from datetime import datetime, timezone
from typing import Optional, List
from pydantic import BaseModel, Field, model_validator


class Business(BaseModel):
    """
    Standardized Business Contract for Nayom-Automation.
    
    Tolerates partial records with missing optional fields.
    Records missing optional data log validation warnings rather than raising exceptions.
    
    Usability Rule:
    A business is considered `usable = True` if it has a `name` and at least ONE contact method
    (`phone` OR `email` OR `website`). If none are present, `usable = False`.
    """
    id: str
    name: str
    category: Optional[str] = None
    categories: List[str] = Field(default_factory=list)
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    postal_code: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    website: Optional[str] = None
    rating: Optional[float] = None
    review_count: Optional[int] = None
    google_place_id: Optional[str] = None
    google_maps_url: Optional[str] = None
    source: str = "google_maps_gosom"
    discovered_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    usable: bool = True
    validation_warnings: List[str] = Field(default_factory=list)
    raw_data_ref: Optional[str] = None

    @model_validator(mode="after")
    def compute_usability_and_warnings(self) -> "Business":
        has_phone = bool(self.phone and self.phone.strip())
        has_email = bool(self.email and self.email.strip())
        has_website = bool(self.website and self.website.strip())

        # Determine usability based on contact info presence
        if not (has_phone or has_email or has_website):
            self.usable = False
            if "No contact method available (missing phone, email, and website)" not in self.validation_warnings:
                self.validation_warnings.append("No contact method available (missing phone, email, and website)")
        else:
            self.usable = True

        # Check and record missing optional fields
        warnings = list(self.validation_warnings)
        if not self.address:
            warnings.append("Missing full address")
        if not self.city:
            warnings.append("Missing city")
        if not self.state:
            warnings.append("Missing state")
        if not self.postal_code:
            warnings.append("Missing postal code")
        if self.latitude is None or self.longitude is None:
            warnings.append("Missing geo coordinates")
        if not has_phone:
            warnings.append("Missing phone number")
        if not has_website:
            warnings.append("Missing website")
        if not has_email:
            warnings.append("Missing email")
        if self.rating is None:
            warnings.append("Missing rating")
        if self.review_count is None:
            warnings.append("Missing review count")

        # Deduplicate warnings while preserving order
        seen = set()
        deduped = []
        for w in warnings:
            if w not in seen:
                seen.add(w)
                deduped.append(w)
        self.validation_warnings = deduped
        return self
