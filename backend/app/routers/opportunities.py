"""Opportunities router: browse, search, and manage career listings in SQLite."""
import json
from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, Query, status
from pydantic import BaseModel

from ..database import get_db_connection

router = APIRouter(prefix="/opportunities", tags=["opportunities"])


class OpportunityResponse(BaseModel):
    id: int
    title: str
    company: str
    location: str
    mode: str
    match: int
    skills: list[str]
    skillGap: list[str]
    about: str
    responsibilities: list[str]
    eligibility: str
    deadline: str
    whyMatch: str
    stipend: str


class CreateOpportunityRequest(BaseModel):
    title: str
    company: str
    location: str
    mode: str  # "Internship", "Full-time", "Project"
    match_score: int = 85
    skills: list[str] = []
    skill_gap: list[str] = []
    about: str
    responsibilities: list[str] = []
    eligibility: str
    deadline: str
    why_match: str
    stipend: str = "₹25,000 / mo"


def _row_to_opp(row) -> OpportunityResponse:
    def parse_json(val, default):
        if not val:
            return default
        try:
            return json.loads(val)
        except Exception:
            return default

    return OpportunityResponse(
        id=row["id"],
        title=row["title"],
        company=row["company"],
        location=row["location"],
        mode=row["mode"],
        match=row["match_score"],
        skills=parse_json(row["skills"], []),
        skillGap=parse_json(row["skill_gap"], []),
        about=row["about"],
        responsibilities=parse_json(row["responsibilities"], []),
        eligibility=row["eligibility"],
        deadline=row["deadline"],
        whyMatch=row["why_match"],
        stipend=row["stipend"],
    )


@router.get("", response_model=list[OpportunityResponse])
async def list_opportunities(
    q: str | None = Query(None, description="Search keyword for role, company, or skills"),
    mode: str | None = Query(None, description="Mode: Internship, Full-time, Project"),
    tab: str | None = Query(None, description="Recommended, Internships, Jobs, Projects"),
    min_match: int | None = Query(None, description="Minimum match percentage"),
) -> list[OpportunityResponse]:
    conn = get_db_connection()
    cursor = conn.cursor()

    query = "SELECT * FROM opportunities WHERE 1=1"
    params: list = []

    if mode:
        query += " AND LOWER(mode) = LOWER(?)"
        params.append(mode)

    if tab:
        tab_lower = tab.lower()
        if tab_lower == "internships":
            query += " AND LOWER(mode) LIKE '%intern%'"
        elif tab_lower in ["jobs", "full-time"]:
            query += " AND (LOWER(mode) LIKE '%full%' OR LOWER(mode) LIKE '%job%')"
        elif tab_lower == "projects":
            query += " AND LOWER(mode) LIKE '%project%'"
        elif tab_lower == "recommended":
            query += " AND match_score >= 80"

    if min_match is not None:
        query += " AND match_score >= ?"
        params.append(min_match)

    if q and q.strip():
        term = f"%{q.strip().lower()}%"
        query += " AND (LOWER(title) LIKE ? OR LOWER(company) LIKE ? OR LOWER(skills) LIKE ? OR LOWER(location) LIKE ?)"
        params.extend([term, term, term, term])

    query += " ORDER BY match_score DESC"

    cursor.execute(query, params)
    rows = cursor.fetchall()
    conn.close()

    return [_row_to_opp(r) for r in rows]


@router.get("/{opp_id}", response_model=OpportunityResponse)
async def get_opportunity(opp_id: int) -> OpportunityResponse:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM opportunities WHERE id = ?", (opp_id,))
    row = cursor.fetchone()
    conn.close()

    if not row:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Opportunity with ID {opp_id} not found",
        )

    return _row_to_opp(row)


@router.post("", response_model=OpportunityResponse, status_code=status.HTTP_201_CREATED)
async def create_opportunity(req: CreateOpportunityRequest) -> OpportunityResponse:
    conn = get_db_connection()
    cursor = conn.cursor()
    now = datetime.now(timezone.utc).isoformat()

    cursor.execute(
        """
        INSERT INTO opportunities (
            title, company, location, mode, match_score, skills, skill_gap,
            about, responsibilities, eligibility, deadline, why_match, stipend, created_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            req.title.strip(),
            req.company.strip(),
            req.location.strip(),
            req.mode.strip(),
            req.match_score,
            json.dumps(req.skills),
            json.dumps(req.skill_gap),
            req.about.strip(),
            json.dumps(req.responsibilities),
            req.eligibility.strip(),
            req.deadline.strip(),
            req.why_match.strip(),
            req.stipend.strip(),
            now,
        ),
    )
    conn.commit()
    opp_id = cursor.lastrowid
    cursor.execute("SELECT * FROM opportunities WHERE id = ?", (opp_id,))
    row = cursor.fetchone()
    conn.close()

    return _row_to_opp(row)
