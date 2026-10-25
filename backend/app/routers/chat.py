"""Chat endpoint: streams LLM responses to the frontend via SSE."""
import asyncio
import json
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

from ..config import settings
from ..llm import get_groq, is_groq_available

router = APIRouter(prefix="/chat", tags=["chat"])


class ChatMessage(BaseModel):
    role: str = Field(pattern="^(user|assistant|system)$")
    content: str


class ChatRequest(BaseModel):
    messages: list[ChatMessage]
    page_context: str | None = None  # e.g. "opportunities", "skills"


SYSTEM_PROMPT = """You are KickSkill (powered by Stark Career Intelligence), a proactive, world-class career assistant for students and engineers.
You specialize in:
- Uncovering high-match opportunities and internships
- Precision skill-gap analysis (identifying which tools give maximum leverage)
- Step-by-step career roadmaps from current skills to target roles
- Resume critique and portfolio alignment for verified skill passports
Be concise, inspiring, tactical, and actionable. When detailing structured roadmaps or steps, format cleanly with markdown.
"""


def _generate_simulated_response(user_query: str, page_context: str | None) -> str:
    q = user_query.lower()
    if "intern" in q or "job" in q or "opportunity" in q:
        return (
            "### 🎯 Top Opportunity Matches for Your Profile\n\n"
            "Based on your verified skills (**Python, Machine Learning, SQL**), here are the highest-leverage roles available:\n\n"
            "1. **AI & Machine Learning Intern** at *Anthropic / Autonomous Labs*\n"
            "   • **Match Rating**: `94%`\n"
            "   • **Key Requirements**: Python, PyTorch, Distributed Pipelines\n"
            "   • **Skill Gap**: Docker containerization (+4% match potential)\n\n"
            "2. **Data Science & Quantum Computing Fellow** at *DeepMind Quantum Labs*\n"
            "   • **Match Rating**: `89%`\n"
            "   • **Key Requirements**: Python, Statistical Modeling, Data Visualization\n"
            "   • **Skill Gap**: Zero Gaps (Ready for immediate dispatch)\n\n"
            "3. **Frontend Systems Engineer** at *Linear / Design Systems*\n"
            "   • **Match Rating**: `86%`\n"
            "   • **Key Requirements**: React, TypeScript, CSS Micro-interactions\n\n"
            "👉 *Tip: Head to the **Opportunities** page and click 'Submit Application' to dispatch your verified Skill Passport directly to hiring teams.*"
        )
    elif "skill" in q or "gap" in q or "audit" in q:
        return (
            "### ⚡ Stark Career Skill Gap Telemetry\n\n"
            "Here is the priority breakdown for your target role (**AI Engineer / Autonomous Systems**):\n\n"
            "• **Verified Strengths**: Python (`86%`), SQL (`81%`), React (`68%`)\n"
            "• **Critical Next Milestone**: **Docker & Container Deployment**\n"
            "  *Why?* 68% of production machine learning postings require containerized endpoints.\n"
            "• **Secondary Leverage**: **PyTorch Mixed-Precision** (currently at `42%`, target `70%`).\n\n"
            "📈 *Action Plan: Completing the PyTorch fundamentals track in your **Learning** hub will elevate your composite match score from 74% to 94%.*"
        )
    elif "roadmap" in q or "learn" in q or "plan" in q:
        return (
            "### 🗺️ Recommended 12-Week AI Systems Roadmap\n\n"
            "**Stage 1: Core Mathematical ML & Tensors (Weeks 1-3)**\n"
            "• Deep dive into gradient descent, backpropagation, and PyTorch autograd.\n\n"
            "**Stage 2: Production API Engineering (Weeks 4-6)**\n"
            "• Build high-throughput async prediction servers with **FastAPI** and pydantic validation.\n\n"
            "**Stage 3: Containerization & Cloud Deployment (Weeks 7-9)**\n"
            "• Package models into multi-stage Docker images and deploy serverless endpoints on AWS.\n\n"
            "**Stage 4: Capstone Portfolio & Verification (Weeks 10-12)**\n"
            "• Deploy an autonomous agent lab to secure your verified **Mind Stone** on your Skill Passport."
        )
    else:
        return (
            "### 🛡️ Stark Tactical Career Guide Online\n\n"
            f"I have analyzed your query regarding *'{user_query}'* against current hiring telemetry.\n\n"
            "Here is how KickSkill can accelerate your career readiness today:\n"
            "• **Auditing Skill Gaps**: Compare your current capabilities directly with job listings.\n"
            "• **Personalized Learning**: Follow structured milestones in the **Learning** portal.\n"
            "• **One-Click Verified Applications**: Apply directly with your cryptographically verified Skill Passport.\n\n"
            "*Ask me anything specific—for example: 'Find AI internships', 'What skills do I need for Anthropic?', or 'Review my roadmap'.*"
        )


@router.post("")
async def chat(req: ChatRequest) -> StreamingResponse:
    messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    if req.page_context:
        messages[0]["content"] += f"\nUser is currently on the '{req.page_context}' page."
    messages += [m.model_dump() for m in req.messages]

    last_user_query = ""
    for m in reversed(req.messages):
        if m.role == "user":
            last_user_query = m.content
            break

    async def stream():
        if not is_groq_available():
            simulated_text = _generate_simulated_response(last_user_query, req.page_context)
            words = simulated_text.split(" ")
            for i, word in enumerate(words):
                chunk = word + (" " if i < len(words) - 1 else "")
                payload = json.dumps({"text": chunk})
                yield f"data: {payload}\n\n"
                await asyncio.sleep(0.025)
            yield "data: [DONE]\n\n"
            return

        groq = get_groq()
        try:
            llm_stream = await groq.chat.completions.create(
                model=settings.chat_model,
                messages=messages,  # type: ignore[arg-type]
                stream=True,
                temperature=0.7,
                max_tokens=1024,
            )
            async for chunk in llm_stream:
                delta = chunk.choices[0].delta.content
                if delta:
                    payload = json.dumps({"text": delta})
                    yield f"data: {payload}\n\n"
            yield "data: [DONE]\n\n"
        except Exception as e:
            err_payload = json.dumps({"text": f"\n\n[Tactical Relay Notice: {str(e)}]"})
            yield f"data: {err_payload}\n\n"
            yield "data: [DONE]\n\n"

    return StreamingResponse(stream(), media_type="text/event-stream")
