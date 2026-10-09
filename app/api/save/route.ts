import {saveDb} from '@/lib/save-db';
import {fresh,validateState} from '@/lib/game-engine.mjs';
export const dynamic='force-dynamic';
const json=(body:unknown,status=200)=>Response.json(body,{status,headers:{'Cache-Control':'no-store'}});
const validId=(id:unknown)=>typeof id==='string'&&/^[a-zA-Z0-9-]{16,80}$/.test(id);
function guard(request:Request){
 if(!request.headers.get('oai-authenticated-user-id'))return json({error:'Sign in with ChatGPT to open your journey.'},401);
 const origin=request.headers.get('origin');
 if(origin&&origin!==new URL(request.url).origin)return json({error:'Invalid origin.'},403);
}
async function bodyOf(request:Request){const raw=await request.text();if(raw.length>100000)throw Error('Save too large.');return JSON.parse(raw);}
export async function GET(request:Request){
 const denied=guard(request);if(denied)return denied;
 try{const row=await saveDb().prepare('SELECT state, revision FROM game_saves WHERE owner = ?').bind(request.headers.get('oai-authenticated-user-id')).first<{state:string,revision:number}>();return json({state:row?JSON.parse(row.state):null,revision:row?.revision??0});}
 catch(e){console.error('Save load failed',e);return json({error:'Your saved journey could not be loaded. Please retry.'},503);}
}
// Opening claims the journey for this browser. A previous window cannot overwrite it.
export async function POST(request:Request){
 const denied=guard(request);if(denied)return denied;
 let body;try{body=await bodyOf(request);if(!['open','new'].includes(body.action)||!validId(body.session)||!validId(body.requestId))throw Error('Invalid journey request.');}catch(e){return json({error:e instanceof Error?e.message:'Invalid request.'},400);}
 try{
  const owner=request.headers.get('oai-authenticated-user-id'),db=saveDb(),state=JSON.stringify(fresh());
  const update=body.action==='new'?`state = CASE WHEN last_write = excluded.last_write THEN game_saves.state ELSE excluded.state END,` : '';
  const row=await db.prepare(`INSERT INTO game_saves (owner,state,revision,updated_at,active_session,last_write) VALUES (?,?,1,?,?,?) ON CONFLICT(owner) DO UPDATE SET ${update} revision = CASE WHEN last_write = excluded.last_write THEN game_saves.revision ELSE game_saves.revision + 1 END, updated_at = excluded.updated_at, active_session = excluded.active_session, last_write = excluded.last_write RETURNING state,revision`).bind(owner,state,Date.now(),body.session,body.requestId).first<{state:string,revision:number}>();
  if(!row)throw Error('Missing journey.');
  return json({state:JSON.parse(row.state),revision:row.revision});
 }catch(e){console.error('Open journey failed',e);return json({error:'The cloud could not open your journey. Please try again.'},503);}
}
export async function PUT(request:Request){
 const denied=guard(request);if(denied)return denied;
 let state,revision,session,requestId;
 try{const body=await bodyOf(request);state=validateState(body.state);({revision,session,requestId}=body);if(!Number.isSafeInteger(revision)||revision<1)throw Error('Invalid revision.');if(!validId(session)||!validId(requestId))return json({code:'SESSION_CHANGED',error:'This window needs the latest game. Reload to continue.'},409);}
 catch(e){return json({error:e instanceof Error?e.message:'Invalid save.'},400);}
 try{
  const db=saveDb(),owner=request.headers.get('oai-authenticated-user-id');
  const row=await db.prepare('UPDATE game_saves SET state = ?, revision = revision + 1, updated_at = ?, last_write = ? WHERE owner = ? AND revision = ? AND active_session = ? RETURNING revision').bind(JSON.stringify(state),Date.now(),requestId,owner,revision,session).first<{revision:number}>();
  if(row)return json({revision:row.revision});
  const current=await db.prepare('SELECT revision, active_session, last_write FROM game_saves WHERE owner = ?').bind(owner).first<{revision:number,active_session:string,last_write:string}>();
  if(current&&current.active_session===session&&current.last_write===requestId)return json({revision:current.revision});
  return json({code:current?.active_session!==session?'SESSION_CHANGED':'SAVE_CHANGED',error:current?.active_session!==session?'Your journey is open in another window. Continue here to pick up the latest progress.':'Your cloud progress changed. Continue here to load it.'},409);
 }catch(e){console.error('Save failed',e);return json({error:'Cloud save is unavailable. Your journey is still open; retry or export a backup.'},503);}
}
