# KickSkill — Hackathon Demo Guide

A short guide for presenting the current KickSkill prototype consistently during a live demo.

## 60-second pitch

Students often have skills, coursework, projects, and career goals scattered across different places. KickSkill explores a single career-readiness workspace where a student can review skills, discover example opportunities, understand skill gaps, plan learning, and present a portfolio-style Skill Passport. A recruiter-facing console explores the other side of the same workflow.

The current submission is an interactive frontend prototype supported by an early FastAPI backend scaffold. Demo listings, scores, activity entries, and dashboard metrics are illustrative sample data unless explicitly identified as API-backed.

## Suggested live demo flow

1. **Start with the problem.** Explain how difficult it can be to connect skills and projects to relevant opportunities.
2. **Show the student Command Center.** Point out the main navigation and the career-assistant prompt area.
3. **Explore Opportunities.** Open an example listing and explain how its requirements, match explanation, and skill gaps are presented. Clarify that the listings and match values are demo data.
4. **Show Skills and Learning.** Explain how skill indicators can guide a learning roadmap and project choices.
5. **Open the Skill Passport.** Demonstrate the portfolio-style organization of projects, certifications, experience, and achievements.
6. **Show Applications and Career Goals.** Walk through the intended application pipeline and how a target role can shape the career path.
7. **Switch to the Recruiter / Industry Console.** Explain the complementary recruiting workflow and the potential to review candidates and organize shortlists.
8. **Close with the implementation boundary.** The UI is the main working prototype; the backend currently exposes health and streamed chat endpoints, while profile persistence and live opportunity integrations remain future work.

Use the shortest flow that fits the available judging time. Do not spend the demo typing credentials into an unconfigured service.

## What is implemented today

- React, TypeScript, and Vite frontend with student and recruiter-oriented screens.
- Reusable interface and Marvel-inspired visual components.
- Example opportunity, skill, application, career-goal, and activity views.
- FastAPI backend scaffold with a health endpoint and Groq-backed streaming chat route.
- Profile route placeholders that explicitly return HTTP 501 pending persistence work.

## What should not be claimed

- Live job-board ingestion or verified live opportunity data.
- Production authentication or verified identity.
- Persistent profile/application data across sessions.
- Automatic job applications or autonomous external actions.
- Cryptographically verified skills or evidence.
- A fully integrated frontend-to-backend experience for every screen.

## Pre-submission smoke-test checklist

Run these checks on the machine and deployment you plan to present. Mark them only after verifying them.

- [ ] Install frontend dependencies successfully.
- [ ] Run the development server and confirm the app loads.
- [ ] Navigate through the student workspace without a runtime error.
- [ ] Open the Opportunities, Skills, Learning, Skill Passport, Applications, and Career Goals screens.
- [ ] Open the recruiter console and check its main navigation.
- [ ] Test the production build with `npm run build`.
- [ ] If demonstrating the API, start it separately and verify `GET /health`.
- [ ] If demonstrating chat, configure a valid server-side `GROQ_API_KEY` and test the stream before judging.
- [ ] Check the presentation at the actual screen size and browser used for judging.
- [ ] Remove local secrets from the repository and confirm no `.env` file is tracked.
- [ ] Keep a local working copy and a backup demo path in case network access fails.

## Run locally

Frontend:

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
npm run preview
```

Backend (optional for the frontend demo):

```bash
cd backend
python -m venv .venv
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Configure the required backend environment variables in a local `backend/.env` file before using the chat service. Never commit API keys or service-role credentials.

## Next steps after the prototype

1. Add proper authentication and cryptographic JWT verification.
2. Implement and test profile persistence.
3. Connect the frontend assistant to the streaming chat endpoint with error and cancellation handling.
4. Replace illustrative listings with a documented, reliable opportunity data source.
5. Define transparent matching criteria and evidence requirements.
6. Add automated tests for critical routes and user journeys.

## One-line closing

**KickSkill is a career-readiness workspace prototype that brings skills, learning, opportunities, and portfolio presentation into one guided experience.**
