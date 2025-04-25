Below is a **logically‑sequenced MVP backlog**.  
The order already accounts for all stated technical, UX, and manual‑setup dependencies in the Architecture Blueprint and PRD.

---

### **Epic 0 – Engineering Foundations & Environment**

*Primary goal:* create a shared, running skeleton that every later story can compile, test and deploy against.

| # | User Story |
|---|------------|
|0.1|**As a developer**, I want to initialize a new **Next.js (14) App‑Router project with TypeScript on Vercel** so that the team has a deployable baseline (includes `pnpm create next-app`, GitHub repo, Vercel link). citeturn1file18|
|0.2|**As a developer**, I want Tailwind CSS, shadcn/UI, Radix UI and Lucide icons pre‑installed and configured (`tailwind.config.js`, `@shadcn/cli init`) so components share one design system. citeturn1file6|
|0.3|**As a developer**, I want global layout files (`app/layout.tsx`, `dashboard/layout.tsx`) scaffolded with mocked sidebar + top‑bar navigation so pages render inside a consistent shell. citeturn1file5|
|0.4|**As a developer**, I want Prisma set up with PostgreSQL (local & Vercel Postgres) and an initial `schema.prisma` containing **User, Organization, Student, Report** models so we can migrate & query with types. citeturn1file18|
|0.5|**As a developer**, I want **seed/mock JSON files** and helper hooks that return that data so that frontend teams can iterate UI before real APIs. citeturn1file15|
|0.6|**As a Dev Ops**, I want a **`.env.example`** listing all required secrets (Postgres URL, NEXTAUTH_SECRET, Resend, Stripe keys, OCR key) so that onboarding new devs is friction‑free. citeturn1file1|
|0.7|**As a developer**, I want CI checks (lint, type‑check, unit tests) to run in GitHub Actions so every PR stays green.

---

### **Epic 1 – Authentication, Roles & Tenant Bootstrapping**

*Primary goal:* secure access and allow users to enter the platform in the correct workspace.

| # | User Story |
|---|------------|
|1.1|As a **prospective org admin**, I want to sign up via email magic‑link so that my new flight school tenant is created and I become its owner. citeturn1file13|
|1.2|As a **CFI (instructor)** invited by the admin, I want to accept an email invite link (`/auth/invite/[token]`) so that I am enrolled under that organization. citeturn1file7|
|1.3|As an **independent instructor**, I want to self‑register and automatically receive a personal “solo” organization so my data is isolated. citeturn1file13|
|1.4|As a **student**, I want to accept an instructor’s invite link so that my account is created with role `student`, linked to my instructor and org. citeturn1file13|
|1.5|As a **developer**, I want NextAuth JWT callbacks to include `role` and `organizationId` so server components and API routes can authorize requests. citeturn1file7|
|1.6|As a **middleware**, I must block unauthenticated traffic to any path under `/dashboard`, `/students`, `/reports`, etc., redirecting to `/auth/signin`. citeturn1file7|

---

### **Epic 2 – Student & Instructor Management**

*Primary goal:* let instructors/org admins curate their roster.

| # | User Story |
|---|------------|
|2.1|As an **instructor**, I can view a paginated list of my students (`GET /api/students`) showing name, last score, last‑active. citeturn1file1|
|2.2|As an **org admin**, I can filter that list by instructor. |
|2.3|As an **instructor**, I can open **“Add Student”** dialog, enter name+email, and trigger an invite email (POST `/api/students`). citeturn1file4|
|2.4|As an **instructor**, I can edit student profile fields (PUT `/api/students/[id]`).|
|2.5|As an **org admin**, I can deactivate or transfer a student to another instructor.|
|2.6|As an **org admin**, I can list, invite, or deactivate instructors for my org (`/instructors`). citeturn1file5|
|2.7|As any **user**, I can open **/settings/profile** to change my display name and notification prefs.|

---

### **Epic 3 – Report Upload, OCR & Deficiency Decoding**

*Primary goal:* turn an FAA test‑report PDF into structured data tied to a student.

| # | User Story |
|---|------------|
|3.1|As a **student or instructor**, I can drag‑and‑drop a PDF/image into the **ReportUploadForm** component, and see progress. citeturn1file11|
|3.2|As the **API**, when a file is received (POST `/api/reports`), call Gemini OCR, parse ACS codes, score & metadata, then store a `Report` row. citeturn1file5|
|3.3|As the **API**, create a `Notification` for the linked instructor (type `report_uploaded`) and send an email via Resend templated “New Report” message. citeturn1file8|
|3.4|As an **instructor**, I can view a student’s **Report list** and open a single report page showing decoded deficiencies and mark them “reviewed”.|
|3.5|As a **student**, I can view my own report details but not edit them.|

---

### **Epic 4 – Analytics Dashboards**

*Primary goal:* surface actionable insights from stored reports.

| # | User Story |
|---|------------|
|4.1|As an **instructor**, the **Dashboard** summarises #students, avg score, most common weak area (server component pulling `/api/analytics/summary`). citeturn1file1|
|4.2|As an **org admin**, the same dashboard shows organization‑wide metrics plus per‑instructor breakdown.|
|4.3|As a **student**, my dashboard shows score trend line and weakest topics.|
|4.4|As an **instructor**, the **Analytics page** renders interactive charts (client component `PerformanceChart`) fed by summary JSON. citeturn1file5|
|4.5|As a **developer**, cached or on‑the‑fly calculations must respect org boundaries to prevent cross‑tenant leakage. citeturn1file14|

---

### **Epic 5 – Notification Centre & Email Service**

*Primary goal:* keep users informed inside the app and via email.

| # | User Story |
|---|------------|
|5.1|As a **user**, I see a bell icon with unread count; clicking opens a list (`GET /api/notifications`). citeturn1file9|
|5.2|As a **user**, I can mark a notification as read (PATCH `/api/notifications/[id]`).|
|5.3|As a **system**, every invite, report upload, or reminder triggers both a DB Notification and Resend email using React Email templates. citeturn1file7|
|5.4|As a **student**, I may opt‑out of non‑critical emails via profile settings.|
|5.5|As a **developer**, polling (every 60 s) is implemented first; SSE/WebSocket is deferred.|

---

### **Epic 6 – Subscription Billing & Tier Enforcement**

*Primary goal:* monetise the product and gate premium functionality.

| # | User Story |
|---|------------|
|6.1|As an **org admin or solo instructor**, I can open **/settings/billing** to see current tier and “Upgrade to Pro” button.|
|6.2|On click, frontend calls `POST /api/stripe/create-checkout` and redirects me to Stripe Checkout; upon completion, I’m returned to success page. citeturn1file0|
|6.3|As the **webhook handler**, when Stripe sends `checkout.session.completed`, mark that organization `subscriptionTier=Pro` and store `stripeSubscriptionId`. citeturn1file0|
|6.4|As the **system**, if a subscription later ends, downgrade tier and enforce limits.|
|6.5|As an **API route**, creating a sixth student on Free tier is rejected with 402 status and upgrade CTA. citeturn1file9|

---

### **Epic 7 – Access Control & Multi‑Tenancy Hardening**

*Primary goal:* ensure strict data isolation and RBAC.

| # | User Story |
|---|------------|
|7.1|As a **backend developer**, every query helper automatically injects `organizationId` into `WHERE` clauses. citeturn1file14|
|7.2|As a **test engineer**, I have integration tests proving users cannot read or mutate another org’s data.|
|7.3|As a **file storage service**, uploaded report keys follow `/org_{orgId}/reports/{reportId}.pdf` naming convention. citeturn1file14|
|7.4|As an **org admin**, removing an instructor prompts reassignment of their students.|
|7.5|As a **super‑admin (internal)**, I can impersonate orgs for support (hidden route, out‑of‑scope for UI but placeholder story).|

---

### **Epic 8 – Polish, Accessibility & Launch Readiness**

*Primary goal:* deliver a usable, AA‑compliant, production‑grade MVP.

| # | User Story |
|---|------------|
|8.1|As a **QA tester**, I verify all pages meet WCAG 2.1 AA colour‑contrast and keyboard‑navigation requirements. citeturn1file11|
|8.2|As a **user**, I can install the site as a PWA with custom icon and offline shell for core pages. citeturn1file10|
|8.3|As a **user**, I see graceful error and loading states across the app (`<Spinner>`, error boundaries). citeturn1file11|
|8.4|As a **growth lead**, I can view a public marketing landing page and pricing page linked to checkout.|
|8.5|**Story Zero (release checklist):** configure production domain, Stripe webhook URL, Resend verified sender, and seed admin account.|

---

### **Notes & Future Parking‑Lot (not MVP)**  
• Practice Quizzes, Calendar integration, AI tutor, CSV export, community forum etc. are intentionally left for later phases but the modular architecture makes them easy to add citeturn1file10.

---

This backlog can now be imported into your Agile tool (Jira, Linear, Azure Boards).  Each story is **INVEST‑ready** and their numbering already encodes execution order—simply pull from the top of each epic, one epic at a time, into sprints until the MVP scope is complete.