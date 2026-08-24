import fs from 'fs';
import path from 'path';

const srcDir = path.resolve('c:/Users/Dell/OneDrive/Desktop/new-ofc/new-ofc360/src');

function getAllFiles(dir, exts = ['.ts', '.tsx', '.js', '.jsx']) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllFiles(filePath, exts));
    } else {
      if (exts.some(ext => file.endsWith(ext))) {
        results.push(filePath);
      }
    }
  }
  return results;
}

function resolveImport(importPath, currentFilePath) {
  let resolved = '';
  if (importPath.startsWith('@/')) {
    resolved = path.join(srcDir, importPath.slice(2));
  } else if (importPath.startsWith('.')) {
    resolved = path.resolve(path.dirname(currentFilePath), importPath);
  } else {
    return null; // node_modules
  }

  const extensions = ['', '.ts', '.tsx', '.js', '.jsx', '/index.ts', '/index.tsx', '/index.js', '/index.jsx'];
  for (const ext of extensions) {
    const p = resolved + ext;
    if (fs.existsSync(p) && fs.statSync(p).isFile()) {
      return p;
    }
  }
  return null;
}

const files = getAllFiles(srcDir);
const graph = new Map();

const importRegex = /(?:import|export)\s+(?:(?:(?:\* as \w+|{[^}]+}|\w+)\s+from\s+)?['"]([^'"]+)['"]|import\(['"]([^'"]+)['"]\))/g;

for (const file of files) {
  const content = fs.readFileSync(file, 'utf-8');
  const imports = new Set();
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    const importPath = match[1] || match[2];
    if (importPath) {
      const resolved = resolveImport(importPath, file);
      if (resolved) {
        imports.add(resolved);
      }
    }
  }
  graph.set(file, Array.from(imports));
}

// Find cycles
const cycles = [];
function findCycles(node, visited = new Set(), pathList = []) {
  visited.add(node);
  pathList.push(node);

  const neighbors = graph.get(node) || [];
  for (const neighbor of neighbors) {
    if (pathList.includes(neighbor)) {
      const cycleStart = pathList.indexOf(neighbor);
      cycles.push(pathList.slice(cycleStart).concat(neighbor));
    } else if (!visited.has(neighbor)) {
      findCycles(neighbor, new Set(visited), [...pathList]);
    }
  }
}

for (const file of files) {
  findCycles(file);
}

// Deduplicate cycles
const uniqueCycles = [];
const cycleSignatures = new Set();

for (const cycle of cycles) {
  // Normalize cycle by finding min element
  const cycleNodes = cycle.slice(0, -1);
  const minIdx = cycleNodes.reduce((minI, el, i, arr) => el < arr[minI] ? i : minI, 0);
  const normalized = [...cycleNodes.slice(minIdx), ...cycleNodes.slice(0, minIdx), cycleNodes[minIdx]];
  const sig = normalized.map(p => path.relative(srcDir, p).replace(/\\/g, '/')).join(' -> ');
  if (!cycleSignatures.has(sig)) {
    cycleSignatures.add(sig);
    uniqueCycles.push(sig);
  }
}

console.log(`Found ${uniqueCycles.length} circular dependencies:`);
uniqueCycles.forEach((c, i) => console.log(`${i + 1}: ${c}`));
