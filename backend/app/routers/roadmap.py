"""Roadmap router: generates and persists personalized learning paths."""
import json
import uuid
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel

from ..agents import Roadmap, generate_roadmap
from ..database import get_db_connection
from ..deps import get_current_user_id

router = APIRouter(prefix="/roadmap", tags=["roadmap"])


class GenerateRoadmapRequest(BaseModel):
    target_role: str | None = None
    current_skills: list[str] | None = None


@router.post("/generate", response_model=Roadmap)
async def create_roadmap(
    req: GenerateRoadmapRequest,
    user_id: str = Depends(get_current_user_id),
) -> Roadmap:
    conn = get_db_connection()
    cursor = conn.cursor()

    # If target_role or skills are not supplied, read from student profile
    target_role = req.target_role
    skills = req.current_skills

    if not target_role or skills is None:
        cursor.execute("SELECT target_role, current_skills FROM profiles WHERE user_id = ?", (user_id,))
        profile_row = cursor.fetchone()
        if profile_row:
            if not target_role:
                target_role = profile_row["target_role"] or "Software Engineer"
            if skills is None and profile_row["current_skills"]:
                try:
                    skills = json.loads(profile_row["current_skills"])
                except Exception:
                    skills = []

    target_role = target_role or "Full-Stack Developer"
    skills = skills or []

    roadmap = await generate_roadmap(current_skills=skills, target_role=target_role)

    # Persist roadmap in SQLite
    roadmap_id = f"rd_{uuid.uuid4().hex[:12]}"
    now = datetime.now(timezone.utc).isoformat()
    steps_json = json.dumps([step.model_dump() for step in roadmap.steps])
    skills_json = json.dumps(skills)

    cursor.execute(
        """
        INSERT INTO roadmaps (id, user_id, target_role, current_skills, steps, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
        """,
        (roadmap_id, user_id, target_role, skills_json, steps_json, now),
    )
    conn.commit()
    conn.close()

    return roadmap


@router.get("/me", response_model=Roadmap)
async def get_latest_roadmap(
    user_id: str = Depends(get_current_user_id),
) -> Roadmap:
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT target_role, steps FROM roadmaps WHERE user_id = ? ORDER BY created_at DESC LIMIT 1",
        (user_id,),
    )
    row = cursor.fetchone()

    if not row:
        # If no saved roadmap exists, generate one automatically from profile
        cursor.execute("SELECT target_role, current_skills FROM profiles WHERE user_id = ?", (user_id,))
        p_row = cursor.fetchone()
        conn.close()

        target_role = (p_row["target_role"] if p_row and p_row["target_role"] else "Software Engineer")
        skills = []
        if p_row and p_row["current_skills"]:
            try:
                skills = json.loads(p_row["current_skills"])
            except Exception:
                skills = []

        return await create_roadmap(
            GenerateRoadmapRequest(target_role=target_role, current_skills=skills),
            user_id=user_id,
        )

    conn.close()
    try:
        steps_data = json.loads(row["steps"])
        return Roadmap(target_role=row["target_role"], steps=steps_data)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error parsing saved roadmap",
        )
