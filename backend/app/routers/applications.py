"""Applications router: track student applications pipeline in SQLite."""
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel, Field

from ..database import get_db_connection
from ..deps import get_current_user_id

router = APIRouter(prefix="/applications", tags=["applications"])

VALID_STATUSES = [
    "submitted",
    "resume_viewed",
    "shortlisted",
    "interview",
    "offer",
    "rejected",
]


class ApplicationResponse(BaseModel):
    id: int
    opportunity_id: int
    role: str
    company: str
    companyInitial: str
    accentColor: str
    date: str
    match: int
    status: str
    location: str
    stipend: str
    jobType: str
    notes: str | None = None


class CreateApplicationRequest(BaseModel):
    opportunity_id: int
    notes: str | None = None


class UpdateStatusRequest(BaseModel):
    status: str = Field(description="submitted, resume_viewed, shortlisted, interview, offer, rejected")


def _get_accent_color(company: str) -> str:
    palette = ["#00F0FF", "#EC1D24", "#FFD700", "#7C3AED", "#10B981", "#F59E0B"]
    idx = sum(ord(c) for c in company) % len(palette)
    return palette[idx]


def _row_to_app(row) -> ApplicationResponse:
    company = row["company"]
    company_initial = company[0].upper() if company else "O"
    accent_color = _get_accent_color(company)

    return ApplicationResponse(
        id=row["id"],
        opportunity_id=row["opportunity_id"],
        role=row["role"],
        company=company,
        companyInitial=company_initial,
        accentColor=accent_color,
        date=row["applied_date"],
        match=row["match"],
        status=row["status"],
        location=row["location"] or "Remote",
        stipend=row["stipend"] or "Competitive",
        jobType=row["job_type"] or "Internship",
        notes=row["notes"],
    )


@router.get("", response_model=list[ApplicationResponse])
async def list_applications(
    status_filter: str | None = Query(None, alias="status"),
    user_id: str = Depends(get_current_user_id),
) -> list[ApplicationResponse]:
    conn = get_db_connection()
    cursor = conn.cursor()

    query = "SELECT * FROM applications WHERE user_id = ?"
    params: list = [user_id]

    if status_filter:
        query += " AND status = ?"
        params.append(status_filter.lower())

    query += " ORDER BY id DESC"

    cursor.execute(query, params)
    rows = cursor.fetchall()
    conn.close()

    return [_row_to_app(r) for r in rows]


@router.post("", response_model=ApplicationResponse, status_code=status.HTTP_201_CREATED)
async def submit_application(
    req: CreateApplicationRequest,
    user_id: str = Depends(get_current_user_id),
) -> ApplicationResponse:
    conn = get_db_connection()
    cursor = conn.cursor()

    # 1. Look up opportunity
    cursor.execute("SELECT * FROM opportunities WHERE id = ?", (req.opportunity_id,))
    opp = cursor.fetchone()
    if not opp:
        conn.close()
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Opportunity {req.opportunity_id} not found",
        )

    # 2. Check if already applied
    cursor.execute(
        "SELECT * FROM applications WHERE user_id = ? AND opportunity_id = ?",
        (user_id, req.opportunity_id),
    )
    existing = cursor.fetchone()
    if existing:
        conn.close()
        return _row_to_app(existing)

    # 3. Create application
    now_formatted = datetime.now(timezone.utc).strftime("%B %d, %Y")
    notes = req.notes or "Dispatched via KickSkill Command Center"

    cursor.execute(
        """
        INSERT INTO applications (
            user_id, opportunity_id, role, company, status, match,
            location, stipend, job_type, applied_date, notes
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            user_id,
            opp["id"],
            opp["title"],
            opp["company"],
            "submitted",
            opp["match_score"],
            opp["location"],
            opp["stipend"],
            opp["mode"],
            now_formatted,
            notes,
        ),
    )
    conn.commit()
    app_id = cursor.lastrowid
    cursor.execute("SELECT * FROM applications WHERE id = ?", (app_id,))
    new_app = cursor.fetchone()
    conn.close()

    return _row_to_app(new_app)


@router.patch("/{app_id}/status", response_model=ApplicationResponse)
async def update_application_status(
    app_id: int,
    req: UpdateStatusRequest,
    user_id: str = Depends(get_current_user_id),
) -> ApplicationResponse:
    target_status = req.status.lower().strip()
    if target_status not in VALID_STATUSES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid status '{target_status}'. Must be one of: {', '.join(VALID_STATUSES)}",
        )

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM applications WHERE id = ? AND user_id = ?", (app_id, user_id))
    app_row = cursor.fetchone()
    if not app_row:
        conn.close()
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Application {app_id} not found",
        )

    cursor.execute("UPDATE applications SET status = ? WHERE id = ?", (target_status, app_id))
    conn.commit()

    cursor.execute("SELECT * FROM applications WHERE id = ?", (app_id,))
    updated = cursor.fetchone()
    conn.close()

    return _row_to_app(updated)


@router.delete("/{app_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_application(
    app_id: int,
    user_id: str = Depends(get_current_user_id),
):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM applications WHERE id = ? AND user_id = ?", (app_id, user_id))
    conn.commit()
    conn.close()
    return None
