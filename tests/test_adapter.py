import unittest
from modules.maps_scraper.adapter import normalize_raw_record, normalize_raw_records, parse_address_components
from modules.maps_scraper.geocoder import extract_location_from_query, resolve_query_coordinates


class TestMapsScraperAdapter(unittest.TestCase):

    def test_normalize_complete_gosom_record(self):
        raw = {
            "title": "Toothbar",
            "categories": ["Dentist", "Cosmetic dentist"],
            "category": "Dentist",
            "address": "211 Walter Seaholm Dr LR 160, Austin, TX 78701, United States",
            "web_site": "https://www.toothbar.com/",
            "phone": "+1512-607-4268",
            "latitude": 30.2671177,
            "longitude": -97.7527535,
            "review_rating": 4.9,
            "review_count": 580,
            "data_id": "0x8644b511d14d4c3b:0x3062648265433120",
            "place_id": "ChIJbT0g7gS0RIYRIElqTYJkYjA",
            "link": "https://www.google.com/maps/place/?q=place_id:ChIJbT0g7gS0RIYRIElqTYJkYjA",
        }
        biz = normalize_raw_record(raw, raw_file_ref="test_ref.json")
        self.assertIsNotNone(biz)
        self.assertEqual(biz.name, "Toothbar")
        self.assertEqual(biz.category, "Dentist")
        self.assertEqual(biz.city, "Austin")
        self.assertEqual(biz.state, "TX")
        self.assertEqual(biz.postal_code, "78701")
        self.assertEqual(biz.phone, "+1512-607-4268")
        self.assertEqual(biz.website, "https://www.toothbar.com/")
        self.assertEqual(biz.rating, 4.9)
        self.assertTrue(biz.usable)
        self.assertEqual(biz.raw_data_ref, "test_ref.json")

    def test_normalize_partial_record_missing_phone_and_website(self):
        raw = {
            "title": "Nameless Dental",
            "address": "100 Austin Blvd, Austin, TX 78704, United States",
            "latitude": 30.25,
            "longtitude": -97.75,  # gosom legacy spelling test
        }
        biz = normalize_raw_record(raw)
        self.assertIsNotNone(biz)
        self.assertEqual(biz.name, "Nameless Dental")
        self.assertEqual(biz.longitude, -97.75)
        self.assertIsNone(biz.phone)
        self.assertIsNone(biz.website)
        self.assertFalse(biz.usable)
        self.assertIn("No contact method available (missing phone, email, and website)", biz.validation_warnings)

    def test_address_parsing(self):
        city, state, zip_code, country = parse_address_components(
            "1700 S 1st St, Austin, TX 78704, United States"
        )
        self.assertEqual(city, "Austin")
        self.assertEqual(state, "TX")
        self.assertEqual(zip_code, "78704")
        self.assertEqual(country, "United States")

    def test_normalize_null_and_empty_payload(self):
        # gosom outputs literal null when 0 places found
        self.assertEqual(normalize_raw_records(None), [])
        self.assertEqual(normalize_raw_records([]), [])
        self.assertEqual(normalize_raw_records([None, {}]), [])

    def test_location_extraction_from_query(self):
        self.assertEqual(extract_location_from_query("dentists in Austin Texas"), "Austin Texas")
        self.assertEqual(extract_location_from_query("emergency plumbers near Miami, FL"), "Miami, FL")
        coords = resolve_query_coordinates("dentists in Austin Texas")
        self.assertIsNotNone(coords)
        self.assertIn("30.2672", coords)

    def test_grid_tile_generation(self):
        from modules.maps_scraper.geocoder import generate_grid_tiles, geocode_location_info
        # Test Austin bbox
        loc_info = geocode_location_info("Austin Texas")
        self.assertIsNotNone(loc_info)
        lat, lon, bbox = loc_info
        tiles = generate_grid_tiles(bbox, max_tiles=20)
        self.assertTrue(len(tiles) >= 4)
        for tile in tiles:
            self.assertIn("geo", tile)
            self.assertIn("zoom", tile)
            self.assertIn("radius", tile)

        # Test Maryland state bbox
        md_info = geocode_location_info("Maryland")
        self.assertIsNotNone(md_info)
        _, _, md_bbox = md_info
        md_tiles = generate_grid_tiles(md_bbox, max_tiles=25)
        self.assertTrue(len(md_tiles) >= 5)


if __name__ == "__main__":
    unittest.main()
