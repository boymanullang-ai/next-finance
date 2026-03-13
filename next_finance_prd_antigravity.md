# PRD — Next Finance MVP

## 1. Product Overview

**Product name:** Next Finance  
**Positioning:** Interactive finance learning platform with spreadsheet-style practice, using Google Sheets as the lesson authoring and backend content layer.  
**Core promise:** Users learn finance by doing structured spreadsheet exercises directly on the platform, receive feedback and hints, and only unlock the full correct solution at the end.

This product is **not** a traditional LMS, not a video-first course platform, and not a public Google Sheets repository. It is a **hands-on practice platform** inspired by the learning feel of Quantus and the content depth of Corporate Finance Institute, but optimized for spreadsheet-based finance education.

---

## 2. Goal of the MVP

Build a usable MVP that validates these assumptions:

1. Users are willing to learn finance inside a spreadsheet-style interface.
2. Users find immediate answer checking and progressive hints valuable.
3. Users accept that downloads are locked during practice.
4. Google Sheets can serve as the lesson-authoring backend without exposing answer keys.
5. A narrow lesson set can create enough engagement to justify expansion.

The MVP should be sufficient for:
- internal demo,
- early user testing,
- landing page screenshots,
- small beta launch,
- content validation,
- monetization testing later.

---

## 3. Primary User

### Main ICP
**Fresh graduates and junior finance/accounting analysts** who:
- understand theory weakly or partially,
- struggle to apply concepts in spreadsheets,
- want practical learning rather than passive videos,
- need job-relevant exercises,
- prefer structured and interactive practice.

### Secondary ICP
- Career switchers into finance
- Final-year students preparing for internships
- Early FP&A learners

### User pain points
- Most finance courses are too passive
- Many students memorize, but cannot build
- Spreadsheet practice usually has no instant feedback
- Google Sheets and Excel exercises are often distributed as static files without guided learning
- Users do not know *where* they are wrong, only that they are wrong

---

## 4. Product Principles

1. **Practice-first, not video-first**  
   The product must prioritize doing over watching.

2. **Platform-controlled learning workspace**  
   Users practice inside the platform. They should not access the raw answer sheet during the lesson.

3. **Google Sheets as backend authoring, not exposed frontend**  
   Google Sheets should be used by the team to create lessons and answer logic, but not directly exposed to learners as editable public files.

4. **Progressive disclosure**  
   Hints and solutions are unlocked gradually, not all at once.

5. **Narrow MVP, deep experience**  
   It is better to have 10 strong lessons than 100 shallow modules.

6. **Anti-cheat by architecture**  
   Answer keys must stay server-side.

---

## 5. MVP Scope

### In scope
- User-facing web app
- Dashboard
- Course/module list
- Lesson detail page
- Spreadsheet-style practice workspace
- Locked and editable cells
- Check Answer flow
- Hint flow
- Reset lesson flow
- Reveal solution flow at the end
- Lesson progress scoring
- Google Sheets-backed lesson content retrieval via backend API
- Minimal user progress persistence

### Out of scope for MVP
- Real-time collaboration
- Community features
- Certificates
- Complex gamification
- Full AI tutor chat
- Formula parser with deep semantic validation
- Native mobile app
- Offline mode
- Public downloadable templates during lesson
- Payment integration
- Admin dashboard with full CMS UI

---

## 6. MVP Learning Content Scope

### Track 1: Financial Statements Fundamentals

Initial modules:
1. Balance Sheet
2. Income Statement
3. Cash Flow Statement
4. Basic 3-Statement Linkage

### Initial lesson examples
1. Accounting Equation Basics
2. Simple Balance Sheet Completion
3. Build a Basic Income Statement
4. Gross Profit and Net Income Build
5. Basic Cash Flow Classification
6. Working Capital Impact Exercise
7. Link Net Income to Equity
8. Build a Mini 3-Statement Output
9. Monthly Performance Variance Basics
10. Simple Forecast Starter

### Lesson design standard
Each lesson must include:
- title
- short description
- objective
- difficulty
- estimated completion time
- case/instructions
- starter spreadsheet layout
- editable cells
- locked cells
- answer rules
- hints (minimum 3 levels)
- reveal solution logic
- post-check feedback

---

## 7. User Stories

### Student-facing
- As a learner, I want to open a lesson and understand what I need to complete.
- As a learner, I want to edit only the allowed cells so I do not break the template.
- As a learner, I want to check whether my answers are correct.
- As a learner, I want hints if I get stuck.
- As a learner, I want the final correct solution only after I finish or choose to reveal it.
- As a learner, I want progress to persist so I can continue later.
- As a learner, I want a dashboard to see where I left off.

### Internal/admin-facing
- As a product owner, I want to author lessons in Google Sheets.
- As a product owner, I want answer keys hidden from the client.
- As a product owner, I want to add new lessons by editing a structured Google Sheet and updating metadata.
- As a product owner, I want a scalable lesson format so future modules can be created consistently.

---

## 8. Functional Requirements

### 8.1 Authentication
MVP may support either:
- simple email/password auth, or
- magic link auth.

Minimum requirement:
- login,
- logout,
- identify current user,
- save progress per user.

### 8.2 Dashboard
Dashboard should show:
- current streak placeholder,
- lessons completed,
- progress summary,
- continue learning CTA,
- available modules.

### 8.3 Course Outline
User can:
- browse modules,
- open a module,
- select a lesson,
- see difficulty and duration.

### 8.4 Lesson Workspace
The lesson workspace must include:
- lesson metadata,
- instructions,
- spreadsheet grid,
- locked cells,
- editable cells,
- answer cells,
- action buttons.

Buttons required:
- Check Answer
- Hint
- Reset
- Reveal Solution

### 8.5 Answer Checking
The backend should evaluate user answers against server-side rules.

#### MVP validation mode
Use **value-based checking** first:
- exact string match for text,
- exact numeric match for numbers,
- optional tolerance for numeric fields.

Future enhancement:
- formula pattern validation,
- dependency graph validation,
- multi-cell logic validation.

### 8.6 Hint Logic
Hints must be progressive:
- Hint 1 = directional clue
- Hint 2 = stronger clue
- Hint 3 = almost-step guidance

Hints should unlock one by one, not all at once.

### 8.7 Reveal Solution
When user clicks Reveal Solution:
- final answers populate into relevant answer cells,
- solution state is shown,
- check results update,
- platform logs that solution was revealed.

### 8.8 Progress Tracking
Store at minimum:
- user_id
- lesson_id
- last_attempt_state
- latest score
- completion status
- hint_count_used
- revealed_solution boolean
- updated_at

---

## 9. Non-Functional Requirements

- Responsive web app, desktop-first
- Fast lesson load times
- Secure answer key storage
- Clean separation between frontend UI and backend grading logic
- Maintainable lesson schema
- Easy to add new lessons without editing core app code too much

---

## 10. Product Constraints

1. Users must **not** be able to access raw answer sheets during active practice.
2. Google Sheets must **not** be embedded as public editable files for learners.
3. Answer keys must remain server-side.
4. MVP should favor simplicity over sophistication.
5. Spreadsheet UI may be simplified rather than fully Excel-like.
6. Architecture must stay friendly for solo-founder / vibe-coded iteration.

---

## 11. Recommended Tech Stack

### Frontend
- Next.js
- React
- Tailwind CSS
- shadcn/ui
- Framer Motion

### Backend
- Next.js API routes or server actions
- Supabase for auth and database
- Google Sheets API with service account

### Database
- Supabase Postgres

### Hosting
- Vercel

### Lesson backend
- Google Sheets as authoring CMS

---

## 12. System Architecture

### High-level architecture
1. User opens lesson page on frontend
2. Frontend requests lesson payload from backend
3. Backend reads lesson metadata from internal store or Google Sheets
4. Backend returns **safe lesson JSON** without answer key exposure
5. User inputs answers in platform grid
6. Frontend sends attempt payload to backend
7. Backend evaluates against answer key stored in protected source
8. Backend returns result summary and feedback
9. Progress is stored in database

### Important architecture rule
**Frontend never receives the full answer key upfront.**

---

## 13. Google Sheets Content Architecture

Google Sheets is used internally by the team to author lessons.

### Option A: One spreadsheet per lesson
Tabs:
- Lesson_Config
- Student_View
- Answer_Key
- Hints
- Walkthrough

### Option B: One master spreadsheet per module
Tabs:
- Lessons_Index
- View_Balance_Sheet_01
- Answer_Balance_Sheet_01
- Hints_Balance_Sheet_01
- etc.

### Recommended for MVP
Use **one spreadsheet per lesson**. This is less elegant but simpler and safer for early iteration.

### Required tab schema

#### Tab: Lesson_Config
Fields:
- lesson_id
- title
- module
- description
- objective
- difficulty
- estimated_minutes
- rows_count
- cols_count
- reveal_allowed

#### Tab: Student_View
Contains visible starter grid content.

#### Tab: Editable_Cells
Fields:
- cell
- editable_boolean

#### Tab: Answer_Key
Fields:
- cell
- expected_value
- value_type
- tolerance
- explanation

#### Tab: Hints
Fields:
- level
- hint_text

#### Tab: Walkthrough
Fields:
- step_number
- explanation

---

## 14. Data Model

### Table: users
- id
- email
- created_at

### Table: courses
- id
- slug
- title
- description
- created_at

### Table: modules
- id
- course_id
- slug
- title
- sort_order

### Table: lessons
- id
- module_id
- lesson_slug
- title
- difficulty
- estimated_minutes
- gsheet_source_id
- is_published
- created_at

### Table: lesson_attempts
- id
- user_id
- lesson_id
- status
- latest_score
- hints_used
- solution_revealed
- last_state_json
- updated_at
- created_at

### Table: lesson_check_events
- id
- user_id
- lesson_id
- score
- checked_at

---

## 15. API Requirements

### GET /api/lessons/:lessonId
Returns safe lesson payload:
- lesson metadata
- visible cells
- editable cells
- hint availability metadata
- no answer key

### POST /api/lessons/:lessonId/check
Input:
- user cell values

Output:
- score
- correctness by answer cell
- minimal feedback
- updated progress

### POST /api/lessons/:lessonId/hint
Input:
- current hint level

Output:
- next hint only

### POST /api/lessons/:lessonId/reveal
Output:
- final correct values for revealable cells
- reveal flag saved

### GET /api/dashboard
Returns:
- user progress
- active course
- continue learning lesson
- summary counts

---

## 16. UX Requirements

### Dashboard
Must feel premium and simple.
Needs:
- summary cards
- continue learning block
- modules list
- progress visibility

### Lesson page
Should be split into 3 zones:
1. Lesson context and instructions
2. Spreadsheet workspace
3. Right rail for hints and results

### Spreadsheet behavior
- locked cells are visually distinct
- editable cells are obvious
- answer cells can be highlighted lightly
- reveal state should be visually obvious
- reset should restore original starter state

---

## 17. Anti-Cheat Requirements

- No raw answer key in client payload
- No public Google Sheet links containing answer logic
- No hidden answer tabs in client-exposed sheets
- No downloadable correct model during lesson
- All grading handled server-side

This does not need enterprise-grade anti-cheat, but it must prevent obvious leakage.

---

## 18. Success Criteria for MVP

### Product success
- User can complete at least one lesson end-to-end
- Check Answer works correctly
- Hint flow works correctly
- Reveal flow works correctly
- Progress persists across sessions
- New lesson can be added from Google Sheets with low engineering effort

### Validation success
- At least 70 percent of test users understand the interaction flow without manual explanation
- At least 50 percent of test users complete one lesson
- At least 30 percent ask for more lessons or more modules

---

## 19. Build Order for Antigravity

### Phase 1 — Foundation
- create app shell
- create auth flow
- create dashboard layout
- create course/module/lesson routing

### Phase 2 — Lesson Engine
- create spreadsheet-style grid component
- support locked vs editable cells
- load lesson payload from mocked JSON first
- implement check/hint/reset/reveal actions

### Phase 3 — Google Sheets Backend
- connect service account
- build parser for lesson tabs
- create safe lesson JSON transformer
- build answer check API

### Phase 4 — Persistence
- save lesson attempts
- restore last attempt
- update dashboard metrics

### Phase 5 — Polish
- improve visuals
- improve feedback clarity
- add walkthrough section
- improve error states

---

## 20. Definition of Done for MVP

MVP is done when:
- app supports login,
- dashboard is functional,
- at least 3 lessons work end-to-end,
- each lesson can load from Google Sheets backend,
- user can check answers,
- user can request hints,
- user can reveal solution,
- progress is saved and restored,
- answer key is not exposed on client.

---

## 21. Antigravity Build Prompt

Use this PRD to build a desktop-first MVP web application called **Next Finance**.

The application is an interactive finance learning platform with spreadsheet-style practice. Users should complete finance exercises directly in the browser using a grid that looks like a simple spreadsheet. The platform should support locked cells, editable cells, answer checking, progressive hints, reset, and reveal solution.

Use this architecture:
- Next.js
- React
- Tailwind
- shadcn/ui
- Supabase for auth and persistence
- Google Sheets API as the lesson authoring backend
- Vercel-ready deployment

Critical implementation rules:
1. Do not expose answer keys in frontend payloads.
2. Do not embed public editable Google Sheets directly for users.
3. Use Google Sheets only as internal lesson authoring and answer source.
4. Backend must transform Google Sheets lesson data into safe frontend JSON.
5. MVP should prioritize simplicity and maintainability over complexity.

Required screens:
- dashboard
- course/module/lesson browser
- lesson workspace with spreadsheet grid
- profile page

Required lesson actions:
- Check Answer
- Hint
- Reset
- Reveal Solution

Required backend routes:
- GET lesson payload
- POST answer check
- POST hint
- POST reveal
- GET dashboard summary

Build the product with a clean premium interface, spreadsheet-like lesson interaction, and modular architecture so new lessons can be added later with minimal friction.

---

## 22. Antigravity Agent Task Breakdown

### Agent 1 — App Shell and Routing
Build:
- layout
- sidebar/topbar
- dashboard
- course navigation
- basic routing

### Agent 2 — Lesson Workspace UI
Build:
- spreadsheet grid
- locked/editable cell states
- lesson metadata panel
- hint panel
- results panel
- action buttons

### Agent 3 — Backend Lesson Service
Build:
- Google Sheets connector
- lesson parser
- safe JSON transformer
- answer-checking service

### Agent 4 — Persistence and Progress
Build:
- Supabase schema
- save attempts
- restore attempts
- dashboard stats

### Agent 5 — QA and Guardrails
Check:
- answer key leakage
- broken lesson parsing
- state reset issues
- reveal flow
- edge cases for blank values

---

## 23. Known Risks

1. Google Sheets schema inconsistency will break lesson parsing.
2. If the grid UI becomes too ambitious, build speed will slow down.
3. If formula checking is included too early, scope will blow up.
4. If too many modules are included in MVP, the product will feel unfinished.
5. If answer keys are accidentally exposed, the model breaks.

---

## 24. Product Decisions Already Made

- Desktop-first MVP
- Practice inside platform
- No raw downloadable answer file during active lesson
- Google Sheets used as backend authoring layer
- Narrow initial curriculum: financial statements fundamentals
- Focus on end-to-end lesson loop, not broad content library

---

## 25. Next Recommended Documents After This PRD

After this PRD, create these docs in order:

1. **Technical Architecture Spec**  
   precise API contracts, database schema, Google Sheets parser structure

2. **Lesson Authoring Spec**  
   exact template for creating lessons in Google Sheets

3. **Antigravity Execution Prompt Pack**  
   one prompt per agent/task

4. **UI States and Components Spec**  
   state diagrams and edge cases for lesson workspace

5. **Seed Content Plan**  
   first 10 lessons with objectives, hints, and answer rules

