"""FastAPI entrypoint for KickSkill backend with SQLite."""
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .database import init_db, get_db_connection
from .routers import applications, auth, chat, opportunities, profile, roadmap


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize SQLite database and seed starter demo data on startup
    init_db()
    yield


app = FastAPI(
    title="KickSkill API",
    version="0.2.0",
    description="KickSkill backend powered by FastAPI, SQLite, and Groq.",
    lifespan=lifespan,
)

# Allow typical local dev ports (Vite runs on 5173 or 8443 in Figma Make)
allowed_origins = list(
    set([
        settings.frontend_url,
        "http://localhost:5173",
        "http://localhost:8443",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:8443",
        "http://localhost:3000",
    ])
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(profile.router)
app.include_router(roadmap.router)
app.include_router(opportunities.router)
app.include_router(applications.router)
app.include_router(chat.router)


@app.get("/health")
async def health() -> dict:
    db_status = "error"
    try:
        conn = get_db_connection()
        conn.execute("SELECT 1")
        conn.close()
        db_status = "connected (sqlite)"
    except Exception as e:
        db_status = f"error: {e}"

    return {
        "status": "ok",
        "database": db_status,
        "version": "0.2.0",
    }
