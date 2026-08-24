import fs from 'fs';
import path from 'path';

const distAssets = path.resolve('c:/Users/Dell/OneDrive/Desktop/new-ofc/new-ofc360/dist/assets');
const files = fs.readdirSync(distAssets);
const jsFile = files.find(f => f.endsWith('.js'));
const code = fs.readFileSync(path.join(distAssets, jsFile), 'utf-8');

const idx = code.indexOf('const ar=new Nye');
const classIdx = code.lastIndexOf('class Nye', idx);
console.log('Class definition:');
console.log(code.substring(classIdx, idx + 100));
