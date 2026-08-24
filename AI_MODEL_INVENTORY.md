# OFC360 AI Model Consolidation - Complete Inventory

## Executive Summary

**Total AI/Model-Related Files Found: ~72**

The OFC360 codebase contains approximately 72 AI-related files, but **the actual architecture is different from what the count suggests**:

- **77 mock AI tool definitions** in `src/features/intelligence/data/allModels.ts` - These are UI display definitions, NOT actual LLM models
- **1 mock AI execution** in `src/utils/aiRouter/executeAiModel.ts` - Demo/simulation only
- **~15 RTK Query API endpoint files** - Frontend proxies to backend AI endpoints
- **0 direct AI model client initializations** in the frontend (no OpenAI, Gemini, Ollama clients)
- **Actual AI processing happens on the BACKEND** (Python/FastAPI at `VITE_API_BASE_URL=http://localhost:8000`)

---

## Detailed File Inventory

### 1. Mock AI Tool Definitions (UI Display Only)

| File | Purpose | Models | Provider | Can Consolidate? |
|------|---------|--------|----------|------------------|
| `src/features/intelligence/data/allModels.ts` | 77 AI tool definitions for UI display | 77 mock definitions across 11 categories | N/A (metadata only) | **YES** - Keep as single source of truth |
| `src/data/aiToolsData.ts` | Re-exports ALL_71_AI_MODELS | Re-exports | N/A | **YES** - Thin re-export |
| `src/types/ai.ts` | Type definitions for AI tools | TypeScript interfaces | N/A | **KEEP** - Core types |

### 2. Mock AI Execution (Demo/Simulation)

| File | Purpose | Model Used | Provider | Can Consolidate? |
|------|---------|------------|----------|------------------|
| `src/utils/aiRouter/executeAiModel.ts` | Mock AI execution for demos | Simulated (returns fake responses) | "OFC360 Neural Engine v4.2" (fake) | **DELETE** - Replace with real AI service |
| `src/utils/aiRouter/providerResolver.ts` | Mock provider resolution | Returns fake provider names | Fake providers | **DELETE** - Replace with real config |
| `src/utils/aiRouter/types.ts` | Types for mock execution | TypeScript interfaces | N/A | **MERGE** into ai types |
| `src/utils/aiRouter/resolvePromptOutput.ts` | Mock response generation | Generates fake outputs | N/A | **DELETE** |
| `src/utils/aiRouter/promptHandlers1.ts` | Mock prompt handlers | Fake handlers | N/A | **DELETE** |
| `src/utils/aiRouter/promptHandlers2.ts` | Mock prompt handlers | Fake handlers | N/A | **DELETE** |
| `src/utils/aiRouter/streamAiResponse.ts` | Mock streaming | Fake streaming | N/A | **DELETE** |

### 3. AI Store (Redux/Zustand)

| File | Purpose | Model Used | Provider | Can Consolidate? |
|------|---------|------------|----------|------------------|
| `src/stores/aiStore.ts` | AI state management | Stores mock model data | N/A | **MERGE** into centralized AI store |
| `src/stores/ai/aiStoreTypes.ts` | AI store types | TypeScript interfaces | N/A | **MERGE** into ai types |
| `src/stores/ai/aiStoreActions.ts` | AI store actions | Action creators | N/A | **MERGE** into ai service |

### 4. RTK Query API Endpoints (Backend Proxies)

| File | Purpose | Backend Endpoint | Feature | Can Consolidate? |
|------|---------|------------------|---------|------------------|
| `src/store/api/aiApi.ts` | General AI endpoints | `/api/v1/ai/*` | General | **MERGE** into centralized AI service |
| `src/store/api/aiInsightsApi.ts` | Mood/Risk detection | `/api/v2/mood/detect`, `/api/v2/risk/assess` | Insights | **MERGE** into AI service |
| `src/features/recruitment/aiRecruiterApi.ts` | Recruitment AI | `/api/v1/ai/recruiter/*` | Recruitment | **ADAPTER** - Keep as thin domain adapter |
| `src/features/payroll/aiPayrollApi.ts` | Payroll AI entry point | Re-exports queries/mutations | Payroll | **ADAPTER** - Keep as thin domain adapter |
| `src/features/payroll/ai/aiQueries.ts` | Payroll AI queries | `/v1/ai/payroll/*` | Payroll | **ADAPTER** - Keep as thin domain adapter |
| `src/features/payroll/ai/aiMutations.ts` | Payroll AI mutations | `/v1/ai/payroll/*` | Payroll | **ADAPTER** - Keep as thin domain adapter |
| `src/features/attendance/services/aiInsightsApiPart1.ts` | Attendance AI | `/api/v1/ai/attendance/*` | Attendance | **ADAPTER** - Keep as thin domain adapter |
| `src/features/attendance/services/aiInsightsApiPart2.ts` | Attendance AI (part 2) | `/api/v1/ai/attendance/*` | Attendance | **ADAPTER** - Keep as thin domain adapter |
| `src/features/attendance/services/aiInsightsApiPart3.ts` | Attendance AI (part 3) | `/api/v1/ai/attendance/*` | Attendance | **MERGE** with Part1 |
| `src/services/api/intelligenceApi.ts` | Intelligence AI entry | Re-exports models/executions | Intelligence | **ADAPTER** - Keep as thin domain adapter |
| `src/features/intelligence/api/intelligenceModelsApi.ts` | Intelligence models | `/api/v1/intelligence/models/*` | Intelligence | **ADAPTER** |
| `src/features/intelligence/api/intelligenceExecutionsApi.ts` | Intelligence executions | `/api/v1/intelligence/executions/*` | Intelligence | **ADAPTER** |
| `src/services/api/connectApi.ts` | Connect AI endpoints | `/api/v1/connect/*` (AI settings) | Connect | **ADAPTER** |

### 4. Feature AI Services (Domain-Specific)

| File | Purpose | Model Used | Provider | Decision |
|------|---------|------------|----------|----------|
| `src/features/recruitment/aiRecruiterApi.ts` | Recruitment AI operations | Backend model | Backend | **ADAPTER** |
| `src/features/payroll/aiPayrollApi.ts` | Payroll AI operations | Backend model | Backend | **ADAPTER** |
| `src/features/attendance/services/aiInsightsApiPart*.ts` | Attendance AI | Backend model | Backend | **ADAPTER** (merge parts) |
| `src/features/intelligence/api/*` | Intelligence AI | Backend model | Backend | **ADAPTER** |
| `src/features/recruitment/components/ai-ats/*` | ATS Resume analysis | Backend model | Backend | **KEEP** - UI components |

### 5. Types & Configuration

| File | Purpose | Decision |
|------|---------|----------|
| `src/types/ai.ts` | Core AI types | **KEEP** - Central types |
| `src/types/api/ai.ts` | API AI types | **KEEP** - API contracts |
| `src/features/intelligence/api/intelligenceTypes.ts` | Intelligence types | **MERGE** into central types |
| `src/features/intelligence/api/intelligenceResponseTypes.ts` | Intelligence response types | **MERGE** into central types |
| `src/features/attendance/types/aiDashboard.ts` | Attendance AI types | **MERGE** into central types |

---

## Model Architecture Analysis

### Current State
```
FRONTEND (React)
├── Mock AI Tools (77 definitions) → UI Display Only
├── Mock AI Router → Demo Simulation Only
├── AI Store → Mock State Management
├── RTK Query APIs → Backend Proxies (15+ files)
└── Feature AI Services → Backend Proxies (4+ features)

BACKEND (Python/FastAPI - External)
├── Real LLM Models (Unknown - likely OpenAI/Gemini/Llama)
├── Embedding Models
├── Vision/OCR Models
└── Specialized Models per Feature
```

### Key Findings
1. **No direct AI model clients in frontend** - All AI goes through backend API
2. **77 "models" are UI definitions only** - Not actual model instances
3. **Backend owns all AI processing** - Frontend is purely a consumer
4. **Multiple RTK Query API files** - Duplicate patterns, should be consolidated
5. **Mock AI router is dead code** - Not used by production features

---

## Consolidation Plan

### Phase 1: Create Central AI Architecture (`src/ai/`)
```
src/ai/
├── config/
│   └── aiConfig.ts           # Centralized AI configuration
├── client/
│   └── aiClient.ts           # Single AI HTTP client (wraps RTK Query)
├── service/
│   └── aiService.ts          # Single AI service entry point
├── prompts/
│   └── index.ts              # Centralized prompts (optional)
├── types/
│   └── index.ts              # Consolidated AI types
├── store/
│   └── aiStore.ts            # Centralized AI state (if needed)
└── index.ts                  # Main export
```

### Phase 2: Consolidate Mock AI Tools
- Keep `allModels.ts` as single source of truth for UI definitions
- Remove `aiToolsData.ts` (thin re-export)
- Delete entire `src/utils/aiRouter/` (mock implementation)

### Phase 3: Create Single AI Service
- `aiService.ts` with methods: `chat()`, `complete()`, `embed()`, `analyze()`, `generate()`
- All feature AI calls route through this service
- Service uses RTK Query internally but provides clean interface

### Phase 4: Convert Feature AI Services to Adapters
- `recruitmentAI` → thin adapter calling `aiService.analyzeResume()`, `aiService.matchCandidate()`
- `payrollAI` → thin adapter calling `aiService.forecast()`, `aiService.detectAnomalies()`
- `attendanceAI` → thin adapter calling `aiService.getTrends()`, `aiService.detectAnomalies()`
- `intelligenceAI` → thin adapter calling `aiService.executeModel()`, `aiService.getModels()`

### Phase 5: Environment Configuration
- Add `VITE_AI_MODEL` to `.env.example` (for backend reference)
- Centralize in `aiConfig.ts`

---

## File Classification Summary

| Classification | Count | Files |
|----------------|-------|-------|
| **KEEP** (Core/Types) | 4 | `src/types/ai.ts`, `src/types/api/ai.ts`, `src/features/intelligence/data/allModels.ts`, `src/stores/aiStore.ts` |
| **MERGE** (Consolidate) | 8 | `src/data/aiToolsData.ts`, `src/utils/aiRouter/*` (6 files), `src/stores/ai/aiStoreTypes.ts`, `src/stores/ai/aiStoreActions.ts` |
| **ADAPTER** (Feature Services) | 12 | All RTK Query AI APIs + Feature AI services |
| **DELETE** (Mock/Dead Code) | 7 | `src/utils/aiRouter/executeAiModel.ts`, `providerResolver.ts`, `promptHandlers1.ts`, `promptHandlers2.ts`, `streamAiResponse.ts`, `resolvePromptOutput.ts`, `types.ts` |
| **SPECIALIZED** (UI Components) | 6 | ATS components in `src/features/recruitment/components/ai-ats/` |

**Total: ~37 actionable files** (remaining are types/imports)

---

## Next Steps

1. **Create `src/ai/` directory structure**
2. **Implement `aiConfig.ts`** with centralized configuration
3. **Implement `aiClient.ts`** wrapping RTK Query/baseApi
4. **Implement `aiService.ts`** as single entry point
5. **Implement consolidated types**
6. **Migrate feature AI services to adapters**
7. **Delete mock AI router**
8. **Run validation**: typecheck, build, lint, tests