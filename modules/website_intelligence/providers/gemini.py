import os
import mimetypes
import logging
from pathlib import Path
from typing import Type, TypeVar, Optional, List
from pydantic import BaseModel, ValidationError

from config.settings import GEMINI_MODEL, GEMINI_API_KEY
from .base import AIProvider

logger = logging.getLogger(__name__)

T = TypeVar("T", bound=BaseModel)


class GeminiProvider(AIProvider):
    """
    Google Gemini Model Provider adapter using the official google-genai SDK.
    
    Defaults to 'gemini-3.5-flash-lite' with multimodal screenshot reasoning support.
    """

    def __init__(
        self,
        model_name: Optional[str] = None,
        api_key: Optional[str] = None,
    ):
        self._model_name = model_name or GEMINI_MODEL
        self._api_key = api_key or GEMINI_API_KEY or os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")

    @property
    def provider_name(self) -> str:
        return "gemini"

    @property
    def model_name(self) -> str:
        return self._model_name

    def _get_client(self):
        """Initializes and returns the official Google GenAI Client."""
        if not self._api_key:
            raise ValueError(
                "Gemini API key is missing. Please set GEMINI_API_KEY or GOOGLE_API_KEY "
                "in your environment variables or in a .env file."
            )
        try:
            from google import genai
            return genai.Client(api_key=self._api_key)
        except ImportError as e:
            raise ImportError(
                "The 'google-genai' SDK is required for GeminiProvider. "
                "Install it via: pip install google-genai"
            ) from e

    def _load_image_parts(self, image_paths: List[str]):
        """Loads local screenshot files and wraps them into google.genai types.Part objects."""
        from google.genai import types

        parts = []
        for path_str in image_paths:
            path = Path(path_str)
            if not path.exists() or not path.is_file():
                logger.warning("Screenshot image file not found: %s", path_str)
                continue

            # Determine mime type
            mime_type, _ = mimetypes.guess_type(path.name)
            if not mime_type or not mime_type.startswith("image/"):
                mime_type = "image/png"

            try:
                with open(path, "rb") as f:
                    image_bytes = f.read()

                if len(image_bytes) == 0:
                    logger.warning("Empty screenshot file: %s", path_str)
                    continue

                part = types.Part.from_bytes(data=image_bytes, mime_type=mime_type)
                parts.append(part)
                logger.info("Loaded visual screenshot for multimodal analysis: %s (%d bytes)", path.name, len(image_bytes))
            except Exception as ex:
                logger.warning("Failed to load screenshot %s: %s", path_str, ex)

        return parts

    def generate_structured(
        self,
        prompt: str,
        system_instruction: str,
        response_schema: Type[T],
        image_paths: Optional[List[str]] = None,
    ) -> T:
        """
        Calls Gemini with structured schema constraint and optional visual screenshot inputs.
        """
        from google.genai import types

        client = self._get_client()

        # Prepare contents: prompt text + optional screenshot image parts
        contents = [prompt]
        if image_paths:
            image_parts = self._load_image_parts(image_paths)
            if image_parts:
                contents.extend(image_parts)
                logger.info(
                    "Sending %d visual screenshot(s) along with text prompt to model '%s'",
                    len(image_parts),
                    self._model_name,
                )

        # Configure structured output using Pydantic schema
        config = types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=response_schema,
            system_instruction=system_instruction,
            temperature=0.2,
        )

        try:
            logger.info("Calling Gemini API with model: %s", self._model_name)
            response = client.models.generate_content(
                model=self._model_name,
                contents=contents,
                config=config,
            )

            raw_text = response.text
            if not raw_text:
                raise ValueError("Received empty response text from Gemini API")

            # Parse and validate with Pydantic contract
            validated = response_schema.model_validate_json(raw_text)
            return validated

        except ValidationError as val_err:
            logger.error("Failed to validate response against contract: %s", val_err)
            raise RuntimeError(f"Model output schema validation failed: {val_err}") from val_err
        except Exception as err:
            logger.error("Gemini API call failed: %s", err)
            raise RuntimeError(f"Gemini API error during structured generation: {err}") from err
