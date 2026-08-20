import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

const content = fs.readFileSync(path.join(root, 'src/data/aiToolsData.ts'), 'utf8');

// Use typescript or regex to parse the objects
// Since it is valid JS syntax inside array:
const arrayBodyMatch = content.match(/export const ALL_71_AI_MODELS: AIToolItem\[\] = (\[[\s\S]*?\]);/);
if (arrayBodyMatch) {
  // eslint-disable-next-line no-eval
  const models = eval(arrayBodyMatch[1]);
  console.log(`Found ${models.length} models.`);

  const aiDir = path.join(root, 'src/data/ai');
  fs.mkdirSync(aiDir, { recursive: true });

  // Each model has 8-9 keys. 1 model per file easily fits in ~12 lines (<= 20 lines)!
  // 71 model files: model_1.ts to model_71.ts
  for (let i = 0; i < models.length; i++) {
    const m = models[i];
    const num = i + 1;
    const fileContent = `import type { AIToolItem } from "@/types/ai";\n\nexport const aiModel_${num}: AIToolItem = ${JSON.stringify(m, null, 2)};\n`;
    // If lines > 20, format compactly
    const lines = fileContent.split(/\r?\n/).length;
    let finalContent = fileContent;
    if (lines > 20) {
      finalContent = `import type { AIToolItem } from "@/types/ai";\n\nexport const aiModel_${num}: AIToolItem = {\n` +
        Object.entries(m).map(([k, v]) => `  ${k}: ${JSON.stringify(v)},`).join('\n') +
        `\n};\n`;
      // If still > 20 lines, condense pairs of simple string props
      const condensedLines = finalContent.split(/\r?\n/).length;
      if (condensedLines > 20) {
        finalContent = `import type { AIToolItem } from "@/types/ai";\n\nexport const aiModel_${num}: AIToolItem = ${JSON.stringify(m)};\n`;
      }
    }
    fs.writeFileSync(path.join(aiDir, `model_${num}.ts`), finalContent, 'utf8');
  }

  // Now create groupings: 8 models per group file
  const groupFiles = [];
  const groupCount = Math.ceil(models.length / 8);
  for (let g = 0; g < groupCount; g++) {
    const start = g * 8 + 1;
    const end = Math.min((g + 1) * 8, models.length);
    const imports = [];
    const elements = [];
    for (let i = start; i <= end; i++) {
      imports.push(`aiModel_${i}`);
      elements.push(`aiModel_${i}`);
    }
    // Combined import line to keep lines <= 10
    const importLine = `import { ${imports.join(', ')} } from "./modelsIndex_${g + 1}";`;
    // Create modelsIndex_g.ts to re-export
    const reexportLines = imports.map((m, idx) => `export { ${m} } from "./model_${start + idx}";`).join('\n');
    fs.writeFileSync(path.join(aiDir, `modelsIndex_${g + 1}.ts`), reexportLines + '\n', 'utf8');

    const groupContent = `${importLine}\nimport type { AIToolItem } from "@/types/ai";\n\nexport const aiGroup_${g + 1}: AIToolItem[] = [\n  ${elements.join(', ')}\n];\n`;
    fs.writeFileSync(path.join(aiDir, `group_${g + 1}.ts`), groupContent, 'utf8');
    groupFiles.push(`aiGroup_${g + 1}`);
  }

  // Now create allModels.ts (split into half1 and half2 if needed to stay <= 15 lines)
  const mid = Math.ceil(groupFiles.length / 2);
  const half1 = groupFiles.slice(0, mid);
  const half2 = groupFiles.slice(mid);

  const half1Content = `${half1.map((g, idx) => `import { ${g} } from "./group_${idx + 1}";`).join('\n')}\nimport type { AIToolItem } from "@/types/ai";\n\nexport const aiModelsHalf1: AIToolItem[] = [\n  ${half1.map((g) => `...${g}`).join(',\n  ')},\n];\n`;
  fs.writeFileSync(path.join(aiDir, `modelsHalf1.ts`), half1Content, 'utf8');

  const half2Content = `${half2.map((g, idx) => `import { ${g} } from "./group_${mid + idx + 1}";`).join('\n')}\nimport type { AIToolItem } from "@/types/ai";\n\nexport const aiModelsHalf2: AIToolItem[] = [\n  ${half2.map((g) => `...${g}`).join(',\n  ')},\n];\n`;
  fs.writeFileSync(path.join(aiDir, `modelsHalf2.ts`), half2Content, 'utf8');

  const allModelsContent = `import { aiModelsHalf1 } from "./modelsHalf1";\nimport { aiModelsHalf2 } from "./modelsHalf2";\nimport type { AIToolItem } from "@/types/ai";\n\nexport const ALL_71_AI_MODELS: AIToolItem[] = [\n  ...aiModelsHalf1,\n  ...aiModelsHalf2,\n];\n`;
  fs.writeFileSync(path.join(aiDir, `allModels.ts`), allModelsContent, 'utf8');

  // Update src/data/aiToolsData.ts
  const aiToolsDataContent = `import { ALL_71_AI_MODELS } from "./ai/allModels";\nimport { type AIToolItem, AI_CATEGORIES } from "@/types/ai";\n\nexport type { AIToolItem };\nexport { AI_CATEGORIES, ALL_71_AI_MODELS };\n`;
  fs.writeFileSync(path.join(root, 'src/data/aiToolsData.ts'), aiToolsDataContent, 'utf8');

  console.log('Successfully modularized aiToolsData.ts!');
}
