"""Personalized Outreach Email Generator module for Nayom-Automation."""
from .generator import EmailGenerator
from .prompts import build_email_prompt, SYSTEM_INSTRUCTION, PROMPT_VERSION

__all__ = [
    "EmailGenerator",
    "build_email_prompt",
    "SYSTEM_INSTRUCTION",
    "PROMPT_VERSION",
]
