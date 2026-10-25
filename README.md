KickSkill ⚡ Marvel Cinematic Edition

KickSkill is an AI-powered career-readiness workspace and verified skill verification ecosystem designed for students, engineering candidates, and tech hiring teams. Built with a high-performance FastAPI + SQLite backend and a cinematic React 19 + Tailwind CSS v4 frontend, KickSkill bridges the gap between coursework and production engineering roles through verified credentials, dynamic learning roadmaps, real-time matching, and a live Stark Tactical AI Assistant.

⚡ Core Features
1. 🛡️ Live Stark Tactical AI Assistant (/chat)
Real-Time Streaming: Powered by FastAPI Server-Sent Events (SSE) streaming live tokens using Groq (Llama-3.3-70b-versatile) with an intelligent offline simulation fallback.
Context-Aware Directives: Transmits active telemetry from the student's current page (opportunities, learning, skills, skill-passport, etc.) to deliver hyper-targeted advice.
HUD Interface: Arc Reactor status pulses, typing indicators, syntax-highlighted code chips, markdown formatting, copy-to-clipboard, and streaming abort control (HALT).
Global Accessibility: Summonable anytime via the floating Arc Reactor HUD trigger, the homepage prompt console, or the Avengers sidebar.
2. 🎟️ Verified Skill Passport & Admit-One Ticket
Interactive Ticket: Dynamic Admit-One ticket rendering student identity, verified target role, institution, degree, and graduation cohort.
Infinity Stones Progression: Visual progression tracking the 6 core career milestones (Verified Skills, Projects, Credentials, Applications, Interviews, Offers).
Spider-Man 3D Companion: Animated head-tracking companion with mechanical ocular shutter blinking.
Portfolio Verification: Categorized sections for verified projects, credentials, research experience, and hackathon honors.
3. 🎯 Opportunities & Instant Applications Pipeline
Real-Time Opportunities Hub: Live querying of internships, fellowships, and full-time listings stored in SQLite.
Dynamic Filters: Instant filtering across work modes (Remote, Hybrid, On-site), role types, and search keywords.
Match Telemetry: Calculates alignment percentage, highlights matching verified skills, and flags leverage skill gaps.
One-Click Application Dispatch: Students submit applications with custom notes directly to the SQLite applications table.
Applications Tracking Console: Real-time status tracker monitoring stages (Submitted, Under Review, Shortlisted, Interview, Offer).
4. 🗺️ Dynamic AI Learning Roadmaps
On-Demand Roadmap Synthesis: Generates structured, multi-week learning curricula dynamically tailored to the student's target role and verified skills.
Persistent Progress: Saved into the local SQLite database (roadmaps table) and retrievable across sessions.
Regenerate AI Action: Instant re-synthesis when the student changes their career goal or masters new competencies.
5. ⚡ Skills Matrix & Adaptive Evaluations
Skill Telemetry: Interactive Funnel Charts breaking down Technical, Soft Skills, Tools, and Industry competencies.
Interactive Skill Assessments: 3-question adaptive evaluations (Python, Algorithms, Analytical Aptitude) that score student proficiency, trigger particle bursts, and boost verified skill levels in real-time.
Goal Switcher: Change target roles (AI / ML Systems Engineer, Frontend Systems Engineer, Data Scientist, etc.) with automatic profile persistence and roadmap alignment.
6. 📚 Interactive Learning Hub & Lab Modals
Course Detail Modal: Complete interactive syllabus with module checkboxes and dynamic completion progress bars.
Hands-On Project Labs: Project details featuring requirements checklists, starter code tabs, and one-click "Add to Skill Passport" dispatch.
7. 🦸 Marvel Cinematic Experience
Stark Audio Engine: Web Audio synthesis for authentic repulsor clicks, vibranium chime confirmations, and HUD hover feedback.
3D Iron Man Helmet: Interactive 3D helmet on the Command Center that tracks mouse cursor coordinates.
Hulk Cursor Companion: Physics-based desktop companion with gravity, inertia, and smash animations.
Comic Page Transitions: Dynamic comic book sweep transitions across page navigations.
🛠️ Technology Stack
Layer	Technologies
Frontend Framework	React 19, TypeScript 5.7, Vite 8
Styling & Design	Tailwind CSS v4 (@tailwindcss/vite), Marvel HUD dark aesthetic
UI Components & Motion	Framer Motion, Lucide React, Radix UI Slot, Class Variance Authority
Backend Framework	FastAPI (Python 3.12+), Uvicorn (ASGI server with hot reload)
Database	SQLite (kickskill.db) with zero external database dependencies
AI / LLM Engine	Groq SDK (llama-3.3-70b-versatile) + Offline fallback simulator
Authentication	Passwordless (Email + Name only) with cryptographic HS256 JWT tokens
Testing	pytest (8 unit and integration API tests), tsc --noEmit
📂 Project Structure
text
kickskill-marvel/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI application entrypoint & CORS
│   │   ├── config.py            # Pydantic environment configuration
│   │   ├── database.py          # SQLite schema creation & seed datasets
│   │   ├── deps.py              # Cryptographic JWT auth dependencies
│   │   ├── llm.py               # Asynchronous Groq client provider
│   │   ├── agents.py            # AI roadmap generator
│   │   └── routers/
│   │       ├── auth.py          # Passwordless login, signup, /auth/me
│   │       ├── profile.py       # Profile get/update endpoints
│   │       ├── opportunities.py # Searchable opportunity listings
│   │       ├── applications.py  # Applications submission & lifecycle
│   │       ├── roadmap.py       # AI roadmap generation & persistence
│   │       └── chat.py          # Live SSE streaming chat endpoint
│   ├── tests/
│   │   └── test_api.py          # Pytest suite covering all 8 endpoints
│   └── requirements.txt         # Clean backend dependencies
├── src/
│   ├── components/
│   │   ├── chat/
│   │   │   └── StarkAiAssistantDrawer.tsx  # Live Stark AI Assistant drawer
│   │   ├── learning/
│   │   │   ├── CourseDetailModal.tsx       # Interactive course syllabus modal
│   │   │   └── ProjectDetailModal.tsx      # Hands-on project lab modal
│   │   ├── marvel/
│   │   │   ├── IronManHelmet3D.tsx         # 3D mouse-tracking helmet
│   │   │   ├── HulkCursorCompanion.tsx     # Gravity physics companion
│   │   │   ├── MarvelAudioEngine.ts        # Synthesized sound effects
│   │   │   ├── MarvelParticleBurst.tsx     # Particle bursts
│   │   │   └── MarvelIcons.tsx             # Arc Reactor & Marvel SVGs
│   │   └── ui/                             # Admit-one ticket, navbar, charts
│   ├── pages/
│   │   ├── OpportunitiesPage.tsx           # Real-time job/internship search
│   │   ├── ApplicationsPage.tsx            # Live application tracking
│   │   ├── SkillsPage.tsx                  # Skills matrix & quiz evaluation
│   │   ├── LearningPage.tsx                # Dynamic roadmap & courses
│   │   ├── SkillPassportPage.tsx           # Verified admit-one passport
│   │   ├── CareerGoalPage.tsx              # Target role & preferences
│   │   ├── SettingsPage.tsx                # Profile & credential settings
│   │   └── AgentActivityPage.tsx           # Autonomous agent telemetry log
│   ├── lib/
│   │   └── api.ts                          # Typed API client for FastAPI
│   ├── App.tsx                             # Application hub & navigation
│   └── index.css                           # Global styles & Tailwind CSS v4
├── index.html                              # Web app shell
├── package.json                            # Frontend dependencies & scripts
└── vite.config.ts                          # Vite 8 configuration
🚀 Quick Start Guide
Prerequisites
Node.js (v20+ recommended) & npm / pnpm
Python (3.11+ / 3.14)
Step 1: Start the Backend (FastAPI + SQLite)
bash
# Navigate to the backend directory
cd backend
# Install Python dependencies
python -m pip install -r requirements.txt
# (Optional) Add your Groq API key to a .env file for live LLM responses:
# echo GROQ_API_KEY=gsk_your_key_here > .env
# Launch the FastAPI server
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload

The backend server will start on http://127.0.0.1:8000.

Interactive Swagger API Documentation: http://127.0.0.1:8000/docs
Health check: http://127.0.0.1:8000/health
Step 2: Start the Frontend (Vite)

In a separate terminal:

bash
# From the project root
npm install
# Start the Vite development server
npm run dev

Open your browser to: http://localhost:8443 (or http://localhost:5173 depending on port availability)

Step 3: Demo Student Login

KickSkill features zero-password authentication (only Email and Name required).

You can either sign up with your own name and email or use the pre-seeded demo student account:

Email: demo@kickskill.com
Name: Tony Stark

Click Sign In in the top-right header and enter the email. All your profile data, verified skills, and applications will automatically restore!

🧪 Testing
Backend Unit & Integration Tests

Run the comprehensive pytest test suite:

bash
cd backend
python -m pytest tests -v

Coverage includes:

test_health_endpoint
test_seeded_demo_login
test_email_and_name_auth_flow
test_login_without_name_infers_name
test_roadmap_flow
test_chat_stream
test_opportunities_list_and_search
test_applications_lifecycle
Frontend TypeScript Verification & Build
bash
# Type-check without emitting files
npx tsc --noEmit
# Production bundle build
npm run build
🔌 API Reference Summary
Endpoint	Method	Auth	Description
/auth/login	POST	None	Passwordless login via email + optional name
/auth/signup	POST	None	Instant registration via email + name
/auth/me	GET	Bearer	Get current authenticated user details
/profile/me	GET / PUT	Bearer	Get or update student profile in SQLite
/opportunities	GET	Optional	Search & filter opportunities (query, mode, tab)
/applications	GET / POST	Bearer	View submitted applications or submit a new application
/applications/{id}/status	PATCH	Bearer	Update status (submitted, interview, offer)
/roadmap/me	GET	Bearer	Retrieve latest generated career roadmap
/roadmap/generate	POST	Bearer	Generate a new AI roadmap for target role
/chat	POST	Optional	Live Server-Sent Events (SSE) AI assistant stream
/health	GET	None	Backend database and system health check
