import unittest
from contracts.business import Business


class TestBusinessContract(unittest.TestCase):

    def test_complete_business_record(self):
        biz = Business(
            id="biz_123",
            name="Austin Dental Care",
            category="Dentist",
            categories=["Dentist", "Cosmetic Dentist"],
            address="123 Main St, Austin, TX 78701, United States",
            city="Austin",
            state="TX",
            country="United States",
            postal_code="78701",
            latitude=30.2672,
            longitude=-97.7431,
            phone="+15125550199",
            email="contact@austindentalcare.com",
            website="https://austindentalcare.com",
            rating=4.9,
            review_count=120,
            google_place_id="ChIJ123",
            google_maps_url="https://maps.google.com/?cid=123",
        )
        self.assertEqual(biz.name, "Austin Dental Care")
        self.assertTrue(biz.usable)
        self.assertEqual(biz.validation_warnings, [])

    def test_partial_record_with_phone_only_is_usable(self):
        biz = Business(
            id="biz_456",
            name="Austin Smiles",
            phone="+15125550123",
        )
        self.assertEqual(biz.name, "Austin Smiles")
        self.assertTrue(biz.usable)
        self.assertIn("Missing website", biz.validation_warnings)
        self.assertIn("Missing email", biz.validation_warnings)
        self.assertIn("Missing city", biz.validation_warnings)

    def test_partial_record_with_website_only_is_usable(self):
        biz = Business(
            id="biz_789",
            name="Austin Family Smiles",
            website="https://austinfamilysmiles.com",
        )
        self.assertTrue(biz.usable)
        self.assertIn("Missing phone number", biz.validation_warnings)

    def test_partial_record_with_email_only_is_usable(self):
        biz = Business(
            id="biz_101",
            name="Modern Dental",
            email="info@moderndental.com",
        )
        self.assertTrue(biz.usable)

    def test_record_without_any_contact_is_not_usable(self):
        biz = Business(
            id="biz_999",
            name="Mystery Dental Clinic",
            address="Some Street, Austin, TX",
            city="Austin",
        )
        self.assertFalse(biz.usable)
        self.assertIn("No contact method available (missing phone, email, and website)", biz.validation_warnings)

    def test_missing_data_does_not_raise_exception(self):
        # Even with minimal fields (id and name), model instantiates gracefully
        biz = Business(id="biz_min", name="Bare Minimum Corp")
        self.assertIsNotNone(biz)
        self.assertFalse(biz.usable)
        self.assertTrue(len(biz.validation_warnings) > 0)


class TestOperationalMetricsContracts(unittest.TestCase):

    def test_maps_search_result_metrics(self):
        from contracts.maps import MapsSearchRequest, MapsSearchResult
        req = MapsSearchRequest(query="dentists", max_results=100)
        res = MapsSearchResult(
            request=req,
            total_found=80,
            usable_count=75,
            raw_file_path="raw.json",
            normalized_file_path="norm.json",
            executed_at="2026-08-23T00:00:00Z",
            duration_seconds=5.0,
            requested=100,
            attempted=25,
            found=150,
            usable=75,
            processed=110,
            succeeded=80,
            failed=1,
            skipped=70,
        )
        self.assertEqual(res.requested, 100)
        self.assertEqual(res.attempted, 25)
        self.assertEqual(res.found, 150)
        self.assertEqual(res.usable, 75)
        self.assertEqual(res.processed, 110)
        self.assertEqual(res.succeeded, 80)
        self.assertEqual(res.failed, 1)
        self.assertEqual(res.skipped, 70)

    def test_pipeline_summary_metrics(self):
        from contracts.orchestrator import PipelineSummary
        summary = PipelineSummary(
            requested=100,
            attempted=100,
            found=95,
            usable=90,
            processed=90,
            succeeded=85,
            failed=5,
            skipped=10,
            businesses_found=95,
            websites_collected=88,
            intelligence_completed=88,
            sites_generated=88,
            sites_deployed=87,
            emails_generated=87,
            emails_sent=85,
        )
        self.assertEqual(summary.requested, 100)
        self.assertEqual(summary.attempted, 100)
        self.assertEqual(summary.found, 95)
        self.assertEqual(summary.usable, 90)
        self.assertEqual(summary.processed, 90)
        self.assertEqual(summary.succeeded, 85)
        self.assertEqual(summary.failed, 5)
        self.assertEqual(summary.skipped, 10)


if __name__ == "__main__":
    unittest.main()

