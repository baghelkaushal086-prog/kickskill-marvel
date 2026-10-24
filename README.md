# KickSkill

**KickSkill** is a Marvel-inspired career-readiness workspace concept for students and recruiters. It brings skill tracking, a portfolio-style Skill Passport, learning roadmaps, opportunity discovery, application tracking, career goals, and an agent activity feed into one cinematic interface.

> **Repository status:** The current frontend is a Vite + React application with substantial interactive UI and sample/demo data. A separate FastAPI backend scaffold provides a streaming Groq chat endpoint and profile routes; not every screen is connected to persistent backend data yet. Treat the dashboards and example metrics as demo content unless a flow is explicitly backed by the API.

**Repository:** [Syed-Haseeb97/kickskill_marvel](https://github.com/Syed-Haseeb97/kickskill_marvel)

**Hackathon presentation:** See the [Hackathon Demo Guide](HACKATHON_DEMO.md) for a short pitch, suggested demo flow, smoke-test checklist, and clear notes on what is and is not implemented.

---

## What is in the current codebase?

### Student and candidate workspace

- **Role selection** — entry screen for the student/job-seeker workspace or the recruiter/industry console.
- **Command Center / Home** — welcome dashboard, career-assistant prompt box, quick actions, sign-in/sign-up UI, and workspace navigation.
- **Opportunities** — browse sample internships, jobs, and projects; inspect role details, match explanations, required skills, skill gaps, eligibility, and deadlines.
- **Skills** — explore technical skills, soft skills, tools, and industry skills; view proficiency indicators and highlighted gaps.
- **Learning** — recommended courses, learning roadmaps, courses, and projects intended to help close skill gaps.
- **Skill Passport** — portfolio-style profile with tabs for overview, projects, certifications, experience, and achievements; includes verification/evidence-oriented presentation.
- **Applications** — application pipeline with views for all applications, items under review, interviews, offers, and archived/rejected applications.
- **Career Goals** — configure a target role, industry, timeline, location, work mode, and opportunity type, alongside a visual career path.
- **Agent Activity** — timeline-style view of example opportunity scans, skill audits, policy checks, application preparation, and tracking events.
- **Settings** — profile, career preferences, agent settings, documents, notifications, and privacy sections.
- **Recruiter / Industry Console** — dashboard areas for opportunities, candidates, shortlists, interviews, skill demand, AI recruiting, and company profile.

### Marvel-inspired experience

The UI includes a dark, cinematic visual system with Marvel-red and arc-reactor-cyan accents, custom Marvel/KickSkill iconography, animated or interactive UI components, audio controls, particle bursts, an Iron Man helmet component, and a Hulk cursor companion. The exact experience depends on the component and assets loaded by each screen.

### Shared UI and visual components

The repository also contains reusable UI components used by the screens, including animated navigation, search and opportunity cards, charts, hover/motion buttons, borders, ticket/passport visuals, and other imported visual experiments. See `src/components/`, `src/imports/`, and `src/pages/` for the source of truth.

---

## Current implementation and limitations

The repository contains both a rich frontend prototype and an early backend scaffold. They should not be mistaken for a fully production-integrated recruitment automation service.

| Area | Current state in this repository |
| --- | --- |
| Frontend | React 19, TypeScript, Vite, Tailwind CSS v4 |
| Navigation and dashboards | Implemented as frontend pages/components |
| Example opportunities, skills, applications, recruiter data, and activity | Primarily hard-coded/sample UI data |
| Sign-in/sign-up screens | Frontend demo state; the current handlers do not establish a real user session |
| Backend API | FastAPI app with CORS and a health endpoint |
| Career assistant chat | `POST /chat` streams responses from Groq using server-configured model settings |
| Profile API | `GET /profile/me` and `PUT /profile/me` are currently placeholders that return HTTP 501 until Supabase persistence is implemented |
| Roadmap generation | A Groq-backed structured-output helper exists in `backend/app/agents.py`; it is not currently exposed as a route in `backend/app/main.py` |
| Persistent storage | Not wired end-to-end for the frontend screens; the profile router still needs its Supabase query/upsert implementation |
| Automatic job applications / live job-board integrations | Not implemented by the code currently present; activity entries and application outcomes shown in the UI are illustrative |
| Production authentication | Not ready as-is: the backend token dependency currently decodes JWT claims without verifying the signature. Replace this with proper Supabase JWT/JWKS verification before relying on it |

The README intentionally describes what is present in the code rather than presenting planned functionality as already operational.

---

## Tech stack

### Frontend

- **React 19** and **TypeScript**
- **Vite 8** for development and production builds
- **Tailwind CSS v4** with the Vite plugin
- **Framer Motion** for motion and interaction
- **Lucide React** for icons
- **Radix UI Slot**, **class-variance-authority**, **clsx**, and **tailwind-merge** for UI composition and class utilities
- **Paper Design shader components** for selected visual effects

### Backend

- **FastAPI** and **Uvicorn**
- **Pydantic** and **pydantic-settings** for request models and configuration
- **Groq Python SDK** for streamed chat and structured-output generation
- **Supabase Python SDK** included for planned profile persistence
- **PyJWT** for token claim decoding in the current auth dependency
- **HTTPX**, **python-dotenv**, and **python-multipart** among the supporting packages

The current code does **not** demonstrate a working PostgreSQL/pgvector matching pipeline, a local Ollama/Qwen agent, cryptographic skill-evidence verification, or end-to-end autonomous application submission. Those should be described as future work unless and until they are implemented and integrated.

---

## Project structure

```text
.
├── backend/
│   ├── app/
│   │   ├── main.py             # FastAPI app, CORS, health endpoint, routers
│   │   ├── config.py           # Environment-backed settings
│   │   ├── deps.py              # Current bearer-token claim decoding dependency
│   │   ├── llm.py              # Shared asynchronous Groq client
│   │   ├── agents.py           # Structured-output roadmap helper
│   │   └── routers/
│   │       ├── chat.py         # Streaming POST /chat endpoint
│   │       └── profile.py      # Profile endpoints (persistence TODO)
│   ├── requirements.txt
│   └── README.md
├── public/
│   ├── audio/                  # Audio assets
│   └── marvel/                 # Marvel-themed visual assets
├── src/
│   ├── components/
│   │   ├── marvel/             # Marvel-themed interactive components
│   │   └── ui/                 # Reusable interface components
│   ├── imports/                # Imported assets and design/component references
│   ├── pages/                  # Main student and recruiter screens
│   ├── App.tsx                 # App state, navigation, home and auth UI
│   ├── main.tsx                # React entry point
│   └── index.css               # Global styles
├── index.html
├── package.json
├── pnpm-lock.yaml
├── package-lock.json
├── tsconfig.json
└── vite.config.ts
```

Some imported files are design references or experiments rather than application routes. The page and component source files are the authoritative reference for current behavior.

---

## Run the frontend locally

### Requirements

- Node.js compatible with the versions required by the installed Vite release
- npm or pnpm

### Install and start

```bash
git clone https://github.com/Syed-Haseeb97/kickskill_marvel.git
cd kickskill_marvel
npm install
npm run dev
```

Vite prints the local development URL in the terminal (typically `http://localhost:5173`).

### Production build

```bash
npm run build
npm run preview
```

Available package scripts:

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server on the network interface |
| `npm run build` | Create a production build |
| `npm run preview` | Preview the production build locally |
| `npm run format` | Run Oxfmt formatting |

---

## Run the backend locally

The frontend can be explored on its own. To run the separate API, use Python and configure the environment variables below.

```bash
cd backend
python -m venv .venv
```

Activate the virtual environment:

**Windows PowerShell**
```powershell
.venv\Scripts\Activate.ps1
```

**macOS / Linux**
```bash
source .venv/bin/activate
```

Install dependencies and start the server:

```bash
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

- Health check: [http://localhost:8000/health](http://localhost:8000/health)
- Interactive API docs: [http://localhost:8000/docs](http://localhost:8000/docs)

### Backend environment

Create `backend/.env` and supply the credentials for the services you intend to use:

```dotenv
GROQ_API_KEY=your_groq_api_key
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
SUPABASE_ANON_KEY=your_supabase_anon_key
FRONTEND_URL=http://localhost:5173
CHAT_MODEL=llama-3.3-70b-versatile
FAST_MODEL=llama-3.1-8b-instant
```

Keep API keys and service-role credentials private. Do not commit `.env` files or expose a Supabase service-role key in browser code.

The backend settings read these environment variables, and the chat endpoint needs a valid Groq API key. Supabase values are included for the intended profile integration, but the current profile routes still require implementation before they can read or persist profile data.

### API endpoints currently registered

| Method | Path | Behavior |
| --- | --- | --- |
| `GET` | `/health` | Returns a simple health status |
| `POST` | `/chat` | Streams assistant text as Server-Sent Events using Groq |
| `GET` | `/profile/me` | Requires a bearer token; currently returns HTTP 501 |
| `PUT` | `/profile/me` | Requires a bearer token; currently returns HTTP 501 |

The roadmap helper in `backend/app/agents.py` is currently a Python function, not a registered HTTP endpoint.

---

## Configuration and deployment notes

- The backend allows requests from `FRONTEND_URL` and `http://localhost:5173` via CORS.
- The frontend package currently defines no `VITE_API_URL` usage in the main app entry code. Before deploying the API alongside the frontend, connect the relevant UI flows to the API and configure the frontend API base URL.
- The backend README outlines a possible Render deployment and frontend hosting on Vercel or Netlify, but a deployed service is not guaranteed by this repository alone.
- Do not treat sample job listings, match percentages, applicant counts, profile names, or agent activity entries as live or independently verified data.

---

## Suggested next steps

1. Add proper Supabase authentication and verify JWT signatures using the project's supported JWKS/verification flow.
2. Implement profile read/write operations against a defined Supabase schema.
3. Connect the frontend chat UI to `POST /chat` and handle SSE framing, errors, and cancellation.
4. Add typed API client functions and loading/error/empty states for screens that will use persisted data.
5. Define the evidence model and deterministic scoring rules before presenting any skill as verified.
6. Add real opportunity-source integrations, deduplication, and explicit user approval before any external application action.
7. Add automated tests for API routes, auth, matching/scoring rules, and key frontend workflows.
8. Remove committed generated artifacts (such as Python `__pycache__` files) and replace placeholder or invalid media assets with validated assets where needed.

---

## Product principle

**AI can explain and assist; application code should enforce policy.** A trustworthy version of KickSkill should make the evidence behind each skill and match score inspectable, distinguish suggestions from completed actions, and require clear user consent for consequential actions.
