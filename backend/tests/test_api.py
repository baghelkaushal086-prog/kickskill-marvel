"""Automated tests for KickSkill SQLite backend with email + name auth."""
import uuid
import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.database import init_db

client = TestClient(app)


@pytest.fixture(autouse=True)
def setup_database():
    init_db()


def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "connected (sqlite)" in data["database"]


def test_seeded_demo_login():
    response = client.post(
        "/auth/login",
        json={"email": "demo@kickskill.com"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["user"]["email"] == "demo@kickskill.com"
    assert data["user"]["name"] == "Tony Stark"


def test_email_and_name_auth_flow():
    email = f"peter.{uuid.uuid4().hex[:8]}@kickskill.com"
    
    # 1. Login/Signup with just email and name
    res = client.post("/auth/login", json={"email": email, "name": "Peter Parker"})
    assert res.status_code == 200
    data = res.json()
    assert "access_token" in data
    assert data["user"]["name"] == "Peter Parker"
    assert data["user"]["email"] == email

    token = data["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Check /auth/me
    res_me = client.get("/auth/me", headers=headers)
    assert res_me.status_code == 200
    assert res_me.json()["email"] == email
    assert res_me.json()["name"] == "Peter Parker"

    # 3. Check initial /profile/me
    res_prof = client.get("/profile/me", headers=headers)
    assert res_prof.status_code == 200
    prof = res_prof.json()
    assert prof["name"] == "Peter Parker"
    assert prof["email"] == email
    assert prof["current_skills"] == []

    # 4. Update profile details & skills
    prof["target_role"] = "AI Robotics Specialist"
    prof["current_skills"] = ["Python", "Computer Vision", "Robotics"]
    res_update = client.put("/profile/me", json=prof, headers=headers)
    assert res_update.status_code == 200
    updated = res_update.json()
    assert updated["target_role"] == "AI Robotics Specialist"
    assert "Computer Vision" in updated["current_skills"]

    # 5. Public profile read
    user_id = data["user"]["id"]
    res_public = client.get(f"/profile/{user_id}")
    assert res_public.status_code == 200
    assert res_public.json()["target_role"] == "AI Robotics Specialist"


def test_login_without_name_infers_name():
    # Providing just email auto-infers title-cased name
    email = f"bruce.banner.{uuid.uuid4().hex[:4]}@kickskill.com"
    res = client.post("/auth/login", json={"email": email})
    assert res.status_code == 200
    data = res.json()
    assert "Bruce Banner" in data["user"]["name"]


def test_roadmap_flow():
    # Login as demo user with just email
    login_res = client.post(
        "/auth/login",
        json={"email": "demo@kickskill.com"},
    )
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Generate roadmap
    gen_res = client.post(
        "/roadmap/generate",
        json={"target_role": "AI Research Scientist", "current_skills": ["Python", "Linear Algebra"]},
        headers=headers,
    )
    assert gen_res.status_code == 200
    roadmap = gen_res.json()
    assert roadmap["target_role"] == "AI Research Scientist"
    assert len(roadmap["steps"]) > 0

    # Fetch latest saved roadmap
    saved_res = client.get("/roadmap/me", headers=headers)
    assert saved_res.status_code == 200
    assert saved_res.json()["target_role"] == "AI Research Scientist"


def test_chat_stream():
    chat_payload = {
        "messages": [{"role": "user", "content": "How do I become an AI engineer?"}],
        "page_context": "opportunities",
    }
    res = client.post("/chat", json=chat_payload)
    assert res.status_code == 200
    assert "text/event-stream" in res.headers["content-type"]
    assert len(res.text) > 0


def test_opportunities_list_and_search():
    # 1. Get all
    res = client.get("/opportunities")
    assert res.status_code == 200
    opps = res.json()
    assert len(opps) >= 6

    # 2. Search query
    res_q = client.get("/opportunities?q=Anthropic")
    assert res_q.status_code == 200
    q_data = res_q.json()
    assert len(q_data) >= 1
    assert "Anthropic" in q_data[0]["company"]

    # 3. Filter mode
    res_mode = client.get("/opportunities?mode=Internship")
    assert res_mode.status_code == 200
    for item in res_mode.json():
        assert "intern" in item["mode"].lower()

    # 4. Get by ID
    res_single = client.get(f"/opportunities/{opps[0]['id']}")
    assert res_single.status_code == 200
    assert res_single.json()["id"] == opps[0]["id"]


def test_applications_lifecycle():
    # 1. Login
    login_res = client.post("/auth/login", json={"email": "demo@kickskill.com"})
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Submit application for opportunity #2
    apply_res = client.post("/applications", json={"opportunity_id": 2, "notes": "Frontend interest"}, headers=headers)
    assert apply_res.status_code in [200, 201]
    app_data = apply_res.json()
    assert app_data["company"] == "Linear / Design Systems"
    app_id = app_data["id"]

    # 3. List applications
    list_res = client.get("/applications", headers=headers)
    assert list_res.status_code == 200
    my_apps = list_res.json()
    assert any(a["id"] == app_id for a in my_apps)

    # 4. Update status
    patch_res = client.patch(f"/applications/{app_id}/status", json={"status": "interview"}, headers=headers)
    assert patch_res.status_code == 200
    assert patch_res.json()["status"] == "interview"
