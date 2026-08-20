import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SRC_DIR = path.resolve(__dirname, '../src');
const MAX_LINES = 20;

function getAllFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      getAllFiles(fullPath, fileList);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

function countLines(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  if (!content) return 0;
  // Count lines by newline splits
  return content.split(/\r?\n/).length;
}

function checkFileSizes() {
  const allFiles = getAllFiles(SRC_DIR);
  const oversized = [];
  const compliant = [];

  for (const filePath of allFiles) {
    const lines = countLines(filePath);
    const relPath = path.relative(path.resolve(__dirname, '..'), filePath).replace(/\\/g, '/');
    if (lines > MAX_LINES) {
      oversized.push({ path: relPath, lines });
    } else {
      compliant.push({ path: relPath, lines });
    }
  }

  // Sort oversized by lines descending
  oversized.sort((a, b) => b.lines - a.lines);

  console.log(`========================================`);
  console.log(`OFC360 FILE SIZE AUDIT REPORT`);
  console.log(`Target: ≤ ${MAX_LINES} lines per file`);
  console.log(`Total Source Files: ${allFiles.length}`);
  console.log(`Compliant Files (≤ ${MAX_LINES} lines): ${compliant.length}`);
  console.log(`Oversized Files (> ${MAX_LINES} lines): ${oversized.length}`);
  console.log(`========================================\n`);

  if (oversized.length > 0) {
    console.log(`TOP OVERSIZED FILES:`);
    oversized.slice(0, 50).forEach((f, idx) => {
      console.log(`${idx + 1}. [${f.lines} lines] ${f.path}`);
    });
    if (oversized.length > 50) {
      console.log(`... and ${oversized.length - 50} more files`);
    }
    console.log(`\n❌ FAILED: ${oversized.length} files exceed ${MAX_LINES} lines limit.`);
    return false;
  } else {
    console.log(`\n✓ SUCCESS: All ${allFiles.length} files are ≤ ${MAX_LINES} lines!`);
    return true;
  }
}

const isCiOrCheck = process.argv.includes('--ci') || process.argv.includes('--check');
const passed = checkFileSizes();
if (isCiOrCheck && !passed) {
  process.exit(1);
}
