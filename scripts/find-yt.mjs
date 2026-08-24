import fs from 'fs';
import path from 'path';

const distAssets = path.resolve('c:/Users/Dell/OneDrive/Desktop/new-ofc/new-ofc360/dist/assets');
const files = fs.readdirSync(distAssets);
const jsFile = files.find(f => f.endsWith('.js'));
const code = fs.readFileSync(path.join(distAssets, jsFile), 'utf-8');

// Find declaration of Yt
const matches = [...code.matchAll(/(?:const|let|var)\s+Yt\s*=/g)];
for (const m of matches) {
  console.log(`Match at ${m.index}:`);
  console.log(code.substring(m.index - 50, m.index + 150));
}

const arIdx = code.indexOf('const ar=new Nye');
console.log(`arIdx is at: ${arIdx}`);
