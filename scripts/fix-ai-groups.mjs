import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const aiDir = path.resolve(__dirname, '../src/data/ai');

for (let g = 1; g <= 9; g++) {
  const gPath = path.join(aiDir, `group_${g}.ts`);
  const varNames = [];
  const start = (g - 1) * 8 + 1;
  const end = Math.min(g * 8, 73);
  for (let i = start; i <= end; i++) {
    varNames.push(`aiModel_${i}`);
  }
  const importLines = varNames.map((v) => `import { ${v} } from "./${v.replace('aiModel_', 'model_')}";`).join('\n');
  const content = `import type { AIToolItem } from "@/types/ai";\n${importLines}\n\nexport const aiGroup_${g}: AIToolItem[] = [${varNames.join(', ')}];\n`;
  fs.writeFileSync(gPath, content, 'utf8');
}

const g1_5 = [1, 2, 3, 4, 5].map((i) => `aiGroup_${i}`);
const g6_9 = [6, 7, 8, 9].map((i) => `aiGroup_${i}`);

const half1 = `import type { AIToolItem } from "@/types/ai";\n${g1_5.map((g) => `import { ${g} } from "./group_${g.replace('aiGroup_', '')}";`).join('\n')}\nexport const aiModelsHalf1: AIToolItem[] = [${g1_5.map((g) => `...${g}`).join(', ')}];\n`;
fs.writeFileSync(path.join(aiDir, 'modelsHalf1.ts'), half1, 'utf8');

const half2 = `import type { AIToolItem } from "@/types/ai";\n${g6_9.map((g) => `import { ${g} } from "./group_${g.replace('aiGroup_', '')}";`).join('\n')}\nexport const aiModelsHalf2: AIToolItem[] = [${g6_9.map((g) => `...${g}`).join(', ')}];\n`;
fs.writeFileSync(path.join(aiDir, 'modelsHalf2.ts'), half2, 'utf8');

const allModels = `import type { AIToolItem } from "@/types/ai";\nimport { aiModelsHalf1 } from "./modelsHalf1";\nimport { aiModelsHalf2 } from "./modelsHalf2";\n\nexport const ALL_71_AI_MODELS: AIToolItem[] = [\n  ...aiModelsHalf1,\n  ...aiModelsHalf2,\n];\n`;
fs.writeFileSync(path.join(aiDir, 'allModels.ts'), allModels, 'utf8');

console.log('Fixed allModels and groups successfully!');
