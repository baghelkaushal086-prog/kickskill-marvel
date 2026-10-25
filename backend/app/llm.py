"""Shared Groq client. OpenAI-compatible, streaming + JSON mode supported."""
from functools import lru_cache
from typing import Optional

from .config import settings

try:
    from groq import AsyncGroq
    GROQ_AVAILABLE = True
except ImportError:
    GROQ_AVAILABLE = False
    AsyncGroq = None  # type: ignore


def is_groq_available() -> bool:
    return GROQ_AVAILABLE and bool(settings.groq_api_key and settings.groq_api_key.strip())


@lru_cache
def get_groq() -> Optional["AsyncGroq"]:
    if not is_groq_available():
        return None
    return AsyncGroq(api_key=settings.groq_api_key.strip())
