# Next Finance — Admin, Backoffice, and SaaS Operations Spec

## 1. Purpose

This document defines the **admin and backoffice layer** required for Next Finance to operate as a real edutech SaaS product, not just a learner-facing MVP.

The original MVP scope focused on the student learning loop:
- open lesson,
- practice inside platform,
- check answer,
- get hint,
- reveal at the end,
- save progress.

That is necessary, but not sufficient.

To run this as a real business, the platform also needs a backoffice that can handle:
- content operations,
- user operations,
- access control,
- billing and payment integration,
- CRM basics,
- analytics and SaaS metrics,
- support workflows,
- admin governance.

This spec expands the product architecture to include those needs.

---

## 2. Strategic Position

Next Finance should not be treated as only a course website.
It should be treated as a **learning SaaS platform with admin operations**.

That means the system must support 3 layers:

### Layer 1 — Learner App
What students use.

### Layer 2 — Admin / Backoffice
What founders, operators, content managers, and support teams use.

### Layer 3 — Business Ops Infrastructure
What powers billing, CRM, user lifecycle, analytics, and growth.

If Layer 2 and 3 are ignored, the product will become hard to scale, hard to sell, and hard to manage.

---

## 3. Admin and Backoffice Goals

The admin/backoffice must make it possible to:

1. create and manage courses and lessons,
2. register and manage spreadsheets used as lesson sources,
3. manage users and access,
4. track customer/payment status,
5. support login and registration,
6. manage roles and permissions,
7. view key SaaS and edutech metrics,
8. run simple CRM workflows,
9. manage support issues,
10. handle monetization readiness.

---

## 4. Primary Backoffice Users

### Founder / Super Admin
Needs full access to:
- content,
- user management,
- billing,
- CRM,
- analytics,
- admin settings.

### Content Admin
Needs access to:
- course creation,
- module management,
- lesson registration,
- Google Sheet source registration,
- lesson publishing status.

### Support / Ops Admin
Needs access to:
- users,
- subscriptions,
- payment lookup,
- support tickets,
- access overrides,
- CRM notes.

### Finance / Business Admin
Needs access to:
- payment records,
- Xendit transaction logs,
- MRR/revenue dashboard,
- refund status,
- plan status.

### Instructor / Reviewer (optional later)
Needs limited access to:
- learner performance,
- progress data,
- content QA.

---

## 5. Required Backoffice Modules

## 5.1 Admin Authentication and Access Control
The admin layer must support:
- secure login,
- admin-only route protection,
- role-based access control,
- audit-friendly actions.

### Required capabilities
- admin login
- session handling
- role checking
- protected admin routes
- route-level and action-level permission checks

### Core roles for MVP+
- `super_admin`
- `content_admin`
- `ops_admin`
- `finance_admin`
- `support_admin`
- `learner`

### Notes
`learner` is not an admin role but should still exist in the unified role model.

---

## 5.2 User Management
The platform needs a proper user database for login and registration.

### Required capabilities
- register user
- login user
- view user list
- search user
- filter by plan / status / role
- view user detail
- update role
- activate / deactivate account
- see enrollment and progress summary
- see payment/subscription status

### Relevant fields
- full name
- email
- role
- status
- registration date
- last active date
- current plan
- current subscription status
- enrolled courses
- total lessons completed
- total checks used
- total hints used

### Additional relevant features
- impersonation by super admin, optional later
- password reset flow
- email verification state
- soft delete / suspend account

---

## 5.3 Course and Content Management
Admin must be able to manage learning content without touching code every time.

### Required capabilities
- add course
- edit course
- archive course
- add module
- reorder module
- add lesson record
- link lesson to module
- publish / unpublish lesson
- mark lesson as draft / live / archived

### Course fields
- course title
- slug
- short description
- long description
- difficulty level
- category
- thumbnail
- pricing linkage
- published status

### Module fields
- module title
- module slug
- sort order
- parent course
- published status

### Lesson fields
- lesson title
- lesson slug
- lesson_id
- module
- difficulty
- estimated minutes
- gsheet_source_id
- lesson version
- published status
- QA status
- last validated date

### Critical note
The admin panel should not necessarily edit lesson content directly for MVP.
It should at minimum **register and manage lesson metadata and spreadsheet source linkage**.

---

## 5.4 Spreadsheet Registry / Lesson Source Management
This is essential because your content backend depends on Google Sheets.

### Required capabilities
- add spreadsheet source
- map spreadsheet to lesson
- validate spreadsheet structure
- test parser connection
- show last sync status
- show last validation result
- show version mismatch or invalid schema warning

### Required fields
- spreadsheet source name
- Google Sheet ID
- linked lesson_id
- module_slug
- validation status
- last validated at
- parser status
- published compatibility status

### Why this matters
Without this registry, content ops becomes messy and fragile fast.

---

## 5.5 CRM Simple
You asked for simple CRM. For this product, that means not Salesforce theater.
It means lean pipeline tracking for users and leads.

### Minimum CRM entities
- leads
- registered users
- paying customers
- churned users
- enterprise/institution prospects, optional later

### Required CRM capabilities
- store lead/user notes
- tag leads/users
- track source channel
- track lifecycle stage
- assign owner
- track contact attempts
- log conversion status

### Suggested lifecycle stages
- lead
- signed_up
- activated
- trial_user
- paid_user
- inactive
- churned

### Useful CRM fields
- name
- email
- whatsapp, optional
- source channel
- campaign source
- lead owner
- notes
- last contacted date
- status
- payment plan
- activation date

### Why it matters
You will want to know:
- who signed up but did not activate,
- who used lessons but never paid,
- who paid but became inactive,
- who needs follow-up,
- which channels actually convert.

---

## 5.6 Billing and Xendit Integration
If monetization is serious, Xendit should not be treated as just a webhook dump.

### Required capabilities
- create payment link or invoice via Xendit
- store transaction status
- map payment to user
- map payment to plan/subscription
- handle webhook status updates
- handle paid / pending / failed / expired
- issue refund status tracking, optional later

### Minimum billing states
- pending
- paid
- failed
- expired
- refunded
- cancelled

### Required payment records
- payment_id internal
- xendit_reference_id
- user_id
- plan_id
- amount
- currency
- status
- payment_channel
- created_at
- paid_at
- expired_at

### Important rule
Billing state should not live only inside Xendit logs.
It must be normalized into your own database.

### Subscription logic later
Even if you start one-time payment first, design with future support for:
- monthly subscription
- annual subscription
- team plan
- coupon / promo code

---

## 5.7 Plans, Access, and Entitlements
Payment alone is not enough. You need to define what access a paid user gets.

### Required capabilities
- define plan
- map plan to course access
- map plan to feature access
- assign plan to user
- track plan start/end
- handle expired access

### Suggested plan examples
- free
- starter
- pro
- cohort
- enterprise, later

### Example entitlements
- number of accessible courses
- number of checks per day
- number of hints per lesson
- reveal solution allowed or limited
- downloadable answers allowed or not
- access duration

### Why this matters
Without entitlements, pricing and access quickly turn into hardcoded spaghetti.

---

## 5.8 Dashboard and Key Metrics
The admin panel must have a dashboard for tracking the business and product.

### Core dashboard sections
1. SaaS growth metrics
2. learner engagement metrics
3. content performance metrics
4. billing metrics
5. activation funnel metrics
6. operational alerts

### Key SaaS metrics
- total registered users
- active users
- DAU
- WAU
- MAU
- free users
- paid users
- trial to paid conversion
- MRR, if subscription model exists
- gross revenue
- churn count
- churn rate, later
- CAC proxy by channel, later
- LTV proxy, later

### Key edutech metrics
- lessons started
- lessons completed
- completion rate
- average score
- average hints used per lesson
- average reveal usage rate
- time to first lesson completion
- activation rate, signed up to first completed lesson
- retention by cohort, later

### Key content metrics
- most opened course
- most completed lesson
- lesson drop-off points
- lessons with high reveal rate
- lessons with low completion rate
- lessons with validation errors

### Key billing metrics
- payments today
- payments this month
- pending payments
- failed payments
- revenue by plan
- revenue by channel, later

### Key ops alerts
- invalid spreadsheet linked
- unpublished lesson referenced by live course
- webhook failures
- users without entitlement but with paid status

---

## 5.9 Support and Ticketing Lite
You do not need Zendesk-level complexity at first, but you do need issue tracking.

### Required capabilities
- create support ticket
- tag issue type
- assign ticket owner
- track ticket status
- link ticket to user
- add internal notes

### Suggested support statuses
- open
- in_progress
- waiting_user
- resolved
- closed

### Suggested issue types
- login issue
- payment issue
- content issue
- access issue
- bug report

---

## 5.10 Audit Logs and Admin Activity Tracking
This becomes relevant fast once multiple admins exist.

### Required capabilities
Track important admin actions such as:
- course created
- lesson published
- lesson archived
- user role changed
- plan changed
- payment status manually adjusted
- spreadsheet source changed

### Why it matters
When something breaks, you need to know who changed what.

---

## 5.11 Notifications and Operational Messaging
Relevant additions for SaaS ops:
- send verification email
- send password reset email
- notify payment success
- notify payment pending/expired
- notify admins on failed lesson validation
- notify support on ticket creation

For MVP+, email-based notifications are enough.
WhatsApp can come later.

---

## 5.12 Analytics and Event Tracking Foundation
Even if the dashboard is simple, raw event capture matters.

### Suggested events
- user_signed_up
- user_logged_in
- lesson_opened
- lesson_checked
- hint_requested
- solution_revealed
- lesson_completed
- payment_initiated
- payment_paid
- payment_failed
- course_enrolled

### Why it matters
You will eventually want funnels, cohorts, and feature usage trends.
If no event layer exists, that becomes painful later.

---

## 5.13 Marketing and Growth-Relevant Additions
Relevant features beyond the exact list you gave:

### Coupon / Promo Code Support
Useful for launches, cohort sales, affiliates, and community discounts.

### Referral Source Tracking
Track where users came from:
- LinkedIn
- Instagram
- TikTok
- direct
- partner
- coupon
- campaign

### Waitlist / Lead Capture
Useful if launching modules gradually.

### Email Capture Before Full Launch
Useful for collecting interested users before the full product is ready.

### Conversion Funnel View
Track:
- visitor → signup
- signup → first lesson
- first lesson → completed lesson
- completed lesson → paid

These are highly relevant for an edutech SaaS.

---

## 6. Recommended Admin Navigation Structure

### Main nav
- Overview
- Users
- Courses
- Lessons
- Spreadsheets
- CRM
- Billing
- Plans & Access
- Analytics
- Support
- Settings

### Suggested route structure
```text
/admin
/admin/users
/admin/users/[id]
/admin/courses
/admin/courses/new
/admin/modules
/admin/lessons
/admin/lessons/[id]
/admin/spreadsheets
/admin/crm
/admin/billing
/admin/plans
/admin/analytics
/admin/support
/admin/settings
```

---

## 7. Suggested Database Expansion

To support this backoffice, the database should expand beyond learner MVP tables.

### Existing / already expected
- profiles
- courses
- modules
- lessons
- lesson_attempts
- lesson_check_events
- lesson_hint_events
- lesson_reveal_events

### Add these
- roles
- user_roles
- spreadsheet_sources
- plans
- user_entitlements
- payments
- subscriptions, if subscription-based
- crm_contacts
- crm_notes
- support_tickets
- support_ticket_notes
- admin_audit_logs
- event_logs
- coupons, optional

---

## 8. Suggested Data Model Additions

## 8.1 `roles`
- id
- role_key
- role_name

## 8.2 `user_roles`
- id
- user_id
- role_id
- assigned_at

## 8.3 `spreadsheet_sources`
- id
- lesson_id
- spreadsheet_name
- google_sheet_id
- validation_status
- parser_status
- last_validated_at
- created_at

## 8.4 `plans`
- id
- plan_key
- plan_name
- billing_type
- price_amount
- currency
- is_active

## 8.5 `user_entitlements`
- id
- user_id
- plan_id
- access_status
- start_at
- end_at
- metadata_json

## 8.6 `payments`
- id
- user_id
- plan_id
- xendit_reference_id
- amount
- currency
- status
- payment_channel
- paid_at
- created_at

## 8.7 `crm_contacts`
- id
- user_id nullable
- name
- email
- phone nullable
- source_channel
- lifecycle_stage
- owner_user_id nullable
- notes_summary
- created_at

## 8.8 `crm_notes`
- id
- crm_contact_id
- note_body
- created_by
- created_at

## 8.9 `support_tickets`
- id
- user_id nullable
- title
- issue_type
- status
- priority
- assigned_to nullable
- created_at
- updated_at

## 8.10 `support_ticket_notes`
- id
- support_ticket_id
- note_body
- is_internal
- created_by
- created_at

## 8.11 `admin_audit_logs`
- id
- actor_user_id
- action_type
- entity_type
- entity_id
- metadata_json
- created_at

## 8.12 `event_logs`
- id
- user_id nullable
- event_name
- event_properties_json
- created_at

---

## 9. Admin Dashboard KPI Recommendations

If you want the dashboard to be genuinely useful, it should not just show vanity counts.

### Recommended top-line blocks
- New signups, today / this week / this month
- Active users, DAU / WAU / MAU
- First lesson activation rate
- Lesson completion rate
- Paid conversion rate
- Revenue, today / this month
- Pending vs paid Xendit payments
- Active paid users
- Top performing course
- Lessons with highest reveal usage

### Recommended charts
- signups over time
- lesson completions over time
- payment revenue over time
- active users trend
- conversion funnel chart

### Recommended tables
- recent signups
- recent payments
- recent support tickets
- lessons with parser validation errors
- users at risk, signed up but inactive

---

## 10. What Else Is Relevant and Worth Adding

These are relevant additions beyond what you explicitly asked:

### 10.1 Content QA Status
Each lesson should have status such as:
- draft
- ready_for_review
- approved
- live
- archived

Because content quality matters as much as code quality.

### 10.2 Parser Validation Console
Admin should be able to test whether a linked spreadsheet is valid before publishing.

That will save you from embarrassing live content failures.

### 10.3 Entitlement Override Tool
Support/admin should be able to manually grant or extend access.

Useful for:
- refunds,
- manual bonus access,
- resolving payment disputes,
- cohort promotions.

### 10.4 Manual Enrollment Tool
Admin can enroll users into certain courses without payment flow.

Useful for:
- beta testers,
- internal testers,
- special partnership users.

### 10.5 Webhook Health Monitor
Since you want Xendit integration, webhook failures need visibility.

### 10.6 Cohort / Batch Tagging
Useful if later you sell cohort-based programs or bootcamps.

### 10.7 Basic Segmentation
Segment users by:
- role
- paid/free
- active/inactive
- lead source
- course enrolled

This is highly relevant for growth and CRM.

---

## 11. Suggested Build Phasing

## Phase A — Core Business Readiness
Build first:
- auth and registration
- user roles
- admin route protection
- user management
- course management
- lesson registry
- spreadsheet source registry

## Phase B — Revenue Readiness
Then build:
- plans
- entitlements
- Xendit integration
- payment records
- billing status view

## Phase C — Ops and CRM
Then build:
- CRM basic
- support tickets
- audit logs
- event logs

## Phase D — Advanced Analytics
Then build:
- SaaS dashboard
- content dashboard
- funnel tracking
- retention views

This order matters. Do not jump to fancy analytics if basic access and billing are still messy.

---

## 12. Updated Product Scope Position

Next Finance is no longer just:
- interactive spreadsheet learning product.

It is now:
- learner app,
- content operations system,
- billing and entitlement system,
- basic CRM,
- admin-controlled edutech SaaS platform.

That is the correct framing if you want this to become a serious business.

---

## 13. Recommended Next Documents

After this admin/backoffice spec, the most useful next documents would be:

1. **Admin PRD**  
   detailed user stories and page-level requirements for admin UI

2. **Database Master Schema**  
   full schema combining learner app + admin + billing + CRM

3. **Xendit Integration Spec**  
   payment flows, webhook handling, entitlement activation logic

4. **Role and Permission Matrix**  
   exact access rights by admin role

5. **Analytics Event Taxonomy**  
   event names, properties, and dashboard mapping

---

## 14. Build Prompt Add-On for Antigravity

Use this context as an add-on to the existing Antigravity prompt pack:

```text
In addition to the learner-facing MVP, the product also requires an admin and backoffice layer.

Admin/backoffice must support:
- user login/register database
- admin authentication and role-based access control
- user management
- course/module/lesson management
- spreadsheet source registry and validation
- simple CRM
- plans and entitlements
- Xendit integration
- payment records and billing status
- admin dashboard with SaaS + edutech metrics
- support ticketing lite
- audit logs
- event logging foundation

Build this in a phased way. Do not mix admin complexity into learner pages. Keep a clean separation between learner app and admin app.

Suggested admin routes:
- /admin
- /admin/users
- /admin/courses
- /admin/lessons
- /admin/spreadsheets
- /admin/crm
- /admin/billing
- /admin/plans
- /admin/analytics
- /admin/support
- /admin/settings

Keep the architecture modular and compatible with the existing learner platform specs.
```

---

## 15. Final Note

This addition is not optional if you want to operate this as a real SaaS.

Without this layer, you may still be able to demo the product.
But you will struggle to:
- manage content cleanly,
- manage users,
- collect payment properly,
- control access,
- track business performance,
- support customers,
- scale without chaos.

So yes, learner experience is the product surface.
But admin/backoffice is the operating system behind it.

