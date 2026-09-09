import http.server
import json
import shutil
import socketserver
import tempfile
import threading
import unittest
from pathlib import Path

from contracts.website import WebsiteCollectionRequest, WebsiteCollectionResult
from modules.website_collector.collector import WebsiteCollector, slugify_domain

MOCK_INDEX_HTML = """
<!DOCTYPE html>
<html>
<head>
    <title>Mock Local Business</title>
    <meta name="description" content="Local business providing dental and healthcare services.">
    <link rel="canonical" href="http://localhost/">
</head>
<body>
    <h1>Welcome to Mock Local Business</h1>
    <p>We are the premier dental clinic in town. Serving families since 2010.</p>
    <nav>
        <a href="/about.html">About Us</a>
        <a href="/contact.html">Contact Us</a>
    </nav>
    <a href="/contact.html" class="btn cta">Book an Appointment</a>
</body>
</html>
"""

MOCK_ABOUT_HTML = """
<!DOCTYPE html>
<html>
<head>
    <title>About Us — Mock Local Business</title>
</head>
<body>
    <h1>About Our Practice</h1>
    <p>Our team of experienced doctors provides comprehensive care.</p>
    <h2>Our Doctors</h2>
    <p>Dr. Smith, Dr. Johnson, and Dr. Lee.</p>
    <img src="/doctor.jpg" alt="Doctor Team" width="500" height="400">
    <a href="/">Back to Home</a>
</body>
</html>
"""

MOCK_CONTACT_HTML = """
<!DOCTYPE html>
<html>
<head>
    <title>Contact Us — Mock Local Business</title>
</head>
<body>
    <h1>Contact Our Office</h1>
    <p>Call us at 555-0199 or send a message below.</p>
    <form action="/submit-contact" method="POST">
        <label for="name">Your Name</label>
        <input type="text" id="name" name="name" required placeholder="Jane Doe">
        <label for="phone">Phone</label>
        <input type="tel" id="phone" name="phone">
        <button type="submit">Submit Request</button>
    </form>
    <a href="/">Home</a>
</body>
</html>
"""


class MockHTTPHandler(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path in ("/", "/index.html"):
            content = MOCK_INDEX_HTML.encode("utf-8")
        elif self.path == "/about.html":
            content = MOCK_ABOUT_HTML.encode("utf-8")
        elif self.path == "/contact.html":
            content = MOCK_CONTACT_HTML.encode("utf-8")
        elif self.path == "/robots.txt":
            content = b"User-agent: *\nAllow: /\n"
        else:
            self.send_response(404)
            self.end_headers()
            self.wfile.write(b"Not Found")
            return

        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(content)))
        self.end_headers()
        self.wfile.write(content)

    def log_message(self, format, *args):
        pass  # Suppress HTTP server logs in tests


class TestWebsiteCollector(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        # Start local test HTTP server on an open port
        cls.httpd = socketserver.TCPServer(("127.0.0.1", 0), MockHTTPHandler)
        cls.port = cls.httpd.server_address[1]
        cls.server_thread = threading.Thread(target=cls.httpd.serve_forever, daemon=True)
        cls.server_thread.start()

    @classmethod
    def tearDownClass(cls):
        cls.httpd.shutdown()
        cls.httpd.server_close()

    def setUp(self):
        self.temp_dir = tempfile.mkdtemp(prefix="nayom_test_websites_")
        self.data_root = Path(self.temp_dir)

    def tearDown(self):
        shutil.rmtree(self.temp_dir, ignore_errors=True)

    def test_slugify_domain(self):
        self.assertEqual(slugify_domain("https://example.com"), "example_com")
        self.assertEqual(slugify_domain("https://www.google.com/search?q=test"), "google_com")
        self.assertEqual(slugify_domain("http://api.staging.mysite.org:8080/docs"), "api_staging_mysite_org")

    def test_collector_crawl_and_normalize(self):
        base_url = f"http://127.0.0.1:{self.port}"
        collector = WebsiteCollector(data_root=self.data_root)

        req = WebsiteCollectionRequest(
            url=base_url,
            site_id="test_mock_site",
            max_pages=10,
            concurrency=2,
            timeout=5,
            delay=0.01,
            use_sitemap=False,
            min_words=1,
        )

        result: WebsiteCollectionResult = collector.collect(req)

        self.assertEqual(result.site_id, "test_mock_site")
        self.assertTrue(result.total_pages_crawled >= 3)
        self.assertTrue(result.successful_pages >= 3)
        self.assertEqual(result.failed_pages, 0)
        self.assertEqual(result.site_title, "Mock Local Business")

        # Verify raw directory artifacts
        raw_dir = self.data_root / "test_mock_site" / "raw"
        self.assertTrue(raw_dir.exists())
        pages_jsonl = raw_dir / "pages.jsonl"
        self.assertTrue(pages_jsonl.exists())

        # Verify website.json
        website_json = self.data_root / "test_mock_site" / "website.json"
        self.assertTrue(website_json.exists())

        with open(website_json, "r", encoding="utf-8") as f:
            data = json.load(f)

        self.assertEqual(data["site_id"], "test_mock_site")
        self.assertTrue(len(data["pages"]) >= 3)

        # Check extracted data across pages
        urls = [p["url"] for p in data["pages"]]
        self.assertTrue(any("/about.html" in u for u in urls))
        self.assertTrue(any("/contact.html" in u for u in urls))

        # Check contact form page
        contact_page = next((p for p in data["pages"] if "/contact.html" in p["url"]), None)
        self.assertIsNotNone(contact_page)
        self.assertTrue(len(contact_page["forms"]) >= 1)
        form = contact_page["forms"][0]
        self.assertEqual(form["action"], f"{base_url}/submit-contact")
        self.assertEqual(form["method"], "POST")
        self.assertEqual(form["submit_text"], "Submit Request")

        # Check about page images and headings
        about_page = next((p for p in data["pages"] if "/about.html" in p["url"]), None)
        self.assertIsNotNone(about_page)
        self.assertTrue(len(about_page["headings"]) >= 2)
        self.assertTrue(len(about_page["images"]) >= 1)
        self.assertEqual(about_page["images"][0]["alt"], "Doctor Team")


if __name__ == "__main__":
    unittest.main()
