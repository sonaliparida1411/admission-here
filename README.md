# AdmissionsHub: Higher Education Discovery, CMS & Dual AI Search Platform

AdmissionsHub is a production-ready, type-safe Higher Education Discovery Directory, Editorial Blog CMS, B2B Student Lead Generation CRM, and Dual AI Search Platform modeled after industry benchmarks (*Shiksha, Collegedunia, Careers360, CollegeDekho*).

Built with **Next.js 15 (App Router)**, **React 19**, **TypeScript**, and **PostgreSQL 18** (with native `tsvector` full-text search triggers, `pg_trgm` fuzzy matching, and vector compatibility).

---

## 🚀 Key Highlights & Architecture

### 1. Public Student Portal (SSR & ISR)
- **Homepage (`/`)**: AI Search Command Bar, Stream discovery grid, top NIRF-ranked institutions, live exam news.
- **Programmatic SEO Directory (`/colleges/[[...filters]]`)**: Faceted multi-dimensional filtering by Stream, Degree, State (e.g. `/colleges/b-tech/odisha`), Ownership, and Max Fees.
- **Persistent College Layout & 9 Sub-Tabs (`/college/[slug]`)**:
  - `Overview` (`/`): Quick facts, highlights, facilities, and accreditations.
  - `Courses & Fees` (`/courses-fees`): Comprehensive tuition, hostel costs, intake seats, and Course JSON-LD.
  - `Admission 2026` (`/admission`): Step-by-step JoSAA/institutional counseling workflow.
  - `Cutoff` (`/cutoff`): Historical round-wise opening & closing ranks by Quota (HS/OS/AI) and Category (GEN/OBC/SC/ST/EWS).
  - `Placements` (`/placements`): Highest CTC, Average CTC, Median package, placement rates, and top recruiters.
  - `Rankings` (`/rankings`): Ministry of Education NIRF benchmarks and NAAC grades.
  - `Campus Gallery` (`/gallery`): High-res photos of labs, auditoriums, hostels, and sports arenas.
  - `Student Reviews` (`/reviews`): Verified ID-checked student ratings across Placements, Infrastructure, Faculty, and Value/ROI.
  - `Q&A` (`/qna`): Verified answers with Schema.org `FAQPage` JSON-LD.
- **Side-by-Side 4-Way Comparison (`/compare/[pair]`)**: e.g., `/compare/iit-bombay-vs-nit-rourkela` matrix benchmark.
- **Algorithmic Rank/Score Predictor (`/college-predictor/[exam]`)**: Categorized High, Medium, and Dream college admission chances based on user category, score, and state quota.
- **Editorial Blog & Live News (`/blog`, `/blog/[slug]`)**:
  - 4-bullet AI / GEO Answer Box (`<BlogTldrBox />`) for search engine direct citations.
  - Live Exam Coverage Ticker (`<LiveBlogTicker />`) with pinned updates and timestamps.
  - Embedded Interactive College Card (`<EmbeddedCollegeCTA slug="..." />`) for high-intent conversions.

### 2. Full Admin & Blog CMS Control Panel (`/admin`)
- **Dashboard (`/admin`)**: Analytics for captured student leads, traffic KPIs, and indexed colleges.
- **College Directory Manager (`/admin/colleges`)**: College data table, status manager, and new college onboarding (`/admin/colleges/new`).
- **Exam Master (`/admin/exams`)**: Application windows, exam dates, syllabus, and cutoff benchmarks.
- **Editorial CMS Desk (`/admin/blogs`)**:
  - Rich MDX/TipTap editor with shortcode buttons (`[+ College CTA]`, `[+ TL;DR]`, `[+ Live Feed]`).
  - Real-time SEO & GEO Scorer auditing title length, SERP description, answer box presence, and schema readiness.
- **Review Moderation Queue (`/admin/reviews`)**: Verify student identity card proofs and approve/reject reviews.
- **B2B Lead CRM Kanban (`/admin/leads`)**: Student pipeline (`NEW` → `OTP_VERIFIED` → `ASSIGNED_TO_COUNSELOR` → `CONTACTED` → `ENROLLED`) with blog attribution.
- **SEO & GEO Monitor (`/admin/seo-geo`)**: Verification of `/llms.txt`, `/llms-full.txt`, `sitemap.xml`, and JSON-LD graphs.
- **User & RBAC Access (`/admin/users`)**: Role-based access control (`SUPER_ADMIN`, `AUTHOR`, `COLLEGE_ADMIN`, `STUDENT`).

### 3. Dual AI & Search Engines
- **PostgreSQL tsvector + Vector RRF Hybrid Search**: Raw SQL Reciprocal Rank Fusion combining full-text keyword ranking with trigram similarity (`/api/v1/search/hybrid`).
- **AI Admissions Counselor (`/api/v1/ai/counselor`)**: Context-grounded RAG counselor providing targeted college advice.

### 4. Technical SEO & Generative Engine Optimization (GEO / AEO)
- Dynamic `/llms.txt` and `/llms-full.txt` feeds for AI crawlers (Perplexity, ChatGPT, Claude, Gemini).
- Schema.org JSON-LD structured data: `CollegeOrUniversity`, `Course`, `NewsArticle`, `FAQPage`, `BreadcrumbList`.
- Sharded XML sitemaps at `/sitemap.xml` covering colleges, tabs, blogs, and exams.

---

## 🛠️ Technology Stack
- **Framework**: Next.js 15 (App Router) + React 19 + TypeScript (Strict)
- **Database**: PostgreSQL 18 with `pg_trgm`, `searchTsv` GIN indexes, and `vector` domain
- **ORM & Validation**: Prisma ORM 6.19 + Zod
- **Authentication**: Auth.js v5 (NextAuth) with 4-tier RBAC
- **Styling**: Tailwind CSS + Lucide Icons + Radix Primitives

---

## 🔑 Default Test Credentials & Roles

| Role | Email | Password | Access Level |
|---|---|---|---|
| **SUPER_ADMIN** | `superadmin@admissionshub.in` | `Password@123` | Full Admin & Platform Control |
| **AUTHOR** | `editor@admissionshub.in` | `Password@123` | Blog CMS & Editorial Desk |
| **COLLEGE_ADMIN** | `admin@iitb.ac.in` | `Password@123` | Partner College Dashboard |
| **STUDENT** | `student@example.com` | `Password@123` | Student Discovery & Inquiries |

---

## 🏃‍♂️ How to Run

1. **Start PostgreSQL**:
   Ensure PostgreSQL is running on port 5432 with database `admission_db`.

2. **Generate Prisma Client & Seed Data**:
   ```bash
   npx prisma generate
   npx tsx prisma/seed.ts
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Production Build & Start**:
   ```bash
   npm run build
   npm run start
   ```

