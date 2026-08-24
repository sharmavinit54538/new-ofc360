import fs from 'fs';
import path from 'path';

const distAssets = path.resolve('c:/Users/Dell/OneDrive/Desktop/new-ofc/new-ofc360/dist/assets');
const files = fs.readdirSync(distAssets);
const jsFile = files.find(f => f.endsWith('.js'));
const code = fs.readFileSync(path.join(distAssets, jsFile), 'utf-8');

const idx = code.indexOf('const ar=new Nye');
if (idx !== -1) {
  console.log(code.substring(idx - 1500, idx + 500));
} else {
  // Let's find class Nye or constructor of Nye
  const m = code.match(/class Nye[^{]*\{[^}]*\}/);
  if (m) {
    console.log('class Nye:', m[0]);
  }
}
