# Technical Architecture Spec — Next Finance MVP

## 1. Purpose

This document translates the PRD into an implementation-ready technical architecture for Antigravity.

It defines:
- system boundaries,
- frontend and backend responsibilities,
- database design,
- API contracts,
- Google Sheets integration pattern,
- lesson parser rules,
- security model,
- state model,
- implementation order.

This spec is optimized for a **solo-founder, vibe-coded MVP** that must stay maintainable and safe enough to prevent obvious answer leakage.

---

## 2. Core Architecture Decision

### Chosen architecture
**Google Sheets as lesson authoring backend**  
**Supabase as auth + database**  
**Next.js as frontend + backend API layer**

### Explicit non-goals
- Do not expose Google Sheets directly to learners.
- Do not use client-side grading.
- Do not store answer keys in frontend state.
- Do not over-engineer the spreadsheet grid in v1.

### Why this architecture
This gives:
- fast content iteration via Google Sheets,
- safe separation between user UI and answer logic,
- simple deployment,
- clean founder workflow,
- minimal custom infra.

---

## 3. High-Level System Diagram

```text
[ User Browser ]
      |
      v
[ Next.js Frontend ]
      |
      | HTTPS
      v
[ Next.js API Routes / Server Actions ]
      |                     |
      |                     |
      v                     v
[ Supabase ]         [ Google Sheets API ]
(Auth + DB)          (Lesson authoring source)
```

### Responsibility split

#### Browser / frontend
- render dashboard
- render course/module/lesson pages
- render spreadsheet-like grid
- manage temporary local UI state
- submit attempts to backend
- request hints and reveal
- never receive full answer key during normal lesson load

#### Next.js backend
- authenticate requests
- fetch lesson content from cache/db/Google Sheets
- sanitize lesson payload for frontend
- grade answers server-side
- reveal solution server-side
- persist attempts and stats

#### Supabase
- auth
- user records
- lesson metadata cache
- attempts
- check events
- progress stats

#### Google Sheets
- lesson authoring system
- source of truth for lesson content
- not directly exposed to learners

---

## 4. Deployment Topology

### Environment
- Frontend + API on Vercel
- Supabase hosted backend
- Google Cloud service account for Sheets API

### Environment variables

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
GOOGLE_SERVICE_ACCOUNT_EMAIL=
GOOGLE_PRIVATE_KEY=
GOOGLE_SHEETS_ROOT_FOLDER_ID=
NEXT_FINANCE_ADMIN_EMAIL=
```

### Secret handling rules
- `SUPABASE_SERVICE_ROLE_KEY` must remain server-side only.
- `GOOGLE_PRIVATE_KEY` must remain server-side only.
- Never expose raw sheet IDs for answer tabs to frontend unless harmless.

---

## 5. Frontend Architecture

### Recommended app router structure

```text
app/
  layout.tsx
  page.tsx                      -> dashboard
  login/page.tsx
  course/page.tsx
  course/[moduleSlug]/page.tsx
  lesson/[lessonSlug]/page.tsx
  profile/page.tsx
  api/
    dashboard/route.ts
    lessons/[lessonId]/route.ts
    lessons/[lessonId]/check/route.ts
    lessons/[lessonId]/hint/route.ts
    lessons/[lessonId]/reveal/route.ts
components/
  layout/
  dashboard/
  course/
  lesson/
  ui/
lib/
  auth/
  db/
  sheets/
  parser/
  grading/
  progress/
  types/
```

### Frontend modules

#### 5.1 Layout layer
- sidebar
- topbar
- auth guard wrapper
- route container

#### 5.2 Dashboard layer
- stats cards
- continue learning card
- module summary cards
- progress widgets

#### 5.3 Course browser layer
- module accordion
- lesson list
- difficulty/duration badges

#### 5.4 Lesson workspace layer
- lesson header
- instruction panel
- spreadsheet grid
- hint panel
- result panel
- action bar

#### 5.5 State boundaries
Frontend stores only:
- visible lesson structure
- editable cell values
- current hint level shown
- last grading result from server
- reveal state response

Frontend must not store:
- full answer key
- hidden grading rules beyond what is needed for UX
- secret Google Sheet references

---

## 6. Spreadsheet UI Architecture

### MVP spreadsheet model
The spreadsheet UI is not a full spreadsheet engine.
It is a controlled grid component with:
- row/column headers
- input cells
- locked cells
- visually highlighted answer cells
- resettable starter state

### Cell types

#### `label`
Non-editable display cell.

#### `input`
Editable cell.

#### `locked-value`
Non-editable value cell.

#### `answer-target`
Editable cell that is graded.

### Grid rendering model
The backend sends a safe grid definition such as:

```json
{
  "grid": {
    "rows": 10,
    "cols": 6,
    "cells": {
      "A1": { "type": "label", "value": "Mini Case" },
      "A3": { "type": "label", "value": "Total Assets" },
      "B3": { "type": "answer-target", "value": "" }
    }
  }
}
```

### Reset behavior
Reset restores:
- starter cell values,
- local answer cells,
- hint visibility,
- last check results.

### Reveal behavior
Reveal updates only revealable answer cells and result state.

---

## 7. Backend Architecture

### Rule
All lesson logic is server-authoritative.

### Backend modules

#### `lib/sheets/`
Handles Google Sheets API calls.

#### `lib/parser/`
Transforms raw sheet tabs into app lesson objects.

#### `lib/grading/`
Compares user answers against answer rules.

#### `lib/progress/`
Saves and retrieves attempt/progress state.

#### `lib/db/`
Supabase client helpers.

---

## 8. Google Sheets Integration Design

### Recommendation
Use **one Google Spreadsheet per lesson** for MVP.

This avoids:
- parser complexity,
- lesson cross-contamination,
- hard-to-debug giant workbook issues.

### Google Sheet naming convention

```text
NF_LESSON_<module>_<lesson_code>
Example:
NF_LESSON_BALANCE_SHEET_ACCT_EQ_001
```

### Required tabs
- `Lesson_Config`
- `Student_View`
- `Editable_Cells`
- `Answer_Key`
- `Hints`
- `Walkthrough`

### Optional future tabs
- `Formula_Key`
- `Validation_Rules`
- `Localization`

---

## 9. Google Sheet Tab Schemas

## 9.1 Lesson_Config
Single key-value table.

### Example
| key | value |
|---|---|
| lesson_id | acct-eq-001 |
| lesson_slug | accounting-equation-basics |
| module_slug | balance-sheet |
| title | Accounting Equation Basics |
| description | Lengkapi komponen laporan posisi keuangan sederhana... |
| objective | Memahami hubungan Assets = Liabilities + Equity... |
| difficulty | Beginner |
| estimated_minutes | 12 |
| rows_count | 10 |
| cols_count | 6 |
| reveal_allowed | true |
| published | true |

### Parser rules
- keys are required and case-sensitive for MVP
- boolean values parsed from `true/false`
- numeric values parsed safely
- fail parser if required keys missing

---

## 9.2 Student_View
Rectangular grid representing visible sheet to user.

### Example
|   | A | B | C | D | E | F |
|---|---|---|---|---|---|---|
| 1 | Mini Case |   |   |   |   |   |
| 2 | Modal disetor pemilik | 100000000 |   | Utang bank | 40000000 |   |
| 3 | Total Assets |   |   |   |   |   |
| 4 | Liabilities |   |   |   |   |   |
| 5 | Equity |   |   |   |   |   |

### Parser rules
- read exact rectangular range based on `rows_count` and `cols_count`
- blank cells allowed
- do not infer editability from blankness

---

## 9.3 Editable_Cells
Explicit list of user-editable cells.

### Example
| cell | editable |
|---|---|
| B3 | true |
| B4 | true |
| B5 | true |

### Parser rules
- all editable cells must exist inside grid range
- if a cell is editable and also has visible starter value, it should preload that value

---

## 9.4 Answer_Key
Protected answer targets.

### Example
| cell | expected_value | value_type | tolerance | explanation |
|---|---|---|---|---|
| B3 | 140000000 | number | 0 | Total assets |
| B4 | 40000000 | number | 0 | Liabilities |
| B5 | 100000000 | number | 0 | Equity |

### Supported `value_type`
- `text`
- `number`
- `currency`
- `percentage`

### Parser rules
- answer cells must be editable cells
- value type required
- tolerance defaults to 0 if blank

---

## 9.5 Hints
Progressive hints.

### Example
| level | hint_text |
|---|---|
| 1 | Mulai dari total aset dulu... |
| 2 | Jika modal pemilik Rp100 juta... |
| 3 | Pastikan nilai akhir Assets... |

### Parser rules
- levels must start at 1 and increase sequentially
- duplicate levels invalid

---

## 9.6 Walkthrough
Used after reveal or for future solution explanation.

### Example
| step_number | explanation |
|---|---|
| 1 | Tentukan sisi kanan persamaan... |
| 2 | Jumlahkan liabilities dan equity... |

---

## 10. Lesson Domain Types

### Safe lesson payload type

```ts
type SafeLessonPayload = {
  lessonId: string;
  lessonSlug: string;
  moduleSlug: string;
  title: string;
  description: string;
  objective: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  estimatedMinutes: number;
  revealAllowed: boolean;
  grid: {
    rows: number;
    cols: number;
    cells: Record<string, {
      value: string;
      type: "label" | "input" | "locked-value" | "answer-target";
    }>;
  };
  hintCount: number;
  walkthroughAvailable: boolean;
};
```

### Internal parsed lesson type

```ts
type ParsedLesson = SafeLessonPayload & {
  answerKey: Array<{
    cell: string;
    expectedValue: string;
    valueType: "text" | "number" | "currency" | "percentage";
    tolerance: number;
    explanation?: string;
  }>;
  hints: Array<{
    level: number;
    hintText: string;
  }>;
  walkthrough: Array<{
    stepNumber: number;
    explanation: string;
  }>;
  sheetSourceId: string;
};
```

---

## 11. Supabase Database Design

## 11.1 `profiles`
Extends auth user profile.

| column | type | notes |
|---|---|---|
| id | uuid pk | matches auth.users.id |
| email | text | cached email |
| full_name | text | optional |
| created_at | timestamptz | default now() |

## 11.2 `courses`
| column | type | notes |
|---|---|---|
| id | uuid pk |
| slug | text unique |
| title | text |
| description | text |
| created_at | timestamptz |

## 11.3 `modules`
| column | type | notes |
|---|---|---|
| id | uuid pk |
| course_id | uuid fk |
| slug | text unique |
| title | text |
| sort_order | int |
| created_at | timestamptz |

## 11.4 `lessons`
| column | type | notes |
|---|---|---|
| id | uuid pk |
| module_id | uuid fk |
| lesson_id | text unique | logical lesson code, e.g. acct-eq-001 |
| slug | text unique |
| title | text |
| difficulty | text |
| estimated_minutes | int |
| gsheet_source_id | text |
| published | boolean |
| lesson_version | int | increment when source changes |
| created_at | timestamptz |
| updated_at | timestamptz |

## 11.5 `lesson_attempts`
Latest per-user lesson state.

| column | type | notes |
|---|---|---|
| id | uuid pk |
| user_id | uuid fk |
| lesson_id | uuid fk |
| status | text | not_started / in_progress / completed |
| latest_score | int |
| hint_count_used | int |
| solution_revealed | boolean |
| last_state_json | jsonb |
| started_at | timestamptz |
| completed_at | timestamptz nullable |
| updated_at | timestamptz |

### `last_state_json` example
```json
{
  "cells": {
    "B3": "140000000",
    "B4": "40000000"
  },
  "lastCheck": {
    "correct": 2,
    "total": 3,
    "percent": 67
  },
  "revealed": false
}
```

## 11.6 `lesson_check_events`
Tracks grading actions.

| column | type | notes |
|---|---|---|
| id | uuid pk |
| user_id | uuid fk |
| lesson_id | uuid fk |
| score | int |
| correct_count | int |
| total_count | int |
| checked_at | timestamptz |

## 11.7 `lesson_hint_events`
Tracks hint usage.

| column | type | notes |
|---|---|---|
| id | uuid pk |
| user_id | uuid fk |
| lesson_id | uuid fk |
| hint_level | int |
| requested_at | timestamptz |

## 11.8 `lesson_reveal_events`
Tracks reveal usage.

| column | type | notes |
|---|---|---|
| id | uuid pk |
| user_id | uuid fk |
| lesson_id | uuid fk |
| revealed_at | timestamptz |

---

## 12. Row-Level Security Strategy

### Principle
Users can only access their own attempts and event logs.

### RLS policy direction

#### `lesson_attempts`
- select: user can read rows where `auth.uid() = user_id`
- insert: user can insert rows where `auth.uid() = user_id`
- update: user can update rows where `auth.uid() = user_id`

#### event tables
Same rule: user-scoped access only.

### Admin/service operations
Lesson synchronization from Google Sheets should use service role or server-only access.

---

## 13. API Contracts

All lesson APIs require authenticated user except public marketing-facing endpoints.

## 13.1 GET `/api/dashboard`

### Purpose
Return dashboard summary for current user.

### Response
```json
{
  "stats": {
    "currentStreak": 2,
    "conceptsLearned": 2,
    "practiceCompleted": 1,
    "currentFocus": "Balance Sheet"
  },
  "continueLearning": {
    "lessonId": "acct-eq-001",
    "lessonSlug": "accounting-equation-basics",
    "title": "Accounting Equation Basics",
    "module": "Balance Sheet"
  },
  "modules": [
    {
      "moduleSlug": "balance-sheet",
      "title": "Balance Sheet",
      "activeLessonCount": 1
    }
  ]
}
```

---

## 13.2 GET `/api/lessons/:lessonId`

### Purpose
Return safe lesson payload for rendering.

### Response
```json
{
  "lessonId": "acct-eq-001",
  "lessonSlug": "accounting-equation-basics",
  "moduleSlug": "balance-sheet",
  "title": "Accounting Equation Basics",
  "description": "Lengkapi komponen laporan posisi keuangan sederhana...",
  "objective": "Memahami hubungan Assets = Liabilities + Equity...",
  "difficulty": "Beginner",
  "estimatedMinutes": 12,
  "revealAllowed": true,
  "grid": {
    "rows": 10,
    "cols": 6,
    "cells": {
      "A1": { "value": "Mini Case", "type": "label" },
      "A2": { "value": "Modal disetor pemilik", "type": "label" },
      "B2": { "value": "100000000", "type": "locked-value" },
      "B3": { "value": "", "type": "answer-target" }
    }
  },
  "hintCount": 3,
  "walkthroughAvailable": true,
  "attemptState": {
    "status": "in_progress",
    "latestScore": 67,
    "hintCountUsed": 1,
    "solutionRevealed": false,
    "cells": {
      "B3": "140000000"
    }
  }
}
```

### Notes
- `attemptState` is optional on first open.
- No answer key included.

---

## 13.3 POST `/api/lessons/:lessonId/check`

### Purpose
Grade current lesson answers.

### Request
```json
{
  "cells": {
    "B3": "140000000",
    "B4": "40000000",
    "B5": "100000000"
  }
}
```

### Response
```json
{
  "correct": 3,
  "total": 3,
  "percent": 100,
  "feedback": [
    {
      "cell": "B3",
      "ok": true,
      "explanation": "Total assets"
    },
    {
      "cell": "B4",
      "ok": true,
      "explanation": "Liabilities"
    },
    {
      "cell": "B5",
      "ok": true,
      "explanation": "Equity"
    }
  ],
  "status": "completed"
}
```

### Failure response
```json
{
  "correct": 1,
  "total": 3,
  "percent": 33,
  "feedback": [
    {
      "cell": "B3",
      "ok": false,
      "explanation": "Total assets"
    }
  ],
  "status": "in_progress"
}
```

### Security notes
- backend validates submitted cell IDs against editable/answer cells
- ignore or reject unexpected cells

---

## 13.4 POST `/api/lessons/:lessonId/hint`

### Purpose
Return next hint only.

### Request
```json
{
  "currentHintLevel": 1
}
```

### Response
```json
{
  "nextHintLevel": 2,
  "hintText": "Jika modal pemilik Rp100 juta dan utang Rp40 juta..."
}
```

### Rules
- if no more hints, return last state with `hasMoreHints: false`

---

## 13.5 POST `/api/lessons/:lessonId/reveal`

### Purpose
Reveal final answers for revealable cells.

### Response
```json
{
  "revealed": true,
  "cells": {
    "B3": "140000000",
    "B4": "40000000",
    "B5": "100000000"
  },
  "walkthrough": [
    {
      "stepNumber": 1,
      "explanation": "Jumlahkan liabilities dan equity untuk mendapatkan assets."
    }
  ]
}
```

### Security note
- only return answer cells for that lesson
- never return internal grading metadata unless needed

---

## 14. Grading Engine Design

### MVP grading mode
**Value-based grading only**

### Supported comparisons

#### Text
```ts
normalize(trim(value)) === normalize(trim(expected))
```

#### Number / currency
```ts
Math.abs(parsedActual - parsedExpected) <= tolerance
```

#### Percentage
Store percentage either as:
- raw decimal (`0.15`), or
- percentage number (`15`)

Choose one standard and enforce it.  
**Recommendation for MVP:** store and compare as raw numeric values entered by user, e.g. `15` for 15 percent, because it is easier for learners.

### Grading flow
1. load parsed lesson internally
2. iterate answer key rules
3. lookup submitted value by cell
4. normalize based on `value_type`
5. compare with tolerance
6. return feedback summary
7. persist attempt state and check event

### Pseudocode
```ts
for each rule in answerKey:
  actual = submittedCells[rule.cell]
  normalizedActual = normalize(actual, rule.valueType)
  normalizedExpected = normalize(rule.expectedValue, rule.valueType)
  ok = compare(normalizedActual, normalizedExpected, rule.tolerance)
```

---

## 15. Lesson Parser Design

### Parser objective
Transform Google Sheets lesson tabs into `ParsedLesson`.

### Parser stages

#### Stage 1 — fetch raw tab ranges
Read each required tab.

#### Stage 2 — validate config
Check required keys and types.

#### Stage 3 — parse grid
Build rectangular cell map from `Student_View`.

#### Stage 4 — parse editable cells
Build editable cell set.

#### Stage 5 — parse answer key
Build grading rules.

#### Stage 6 — parse hints and walkthrough
Build content arrays.

#### Stage 7 — derive visible cell types
Assign each visible cell one of:
- label
- locked-value
- answer-target
- input

#### Stage 8 — build safe payload + internal payload
Return safe payload for frontend and protected internal payload for grading.

### Parser validation errors
Parser should fail loudly if:
- missing required tab
- missing required config key
- answer cell not editable
- cell reference invalid
- duplicate answer cell
- hint levels broken

### Recommendation
Create a `parseLessonSpreadsheet(sheetId)` function that returns:
```ts
{
  safePayload,
  parsedLesson
}
```

---

## 16. Caching Strategy

### MVP caching approach
Use **database-backed lesson metadata cache** or **in-memory server cache** sparingly.

### Recommendation for MVP
- lesson structural metadata cached in `lessons` table
- runtime lesson parsing can happen on request initially
- optimize later if needed

### Future option
Add `lesson_cache` table with parsed safe JSON and version hash.

For MVP, do not overbuild cache invalidation.

---

## 17. Progress State Model

### Lesson statuses
- `not_started`
- `in_progress`
- `completed`

### Completion rule for MVP
A lesson is completed when:
- score reaches 100, or
- user reveals solution and manually marks complete later

**Recommendation:** only mark `completed` automatically on 100 score for MVP.

### Progress restore flow
When user opens lesson:
1. backend loads safe lesson payload
2. backend loads latest attempt state
3. backend merges saved user cells into response
4. frontend renders restored state

---

## 18. Error Handling

### Frontend errors
Handle gracefully:
- lesson failed to load
- check request failed
- hint request failed
- reveal request failed
- session expired

### Backend errors
Return structured responses:

```json
{
  "error": {
    "code": "LESSON_PARSE_FAILED",
    "message": "Lesson configuration is invalid."
  }
}
```

### Recommended error codes
- `UNAUTHORIZED`
- `LESSON_NOT_FOUND`
- `LESSON_NOT_PUBLISHED`
- `LESSON_PARSE_FAILED`
- `INVALID_SUBMISSION`
- `HINT_NOT_AVAILABLE`
- `REVEAL_NOT_ALLOWED`
- `INTERNAL_ERROR`

---

## 19. Security Boundaries

### Must protect
- answer key
- service account credentials
- Supabase service role key
- internal sheet structure not needed by client

### Threat model for MVP
Protect against obvious leakage, not advanced attackers.

### Required controls
- all grading server-side
- no answer tab data in safe payload
- no direct learner access to internal Google Sheet URLs
- sanitize API responses
- validate submitted cells
- auth required for lesson endpoints

---

## 20. Sync Strategy Between Supabase and Google Sheets

### Chosen source of truth
For lesson content: **Google Sheets**  
For lesson catalog and publication status: **Supabase**

### Recommended workflow
1. create lesson in Google Sheets
2. create lesson record in Supabase with `gsheet_source_id`
3. publish lesson by setting `published = true`
4. backend resolves lesson by DB record, then parses Google Sheet

### Why not discover sheets dynamically?
Because it creates unnecessary chaos for MVP.

---

## 21. Suggested Server File Responsibilities

### `lib/sheets/client.ts`
- build Google auth client
- build sheets API client

### `lib/sheets/read-range.ts`
- helper to read tab ranges

### `lib/parser/parse-lesson-config.ts`
- parse Lesson_Config

### `lib/parser/parse-student-view.ts`
- parse Student_View

### `lib/parser/parse-editable-cells.ts`
- parse Editable_Cells

### `lib/parser/parse-answer-key.ts`
- parse Answer_Key

### `lib/parser/parse-hints.ts`
- parse Hints

### `lib/parser/parse-walkthrough.ts`
- parse Walkthrough

### `lib/parser/parse-lesson-spreadsheet.ts`
- orchestration layer

### `lib/grading/normalize-value.ts`
- normalize text/number/currency/percentage

### `lib/grading/grade-lesson.ts`
- core grading logic

### `lib/progress/get-dashboard-summary.ts`
- dashboard stats builder

### `lib/progress/upsert-lesson-attempt.ts`
- attempt save logic

---

## 22. Antigravity Implementation Sequence

### Step 1 — Project foundation
Build:
- Next.js app router
- Tailwind + shadcn/ui setup
- Supabase auth wiring
- base layout and protected routes

### Step 2 — Frontend lesson shell
Build:
- dashboard page
- course page
- lesson page
- spreadsheet grid component using mocked lesson JSON
- hint/result panels

### Step 3 — Database and progress
Build:
- Supabase schema
- auth guard
- save and restore attempt state
- dashboard stats endpoint

### Step 4 — Lesson service
Build:
- lesson lookup by lesson slug/id from DB
- Google Sheets client
- parser orchestration
- safe lesson response endpoint

### Step 5 — Grading flow
Build:
- check endpoint
- server-side grading
- attempt update
- check event logging

### Step 6 — Hint flow
Build:
- hint endpoint
- hint event logging
- frontend progressive hint state

### Step 7 — Reveal flow
Build:
- reveal endpoint
- reveal event logging
- walkthrough response

### Step 8 — Hardening
Build:
- parser validation errors
- endpoint input validation
- loading/empty/error states
- RLS checks

---

## 23. QA Checklist

### Lesson parser QA
- fails if required tab missing
- fails if answer key invalid
- fails if editable cells invalid
- parses blank cells safely

### Lesson UI QA
- locked cells cannot be edited
- reset restores original values
- reveal updates correct cells only
- progress bar reflects backend result

### Security QA
- safe lesson payload contains no answer key
- browser devtools cannot inspect hidden answer data from initial load
- direct Google Sheet links are not exposed in UI

### Progress QA
- attempts persist after refresh
- dashboard reflects latest activity
- completed lessons remain completed

---

## 24. Example Data Flow — End to End

### Lesson open
1. User opens `/lesson/accounting-equation-basics`
2. Frontend requests `GET /api/lessons/acct-eq-001`
3. Backend checks auth
4. Backend loads lesson DB record
5. Backend parses Google Sheet using `gsheet_source_id`
6. Backend builds safe payload
7. Backend fetches latest attempt state
8. Backend returns safe payload + attempt state
9. Frontend renders grid

### Check answer
1. User clicks Check Answer
2. Frontend submits editable cells to `/check`
3. Backend loads parsed lesson internally
4. Backend grades submitted values
5. Backend saves attempt + check event
6. Backend returns summary
7. Frontend updates result panel and progress bar

### Hint
1. User clicks Hint
2. Frontend sends current level to `/hint`
3. Backend returns only next hint
4. Backend logs hint usage
5. Frontend appends hint panel

### Reveal
1. User clicks Reveal Solution
2. Frontend calls `/reveal`
3. Backend returns revealable final values + walkthrough
4. Backend logs reveal event and updates attempt
5. Frontend fills answer cells and marks revealed state

---

## 25. Technical Decisions Locked for MVP

- Next.js App Router
- Supabase Auth + Postgres
- Google Sheets API via service account
- One spreadsheet per lesson
- Server-side grading only
- Value-based grading only
- Desktop-first UI
- No public Google Sheet embed for learners
- Minimal spreadsheet engine, not full Excel clone

---

## 26. Technical Debt Explicitly Accepted

These are acceptable for MVP:
- no advanced caching layer
- no formula-based grading
- no admin CMS UI
- no background sync job for sheet updates
- no fine-grained analytics pipeline
- no multi-language support

This is fine as long as:
- lessons load reliably,
- answer key stays protected,
- authoring workflow stays simple.

---

## 27. Build-Ready Prompt for Antigravity

Use this technical architecture spec to implement the Next Finance MVP.

You are building a desktop-first interactive finance learning platform with a spreadsheet-style lesson workspace. The frontend must never receive the full answer key during normal lesson load. Google Sheets is used only as the internal lesson authoring backend, and Next.js backend routes must parse Google Sheets into safe frontend payloads.

Build the implementation with these layers:
- Next.js App Router
- shadcn/ui + Tailwind for UI
- Supabase for auth and persistence
- Google Sheets API for lesson source
- server-side grading only

Follow these constraints strictly:
1. One spreadsheet per lesson for MVP.
2. Required lesson tabs: Lesson_Config, Student_View, Editable_Cells, Answer_Key, Hints, Walkthrough.
3. GET lesson endpoint returns safe lesson payload only.
4. POST check endpoint grades submitted cells server-side.
5. POST hint returns only the next hint.
6. POST reveal returns revealable answer cells and walkthrough.
7. Save progress to Supabase and restore it when lesson is reopened.
8. Keep architecture modular so lesson parsing, grading, and progress logic are separate.

Do not implement formula grading in this phase. Do not build direct public Google Sheet embed for learners.

---

## 28. What Should Be Built Next After This Doc

After this technical spec, the next most useful document is:

**Lesson Authoring Spec**

That document should define:
- exact Google Sheet template,
- cell naming rules,
- lesson creation SOP,
- validation checklist for new lessons,
- examples for your first 10 lessons.

