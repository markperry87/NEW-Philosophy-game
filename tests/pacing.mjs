import * as E from '../lib/game-engine.mjs';
const results=[];
for(let seed=1;seed<=20;seed++){
 let random=seed;const rng=()=>((random=(random*1664525+1013904223)>>>0)/4294967296);
 const s=E.fresh();let renaissance=null,finish=null;
 for(let t=1;t<=8*3600;t++){
  E.tick(s,1,rng);E.think(s,t*1000);
  for(let i=0;i<15;i++){if(E.canDiscover(s,i)&&s.counts[i]<4)E.buy(s,i);if(s.discovered[1]&&s.counts[i]>=4&&s.counts[i]<64&&t%5===0)E.wager(s,i,rng);}
  E.advance(s);if(s.era>=6&&renaissance===null)renaissance=t;
  E.upgrade(s,'meta');if(s.focus<6&&s.thoughts>E.focusCost(s)*5)E.upgrade(s,'focus');
  if(s.era===14&&s.discovered[14]){finish=t;break;}
 }
 results.push({seed,renaissanceMinutes:Math.round(renaissance/60),allWorldsMinutes:finish?Math.round(finish/60):'>480'});
}
console.log(JSON.stringify(results));
