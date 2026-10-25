"""Authentication router: lightweight email + name authentication with SQLite."""
import json
import uuid
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel

from ..database import get_db_connection
from ..deps import create_access_token, get_current_user

router = APIRouter(prefix="/auth", tags=["auth"])


class AuthRequest(BaseModel):
    email: str
    name: str | None = None


class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    role: str


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


def _extract_name_from_email(email: str) -> str:
    username = email.split("@")[0].replace(".", " ").replace("_", " ").strip()
    return username.title() if username else "Student"


def _authenticate_or_create(email_raw: str, name_raw: str | None) -> AuthResponse:
    email_clean = email_raw.strip().lower()
    if not email_clean or "@" not in email_clean:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A valid email address is required",
        )

    display_name = name_raw.strip() if (name_raw and name_raw.strip()) else _extract_name_from_email(email_clean)

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT id, email, full_name, role FROM users WHERE email = ?", (email_clean,))
    user = cursor.fetchone()

    now = datetime.now(timezone.utc).isoformat()

    if user:
        user_id = user["id"]
        role = user["role"]
        # If a name was explicitly passed and user doesn't have one or user wants to update it
        if name_raw and name_raw.strip() and name_raw.strip() != user["full_name"]:
            cursor.execute("UPDATE users SET full_name = ? WHERE id = ?", (display_name, user_id))
            cursor.execute("UPDATE profiles SET name = ?, updated_at = ? WHERE user_id = ?", (display_name, now, user_id))
            conn.commit()
            final_name = display_name
        else:
            final_name = user["full_name"]
    else:
        # Create new user & profile
        user_id = f"user_{uuid.uuid4().hex[:12]}"
        role = "student"
        final_name = display_name

        cursor.execute(
            """
            INSERT INTO users (id, email, full_name, role, created_at)
            VALUES (?, ?, ?, ?, ?)
            """,
            (user_id, email_clean, final_name, role, now),
        )

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
                final_name,
                email_clean,
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

    conn.close()

    token = create_access_token({"sub": user_id, "email": email_clean, "role": role})

    return AuthResponse(
        access_token=token,
        token_type="bearer",
        user=UserResponse(
            id=user_id,
            email=email_clean,
            name=final_name,
            role=role,
        ),
    )


@router.post("/login", response_model=AuthResponse)
async def login(req: AuthRequest):
    """Authenticate or auto-register using only email and name."""
    return _authenticate_or_create(req.email, req.name)


@router.post("/signup", response_model=AuthResponse)
async def signup(req: AuthRequest):
    """Sign up using only email and name."""
    return _authenticate_or_create(req.email, req.name)


@router.get("/me", response_model=UserResponse)
async def get_me(user: dict = Depends(get_current_user)):
    """Return the currently authenticated user."""
    return UserResponse(
        id=user["id"],
        email=user["email"],
        name=user["full_name"],
        role=user["role"],
    )
