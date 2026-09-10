const fs = require('fs');
let content = fs.readFileSync('src/services/people-ai/peopleCopilotService.ts', 'utf8');
content = content.replace("origLower.replace(/['\".,\\/#!$%\\^&\\*;:{}=\\-_`~()]/g, \" \")", "origLower.replace(/['\".,/#!$%^&*;:{}=\\-_`~()]/g, \" \")");
fs.writeFileSync('src/services/people-ai/peopleCopilotService.ts', content);
