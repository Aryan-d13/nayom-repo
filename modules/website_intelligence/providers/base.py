import abc
from typing import Type, TypeVar, Optional, List
from pydantic import BaseModel

T = TypeVar("T", bound=BaseModel)


class AIProvider(abc.ABC):
    """
    Abstract Base Class for AI Model Providers.
    
    Decouples the Website Intelligence analysis pipeline from specific AI SDKs or APIs
    (Gemini, OpenAI, Anthropic, Mock, etc.).
    """

    @property
    @abc.abstractmethod
    def provider_name(self) -> str:
        """Name identifier of the provider (e.g. 'gemini', 'mock')."""
        pass

    @property
    @abc.abstractmethod
    def model_name(self) -> str:
        """Exact model string used by the provider."""
        pass

    @abc.abstractmethod
    def generate_structured(
        self,
        prompt: str,
        system_instruction: str,
        response_schema: Type[T],
        image_paths: Optional[List[str]] = None,
    ) -> T:
        """
        Executes a prompt against the AI model and returns an instance of response_schema.
        
        Args:
            prompt: Text prompt containing structured website content.
            system_instruction: System prompt framing the role and rules.
            response_schema: Pydantic model class to constrain output structure.
            image_paths: Optional list of file paths to screenshot images for visual multimodal reasoning.
            
        Returns:
            Validated instance of response_schema.
        """
        pass
