# Lesson Authoring Spec — Next Finance MVP

## 1. Purpose

This document defines the exact standard for creating new lessons in Google Sheets for the Next Finance MVP.

It is written for:
- the founder,
- future content operators,
- AI agents building parsing logic,
- any contributor authoring new finance practice lessons.

This spec exists to prevent three problems:
1. inconsistent lesson structure,
2. broken parser behavior,
3. answer leakage caused by sloppy sheet design.

The goal is simple:
**Every new lesson must be created in a predictable format so the platform can load, validate, grade, and reveal it safely.**

---

## 2. Authoring Philosophy

### Core rule
Google Sheets is the **authoring layer**, not the learner-facing product.

### This means
- lesson creators build content in Google Sheets,
- the backend reads the Google Sheet,
- the platform converts it into a safe lesson payload,
- learners never receive the raw full lesson sheet.

### Authoring principle
A lesson should be easy to create, easy to validate, and impossible to misunderstand by the parser.

---

## 3. Lesson Packaging Standard

## Chosen standard for MVP
**One Google Spreadsheet = One Lesson**

### Why
This is less elegant than one giant workbook, but far safer and easier for MVP.

It gives:
- easier debugging,
- lower parsing complexity,
- cleaner version control,
- lower risk of breaking unrelated lessons,
- simpler lesson ownership.

### Naming convention
Each spreadsheet must use this format:

```text
NF_LESSON_<MODULE_CODE>_<LESSON_CODE>
```

### Examples
```text
NF_LESSON_BS_ACCT_EQ_001
NF_LESSON_IS_BASIC_BUILD_001
NF_LESSON_CF_CLASSIFY_001
```

### Rules
- use uppercase in spreadsheet name
- use underscore separators only
- avoid spaces
- do not put version number in file title unless really needed

---

## 4. Required Tabs

Every lesson spreadsheet must contain these tabs exactly:

1. `Lesson_Config`
2. `Student_View`
3. `Editable_Cells`
4. `Answer_Key`
5. `Hints`
6. `Walkthrough`

### Important
These tab names are **case-sensitive** for MVP.

If any one is missing, the parser should fail.

---

## 5. Global Rules for Authors

1. Do not rename required tabs.
2. Do not insert decorative merged cells in configuration tabs.
3. Do not use hidden tabs as security.
4. Do not assume blank cells are editable.
5. Do not store answer key in comments or notes.
6. Do not rely on sheet protection as the primary security model.
7. Do not place multiple lessons in one spreadsheet for MVP.
8. Keep lesson structure rectangular and predictable.
9. Use explicit cell references consistently.
10. Assume the parser is strict and stupid, not clever.

That last point matters. Do not build authoring around human intuition. Build it around machine predictability.

---

## 6. Directory and Catalog Workflow

### Source of truth split
- **Google Sheets** = lesson content source
- **Supabase lessons table** = lesson catalog source

### Lesson creation workflow
1. Create new spreadsheet using the approved template
2. Fill all required tabs
3. Validate lesson using author checklist
4. Add `gsheet_source_id` to Supabase lesson record
5. Set `published = true` only after validation passes

### Recommendation
Create a Google Drive folder structure like:

```text
Next Finance Lessons/
  Balance Sheet/
  Income Statement/
  Cash Flow/
  Three Statement/
```

---

## 7. Lesson Identity Rules

Each lesson has several identifiers.

### 7.1 Spreadsheet filename
Human-facing source file name.

Example:
```text
NF_LESSON_BS_ACCT_EQ_001
```

### 7.2 `lesson_id`
Internal logical code used in config.

Example:
```text
acct-eq-001
```

### 7.3 `lesson_slug`
Frontend routing slug.

Example:
```text
accounting-equation-basics
```

### 7.4 `module_slug`
Belongs to course/module routing.

Example:
```text
balance-sheet
```

### 7.5 `title`
User-visible lesson title.

Example:
```text
Accounting Equation Basics
```

### Rules
- `lesson_id` must be unique
- `lesson_slug` must be unique
- `lesson_slug` should be URL-safe lowercase with hyphens
- `module_slug` must match an existing module in app catalog

---

## 8. Tab Spec — Lesson_Config

This tab is a two-column key-value table.

### Required format
| key | value |
|---|---|
| lesson_id | acct-eq-001 |
| lesson_slug | accounting-equation-basics |
| module_slug | balance-sheet |
| title | Accounting Equation Basics |
| description | Lengkapi komponen laporan posisi keuangan sederhana berdasarkan transaksi awal bisnis. |
| objective | Memahami hubungan Assets = Liabilities + Equity melalui input langsung di spreadsheet workspace. |
| difficulty | Beginner |
| estimated_minutes | 12 |
| rows_count | 10 |
| cols_count | 6 |
| reveal_allowed | true |
| published | true |

### Required keys
- `lesson_id`
- `lesson_slug`
- `module_slug`
- `title`
- `description`
- `objective`
- `difficulty`
- `estimated_minutes`
- `rows_count`
- `cols_count`
- `reveal_allowed`
- `published`

### Allowed difficulty values
- `Beginner`
- `Intermediate`
- `Advanced`

### Rules
- no duplicate keys
- booleans must be `true` or `false`
- `rows_count` and `cols_count` must be integers
- title must not be blank
- description and objective should be short but meaningful

### Author notes
Do not add random extra keys for MVP unless the parser is updated first.

---

## 9. Tab Spec — Student_View

This tab is the visible spreadsheet layout that learners will experience.

### Purpose
It defines:
- labels,
- starter values,
- layout,
- visible context for the lesson.

### Rules
- must follow the exact rectangular size defined by `rows_count` and `cols_count`
- blank cells are allowed
- merged cells are strongly discouraged
- visual formatting may exist for author readability, but parser should only rely on cell values
- do not infer editability here

### Example
|   | A | B | C | D | E | F |
|---|---|---|---|---|---|---|
| 1 | Mini Case |  |  |  |  |  |
| 2 | Modal disetor pemilik | 100000000 |  | Utang bank | 40000000 |  |
| 3 | Total Assets |  |  |  |  |  |
| 4 | Liabilities |  |  |  |  |  |
| 5 | Equity |  |  |  |  |  |

### Good usage examples
- case prompts
- known input data
- line item labels
- section headers

### Bad usage examples
- hidden answers
- instructions that conflict with `Lesson_Config`
- notes only visible in formatting but not in actual cell values

---

## 10. Tab Spec — Editable_Cells

This tab explicitly lists which cells the learner is allowed to modify.

### Required format
| cell | editable |
|---|---|
| B3 | true |
| B4 | true |
| B5 | true |

### Rules
- every listed `cell` must be valid within the defined grid
- `editable` should be `true` for all MVP rows
- duplicate cell references are invalid
- cells not listed here are considered non-editable

### Important principle
Editability is **never** inferred from blank cells in `Student_View`.

That would be sloppy and dangerous.

---

## 11. Tab Spec — Answer_Key

This tab defines the server-side answer rules.

### Required format
| cell | expected_value | value_type | tolerance | explanation |
|---|---|---|---|---|
| B3 | 140000000 | number | 0 | Total assets |
| B4 | 40000000 | number | 0 | Liabilities |
| B5 | 100000000 | number | 0 | Equity |

### Required columns
- `cell`
- `expected_value`
- `value_type`
- `tolerance`
- `explanation`

### Allowed `value_type` values
- `text`
- `number`
- `currency`
- `percentage`

### Rules
- every answer key cell must also exist in `Editable_Cells`
- duplicate answer cells are invalid
- tolerance is required for numeric values, even if `0`
- explanation should be human-readable because it may appear in feedback UI

### Formatting rules by type
#### `text`
Use exact comparison after trim and normalization.

#### `number`
Use plain numeric value with no commas.

#### `currency`
For MVP treat same as number, but keep semantic label separate.

#### `percentage`
For MVP store as whole number if user is expected to type whole number. Example:
- store `15`, not `0.15`

Pick one standard and stick to it across lessons.

### Important
Do not put formulas in `expected_value` for MVP.
Only final expected outputs.

---

## 12. Tab Spec — Hints

This tab defines progressive hints.

### Required format
| level | hint_text |
|---|---|
| 1 | Mulai dari total aset dulu, lalu cocokkan sisi kanan persamaan. |
| 2 | Jika modal pemilik Rp100 juta dan utang Rp40 juta, maka total aset harus Rp140 juta. |
| 3 | Pastikan nilai akhir Assets sama dengan Liabilities + Equity. |

### Rules
- levels must start at `1`
- levels must be sequential without gaps
- one row per hint level
- at least 3 hints recommended for each lesson
- do not make Hint 1 too revealing
- do not make Hint 3 still too vague

### Hint writing standard
#### Hint 1
Directional clue

#### Hint 2
Stronger clue with structure

#### Hint 3
Near-solution guidance without dumping everything

### Bad hint example
“Jawabannya 140000000.”

That defeats the point.

---

## 13. Tab Spec — Walkthrough

This tab defines explanation steps after reveal, or later as part of lesson review.

### Required format
| step_number | explanation |
|---|---|
| 1 | Tentukan liabilities dan equity dari data yang tersedia. |
| 2 | Jumlahkan liabilities dan equity untuk mendapatkan total assets. |
| 3 | Masukkan hasil akhir ke cell yang diminta. |

### Rules
- steps must be sequential
- explanation should be clear and concise
- walkthrough should explain logic, not just restate answers

### Purpose
Walkthrough is used for:
- reveal state explanation,
- future solution pages,
- post-completion learning reinforcement.

---

## 14. Cell Reference Rules

### Valid format
Use standard spreadsheet cell references:
- `A1`
- `B3`
- `F10`

### Invalid examples
- `a1`
- `Row1Col2`
- `B-3`
- `B03`

### Rules
- uppercase letters only
- no ranges in MVP authoring tabs
- one row per cell reference

---

## 15. Derived Cell Types in App

The platform will derive visible cell behavior from the combination of `Student_View`, `Editable_Cells`, and `Answer_Key`.

### Logic
A visible cell becomes:
- `label` if non-editable and textual or structural
- `locked-value` if non-editable and has a visible value
- `input` if editable but not in answer key
- `answer-target` if editable and also in answer key

### Author implication
Do not try to manually label UI cell type in sheets for MVP.
The backend derives it.

---

## 16. Lesson Difficulty Design Standard

### Beginner
Use when:
- direct inputs,
- simple calculations,
- one-step or two-step logic,
- no tricky accounting mechanics.

### Intermediate
Use when:
- multiple dependencies,
- more than one statement section,
- some classification judgment.

### Advanced
Use when:
- multi-layer logic,
- integrated statements,
- case interpretation matters.

### Rule
Do not label something advanced just to make it sound premium.
That is fake sophistication and it hurts the learner journey.

---

## 17. Lesson Design Checklist

Before publishing a lesson, the author must confirm:

### Identity
- lesson_id exists and is unique
- lesson_slug exists and is unique
- module_slug is valid
- title is clear

### Config
- all required config keys filled
- rows_count and cols_count correct
- difficulty valid
- reveal_allowed set intentionally

### Student View
- visible grid matches intended lesson
- no accidental answer leakage
- no conflicting text

### Editable Cells
- all learner input cells listed
- no non-existent cells included
- no required learner cell missing

### Answer Key
- all answer cells exist in editable list
- expected values correct
- value types correct
- tolerance intentionally set
- explanations readable

### Hints
- levels are sequential
- hints increase in helpfulness
- none of the hints instantly kill the challenge

### Walkthrough
- steps are sequential
- explanation teaches logic
- reveal state makes sense after walkthrough

### QA
- lesson can be parsed
- lesson can be checked
- reveal works
- reset works

---

## 18. Lesson Quality Standard

Every lesson must pass this bar:

### Good lesson
- objective is clear
- task is concrete
- layout is understandable in under 20 seconds
- answer checking feels fair
- hints help progressively
- reveal teaches, not just exposes answers

### Bad lesson
- confusing prompt
- unclear input area
- answer cells hidden randomly
- hints useless or too revealing
- too many concepts at once

Do not cram three ideas into one lesson just because it saves time.
That will make the product worse.

---

## 19. Recommended Lesson Template Copy

Use this exact starter structure for most lessons.

### Lesson_Config template
| key | value |
|---|---|
| lesson_id |  |
| lesson_slug |  |
| module_slug |  |
| title |  |
| description |  |
| objective |  |
| difficulty | Beginner |
| estimated_minutes | 10 |
| rows_count | 10 |
| cols_count | 6 |
| reveal_allowed | true |
| published | false |

### Editable_Cells template
| cell | editable |
|---|---|
| B3 | true |

### Answer_Key template
| cell | expected_value | value_type | tolerance | explanation |
|---|---|---|---|---|
| B3 |  | number | 0 |  |

### Hints template
| level | hint_text |
|---|---|
| 1 |  |
| 2 |  |
| 3 |  |

### Walkthrough template
| step_number | explanation |
|---|---|
| 1 |  |
| 2 |  |
| 3 |  |

---

## 20. Publishing SOP

### Step 1 — Create lesson file
Create a new spreadsheet from template using naming convention.

### Step 2 — Fill Lesson_Config
Add all metadata first.

### Step 3 — Build Student_View
Lay out the visible practice grid.

### Step 4 — Mark Editable_Cells
Explicitly list all learner-editable cells.

### Step 5 — Fill Answer_Key
Define exact graded outputs.

### Step 6 — Write Hints
Add at least 3 progressive hints.

### Step 7 — Write Walkthrough
Add short explanation steps.

### Step 8 — Self-QA
Run the author checklist.

### Step 9 — Register lesson in Supabase
Insert lesson record with:
- slug
- module
- gsheet_source_id
- published status

### Step 10 — Publish
Only mark published after parser and lesson flow are validated.

---

## 21. Validation Rules for Parser and QA Agent

The following conditions should fail validation:

- missing required tab
- missing required config key
- invalid difficulty value
- invalid row/column count
- answer cell outside grid
- editable cell outside grid
- answer cell not listed in editable cells
- duplicate answer cell
- duplicate editable cell
- hints not sequential
- walkthrough not sequential
- blank lesson title
- blank lesson_id
- blank lesson_slug

### Warning-only conditions
These may not fail, but should trigger warning:
- less than 3 hints
- no walkthrough steps
- too many answer cells for beginner lesson
- description too short
- objective too vague

---

## 22. Authoring Example 1 — Accounting Equation Basics

## Lesson_Config
| key | value |
|---|---|
| lesson_id | acct-eq-001 |
| lesson_slug | accounting-equation-basics |
| module_slug | balance-sheet |
| title | Accounting Equation Basics |
| description | Lengkapi komponen laporan posisi keuangan sederhana berdasarkan transaksi awal bisnis. |
| objective | Memahami hubungan Assets = Liabilities + Equity melalui input langsung di spreadsheet workspace. |
| difficulty | Beginner |
| estimated_minutes | 12 |
| rows_count | 10 |
| cols_count | 6 |
| reveal_allowed | true |
| published | true |

## Student_View
|   | A | B | C | D | E | F |
|---|---|---|---|---|---|---|
| 1 | Mini Case |  |  |  |  |  |
| 2 | Modal disetor pemilik | 100000000 |  | Utang bank | 40000000 |  |
| 3 | Total Assets |  |  |  |  |  |
| 4 | Liabilities |  |  |  |  |  |
| 5 | Equity |  |  |  |  |  |

## Editable_Cells
| cell | editable |
|---|---|
| B3 | true |
| B4 | true |
| B5 | true |

## Answer_Key
| cell | expected_value | value_type | tolerance | explanation |
|---|---|---|---|---|
| B3 | 140000000 | number | 0 | Total assets |
| B4 | 40000000 | number | 0 | Liabilities |
| B5 | 100000000 | number | 0 | Equity |

## Hints
| level | hint_text |
|---|---|
| 1 | Mulai dari total aset dulu, lalu cocokkan sisi kanan persamaan. |
| 2 | Jika modal pemilik Rp100 juta dan utang Rp40 juta, maka total aset harus Rp140 juta. |
| 3 | Pastikan nilai akhir Assets sama dengan Liabilities + Equity. |

## Walkthrough
| step_number | explanation |
|---|---|
| 1 | Ambil nilai liabilities dan equity dari data kasus. |
| 2 | Jumlahkan liabilities dan equity untuk memperoleh total assets. |
| 3 | Masukkan angka ke cell target yang diminta. |

---

## 23. Authoring Example 2 — Basic Income Statement Build

## Lesson_Config
| key | value |
|---|---|
| lesson_id | is-001 |
| lesson_slug | basic-income-statement-build |
| module_slug | income-statement |
| title | Basic Income Statement Build |
| description | Isi revenue, COGS, dan net income dari data transaksi sederhana. |
| objective | Menghubungkan komponen topline dan bottom line dengan struktur laba rugi paling dasar. |
| difficulty | Beginner |
| estimated_minutes | 15 |
| rows_count | 10 |
| cols_count | 6 |
| reveal_allowed | true |
| published | true |

## Student_View
|   | A | B | C | D | E | F |
|---|---|---|---|---|---|---|
| 1 | Mini Case |  |  |  |  |  |
| 2 | Penjualan bulan ini = 250000000 |  |  | COGS = 150000000 |  |  |
| 3 | Revenue |  |  |  |  |  |
| 4 | COGS |  |  |  |  |  |
| 5 | Gross Profit |  |  |  |  |  |
| 6 | Opex |  |  |  |  |  |
| 7 | Net Income |  |  | Opex = 30000000 |  |  |

## Editable_Cells
| cell | editable |
|---|---|
| B3 | true |
| B4 | true |
| B5 | true |
| B6 | true |
| B7 | true |

## Answer_Key
| cell | expected_value | value_type | tolerance | explanation |
|---|---|---|---|---|
| B3 | 250000000 | number | 0 | Revenue |
| B4 | 150000000 | number | 0 | COGS |
| B5 | 100000000 | number | 0 | Gross Profit |
| B6 | 30000000 | number | 0 | Opex |
| B7 | 70000000 | number | 0 | Net Income |

## Hints
| level | hint_text |
|---|---|
| 1 | Isi dulu semua angka yang sudah tersedia dari kasus. |
| 2 | Gross Profit = Revenue - COGS. |
| 3 | Net Income = Gross Profit - Opex. |

## Walkthrough
| step_number | explanation |
|---|---|
| 1 | Revenue, COGS, dan Opex sudah tersedia dari mini case. |
| 2 | Kurangi Revenue dengan COGS untuk memperoleh Gross Profit. |
| 3 | Kurangi Gross Profit dengan Opex untuk memperoleh Net Income. |

---

## 24. Authoring Example 3 — Basic Cash Flow Classification

## Lesson_Config
| key | value |
|---|---|
| lesson_id | cf-001 |
| lesson_slug | basic-cash-flow-classification |
| module_slug | cash-flow |
| title | Basic Cash Flow Classification |
| description | Klasifikasikan arus kas ke operating, investing, atau financing activity. |
| objective | Memahami kategori dasar arus kas dengan latihan klasifikasi sederhana. |
| difficulty | Beginner |
| estimated_minutes | 10 |
| rows_count | 10 |
| cols_count | 6 |
| reveal_allowed | true |
| published | false |

## Student_View
|   | A | B | C | D | E | F |
|---|---|---|---|---|---|---|
| 1 | Mini Case |  |  |  |  |  |
| 2 | Pembayaran supplier |  |  |  |  |  |
| 3 | Pembelian mesin |  |  |  |  |  |
| 4 | Penerimaan pinjaman bank |  |  |  |  |  |
| 5 | Kode jawaban: O / I / F |  |  |  |  |  |

## Editable_Cells
| cell | editable |
|---|---|
| B2 | true |
| B3 | true |
| B4 | true |

## Answer_Key
| cell | expected_value | value_type | tolerance | explanation |
|---|---|---|---|---|
| B2 | O | text | 0 | Operating activity |
| B3 | I | text | 0 | Investing activity |
| B4 | F | text | 0 | Financing activity |

## Hints
| level | hint_text |
|---|---|
| 1 | Pikirkan dulu apakah transaksi ini terkait operasi, investasi aset, atau pendanaan. |
| 2 | Pembayaran supplier biasanya masuk aktivitas operasional. |
| 3 | Pembelian mesin adalah investasi, dan penerimaan pinjaman bank adalah pendanaan. |

## Walkthrough
| step_number | explanation |
|---|---|
| 1 | Pembayaran supplier terkait kegiatan utama usaha, jadi Operating. |
| 2 | Pembelian mesin menambah aset tetap, jadi Investing. |
| 3 | Penerimaan pinjaman bank berasal dari sumber pendanaan, jadi Financing. |

---

## 25. Suggested Lesson Design Limits by Difficulty

### Beginner
- 1 to 5 answer cells preferred
- 1 main concept only
- 10 to 15 minutes target

### Intermediate
- 4 to 10 answer cells preferred
- up to 2 linked concepts
- 15 to 25 minutes target

### Advanced
- 8 to 20 answer cells preferred
- multi-step and multi-section logic
- 20 to 40 minutes target

These are not hard system limits, but they are good guardrails.

---

## 26. Common Author Mistakes

### Mistake 1
Using formatting instead of values to convey meaning.

Bad because the parser reads values, not your visual intention.

### Mistake 2
Assuming blank cell means user input cell.

Bad because blank cells can also be intentionally locked empty cells.

### Mistake 3
Putting answer values somewhere visible in Student_View.

Bad because you just leaked the lesson.

### Mistake 4
Writing vague objectives like “understand finance basics.”

Bad because it does not help user or product clarity.

### Mistake 5
Creating hints that either do nothing or spoil everything.

Bad because both kill learning quality.

---

## 27. Review Checklist for Founder Before Approving Lesson

Ask these questions:

1. Can a learner understand the task in under 20 seconds?
2. Is the layout clean and not overloaded?
3. Are the answer cells the right ones to grade?
4. Are the hints genuinely progressive?
5. Does the walkthrough teach logic, not just restate output?
6. Is this lesson only testing one main idea?
7. Could this lesson be completed without confusion?
8. Is anything in Student_View accidentally leaking the answer?

If the answer to any of those is no, the lesson is not ready.

---

## 28. Antigravity Instruction for Lesson Template Builder

Build a reusable lesson authoring template for Google Sheets based on this specification.

The template must include exactly these tabs:
- Lesson_Config
- Student_View
- Editable_Cells
- Answer_Key
- Hints
- Walkthrough

The template must include:
- starter header rows for each tab,
- example placeholder values,
- notes for authors where useful,
- strict compatibility with the parser rules defined in the technical architecture spec.

Do not include answer logic in Student_View. Do not make editability implicit. Do not introduce extra tabs unless explicitly requested.

---

## 29. What Comes After This Document

Once this document is accepted, the next most useful artifacts are:

1. **Google Sheets template file structure**  
   exact starter workbook layout to replicate

2. **First 10 seed lessons**  
   authored using this format

3. **Parser validation checklist**  
   usable by QA agent or founder before publishing

4. **Antigravity prompt pack for content operations**  
   prompts for creating lessons consistently

