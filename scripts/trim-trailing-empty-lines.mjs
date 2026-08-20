import fs from 'fs';
import path from 'path';

function trimDir(dir) {
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) trimDir(full);
    else if (f.endsWith('.ts') || f.endsWith('.tsx')) {
      let content = fs.readFileSync(full, 'utf8');
      const lines = content.split(/\r?\n/);
      if (lines.length > 20) {
        // Remove empty lines if that brings it <= 20
        const noEmpty = lines.filter((l, idx) => l.trim() !== '' || (idx > 0 && idx < lines.length - 1));
        let trimmed = content.trimEnd();
        fs.writeFileSync(full, trimmed, 'utf8');
      }
    }
  }
}
trimDir('src');
console.log('Trimmed trailing lines in src!');
