# Personal Blog Project - Copilot Instructions

> ⛔ **STOP — Run all 3 test suites after EVERY change. Do NOT report task complete until tests are green.**
> See [Test Verification Loop](#test-verification-loop-mandatory) below.

This is a personal blog project built with TypeScript, Express.js, and JSON database, including a React frontend, unit tests (Vitest), and E2E tests (Cypress).

---

## Project Architecture

```
/                          ← Backend (Node.js + Express + TypeScript)
  src/
    index.ts               ← Express server entry point (port 3002)
    models/index.ts        ← TypeScript interfaces: User, BlogPost, Category, Tag, Comment
    database/JsonDatabase.ts ← JSON file-based database class
  tests/unit/              ← Backend unit tests (Vitest)
  data/database.json       ← Auto-generated JSON database

client/                    ← Frontend (React + TypeScript, port 3001)
  src/
    pages/                 ← Home, Blog, PostDetail, CreatePost, Profile
    components/            ← Reusable UI components
    services/apiService.ts ← Axios API client
    types/index.ts         ← Shared TypeScript types
  cypress/e2e/             ← E2E tests (Cypress)
```

---

## Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Backend   | Node.js, Express 4, TypeScript 5    |
| Database  | JSON file (`data/database.json`)    |
| Frontend  | React 19, React Router 7, Axios     |
| Unit Test | Vitest 2, @testing-library/react    |
| E2E Test  | Cypress 15                          |
| Build     | ts-node (dev), tsc (prod)           |

---

## NPM Scripts

### Backend (root)
```bash
npm run dev            # Start backend with ts-node (watch mode)
npm run build          # Compile TypeScript → dist/
npm start              # Run compiled dist/index.js
npm run test           # Run Vitest (watch mode)
npm run test:run       # Run Vitest (single run)
npm run test:coverage  # Run Vitest with coverage report
npm run start:all      # Run backend + frontend concurrently
```

### Frontend (client/)
```bash
npm start              # Start React dev server on port 3001
npm run test:vitest:run      # Run Vitest unit tests (single run)
npm run test:vitest:coverage # Run Vitest with coverage
npm run cy:open        # Open Cypress interactive
npm run cy:run         # Run all Cypress E2E tests headlessly
npm run test:e2e       # Run post-comment E2E test
```

---

## API Endpoints (Backend — http://localhost:3002)

| Method | Path                        | Description                        |
|--------|-----------------------------|------------------------------------|
| GET    | `/api/home`                 | Latest posts, categories, tags     |
| GET    | `/api/profile`              | Author profile info                |
| GET    | `/api/posts`                | Posts list (pagination, filtering) |
| GET    | `/api/posts/:slug`          | Single post by slug                |
| POST   | `/api/admin/posts`          | Create new post                    |
| POST   | `/api/posts/:slug/comments` | Add comment to post                |
| GET    | `/api/categories`           | All categories                     |
| GET    | `/api/tags`                 | All tags                           |

---

## Testing Guidelines

### Backend Unit Tests (Vitest — `tests/unit/`)
- Tests run in `node` environment
- Coverage thresholds: **100%** branches, functions, lines, statements on `src/**/*.ts`
- `src/index.ts` is excluded from coverage
- Mock database via `tests/mocks/database.mock.ts`
- Run: `npx vitest run` from root

### Frontend Unit Tests (Vitest — `client/src/`)
- Tests run in `jsdom` environment
- Uses `@testing-library/react` and `@testing-library/user-event`
- API calls mocked via `vi.mock`
- Run: `npx vitest run` from `client/`

### E2E Tests (Cypress — `client/cypress/e2e/`)
- `baseUrl`: http://localhost:3001
- Backend must be running on http://localhost:3002
- Default timeout: 10 seconds
- Specs: `create-post.cy.ts`, `post-comment-submit.cy.ts`
- Run: `npm run cy:run` from `client/`

---

## Data Models

```typescript
interface BlogPost {
  id: string;          // UUID
  title: string;
  slug: string;        // URL-friendly identifier
  content: string;
  excerpt: string;
  status: 'published' | 'draft';
  authorId: string;
  categoryId: string;
  tags: string[];
  createdAt: string;   // ISO date
  updatedAt: string;
  comments: Comment[];
}

interface Comment {
  id: string;
  postId: string;
  author: string;
  content: string;
  createdAt: string;
}
```

---

## TDD Workflow (Test-Driven Development)

> 🔴🟢♻️ **Red → Green → Refactor** — The AI agent MUST strictly follow TDD. Never write implementation code before tests exist.

### Roles

| Who  | Responsibility |
|------|----------------|
| **User** | Designs business requirements and writes unit tests (the *spec*) |
| **AI Agent** | Reads the failing tests and implements the minimal code to make them pass |

### TDD Cycle — Step by Step

**Phase 1 — 🔴 Red (User's job)**
1. User describes the feature/business rule in plain language.
2. User writes one or more unit tests that define the expected behavior.
3. User confirms: *"Tests are written and currently failing."*
4. AI MUST NOT write any implementation until tests exist and are red.

**Phase 2 — 🟢 Green (AI's job)**
1. AI reads all provided test files carefully before writing any code.
2. AI infers required interfaces, function signatures, and return types **solely from the tests**.
3. AI writes the **minimum implementation** needed to make every failing test pass — no gold plating.
4. AI runs the relevant test suite and verifies all tests are green before reporting done.

**Phase 3 — ♻️ Refactor (AI's job)**
1. With tests green, AI may clean up the implementation (rename, extract helpers, improve readability).
2. After every refactor step, AI re-runs tests to confirm they are still green.
3. AI never changes test files during refactor — only production code.

### AI Agent Rules for TDD

- ⛔ **Never create a function, class, or service before its tests exist.**
- ⛔ **Never modify test files to make them pass** — fix the implementation instead.
- ✅ Ask the user to clarify business rules if the test intent is ambiguous, rather than guessing.
- ✅ Implement only what the tests assert — do not add untested logic.
- ✅ After implementing, always run `npx vitest run` (backend) or `npx vitest run` (frontend) to confirm green.
- ✅ If a new function is added, ensure coverage thresholds remain at **100%** — add tests for any edge cases discovered during implementation.

### Typical TDD Task Flow

```
User:  "I need a slugify() utility. Here are the tests → tests/unit/utilities.test.ts"
AI:    1. Read tests/unit/utilities.test.ts
       2. Identify: function slugify(title: string): string
       3. Create src/utils/slugify.ts with minimal implementation
       4. Run: npx vitest run
       5. ✅ All pass → report complete
```

### When User Provides Tests with No Implementation File Yet

1. AI identifies the module path implied by the test's import statement.
2. AI creates the file at that exact path with the correct exports.
3. AI does NOT change the import path in the test.
4. AI runs tests immediately after creation and iterates until green.

---

## Implementation Plan Workflow (MANDATORY)

> 📋 **PLAN FIRST — Always create an implementation plan file before writing code.**

Before implementing any new requirement or feature, the AI agent MUST:

### Step 1 — Create Implementation Plan File

1. Create a `.ai.md` file in the `.task` folder at the project root
   - All implementation plan files must be placed in `.task/` directory
   - This keeps all planning documents centralized and organized
   - File naming: `<feature-name>.ai.md` (e.g., `add-search.ai.md`, `update-blog-ui.ai.md`)
   - Use the same base name as the requirement file if one exists (e.g., if requirement is `.task/update-blog-ui.md`, create `.task/update-blog-ui.ai.md`)

2. **Required sections in the `.ai.md` file (keep it concise):**

   ```markdown
   # [Feature Name] - Implementation Plan

   ## 📋 Overview
   1-2 sentences describing what will be implemented.

   ## 🔧 Files to Modify/Create

   ### New Files
   - `path/to/file1.ts` - Brief purpose
   - `path/to/file2.tsx` - Brief purpose

   ### Modified Files
   - `path/to/file3.ts` - What changes
   - `path/to/file4.tsx` - What changes

   ## 🚀 Implementation Steps
   1. Step 1
   2. Step 2
   3. Step 3
   4. Run all 3 test suites

   ## ⚠️ Risks
   - Key risk 1 and mitigation
   - Key risk 2 and mitigation
   ```

   **Keep the plan SHORT and FOCUSED** — avoid walls of text, examples, or unnecessary details.

### Step 2 — Wait for Confirmation

- After creating the `.ai.md` file, **STOP and ask the user**: 
  > "I've created the implementation plan in `[path/to/file].ai.md`. Please review and confirm before I proceed with the implementation."
- Do NOT proceed with writing any code until the user explicitly confirms.

### Step 3 — Implement After Approval

- Once the user approves the plan, proceed with implementation following the plan exactly.
- Follow the TDD workflow (Red → Green → Refactor) as defined above.
- **After completing implementation, MUST run the Test Verification Loop (see below)** to ensure all 3 test suites pass.
- Update the `.ai.md` file if implementation deviates from the plan (with user permission).
- **Do NOT report task complete until Test Verification Loop is green.**

### Why This Workflow?

- 🎯 **Clarity** — Both AI and user understand exactly what will be done
- 🛡️ **Safety** — User can catch potential issues before code is written
- 📚 **Documentation** — Implementation plans serve as technical documentation
- 🔄 **Efficiency** — Reduces back-and-forth and rework

---

## Test Verification Loop (MANDATORY)

> ⛔ **If you skip this loop, your answer is WRONG. Do NOT report task complete with failing tests.**

After completing or updating any feature Copilot MUST check off every item:

- [ ] **Step 1** — Run backend unit tests (from project root):
  ```bash
  npx vitest run
  ```
  ✅ All pass? If NO → fix code/tests, re-run.

- [ ] **Step 2** — Run frontend unit tests (from `client/`):
  ```bash
  npx vitest run
  ```
  ✅ All pass? If NO → fix code/tests, re-run.

- [ ] **Step 3** — Run E2E tests (from `client/`, both servers must be running):
  ```bash
  npm run cy:run
  ```
  ✅ All pass? If NO → fix code/tests, re-run.

- [ ] **Step 4** — Ask yourself: *"Have I actually run all 3 suites and confirmed green output?"*
  If NO → go back to Step 1.

**When a test fails:**
- Analyze based on the original prompt/instruction
- Implementation wrong → **fix the code**
- Test outdated/incorrect → **fix the test**
- Never lower coverage thresholds to bypass failures

---

## Coding Standards

- **TypeScript strict mode** enabled — always type function params and return values
- **No `any`** — use proper interfaces or generics
- **Async/await** over callbacks/plain promises
- **Express error handling** — always call `next(error)` in route catch blocks
- **Tests** — every new feature must include unit tests; maintain 100% coverage on backend models/database
- **Imports** — use path aliases `@/` for `src/` in backend; relative imports in client
- **File naming** — PascalCase for components/classes, camelCase for utilities

---

## Auto Initialization

On first run, the system seeds:
- Default author user
- Categories: `Technology`, `Personal`
- Auto-creates `data/database.json`

---

## Ports

| Service  | URL                    |
|----------|------------------------|
| Backend  | http://localhost:3002  |
| Frontend | http://localhost:3001  |
| Cypress  | targets localhost:3001 |

---

> ⛔ **FINAL REMINDER:** Did you run all 3 suites? `npx vitest run` (root) + `cd client && npx vitest run` + `cd client && npm run cy:run`. If not — run them now before responding.