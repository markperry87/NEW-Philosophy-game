import {fresh,validateState} from './game-engine.mjs';
export const SAVE_KEY='philosophy-browser-journey-v1';
export const MODE_KEY='philosophy-save-mode';
function read(storage){
 const raw=storage.getItem(SAVE_KEY);if(!raw)return null;
 try{const row=JSON.parse(raw);if(!Number.isSafeInteger(row.revision)||row.revision<1||typeof row.session!=='string')throw Error();return {...row,state:validateState(row.state)};}
 catch{throw Error('The browser save could not be read. Export the stored backup before starting a new game.');}
}
export function openBrowserSave(storage,session,reset=false){
 // A requested reset can replace a corrupt save, but opening never silently erases one.
 const previous=reset?null:read(storage),state=previous?.state??fresh();
 const row={state,session,revision:(previous?.revision??0)+1};
 storage.setItem(SAVE_KEY,JSON.stringify(row));storage.setItem(MODE_KEY,'browser');return row;
}
export function writeBrowserSave(storage,state,session,revision){
 const previous=read(storage);
 if(!previous||previous.session!==session||previous.revision!==revision)throw Object.assign(Error('This browser journey is open in another window. Choose Continue here to pick it up.'),{status:409});
 const row={state:validateState(state),session,revision:revision+1};storage.setItem(SAVE_KEY,JSON.stringify(row));return row;
}
export function withBrowserSaveLock(work){
 return globalThis.navigator?.locks?globalThis.navigator.locks.request(SAVE_KEY,work):Promise.resolve().then(work);
}
