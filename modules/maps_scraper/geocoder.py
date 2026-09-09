import re
import math
import urllib.parse
import urllib.request
import json
import logging
from typing import Optional, Tuple, List, Dict, Any

logger = logging.getLogger(__name__)

# Bounding box format: (min_lat, min_lon, max_lat, max_lon)
OFFLINE_LOCATIONS: Dict[str, Tuple[float, float, Tuple[float, float, float, float]]] = {
    # Major US States
    "maryland": (39.0458, -76.6413, (37.8865, -79.4873, 39.7230, -74.9852)),
    "texas": (31.9686, -99.9018, (25.8371, -106.6466, 36.5007, -93.5080)),
    "california": (36.7783, -119.4179, (32.5288, -124.4820, 42.0095, -114.1312)),
    "florida": (27.6648, -81.5158, (24.3963, -87.6349, 31.0008, -80.0314)),
    "new york state": (40.7128, -74.0060, (40.4774, -79.7622, 45.0159, -71.7775)),
    "illinois": (40.6331, -89.3985, (36.9703, -91.5131, 42.5083, -87.0199)),
    "washington": (47.7511, -120.7401, (45.5435, -124.8489, 49.0024, -116.9156)),
    "massachusetts": (42.4072, -71.3824, (41.1871, -73.5081, 42.8868, -69.8589)),
    "georgia": (32.1656, -82.9001, (30.3556, -85.6052, 35.0008, -80.7514)),
    "colorado": (39.5501, -105.7821, (36.9924, -109.0603, 41.0034, -102.0415)),
    "arizona": (34.0489, -111.0937, (31.3322, -114.8166, 37.0043, -109.0452)),
    # Major Cities
    "austin, tx": (30.2672, -97.7431, (30.0985, -97.9368, 30.5166, -97.5605)),
    "austin texas": (30.2672, -97.7431, (30.0985, -97.9368, 30.5166, -97.5605)),
    "austin": (30.2672, -97.7431, (30.0985, -97.9368, 30.5166, -97.5605)),
    "houston, tx": (29.7604, -95.3698, (29.5233, -95.7881, 30.1107, -95.0145)),
    "houston texas": (29.7604, -95.3698, (29.5233, -95.7881, 30.1107, -95.0145)),
    "houston": (29.7604, -95.3698, (29.5233, -95.7881, 30.1107, -95.0145)),
    "dallas, tx": (32.7767, -96.7970, (32.6183, -96.9996, 33.0238, -96.5544)),
    "dallas texas": (32.7767, -96.7970, (32.6183, -96.9996, 33.0238, -96.5544)),
    "dallas": (32.7767, -96.7970, (32.6183, -96.9996, 33.0238, -96.5544)),
    "san antonio, tx": (29.4241, -98.4936, (29.2084, -98.7774, 29.6896, -98.3182)),
    "san antonio": (29.4241, -98.4936, (29.2084, -98.7774, 29.6896, -98.3182)),
    "baltimore, md": (39.2904, -76.6122, (39.1972, -76.7115, 39.3722, -76.5297)),
    "baltimore maryland": (39.2904, -76.6122, (39.1972, -76.7115, 39.3722, -76.5297)),
    "baltimore": (39.2904, -76.6122, (39.1972, -76.7115, 39.3722, -76.5297)),
    "new york, ny": (40.7128, -74.0060, (40.4960, -74.2591, 40.9153, -73.7003)),
    "new york": (40.7128, -74.0060, (40.4960, -74.2591, 40.9153, -73.7003)),
    "nyc": (40.7128, -74.0060, (40.4960, -74.2591, 40.9153, -73.7003)),
    "los angeles, ca": (34.0522, -118.2437, (33.7037, -118.6682, 34.3373, -118.1553)),
    "los angeles": (34.0522, -118.2437, (33.7037, -118.6682, 34.3373, -118.1553)),
    "chicago, il": (41.8781, -87.6298, (41.6443, -87.9402, 42.0231, -87.5240)),
    "chicago": (41.8781, -87.6298, (41.6443, -87.9402, 42.0231, -87.5240)),
    "miami, fl": (25.7617, -80.1918, (25.7091, -80.3198, 25.8558, -80.1390)),
    "miami": (25.7617, -80.1918, (25.7091, -80.3198, 25.8558, -80.1390)),
    "seattle, wa": (47.6062, -122.3321, (47.4955, -122.4360, 47.7341, -122.2244)),
    "seattle": (47.6062, -122.3321, (47.4955, -122.4360, 47.7341, -122.2244)),
    "denver, co": (39.7392, -104.9903, (39.6144, -105.1099, 39.9142, -104.6003)),
    "denver": (39.7392, -104.9903, (39.6144, -105.1099, 39.9142, -104.6003)),
    "san francisco, ca": (37.7749, -122.4194, (37.7081, -122.5179, 37.8324, -122.3570)),
    "san francisco": (37.7749, -122.4194, (37.7081, -122.5179, 37.8324, -122.3570)),
    "boston, ma": (42.3601, -71.0589, (42.2279, -71.1912, 42.3974, -70.9860)),
    "boston": (42.3601, -71.0589, (42.2279, -71.1912, 42.3974, -70.9860)),
    "atlanta, ga": (33.7490, -84.3880, (33.6478, -84.5511, 33.8869, -84.2896)),
    "atlanta": (33.7490, -84.3880, (33.6478, -84.5511, 33.8869, -84.2896)),
}


def extract_location_from_query(query: str) -> str:
    """Extracts the location portion of a query (e.g. 'Dentists in Maryland' -> 'Maryland')."""
    patterns = [
        r"(?:in|near|around|at|for)\s+([a-zA-Z\s,]+)$",
        r",\s*([a-zA-Z\s,]+)$",
    ]
    for pattern in patterns:
        match = re.search(pattern, query, re.IGNORECASE)
        if match:
            return match.group(1).strip()
    return query.strip()


def geocode_location_info(location_str: str) -> Optional[Tuple[float, float, Tuple[float, float, float, float]]]:
    """
    Returns (center_lat, center_lon, (min_lat, min_lon, max_lat, max_lon)).
    Checks offline dictionary first, then falls back to OpenStreetMap Nominatim.
    """
    cleaned = location_str.lower().strip()

    # 1. Offline lookup
    if cleaned in OFFLINE_LOCATIONS:
        lat, lon, bbox = OFFLINE_LOCATIONS[cleaned]
        return lat, lon, bbox

    for loc_key, val in OFFLINE_LOCATIONS.items():
        if loc_key == cleaned or (len(cleaned) > 3 and loc_key in cleaned):
            return val[0], val[1], val[2]

    # 2. Online Geocoding via Nominatim
    try:
        url = f"https://nominatim.openstreetmap.org/search?q={urllib.parse.quote(location_str)}&format=json&limit=1"
        req = urllib.request.Request(url, headers={"User-Agent": "NayomAutomation/1.0"})
        with urllib.request.urlopen(req, timeout=4) as response:
            data = json.loads(response.read().decode("utf-8"))
            if data and len(data) > 0:
                item = data[0]
                lat = float(item["lat"])
                lon = float(item["lon"])
                raw_bbox = item.get("boundingbox")
                if raw_bbox and len(raw_bbox) == 4:
                    min_lat = float(raw_bbox[0])
                    max_lat = float(raw_bbox[1])
                    min_lon = float(raw_bbox[2])
                    max_lon = float(raw_bbox[3])
                    return lat, lon, (min_lat, min_lon, max_lat, max_lon)
                else:
                    # Synthetic 15km bbox around point
                    delta = 15.0 / 111.0
                    return lat, lon, (lat - delta, lon - delta, lat + delta, lon + delta)
    except Exception as e:
        logger.debug("Online geocoding failed for '%s': %s", location_str, e)

    return None


def geocode_location(location_str: str) -> Optional[Tuple[float, float]]:
    """Returns (lat, lon) for a location string."""
    info = geocode_location_info(location_str)
    if info:
        return info[0], info[1]
    return None


def resolve_query_coordinates(query: str) -> Optional[str]:
    """Legacy helper: returns 'lat,lon' string."""
    loc = extract_location_from_query(query)
    info = geocode_location_info(loc) or geocode_location_info(query)
    if info:
        return f"{info[0]:.4f},{info[1]:.4f}"
    return None


def generate_grid_tiles(
    bbox: Tuple[float, float, float, float],
    max_tiles: int = 25
) -> List[Dict[str, Any]]:
    """
    Generates an optimal grid of search tiles covering a bounding box.
    Returns a list of dicts: [{'lat': float, 'lon': float, 'zoom': int, 'radius': float}].
    """
    min_lat, min_lon, max_lat, max_lon = bbox
    lat_span_km = (max_lat - min_lat) * 111.0
    avg_lat = (min_lat + max_lat) / 2.0
    lon_span_km = (max_lon - min_lon) * (111.0 * math.cos(math.radians(avg_lat)))
    
    max_dim = max(lat_span_km, lon_span_km)

    # Determine step size and tile parameters based on geography scale
    if max_dim <= 20.0:
        # Small town / small city
        step_km = 8.0
        zoom = 14
        radius = 8000.0
    elif max_dim <= 60.0:
        # Standard City (e.g. Austin, Miami, Baltimore)
        step_km = 12.0
        zoom = 14
        radius = 10000.0
    elif max_dim <= 150.0:
        # Large Metro / County
        step_km = 20.0
        zoom = 13
        radius = 16000.0
    else:
        # Large State / Region (e.g. Maryland, Texas)
        # Adapt step size to stay within reasonable tile budget
        step_km = max(30.0, max_dim / math.sqrt(max_tiles))
        zoom = 12
        radius = step_km * 900.0  # slightly overlap tiles

    lat_step = step_km / 111.0
    lon_step = step_km / (111.0 * math.cos(math.radians(avg_lat)))

    tiles = []
    curr_lat = min_lat + (lat_step / 2.0)
    while curr_lat <= max_lat:
        curr_lon = min_lon + (lon_step / 2.0)
        while curr_lon <= max_lon:
            tiles.append({
                "lat": round(curr_lat, 4),
                "lon": round(curr_lon, 4),
                "geo": f"{curr_lat:.4f},{curr_lon:.4f}",
                "zoom": zoom,
                "radius": radius,
            })
            curr_lon += lon_step
        curr_lat += lat_step

    # If bounding box was tiny, at least return center point
    if not tiles:
        tiles.append({
            "lat": round((min_lat + max_lat) / 2.0, 4),
            "lon": round((min_lon + max_lon) / 2.0, 4),
            "geo": f"{((min_lat + max_lat) / 2.0):.4f},{((min_lon + max_lon) / 2.0):.4f}",
            "zoom": 14,
            "radius": 10000.0,
        })

    return tiles
