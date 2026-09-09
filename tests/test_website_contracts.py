import unittest
import json
from contracts.website import (
    Page,
    PageHeading,
    PageLink,
    PageImage,
    PageForm,
    PageFormField,
    PageButton,
    PageMetadata,
    PageContent,
    PageError,
    StructuredData,
    WebsiteCollectionRequest,
    WebsiteCollectionResult,
)


class TestWebsiteContracts(unittest.TestCase):

    def test_page_contract_full(self):
        page = Page(
            url="https://example.com/pricing",
            path="/pricing",
            title="Pricing Plans",
            status_code=200,
            duration_ms=45.2,
            content=PageContent(
                markdown="# Pricing\n\nChoose your plan.",
                plain_text="Pricing Choose your plan.",
                word_count=4,
                character_count=25,
            ),
            headings=[PageHeading(level=1, text="Pricing", id="pricing")],
            links=[PageLink(url="https://example.com/checkout", text="Buy", is_external=False)],
            images=[PageImage(url="https://example.com/badge.png", alt="Pro Badge")],
            metadata=PageMetadata(title="Pricing Plans", description="Best pricing."),
            forms=[
                PageForm(
                    action="https://example.com/subscribe",
                    method="POST",
                    fields=[PageFormField(name="email", type="email", required=True)],
                )
            ],
            buttons=[PageButton(text="Subscribe Now", type="submit", is_cta=True)],
            structured_data=StructuredData(json_ld=[{"@type": "Product", "name": "Pro Plan"}]),
            is_success=True,
        )

        self.assertEqual(page.url, "https://example.com/pricing")
        self.assertEqual(page.path, "/pricing")
        self.assertEqual(page.title, "Pricing Plans")
        self.assertTrue(page.is_success)
        self.assertEqual(len(page.headings), 1)
        self.assertEqual(len(page.forms), 1)
        self.assertEqual(len(page.buttons), 1)

        # Test JSON serialization and roundtrip
        json_str = page.model_dump_json()
        data = json.loads(json_str)
        self.assertEqual(data["url"], "https://example.com/pricing")
        self.assertEqual(data["headings"][0]["text"], "Pricing")

    def test_page_error_contract(self):
        page = Page(
            url="https://example.com/404-broken",
            path="/404-broken",
            title="Not Found",
            status_code=404,
            is_success=False,
            errors=[
                PageError(
                    error_type="HTTPError",
                    message="404 Not Found returned by server",
                    status_code=404,
                )
            ],
            warnings=["Missing canonical tag"],
        )

        self.assertFalse(page.is_success)
        self.assertEqual(page.status_code, 404)
        self.assertEqual(len(page.errors), 1)
        self.assertEqual(page.errors[0].error_type, "HTTPError")
        self.assertEqual(len(page.warnings), 1)

    def test_website_collection_request_and_result(self):
        req = WebsiteCollectionRequest(
            url="https://example.com",
            max_pages=25,
            render_js=True,
            screenshot=True,
        )
        self.assertEqual(req.url, "https://example.com")
        self.assertEqual(req.max_pages, 25)
        self.assertTrue(req.render_js)

        page = Page(
            url="https://example.com",
            path="/",
            title="Example Domain",
            status_code=200,
            is_success=True,
        )

        result = WebsiteCollectionResult(
            request=req,
            site_id="example_com",
            base_url="https://example.com",
            domain="example.com",
            total_pages_crawled=1,
            successful_pages=1,
            failed_pages=0,
            pages=[page],
            site_title="Example Domain",
            raw_output_dir="/path/to/raw",
            website_json_path="/path/to/website.json",
        )

        self.assertEqual(result.site_id, "example_com")
        self.assertEqual(result.successful_pages, 1)
        self.assertEqual(result.failed_pages, 0)
        self.assertEqual(len(result.pages), 1)

        # Check dump JSON
        dumped = json.loads(result.model_dump_json())
        self.assertEqual(dumped["site_id"], "example_com")
        self.assertEqual(dumped["request"]["max_pages"], 25)


if __name__ == "__main__":
    unittest.main()
