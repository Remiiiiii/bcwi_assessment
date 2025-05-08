# Client Dashboard Roadmap

## Phase 1: Core Setup

- [ ] **Project Scaffolding**
  - Next.js + TypeScript (App Router)
  - Tailwind CSS (pixel-perfect styling)
  - PostgreSQL + Prisma ORM (database setup)
- [ ] **OAuth Integration**
  - NextAuth.js (Google/GitHub providers)
  - Session management with JWT
  - Store user sessions in PostgreSQL

## Phase 2: Database & API

- [ ] **PostgreSQL Configuration**
  - Docker container for local development
  - Schema definition (Prisma):
    ```prisma
    model Client {
      id        String   @id @default(uuid())
      name      String
      birthday  String   // Format: "MM / DD / YYYY"
      type      String   // "Savings" | "Checking"
      account   String   // 13-digit number
      balance   String   // Format: "$X,XXX.XX"
    }
    ```
  - Seed script with mock data (from PNG)
- [ ] **API Routes**
  - Next.js API endpoints for:
    - Fetching clients (search/filter support)
    - CRUD actions (e.g., "Close Account" soft delete)

## Phase 3: UI Implementation

- [ ] **Search Component**
  - Replicate PNG layout with exact spacing
  - Connect to API for real-time filtering
- [ ] **Data Table**
  - Server-side rendering (SSR) for initial load
  - Client-side sorting/filtering
  - Pixel-perfect styling (use Figma inspect for CSS)

## Phase 4: Functionality

- [ ] **Search/Filter Logic**
  - PostgreSQL full-text search (name/account)
  - Query optimization with indexes
- [ ] **Table Interactions**
  - API-integrated actions:
    - "Transfer": Mock transaction endpoint
    - "Close Account": Update database status

## Phase 5: Deployment & Polish

- [ ] **Infrastructure**
  - Vercel (frontend) + Supabase/Neon (PostgreSQL)
  - Environment variables for secrets
- [ ] **Pixel-Perfect Audit**
  - Chrome Inspector to validate against PNG
  - Cross-browser testing

## Submission

- Live demo (Vercel)
- GitHub repo with:
  - `README.md` (setup + database instructions)
  - Prisma schema + seed script
- Email submission to `cblanco@biocollections.com`

## Phase 6: Testing

- [ ] **Setup Testing Environment**
  - Install Jest, React Testing Library, ts-jest
  - Configure Jest (jest.config.js, jest.setup.js)
- [ ] **Write Unit Tests**
  - Test core components (e.g., SearchBox, ClientTable)
  - Test utility functions (e.g., data transformers)
  - Test API route handlers (with mocking)

Email submission to `cblanco@biocollections.com`
