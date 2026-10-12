# LeadIQ — Smart Lead Generation & Qualification

## 1. Problem Statement
Finding leads is easy. Finding the *right* leads is hard. Sales teams waste too much time manually researching companies, reviewing unstructured data, and chasing prospects that have a low probability of closing, leading to inefficiencies and lost revenue.

## 2. Business Use Case
"Don't just find leads — identify which leads are worth contacting first."
LeadIQ solves this by providing a smart scoring engine. It doesn't just present a list of 500 companies; it identifies the top 20 you should contact today, backed by an explainable, data-driven score. It streamlines the workflow: Find → Filter → Qualify → Prioritize → Act.

## 3. Key Features
- **Leads Explorer**: Search and filter by industry, location, technology, score, and priority.
- **Smart Lead Scoring**: Deterministic 100-point engine grading leads based on actionable data.
- **Explainable Scores**: See exactly *why* a lead scored what it did (e.g., +20 for Industry Match).
- **Dashboard Analytics**: Real-time stats derived directly from your leads dataset.
- **Saved Leads**: Persist high-value targets.
- **Deduplication**: Automatic checking across website, email, and normalized company names.
- **CSV Export**: Export filtered views for CRM import.

## 4. Lead Scoring Method
The application uses an Intelligent Lead Scoring engine (rule-based, transparent, and deterministic). It calculates a score from 0 to 100 based on specific matching criteria tailored to your Ideal Customer Profile (ICP).

## 5. Score Breakdown
- **Industry Match**: 20 points
- **Company Size Match**: 15 points
- **Location Match**: 15 points
- **Technology Match**: 15 points
- **Growth Signals**: 15 points
- **Decision Maker Available**: 10 points
- **Website Verified**: 10 points
*Total = 100 points*

## 6. Priority Rules
- **80–100**: HIGH PRIORITY
- **60–79**: MEDIUM PRIORITY
- **0–59**: LOW PRIORITY

## 7. Technology Stack
- **Frontend**: React, TypeScript, Vite, CSS (Custom Design System), React Router, Axios
- **Backend**: Node.js, Express, TypeScript
- **Database**: MongoDB (via Mongoose), using `mongodb-memory-server` for zero-config local development

## 8. Architecture
The app follows a modern decoupled architecture. The React frontend consumes RESTful APIs provided by the Express backend, ensuring separation of concerns and clear data flow.

## 9. Frontend Architecture
Structured by feature:
- `/components`: Reusable UI elements (LeadCard, Navbar, Filters)
- `/pages`: Route-level views (Dashboard, Leads)
- `/services`: API clients (Axios abstractions)
- `/types`: Shared TypeScript interfaces

## 10. Backend Architecture
Structured for scalability:
- `/routes`: Express route definitions
- `/controllers`: Request handling and response formatting
- `/services`: Core business logic (Scoring, Deduplication)
- `/models`: Mongoose schemas and data validation

## 11. Database
MongoDB is used for flexible schema design, perfectly suited for unstructured or semi-structured scraped lead data. We use compound indexes for fast querying and deduplication.

## 12. API Endpoints
- `GET /api/leads` - Fetch and filter leads (supports `page`, `limit`, `sortBy`, `sortOrder`, `search`, `industry`, `location`, `minEmployees`, `maxEmployees`, `technologies`, `minScore`, `priority`, `isSaved`)
- `GET /api/leads/stats` - Fetch dashboard statistics (KPI cards, industry distribution, common tech stacks)
- `GET /api/leads/export` - Export filtered leads as a downloadable CSV
- `POST /api/leads/seed` - Reset database to clean 16-record seed demo dataset
- `POST /api/leads` - Create a new lead (with deduplication & auto-scoring)
- `GET /api/leads/:id` - Fetch single lead with score matrix and explainable `whySummary`
- `POST /api/leads/:id/save` - Toggle saved/bookmarked status

## 13. Data Model
```typescript
{
  name: string,
  website: string,
  industry: string,
  location: string,
  employeeCount: number,
  technologies: string[],
  revenueEstimate: number,
  growthSignals: string[],
  contact: { name, title, email, phone?, linkedin? },
  leadScore: number,
  priority: 'High' | 'Medium' | 'Low',
  scoreBreakdown: [...],
  whySummary?: string[],
  verified: boolean,
  isSaved: boolean
}
```

## 14. Filtering & Pagination
Filtering logic is handled on the backend:
- **Search**: Dynamic case-insensitive regex matching company name, contact, email, and technology.
- **Criteria**: Multi-select industry, location, employee size range, min score, and priority tiers.
- **Pagination**: Supports `page` and `limit` query parameters, returning `{ leads, total, page, totalPages }`. Leads Explorer includes Previous/Next pagination controls and a "Page X of Y" indicator, resetting to page 1 upon filter changes.

## 15. Deduplication
Deduplication happens at the database level. Before inserting a lead, the system checks for existing records using:
1. Normalized website domain (stripping `https://`, `http://`, `www.`, and trailing slashes)
2. Normalized contact email (case-insensitive)
3. Normalized company name (case-insensitive, trimmed)

## 16. Validation
Strict validation is enforced on both ends:
- **Frontend**: Required field checks before submission with informative user alerts.
- **Backend**: Mongoose schema validation for required fields, regex for Emails and URLs, and minimum value constraints (no negative employees/revenue).

## 17. CSV Export
Export exactly what you see. The CSV export endpoint respects current filter parameters, allowing users to export targeted lists for sales outreach.

## 18. Local Development Setup
1. Clone the repository
2. Open two terminals
3. In `backend/`: 
   ```bash
   cp .env.example .env   # (Optional: leave MONGODB_URI empty for in-memory fallback)
   npm install
   npm run dev            # Starts backend on http://localhost:5000
   ```
4. In `frontend/`: 
   ```bash
   npm install
   npm run dev            # Starts frontend on http://localhost:3000
   ```
5. Visit `http://localhost:3000`

## 19. Environment Variables & Persistent Database
Templates are provided in `.env.example` in the root and `backend/` directories.

- **Zero-Config Local Development (Default)**:
  Leave `MONGODB_URI` blank in `backend/.env`. The application automatically launches `mongodb-memory-server` in RAM.
- **Persistent Storage (Survives Restarts)**:
  To persist newly created prospects and bookmarked leads across backend restarts, provide a MongoDB Atlas cluster URI or local MongoDB daemon in `backend/.env`:
  ```env
  PORT=5000
  MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/leadiq?retryWrites=true&w=majority
  NODE_ENV=development
  ```
  When `MONGODB_URI` is present, the app connects directly to your persistent database. If the database is empty, it automatically seeds the initial 16 leads once without overwriting existing data.

## 20. Seed Data
**Note on Data Source**: The application includes a curated 16-company seed dataset in `backend/src/data/leads.json`. You can reset to this baseline data at any time via the "Reset Seed" button.

## 21. Deployment Instructions
- **Backend**: Can be deployed to Render, Railway, or Heroku. Configure the `MONGODB_URI` environment variable in your cloud provider settings.
- **Frontend**: Can be built via `npm run build` and deployed to Vercel, Netlify, or AWS S3. The Vite dev server proxies `/api` to the backend.

## 22. Known Limitations
- Data currently originates from seed data and user input; external scraper adapters are planned as future extensions.
- When running in default local mode without `MONGODB_URI`, data resides in-memory and resets on process restart.

## 23. Future Improvements
- Implement a live web scraping pipeline with headless browser extraction.
- CRM integrations (Salesforce, HubSpot export).
- Authentication and team-level access control.
