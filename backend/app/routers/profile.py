"""Profile endpoints with SQLite persistence."""
import json
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel

from ..database import get_db_connection
from ..deps import get_current_user, get_current_user_id

router = APIRouter(prefix="/profile", tags=["profile"])


class Profile(BaseModel):
    name: str
    email: str
    institution: str | None = None
    degree: str | None = None
    branch: str | None = None
    graduation_year: str | None = None
    career_goal: str | None = None
    target_role: str | None = None
    current_skills: list[str] = []


def _row_to_profile(row) -> Profile:
    skills = []
    if row["current_skills"]:
        try:
            skills = json.loads(row["current_skills"])
            if not isinstance(skills, list):
                skills = []
        except Exception:
            skills = []

    return Profile(
        name=row["name"],
        email=row["email"],
        institution=row["institution"],
        degree=row["degree"],
        branch=row["branch"],
        graduation_year=row["graduation_year"],
        career_goal=row["career_goal"],
        target_role=row["target_role"],
        current_skills=skills,
    )


@router.get("/me", response_model=Profile)
async def get_my_profile(
    user_id: str = Depends(get_current_user_id),
    user: dict = Depends(get_current_user),
) -> Profile:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM profiles WHERE user_id = ?", (user_id,))
    row = cursor.fetchone()

    if not row:
        now = datetime.now(timezone.utc).isoformat()
        cursor.execute(
            """
            INSERT INTO profiles (
                user_id, name, email, institution, degree, branch,
                graduation_year, career_goal, target_role, current_skills, updated_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                user_id,
                user.get("full_name", "Student"),
                user.get("email", ""),
                None,
                None,
                None,
                None,
                None,
                None,
                json.dumps([]),
                now,
            ),
        )
        conn.commit()
        cursor.execute("SELECT * FROM profiles WHERE user_id = ?", (user_id,))
        row = cursor.fetchone()

    conn.close()
    return _row_to_profile(row)


@router.put("/me", response_model=Profile)
async def upsert_my_profile(
    profile: Profile,
    user_id: str = Depends(get_current_user_id),
) -> Profile:
    conn = get_db_connection()
    cursor = conn.cursor()
    now = datetime.now(timezone.utc).isoformat()

    skills_json = json.dumps(profile.current_skills)

    cursor.execute(
        """
        INSERT INTO profiles (
            user_id, name, email, institution, degree, branch,
            graduation_year, career_goal, target_role, current_skills, updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(user_id) DO UPDATE SET
            name = excluded.name,
            email = excluded.email,
            institution = excluded.institution,
            degree = excluded.degree,
            branch = excluded.branch,
            graduation_year = excluded.graduation_year,
            career_goal = excluded.career_goal,
            target_role = excluded.target_role,
            current_skills = excluded.current_skills,
            updated_at = excluded.updated_at
        """,
        (
            user_id,
            profile.name,
            profile.email,
            profile.institution,
            profile.degree,
            profile.branch,
            profile.graduation_year,
            profile.career_goal,
            profile.target_role,
            skills_json,
            now,
        ),
    )
    conn.commit()
    cursor.execute("SELECT * FROM profiles WHERE user_id = ?", (user_id,))
    row = cursor.fetchone()
    conn.close()

    return _row_to_profile(row)


@router.get("/{user_id}", response_model=Profile)
async def get_public_profile(user_id: str) -> Profile:
    """Public read endpoint for student Skill Passport / portfolio viewing."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM profiles WHERE user_id = ?", (user_id,))
    row = cursor.fetchone()
    conn.close()

    if not row:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found",
        )

    return _row_to_profile(row)
