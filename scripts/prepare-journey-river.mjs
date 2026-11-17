import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
const out = new URL('../src/assets/journey/', import.meta.url);
await mkdir(out, { recursive: true });
const { data, info } = await sharp(new URL('../masters/journey-river.png', import.meta.url).pathname).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width:w, height:h } = info;
const seen = new Uint8Array(w*h); let largest=[];
for(let p=0;p<w*h;p++) {
  if(seen[p] || data[p*4+3]<4) continue;
  const group=[p]; seen[p]=1;
  for(let j=0;j<group.length;j++) { const q=group[j], x=q%w;
    for(const n of [x>0?q-1:-1,x<w-1?q+1:-1,q-w,q+w]) {
      if(n<0||n>=w*h||seen[n]||data[n*4+3]<4) continue;
      seen[n]=1; group.push(n);
    }
  }
  if(group.length>largest.length) largest=group;
}
const keep=new Uint8Array(w*h); largest.forEach(p=>keep[p]=1);
for(let p=0;p<w*h;p++) if(!keep[p]) data.fill(0,p*4,p*4+4);
const clean=await sharp(data,{raw:info}).resize(600,2400,{fit:'fill'}).raw().toBuffer();
// Preserve the original artwork
const palettes={autumn:['f9df9c','f2b93b','f7be94','ec6f2d'],spring:['f9c9d4','ee8ba6','d3e6bf','9dc384'],summer:['bee2f6','56aee6','bceadf','36bfa9'],winter:['f2f6fc','809bc9','a6c8f0','809bc9']};
const washSource=await sharp(clean,{raw:{width:600,height:2400,channels:4}}).blur(7).raw().toBuffer();
const rgb=s=>[0,2,4].map(i=>parseInt(s.slice(i,i+2),16));
const requested = process.argv.slice(2);
for(const [season,colors] of Object.entries(palettes)) {
 if(requested.length && !requested.includes(season)) continue;
 const pixels=Buffer.from(clean), c=colors.map(rgb);
 for(let p=0;p<pixels.length;p+=4) {
   const r=washSource[p],g=washSource[p+1],b=washSource[p+2];
   const clamp=n=>Math.max(0,Math.min(1,n));
   const x=(p/4)%600, y=Math.floor(p/4/600);
   const source=clamp(((r-g)/(r-b+1)-.22)/.48);
   const flow=.5+.5*Math.sin(y/177 + x/83 + Math.sin(y/91)*.65);
   let strand=clamp(source*.8+flow*.45-.12);
   if(season==='spring') strand=clamp((source-.25)*1.65 + flow*.25 + .20);
   if(season==='summer') strand=clamp(.32+strand*.9);
   if(season==='winter') strand=clamp(source*.6+flow*.55);
   const pigment=clamp((255-(r+g+b)/3)/100);
   const density=clamp((pigment-.12)*1.7);
   const bloom=clamp((Math.sin(y/113+x/67+Math.sin(y/193)*1.4)+.35)*.52);
   const wash=clamp((.48-pigment)*1.8+bloom*(season==='winter' ? .65 : .30));
   const sediment=clamp((pigment-.62)*2.2);
   for(let k=0;k<3;k++) {
     let colour=(c[0][k]*(1-density)+c[1][k]*density)*(1-strand)
       +(c[2][k]*(1-density)+c[3][k]*density)*strand;
     if(season==='spring') {
       const t=strand*strand*(3-2*strand);
       const pale=Math.sin(Math.PI*t)*.60;
       const pink=c[0][k]*(1-density)+c[1][k]*density;
       const green=c[2][k]*(1-density)+c[3][k]*density;
       const lightPink=pink*(1-pale)+c[0][k]*pale;
       const lightGreen=green*(1-pale)+c[2][k]*pale;
       colour=lightPink*(1-t)+lightGreen*t;
     }
     if(season==='autumn') colour=colour*(1-sediment*.28)+rgb('5e3219')[k]*sediment*.28;
     const winterWhite=season==='winter' ? clamp(wash*.94 + (1-strand)*.30 + bloom*.16) : wash;
     pixels[p+k]=Math.round(colour*(1-winterWhite)+255*winterWhite);
   }
   pixels[p+3]=Math.round(clean[p+3]*(.70+.30*density)*(1-bloom*.22)*.85);
 }
 await sharp(pixels,{raw:{width:600,height:2400,channels:4}}).webp({quality:88,alphaQuality:100}).toFile(new URL(`${season}.webp`,out).pathname);
}
// Keep node positions aligned with the artwork
const centers=[];
for(let y=0;y<2400;y++) {let best=-1,bx=300; for(let x=4;x<596;x++){let sum=0; for(let dx=-4;dx<=4;dx++) sum+=clean[(y*600+x+dx)*4+3];if(sum>best){best=sum;bx=x;}} centers.push(bx/600);}
const samples=Array.from({length:201},(_,i)=>{
 const y=Math.round(i*2399/200);
 const local=centers.slice(Math.max(0,y-5),Math.min(2400,y+6));
 return Math.round(local.reduce((sum,x)=>sum+x,0)/local.length*10000)/10000;
});
await writeFile(new URL('river-positions.json',out),JSON.stringify(samples));
console.log({width:600,height:2400,connectedPigmentPixels:largest.length,transparentCorners:[0,599,600*2399,600*2400-1].every(p=>clean[p*4+3]===0)});
