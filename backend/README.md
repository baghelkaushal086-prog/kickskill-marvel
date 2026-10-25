# KickSkill Backend

FastAPI + SQLite + Groq.

## Setup

```bash
cd backend
python -m venv .venv
# Windows:
.venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate

pip install -r requirements.txt
cp .env.example .env        # optional: fill in GROQ_API_KEY
uvicorn app.main:app --reload --port 8000
```

Interactive Swagger docs: http://localhost:8000/docs

## Automated Tests

Run the test suite with:

```bash
cd backend
python -m pytest
```

## Lightweight Authentication (Email + Name only)

Authentication requires **only an email address and name** (no passwords):
* `POST /auth/login` or `POST /auth/signup`
  ```json
  {
    "email": "student@example.com",
    "name": "Peter Parker"
  }
  ```
* Returns JWT `access_token` and user record.
* If `name` is omitted, the user's name is automatically derived from the email prefix.

## API Modules

- `app/routers/auth.py` — lightweight email + name authentication (`/auth/login`, `/auth/signup`, `/auth/me`)
- `app/routers/profile.py` — student profile persistence (`GET /profile/me`, `PUT /profile/me`, `GET /profile/{user_id}`)
- `app/routers/opportunities.py` — browse, search, and filter job/internship listings (`GET /opportunities`, `GET /opportunities/{id}`, `POST /opportunities`)
- `app/routers/applications.py` — student application tracking & status updates (`GET /applications`, `POST /applications`, `PATCH /applications/{id}/status`, `DELETE /applications/{id}`)
- `app/routers/roadmap.py` — personalized roadmap generation & history (`POST /roadmap/generate`, `GET /roadmap/me`)
- `app/routers/chat.py` — SSE streaming career assistant
- `tests/test_api.py` — comprehensive test coverage

## Default Seed Account

When initialized, SQLite automatically seeds a demo account:
- **Email**: `demo@kickskill.com` (Tony Stark)
