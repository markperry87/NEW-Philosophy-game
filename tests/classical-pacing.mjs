import assert from 'node:assert/strict';
import * as E from '../lib/game-engine.mjs';
// A consistent active strategy, including recovery after every losing wager.
const durations=[];
for(let seed=1;seed<=40;seed++){
 let random=seed;const rng=()=>((random=(random*1664525+1013904223)>>>0)/4294967296);
 const s=E.fresh();let entered=null,left=null;
 for(let t=1;t<=3*3600;t++){
  E.tick(s,1,rng);E.think(s,t*1000);
  for(let i=0;i<15;i++){
   if(E.canDiscover(s,i)&&s.counts[i]<4)E.buy(s,i);
   if(s.discovered[1]&&s.counts[i]>=4&&s.counts[i]<64&&t%5===0)E.wager(s,i,rng);
  }
  E.advance(s);
  if(s.era===4&&entered===null)entered=t;
  if(s.era===5){left=t;break;}
  if(s.focus<6&&s.thoughts>E.focusCost(s)*5)E.upgrade(s,'focus');
 }
 assert.ok(entered!==null&&left!==null,'An active wagering strategy can leave Classical within three hours.');
 durations.push((left-entered)/60);
}
durations.sort((a,b)=>a-b);
assert.ok(durations[0]>3&&durations[20]>=10,'Classical must have a meaningful stay, with lucky wagers still rewarded.');
assert.ok(durations[20]<35,'Classical should not become a protracted grind for the sampled active strategy.');
console.log(JSON.stringify({classicalMinutes:{min:durations[0],median:durations[20],max:durations[39]}}));
