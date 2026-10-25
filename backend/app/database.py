"""SQLite database connection and schema setup for KickSkill."""
import json
import os
import sqlite3
from datetime import datetime, timezone
from typing import Generator
from .config import settings

def get_db_path() -> str:
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    if os.path.isabs(settings.sqlite_db_path):
        return settings.sqlite_db_path
    return os.path.join(base_dir, settings.sqlite_db_path)


def get_db_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(get_db_path(), check_same_thread=False)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON;")
    return conn


def get_db() -> Generator[sqlite3.Connection, None, None]:
    conn = get_db_connection()
    try:
        yield conn
    finally:
        conn.close()


SEED_OPPORTUNITIES = [
    {
        "id": 1,
        "title": "AI & Machine Learning Intern",
        "company": "Anthropic / Autonomous Labs",
        "location": "San Francisco / Remote",
        "mode": "Internship",
        "match_score": 94,
        "skills": ["Python", "Machine Learning", "SQL", "PyTorch"],
        "skill_gap": ["Docker"],
        "about": "Join our core AI team to build high-efficiency data pipelines, evaluate edge neural models, and optimize deployment workflows.",
        "responsibilities": [
            "Train and evaluate neural models on benchmark datasets",
            "Interface data pipelines with distributed storage systems",
            "Collaborate directly with senior ML systems engineers",
            "Conduct reproducible latency and accuracy benchmarks",
        ],
        "eligibility": "Final-year students or recent graduates in Computer Science, AI, or related fields.",
        "deadline": "April 30, 2026",
        "why_match": "Your verified Python and Machine Learning scores closely align with core requirements. Closing your Docker gap will reach 98% match.",
        "stipend": "₹25,000 / mo",
    },
    {
        "id": 2,
        "title": "Frontend Systems Engineer",
        "company": "Linear / Design Systems",
        "location": "New York / Hybrid",
        "mode": "Full-time",
        "match_score": 86,
        "skills": ["React", "TypeScript", "CSS", "Node.js"],
        "skill_gap": ["GraphQL", "Testing"],
        "about": "Engineer fluid, high-performance web user interfaces for mission-critical collaboration and project management systems.",
        "responsibilities": [
            "Develop reusable component libraries with 60fps micro-interactions",
            "Optimize web render cycles and Core Web Vitals",
            "Collaborate closely with product designers",
            "Maintain 95%+ unit test coverage for core workflows",
        ],
        "eligibility": "1+ years of demonstrated excellence in modern React and TypeScript frontend engineering.",
        "deadline": "May 15, 2026",
        "why_match": "Your React and TypeScript proficiency are rated top-tier. Adding GraphQL fluency will secure top priority for this posting.",
        "stipend": "₹22,000 / mo",
    },
    {
        "id": 3,
        "title": "Data Science & Quantum Computing Fellow",
        "company": "DeepMind Quantum Labs",
        "location": "London / Remote",
        "mode": "Project",
        "match_score": 89,
        "skills": ["Python", "Pandas", "Visualization", "Statistics"],
        "skill_gap": [],
        "about": "Analyze experimental simulation datasets and statistical models. Research credits and co-authorship opportunities provided.",
        "responsibilities": [
            "Clean and model multi-dimensional simulation datasets",
            "Construct interactive 3D data visualizations",
            "Synthesize experimental findings into concise technical reports",
            "Present discoveries to lead research investigators",
        ],
        "eligibility": "Open to enrolled engineering students and early-career researchers.",
        "deadline": "May 30, 2026",
        "why_match": "All required competencies perfectly match your verified Skill Passport. Ideal for earning published credentials.",
        "stipend": "₹20,000 / mo",
    },
    {
        "id": 4,
        "title": "High-Throughput Backend Intern",
        "company": "Stripe Cloud Infrastructure",
        "location": "Seattle / Hybrid",
        "mode": "Internship",
        "match_score": 76,
        "skills": ["Node.js", "PostgreSQL", "REST APIs", "Docker"],
        "skill_gap": ["Kubernetes", "Redis"],
        "about": "Build high-reliability distributed services and real-time event systems powering global transactional workflows.",
        "responsibilities": [
            "Architect and test resilient REST & WebSocket endpoints",
            "Optimize PostgreSQL query throughput and indexing",
            "Deploy containerized microservices across hybrid clusters",
            "Participate in asynchronous architecture reviews",
        ],
        "eligibility": "3rd or 4th year undergraduate engineering students.",
        "deadline": "April 25, 2026",
        "why_match": "Your Node.js and SQL competencies are strong. Expanding into Redis caching and Kubernetes orchestration will lift you to 90%+ match.",
        "stipend": "₹24,000 / mo",
    },
    {
        "id": 5,
        "title": "Technical Product Analyst",
        "company": "Figma Platform Operations",
        "location": "San Francisco / Remote",
        "mode": "Internship",
        "match_score": 71,
        "skills": ["Product Thinking", "Analytics", "User Research", "Figma"],
        "skill_gap": ["SQL", "A/B Testing"],
        "about": "Shape product workflows by analyzing engagement metrics, conducting user interviews, and collaborating with cross-functional teams.",
        "responsibilities": [
            "Conduct user interviews and distill functional specifications",
            "Write structured user stories with verifiable acceptance criteria",
            "Monitor product funnels and engagement metrics",
            "Coordinate sprints across design and engineering teams",
        ],
        "eligibility": "Students in engineering, business, or design with sharp analytical acumen.",
        "deadline": "May 10, 2026",
        "why_match": "Your design and product thinking foundation is solid. Completing our SQL assessment will qualify you immediately.",
        "stipend": "₹18,000 / mo",
    },
    {
        "id": 6,
        "title": "Cloud & Site Reliability Engineer",
        "company": "Datadog Systems",
        "location": "New York / Remote",
        "mode": "Full-time",
        "match_score": 65,
        "skills": ["Docker", "Linux", "CI/CD", "AWS"],
        "skill_gap": ["Terraform", "Kubernetes", "Monitoring"],
        "about": "Maintain high availability for multi-region cloud clusters, automate deployment pipelines, and configure proactive monitoring.",
        "responsibilities": [
            "Manage multi-zone cloud infrastructure and security policies",
            "Automate zero-downtime CI/CD deployment pipelines",
            "Monitor system telemetry and execute automated remediation",
            "Harden system configurations against vulnerabilities",
        ],
        "eligibility": "Demonstrated hands-on experience with Linux and cloud infrastructure tooling.",
        "deadline": "May 5, 2026",
        "why_match": "Strong Docker and Linux foundation. Adding Terraform and Kubernetes verification will maximize hiring priority.",
        "stipend": "₹28,000 / mo",
    },
]


def init_db() -> None:
    """Create tables if they don't exist and insert starter demo data."""
    conn = get_db_connection()
    cursor = conn.cursor()

    # Check if existing users table still has the legacy hashed_password column
    cursor.execute("PRAGMA table_info(users);")
    cols = [row[1] for row in cursor.fetchall()]
    if "hashed_password" in cols:
        cursor.execute("DROP TABLE IF EXISTS applications;")
        cursor.execute("DROP TABLE IF EXISTS opportunities;")
        cursor.execute("DROP TABLE IF EXISTS roadmaps;")
        cursor.execute("DROP TABLE IF EXISTS profiles;")
        cursor.execute("DROP TABLE IF EXISTS users;")

    cursor.executescript("""
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            email TEXT UNIQUE NOT NULL,
            full_name TEXT NOT NULL,
            role TEXT NOT NULL DEFAULT 'student',
            created_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS profiles (
            user_id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            institution TEXT,
            degree TEXT,
            branch TEXT,
            graduation_year TEXT,
            career_goal TEXT,
            target_role TEXT,
            current_skills TEXT,
            updated_at TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS roadmaps (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            target_role TEXT NOT NULL,
            current_skills TEXT,
            steps TEXT NOT NULL,
            created_at TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS opportunities (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            company TEXT NOT NULL,
            location TEXT NOT NULL,
            mode TEXT NOT NULL,
            match_score INTEGER NOT NULL DEFAULT 85,
            skills TEXT NOT NULL,
            skill_gap TEXT NOT NULL,
            about TEXT NOT NULL,
            responsibilities TEXT NOT NULL,
            eligibility TEXT NOT NULL,
            deadline TEXT NOT NULL,
            why_match TEXT NOT NULL,
            stipend TEXT NOT NULL DEFAULT '₹25,000 / mo',
            created_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS applications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT NOT NULL,
            opportunity_id INTEGER NOT NULL,
            role TEXT NOT NULL,
            company TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'submitted',
            match INTEGER NOT NULL DEFAULT 85,
            location TEXT,
            stipend TEXT,
            job_type TEXT,
            applied_date TEXT NOT NULL,
            notes TEXT,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (opportunity_id) REFERENCES opportunities(id) ON DELETE CASCADE,
            UNIQUE(user_id, opportunity_id)
        );
    """)

    now = datetime.now(timezone.utc).isoformat()

    # Seed demo student user if not present
    cursor.execute("SELECT id FROM users WHERE email = ?", ("demo@kickskill.com",))
    demo_user = cursor.fetchone()
    if not demo_user:
        demo_user_id = "user_demo_stark"
        cursor.execute(
            """
            INSERT INTO users (id, email, full_name, role, created_at)
            VALUES (?, ?, ?, ?, ?)
            """,
            (
                demo_user_id,
                "demo@kickskill.com",
                "Tony Stark",
                "student",
                now,
            ),
        )

        sample_skills = json.dumps(["Python", "Machine Learning", "PyTorch", "SQL", "React"])
        cursor.execute(
            """
            INSERT INTO profiles (
                user_id, name, email, institution, degree, branch,
                graduation_year, career_goal, target_role, current_skills, updated_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                demo_user_id,
                "Tony Stark",
                "demo@kickskill.com",
                "MIT / Stark Institute",
                "B.Tech in Artificial Intelligence",
                "Computer Science & Engineering",
                "2026",
                "Architect state-of-the-art AI systems and autonomous agents.",
                "AI Engineer / Autonomous Systems",
                sample_skills,
                now,
            ),
        )

    # Seed starter opportunities if none exist
    cursor.execute("SELECT COUNT(*) as count FROM opportunities")
    count_row = cursor.fetchone()
    if count_row and count_row["count"] == 0:
        for opp in SEED_OPPORTUNITIES:
            cursor.execute(
                """
                INSERT INTO opportunities (
                    id, title, company, location, mode, match_score,
                    skills, skill_gap, about, responsibilities, eligibility,
                    deadline, why_match, stipend, created_at
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    opp["id"],
                    opp["title"],
                    opp["company"],
                    opp["location"],
                    opp["mode"],
                    opp["match_score"],
                    json.dumps(opp["skills"]),
                    json.dumps(opp["skill_gap"]),
                    opp["about"],
                    json.dumps(opp["responsibilities"]),
                    opp["eligibility"],
                    opp["deadline"],
                    opp["why_match"],
                    opp["stipend"],
                    now,
                ),
            )

    # Seed starter application for demo user if none exist
    cursor.execute("SELECT COUNT(*) as count FROM applications WHERE user_id = ?", ("user_demo_stark",))
    app_count = cursor.fetchone()
    if app_count and app_count["count"] == 0:
        cursor.execute(
            """
            INSERT INTO applications (
                user_id, opportunity_id, role, company, status, match,
                location, stipend, job_type, applied_date, notes
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                "user_demo_stark",
                1,
                "AI & Machine Learning Intern",
                "Anthropic / Autonomous Labs",
                "resume_viewed",
                94,
                "San Francisco / Remote",
                "₹25,000",
                "Internship",
                "April 24, 2026",
                "Autonomous application dispatched via KickSkill Stark Agent.",
            ),
        )

    conn.commit()
    conn.close()
