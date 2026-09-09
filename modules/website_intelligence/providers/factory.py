import os
from typing import Optional, Dict, Type
from config.settings import DEFAULT_AI_PROVIDER, GEMINI_MODEL
from .base import AIProvider
from .gemini import GeminiProvider
from .mock import MockProvider

_PROVIDER_REGISTRY: Dict[str, Type[AIProvider]] = {
    "gemini": GeminiProvider,
    "mock": MockProvider,
}


def register_provider(name: str, provider_cls: Type[AIProvider]) -> None:
    """Registers a new AI Provider implementation under a string name."""
    _PROVIDER_REGISTRY[name.lower().strip()] = provider_cls


def get_provider(
    provider_name: Optional[str] = None,
    model_name: Optional[str] = None,
    api_key: Optional[str] = None,
    **kwargs,
) -> AIProvider:
    """
    Factory function to instantiate the configured AI Provider.
    
    Args:
        provider_name: 'gemini', 'mock', or any registered provider name. Defaults to settings.DEFAULT_AI_PROVIDER.
        model_name: Model string (e.g. 'gemini-3.5-flash-lite'). Defaults to settings.GEMINI_MODEL.
        api_key: API Key string. If omitted, uses GEMINI_API_KEY / GOOGLE_API_KEY.
        **kwargs: Additional parameters passed to provider constructor.
    """
    name = (provider_name or os.environ.get("AI_PROVIDER") or DEFAULT_AI_PROVIDER).lower().strip()
    
    if name not in _PROVIDER_REGISTRY:
        raise ValueError(
            f"Unknown AI Provider '{name}'. Available providers: {list(_PROVIDER_REGISTRY.keys())}"
        )
    
    provider_cls = _PROVIDER_REGISTRY[name]
    
    if name == "gemini":
        model = model_name or GEMINI_MODEL
        return GeminiProvider(model_name=model, api_key=api_key, **kwargs)
    elif name == "mock":
        model = model_name or "mock-gemini-3.5-flash-lite"
        return MockProvider(model_name=model, **kwargs)
    else:
        try:
            return provider_cls(model_name=model_name, api_key=api_key, **kwargs)
        except TypeError:
            try:
                return provider_cls(model_name=model_name, **kwargs)
            except TypeError:
                return provider_cls()

