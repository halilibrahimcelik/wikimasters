# WikiMasters Testing Roadmap 🧪

## Overview

This document outlines the comprehensive testing strategy for WikiMasters using:

- **Unit & Component Tests**: Vitest + React Testing Library
- **E2E Tests**: Cypress
- **Branch**: `development-05`

---

## 📋 Project Understanding

### Current Tech Stack

- **Framework**: Next.js 16.1.6
- **Runtime**: React 19.2.3
- **State Management**: Redux Toolkit + RTK Query
- **Authentication**: Stack (Stack Auth)
- **Database**: Drizzle ORM + PostgreSQL (Neon)
- **API External**: OpenRouter (AI), AWS S3, Upstash Redis, Resend Email
- **Styling**: Tailwind CSS + shadcn components
- **Linting**: Biome

### Key Features to Test

1. **Authentication & Authorization** (Stack Auth integration)
2. **Article Management** (CRUD operations)
   - View articles
   - Create articles
   - Edit articles
   - Delete articles
3. **AI Features** (OpenRouter integration for AI suggestions)
4. **File Upload** (AWS S3 integration)
5. **Email Notifications** (Milestone celebrations via Resend)
6. **Page Views Tracking** (Redis caching)
7. **Navbar & Navigation** (Authentication-based routing)

---

## 🎯 Testing Roadmap

### Phase 1: Setup & Configuration (2-3 hours)

**Objective**: Establish testing infrastructure

#### 1.1 Install Dependencies

```bash
# Unit testing
pnpm add -D vitest @vitest/ui happy-dom @vitest/coverage-v8

# React Testing Library
pnpm add -D @testing-library/react @testing-library/jest-dom @testing-library/user-event

# Utilities
pnpm add -D @testing-library/dom ts-node

# E2E Testing
pnpm add -D cypress
```

#### 1.2 Create Configuration Files

- `vitest.config.ts` - Vitest configuration
- `cypress.config.ts` - Cypress configuration
- `__tests__/setup.ts` - Test setup and global configuration
- `.env.test` - Test environment variables

#### 1.3 Update package.json Scripts

```json
{
  "test": "vitest",
  "test:ui": "vitest --ui",
  "test:coverage": "vitest --coverage",
  "test:e2e": "cypress open",
  "test:e2e:headless": "cypress run"
}
```

---

### Phase 2: Unit & Component Tests - UI Layer (4-5 hours)

#### 2.1 Components to Test

| Component           | Test Cases                                               | Priority |
| ------------------- | -------------------------------------------------------- | -------- |
| `Navbar`            | Render, auth state, navigation links, logout             | High     |
| `WikiCard`          | Display article data, click handlers                     | High     |
| `ArticlesList`      | Render list, loading state, error state, empty state     | High     |
| `WikiArticleViewer` | Display content, markdown rendering, delete/edit buttons | High     |
| `WikiEditor`        | Form submission, content editing, validation             | High     |
| `Button`            | Click events, disabled state, variants                   | Medium   |
| `Input`             | Value changes, validation, error display                 | Medium   |
| `Card`              | Rendering, className application                         | Low      |

#### 2.2 Test Structure

```
__tests__/
├── components/
│   ├── features/
│   │   ├── navbar.test.tsx
│   │   ├── wiki-card.test.tsx
│   │   ├── articles-list.test.tsx
│   │   ├── wiki-article-viewer.test.tsx
│   │   └── wiki-editor.test.tsx
├── setup.ts
└── mocks/
    ├── handlers.ts
    ├── redux.ts
    └── stack-auth.ts
```

---

### Phase 3: Unit Tests - Business Logic (3-4 hours)

#### 3.1 Server Actions & API Logic

| Module                  | Test Cases                                                    | Priority |
| ----------------------- | ------------------------------------------------------------- | -------- |
| `actions/articles.ts`   | Create, update, delete mutations                              | High     |
| `actions/pageViews.ts`  | Increment, milestone detection, email triggers                | High     |
| `actions/upload.ts`     | File validation, S3 upload, error handling                    | High     |
| `api/articles/route.ts` | GET /api/articles, GET /api/articles/:id                      | High     |
| `api/ai/route.ts`       | POST with valid/invalid input, Zod validation, error handling | Medium   |
| `lib/data/articles.ts`  | Database queries, error handling                              | Medium   |
| `db/authz.ts`           | Authorization checks                                          | Medium   |

#### 3.2 Test Structure

```
__tests__/
├── actions/
│   ├── articles.test.ts
│   ├── pageViews.test.ts
│   └── upload.test.ts
├── api/
│   ├── articles.test.ts
│   ├── ai.test.ts
│   └── mocks/
│       ├── openrouter.ts
│       └── aws-s3.ts
└── lib/
    ├── data.test.ts
    └── authz.test.ts
```

---

### Phase 4: E2E Tests - User Journeys (5-7 hours)

#### 4.1 Critical User Flows

| Flow                | Test Steps                                                        | Priority  |
| ------------------- | ----------------------------------------------------------------- | --------- |
| **Authentication**  | Sign up, sign in, sign out                                        | Critical  |
| **Create Article**  | Navigate to new article → Fill form → Submit → Verify created     | Critical  |
| **View Article**    | Click article → Verify content loads → Check page views increment | Critical  |
| **Edit Article**    | View article → Click edit → Modify → Save → Verify changes        | Critical  |
| **Delete Article**  | View article → Delete → Confirm → Verify removed                  | Critical  |
| **AI Suggestions**  | View article → Open AI panel → Enter prompt → Get suggestion      | Important |
| **Search/Filter**   | Navigate home → Search articles → Verify results                  | Important |
| **File Upload**     | Edit article → Upload image → Verify display                      | Important |
| **Email Milestone** | Create article → Reach milestone views → Verify email sent        | Important |

#### 4.2 Test Structure

```
cypress/
├── e2e/
│   ├── auth.cy.ts
│   ├── articles.cy.ts
│   ├── article-creation.cy.ts
│   ├── article-editing.cy.ts
│   ├── article-deletion.cy.ts
│   ├── ai-features.cy.ts
│   ├── file-upload.cy.ts
│   └── navigation.cy.ts
├── support/
│   ├── commands.ts
│   ├── e2e.ts
│   └── helpers.ts
└── fixtures/
    ├── articles.json
    ├── users.json
    └── test-data.ts
```

#### 4.3 Cypress Custom Commands

```typescript
// cypress/support/commands.ts
cy.login(email, password);
cy.createArticle(title, content);
cy.editArticle(articleId, updates);
cy.deleteArticle(articleId);
cy.uploadImage(filePath);
cy.interceptAICall();
cy.waitForEmailMillstone();
```

---

### Phase 5: Mocking Strategy (2-3 hours)

#### 5.1 Dependencies to Mock

- **Stack Auth**: Authentication endpoints & user context
- **OpenRouter API**: AI completion requests
- **AWS S3**: File upload endpoints
- **Resend Email**: Email sending (for milestone celebrations)
- **Upstash Redis**: Cache operations
- **Database**: Drizzle ORM queries (for unit tests)

#### 5.2 Mock Setup

```
__tests__/
├── mocks/
│   ├── handlers.ts (MSW for API mocking)
│   ├── redux.ts (Redux store for tests)
│   ├── stack-auth.ts
│   ├── openrouter.ts
│   └── aws-s3.ts
└── setup.ts (vitest global setup)
```

---

### Phase 6: CI/CD Integration (1-2 hours)

#### 6.1 GitHub Actions Workflow

```yaml
# .github/workflows/test.yml
- Run unit tests: `pnpm test:coverage`
- Run E2E tests: `pnpm test:e2e:headless`
- Collect coverage reports
- Upload to Codecov (optional)
- Block PR if coverage drops
```

#### 6.2 Pre-commit Hooks

```json
// .husky configuration
- Lint files
- Run quick unit tests
- Type check with tsc
```

---

## 📊 Testing Coverage Goals

| Layer          | Target Coverage | Priority |
| -------------- | --------------- | -------- |
| Components     | 80%+            | High     |
| Business Logic | 90%+            | High     |
| API Routes     | 85%+            | High     |
| Utilities      | 90%+            | Medium   |
| Overall        | 85%+            | High     |

---

## 🗂️ File Structure Summary

```
development-05/
├── __tests__/
│   ├── setup.ts
│   ├── components/
│   │   ├── features/
│   │   └── ui/
│   ├── actions/
│   ├── api/
│   ├── lib/
│   ├── redux/
│   └── mocks/
├── cypress/
│   ├── e2e/
│   ├── support/
│   └── fixtures/
├── vitest.config.ts
├── cypress.config.ts
└── .env.test

```

---

## ⏱️ Implementation Timeline

| Phase               | Duration         | Tasks                            |
| ------------------- | ---------------- | -------------------------------- |
| 1. Setup            | 2-3h             | Dependencies, configs, scripts   |
| 2. UI Components    | 4-5h             | ~15 component tests              |
| 3. Business Logic   | 3-4h             | ~12 action/API tests             |
| 4. State Management | 2-3h             | Redux/RTK tests                  |
| 5. E2E Tests        | 5-7h             | ~8 critical user flows           |
| 6. Mocking          | 2-3h             | Mock handlers setup              |
| 7. CI/CD            | 1-2h             | GitHub Actions, pre-commit hooks |
| **Total**           | **~20-27 hours** | Complete test suite              |

---

## 🎯 Success Criteria

- ✅ All unit tests pass with 85%+ coverage
- ✅ All E2E tests pass in headless mode
- ✅ CI/CD pipeline green on PR creation
- ✅ Load time < 30s for full test suite
- ✅ E2E tests < 5min in headless mode
- ✅ Documentation complete with examples
- ✅ Team can easily add new tests

---

## 📝 Next Steps

1. **Get Approval** of this roadmap
2. **Create Branch** `development-05` from `main`
3. **Phase 1**: Install and configure testing tools
4. **Phase 2-5**: Implement tests incrementally
5. **Phase 6-7**: Setup CI/CD and documentation
6. **Create PR** with full test suite and coverage reports

---

## 🤝 Collaboration Notes

- Tests should be reviewed alongside code changes
- Maintain minimum 85% coverage threshold
- Document complex test scenarios
- Keep E2E tests focused on user journeys (avoid implementation details)
- Use meaningful test names that describe the behavior
