import re
import uuid
import urllib.parse
from typing import Dict, Any, List, Optional, Tuple
from contracts.business import Business


def parse_address_components(raw_address: Optional[str], complete_addr_dict: Optional[Dict[str, Any]] = None) -> Tuple[Optional[str], Optional[str], Optional[str], Optional[str]]:
    """
    Extracts (city, state, postal_code, country) from structured complete_address dict or raw address string.
    Never fails or throws exceptions on unparseable formats.
    """
    city = None
    state = None
    postal_code = None
    country = None

    if complete_addr_dict and isinstance(complete_addr_dict, dict):
        city = complete_addr_dict.get("city") or None
        state = complete_addr_dict.get("state") or None
        postal_code = complete_addr_dict.get("postal_code") or None
        country = complete_addr_dict.get("country") or None

    if not raw_address:
        return city, state, postal_code, country

    # If any components are missing, attempt regex extraction from formatted string
    # e.g., "211 Walter Seaholm Dr LR 160, Austin, TX 78701, United States"
    if not (city and state and postal_code):
        us_match = re.search(r",\s*([^,]+),\s*([A-Z]{2})\s+(\d{5}(?:-\d{4})?)(?:,\s*([^,]+))?$", raw_address)
        if us_match:
            city = city or us_match.group(1).strip()
            state = state or us_match.group(2).strip()
            postal_code = postal_code or us_match.group(3).strip()
            if us_match.group(4):
                country = country or us_match.group(4).strip()
        else:
            # General fallback: comma split
            parts = [p.strip() for p in raw_address.split(",") if p.strip()]
            if len(parts) >= 3:
                country = country or parts[-1]
                # Check for state + zip in second to last part
                state_zip_match = re.search(r"([A-Za-z\s]+)\s+(\d{4,6})", parts[-2])
                if state_zip_match:
                    state = state or state_zip_match.group(1).strip()
                    postal_code = postal_code or state_zip_match.group(2).strip()
                    city = city or parts[-3]
                else:
                    city = city or parts[-2]

    return city, state, postal_code, country


def generate_business_id(data_id: Optional[str], place_id: Optional[str], name: str, address: Optional[str]) -> str:
    """Generates a stable, unique ID for a business."""
    if data_id and data_id.strip():
        clean_id = re.sub(r"[^a-zA-Z0-9_-]", "_", data_id.strip())
        return f"biz_{clean_id}"
    if place_id and place_id.strip():
        clean_id = re.sub(r"[^a-zA-Z0-9_-]", "_", place_id.strip())
        return f"biz_{clean_id}"
    # Fallback to UUID5 based on name + address
    key = f"{name.strip().lower()}_{(address or '').strip().lower()}"
    return f"biz_{uuid.uuid5(uuid.NAMESPACE_DNS, key).hex[:16]}"


def normalize_raw_record(raw: Dict[str, Any], raw_file_ref: Optional[str] = None) -> Optional[Business]:
    """
    Normalizes a single raw JSON dictionary from gosom/google-maps-scraper into a Business model.
    Tolerates partial records and missing optional fields without failing.
    """
    name = (raw.get("title") or raw.get("name") or "").strip()
    if not name:
        return None  # Discard empty records without a name

    raw_address = raw.get("address")
    complete_addr = raw.get("complete_address")
    city, state, postal_code, country = parse_address_components(raw_address, complete_addr)

    # Categories
    categories = raw.get("categories") or []
    if isinstance(categories, str):
        categories = [categories]
    category = raw.get("category") or (categories[0] if categories else None)

    # Coordinates
    lat = raw.get("latitude")
    lon = raw.get("longitude") if raw.get("longitude") is not None else raw.get("longtitude")
    try:
        lat = float(lat) if lat is not None else None
    except (ValueError, TypeError):
        lat = None
    try:
        lon = float(lon) if lon is not None else None
    except (ValueError, TypeError):
        lon = None

    # Contact Info
    phone = raw.get("phone")
    if phone:
        phone = phone.strip() or None

    website = raw.get("web_site") or raw.get("website")
    if website:
        website = website.strip() or None

    # Email
    email = None
    emails_list = raw.get("emails")
    if emails_list and isinstance(emails_list, list) and len(emails_list) > 0:
        email = str(emails_list[0]).strip() or None
    elif raw.get("email"):
        email = str(raw.get("email")).strip() or None

    # Ratings
    review_rating = raw.get("review_rating") or raw.get("rating")
    try:
        review_rating = float(review_rating) if review_rating is not None else None
    except (ValueError, TypeError):
        review_rating = None

    review_count = raw.get("review_count")
    try:
        review_count = int(review_count) if review_count is not None else None
    except (ValueError, TypeError):
        review_count = None

    # Identifiers & URLs
    data_id = raw.get("data_id")
    place_id = raw.get("place_id")
    biz_id = generate_business_id(data_id, place_id, name, raw_address)

    maps_url = raw.get("link")
    if not maps_url:
        query_param = urllib.parse.quote(f"{name} {raw_address or ''}".strip())
        maps_url = f"https://www.google.com/maps/search/?api=1&query={query_param}"

    return Business(
        id=biz_id,
        name=name,
        category=category,
        categories=categories,
        address=raw_address,
        city=city,
        state=state,
        country=country,
        postal_code=postal_code,
        latitude=lat,
        longitude=lon,
        phone=phone,
        email=email,
        website=website,
        rating=review_rating,
        review_count=review_count,
        google_place_id=place_id or data_id,
        google_maps_url=maps_url,
        source="google_maps_gosom",
        raw_data_ref=raw_file_ref,
    )


def normalize_raw_records(raw_items: Optional[List[Dict[str, Any]]], raw_file_ref: Optional[str] = None) -> List[Business]:
    """
    Normalizes a list of raw records into a list of Business models.
    Safely handles None, null, or empty lists.
    """
    businesses = []
    if not raw_items or not isinstance(raw_items, list):
        return businesses

    for item in raw_items:
        if isinstance(item, dict):
            biz = normalize_raw_record(item, raw_file_ref=raw_file_ref)
            if biz:
                businesses.append(biz)
    return businesses
