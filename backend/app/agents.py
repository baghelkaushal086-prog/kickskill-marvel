"""Career-agent flows built on Groq structured outputs (JSON mode) with SQLite persistence."""
import json
from pydantic import BaseModel
from .config import settings
from .llm import get_groq, is_groq_available


class RoadmapStep(BaseModel):
    title: str
    description: str
    skills: list[str]
    duration_weeks: int


class Roadmap(BaseModel):
    target_role: str
    steps: list[RoadmapStep]


def _build_fallback_roadmap(current_skills: list[str], target_role: str) -> Roadmap:
    """Deterministic, high-readiness roadmap when LLM key is not configured."""
    known = set(s.strip().lower() for s in current_skills)

    steps = [
        RoadmapStep(
            title="Core Domain Foundations",
            description=f"Strengthen essential foundational paradigms required for high-impact {target_role} positions.",
            skills=[s for s in ["Data Structures", "System Design", "Python", "API Architecture"] if s.lower() not in known][:3] or ["Advanced Algorithms"],
            duration_weeks=3,
        ),
        RoadmapStep(
            title="Specialized Tooling & Production Pipelines",
            description=f"Master key production tools, frameworks, and workflows aligned with {target_role}.",
            skills=["Docker", "Cloud Deployments", "Monitoring & Evaluation", "CI/CD"],
            duration_weeks=4,
        ),
        RoadmapStep(
            title="Capstone Portfolio & Verification",
            description=f"Build and deploy an end-to-end production-grade capstone project showcasing verified capabilities.",
            skills=["End-to-End System Integration", "Technical Documentation", "Performance Optimization"],
            duration_weeks=3,
        ),
        RoadmapStep(
            title="Interview Preparation & Match Targeting",
            description="Complete mock technical interviews, behavioral narratives, and tailor applications for target roles.",
            skills=["Technical Interviewing", "Portfolio Walkthrough", "System Architecture Defense"],
            duration_weeks=2,
        ),
    ]

    return Roadmap(target_role=target_role, steps=steps)


async def generate_roadmap(
    current_skills: list[str], target_role: str
) -> Roadmap:
    if not is_groq_available():
        return _build_fallback_roadmap(current_skills, target_role)

    groq = get_groq()
    try:
        completion = await groq.chat.completions.create(
            model=settings.chat_model,
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a career coach. Produce a JSON object matching this schema: "
                        '{"target_role": string, "steps": [{"title": string, "description": string, '
                        '"skills": [string], "duration_weeks": int}]}'
                    ),
                },
                {
                    "role": "user",
                    "content": (
                        f"Current skills: {', '.join(current_skills) or 'none'}\n"
                        f"Target role: {target_role}"
                    ),
                },
            ],
            response_format={"type": "json_object"},
            temperature=0.4,
        )
        content = completion.choices[0].message.content or "{}"
        return Roadmap.model_validate_json(content)
    except Exception:
        # Graceful fallback on LLM quota or connection issue
        return _build_fallback_roadmap(current_skills, target_role)
