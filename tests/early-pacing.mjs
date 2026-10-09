import assert from 'node:assert/strict';
import * as E from '../lib/game-engine.mjs';
// Consistent player: clicks, recruits a small circle, banks at 64 when wagering.
// Compare strategies over many seeded outcomes; no expectation that a wager always wins.
function run(wagers,seed,clicks=1){
 let random=seed;const rng=()=>((random=(random*1664525+1013904223)>>>0)/4294967296);const s=E.fresh();
 for(let t=1;t<=7200;t++){
  E.tick(s,1,rng);for(let c=0;c<clicks;c++)E.think(s,t*1000+c*200);E.advance(s);
  if(s.era>=4)return t;
  for(let i=0;i<15;i++)if(E.canDiscover(s,i)&&s.counts[i]<(wagers?4:12)&&E.buyCost(s,i)/(E.THINKERS[i].rate*E.multiplier(s))<90)E.buy(s,i);
  if(wagers&&t%5===0)for(let i=0;i<15;i++)if(s.counts[i]>=4&&s.counts[i]<64)E.wager(s,i,rng);
  if(s.focus<4&&E.focusCost(s)/(2*E.factors(s).paradigm*clicks)<45)E.upgrade(s,'focus');
 }
 return 7200;
}
for(const clicks of [1,4]){
 const steady=run(false,1,clicks),risks=Array.from({length:40},(_,i)=>run(true,i+1,clicks)).sort((a,b)=>a-b),median=risks[20];
 assert.ok(steady>=60*60,'A player who stops investing cannot rush to Classical on passive income.');
 assert.ok(median>=6*60&&median<steady*.6,'Wagering gives a meaningful benefit across seeded outcomes.');
 assert.ok(risks[39]<30*60,'Unlucky sampled runs can still recover.');
 console.log(JSON.stringify({clicksPerSecond:clicks,noWagersMinutes:+(steady/60).toFixed(1),wagerMedianMinutes:+(median/60).toFixed(1),wagerRangeMinutes:[+(risks[0]/60).toFixed(1),+(risks[39]/60).toFixed(1)]}));
}
