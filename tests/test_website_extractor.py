import unittest
from bs4 import BeautifulSoup
from modules.website_collector.extractor import (
    parse_page_html,
    extract_headings,
    extract_links,
    extract_images,
    extract_forms,
    extract_buttons,
    extract_metadata,
    extract_structured_data,
    extract_page_content,
    is_external_url,
    resolve_url,
)

SAMPLE_HTML = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Acme Innovations — Next-Gen AI Solutions</title>
    <meta name="description" content="Acme builds intelligent automation platforms for modern enterprises.">
    <meta name="keywords" content="AI, Automation, Machine Learning, SaaS">
    <meta name="author" content="Acme Team">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="https://acme.example.com/">
    <link rel="icon" href="/assets/favicon.ico">
    <meta property="og:title" content="Acme Innovations — Next-Gen AI Solutions">
    <meta property="og:description" content="Acme builds intelligent automation platforms.">
    <meta property="og:image" content="https://acme.example.com/assets/og-hero.jpg">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Acme Innovations">
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Acme Innovations",
        "url": "https://acme.example.com",
        "logo": "https://acme.example.com/logo.png"
    }
    </script>
</head>
<body>
    <header>
        <nav>
            <a href="/">Home</a>
            <a href="/products">Products</a>
            <a href="/pricing">Pricing</a>
            <a href="https://twitter.com/acme" rel="noopener noreferrer">Twitter</a>
        </nav>
    </header>
    <main>
        <h1 id="hero-title">Intelligent Automation for Everyone</h1>
        <p>Boost your operational efficiency with our cutting-edge AI platform.</p>
        <a href="/get-started" class="btn btn-primary">Get Started Free</a>
        <button id="demo-btn" class="cta-button" onclick="openDemo()">Request a Demo</button>

        <h2 id="features">Core Features</h2>
        <div class="feature-card">
            <img src="/img/robot.png" alt="Autonomous Robots" width="400" height="300" loading="lazy">
            <h3>Automated Workflows</h3>
            <p>Deploy multi-step agents in seconds.</p>
        </div>

        <h2>Contact Us</h2>
        <form id="contact-form" action="/api/contact" method="POST">
            <label for="name-field">Full Name</label>
            <input type="text" id="name-field" name="full_name" placeholder="John Doe" required>
            
            <label for="email-field">Work Email</label>
            <input type="email" id="email-field" name="email" placeholder="john@example.com" required>
            
            <label for="plan-select">Select Plan</label>
            <select id="plan-select" name="plan">
                <option value="starter">Starter</option>
                <option value="enterprise">Enterprise</option>
            </select>
            
            <label for="msg-field">Message</label>
            <textarea id="msg-field" name="message" placeholder="Tell us about your project..."></textarea>
            
            <button type="submit">Send Message</button>
        </form>
    </main>
</body>
</html>
"""


class TestWebsiteExtractor(unittest.TestCase):

    def setUp(self):
        self.soup = BeautifulSoup(SAMPLE_HTML, "lxml")
        self.base_url = "https://acme.example.com"
        self.base_netloc = "acme.example.com"

    def test_resolve_url(self):
        self.assertEqual(resolve_url("/products", self.base_url), "https://acme.example.com/products")
        self.assertEqual(resolve_url("https://external.com", self.base_url), "https://external.com")
        self.assertEqual(resolve_url("//cdn.example.com/style.css", self.base_url), "https://cdn.example.com/style.css")

    def test_is_external_url(self):
        self.assertFalse(is_external_url("https://acme.example.com/pricing", self.base_netloc))
        self.assertFalse(is_external_url("https://sub.acme.example.com/pricing", self.base_netloc))
        self.assertTrue(is_external_url("https://twitter.com/acme", self.base_netloc))
        self.assertTrue(is_external_url("https://google.com", self.base_netloc))

    def test_extract_headings(self):
        headings = extract_headings(self.soup)
        self.assertEqual(len(headings), 4)
        
        h1 = headings[0]
        self.assertEqual(h1.level, 1)
        self.assertEqual(h1.text, "Intelligent Automation for Everyone")
        self.assertEqual(h1.id, "hero-title")

        h2_list = [h for h in headings if h.level == 2]
        self.assertEqual(len(h2_list), 2)
        self.assertEqual(h2_list[0].text, "Core Features")
        self.assertEqual(h2_list[0].id, "features")
        self.assertEqual(h2_list[1].text, "Contact Us")

        h3_list = [h for h in headings if h.level == 3]
        self.assertEqual(len(h3_list), 1)
        self.assertEqual(h3_list[0].text, "Automated Workflows")

    def test_extract_links(self):
        links = extract_links(self.soup, self.base_url, self.base_netloc)
        urls = [link.url for link in links]
        self.assertIn("https://acme.example.com/", urls)
        self.assertIn("https://acme.example.com/products", urls)
        self.assertIn("https://acme.example.com/pricing", urls)
        self.assertIn("https://twitter.com/acme", urls)

        twitter_link = next(link for link in links if "twitter.com" in link.url)
        self.assertTrue(twitter_link.is_external)
        self.assertEqual(twitter_link.text, "Twitter")

        pricing_link = next(link for link in links if "/pricing" in link.url)
        self.assertFalse(pricing_link.is_external)

    def test_extract_images(self):
        images = extract_images(self.soup, self.base_url)
        self.assertEqual(len(images), 1)
        img = images[0]
        self.assertEqual(img.url, "https://acme.example.com/img/robot.png")
        self.assertEqual(img.alt, "Autonomous Robots")
        self.assertEqual(img.width, 400)
        self.assertEqual(img.height, 300)
        self.assertEqual(img.loading, "lazy")

    def test_extract_forms(self):
        forms = extract_forms(self.soup, self.base_url)
        self.assertEqual(len(forms), 1)
        form = forms[0]
        self.assertEqual(form.id, "contact-form")
        self.assertEqual(form.action, "https://acme.example.com/api/contact")
        self.assertEqual(form.method, "POST")
        self.assertEqual(form.submit_text, "Send Message")

        field_names = [f.name for f in form.fields]
        self.assertIn("full_name", field_names)
        self.assertIn("email", field_names)
        self.assertIn("plan", field_names)
        self.assertIn("message", field_names)

        plan_field = next(f for f in form.fields if f.name == "plan")
        self.assertEqual(plan_field.type, "select")
        self.assertEqual(plan_field.options, ["Starter", "Enterprise"])
        self.assertEqual(plan_field.label, "Select Plan")

        name_field = next(f for f in form.fields if f.name == "full_name")
        self.assertTrue(name_field.required)
        self.assertEqual(name_field.placeholder, "John Doe")
        self.assertEqual(name_field.label, "Full Name")

    def test_extract_buttons_and_ctas(self):
        buttons = extract_buttons(self.soup, self.base_url)
        # Should capture: "Get Started Free" (link CTA), "Request a Demo" (button CTA), "Send Message" (form submit button)
        texts = [b.text for b in buttons]
        self.assertIn("Get Started Free", texts)
        self.assertIn("Request a Demo", texts)

        demo_btn = next(b for b in buttons if b.text == "Request a Demo")
        self.assertTrue(demo_btn.is_cta)
        self.assertEqual(demo_btn.onclick, "openDemo()")

        get_started = next(b for b in buttons if b.text == "Get Started Free")
        self.assertTrue(get_started.is_cta)
        self.assertEqual(get_started.type, "link_cta")
        self.assertEqual(get_started.href, "https://acme.example.com/get-started")

    def test_extract_metadata(self):
        meta = extract_metadata(self.soup, self.base_url)
        self.assertEqual(meta.title, "Acme Innovations — Next-Gen AI Solutions")
        self.assertEqual(meta.description, "Acme builds intelligent automation platforms for modern enterprises.")
        self.assertEqual(meta.keywords, ["AI", "Automation", "Machine Learning", "SaaS"])
        self.assertEqual(meta.author, "Acme Team")
        self.assertEqual(meta.language, "en")
        self.assertEqual(meta.canonical, "https://acme.example.com/")
        self.assertEqual(meta.favicon, "https://acme.example.com/assets/favicon.ico")
        self.assertEqual(meta.og_tags.get("og:title"), "Acme Innovations — Next-Gen AI Solutions")
        self.assertEqual(meta.twitter_tags.get("twitter:card"), "summary_large_image")

    def test_extract_structured_data(self):
        sd = extract_structured_data(self.soup)
        self.assertEqual(len(sd.json_ld), 1)
        org = sd.json_ld[0]
        self.assertEqual(org.get("@type"), "Organization")
        self.assertEqual(org.get("name"), "Acme Innovations")
        self.assertEqual(org.get("url"), "https://acme.example.com")

    def test_extract_page_content(self):
        content = extract_page_content(self.soup, self.base_url)
        self.assertIn("Intelligent Automation for Everyone", content.plain_text)
        self.assertIn("Automated Workflows", content.plain_text)
        self.assertTrue(content.word_count > 10)
        self.assertTrue(len(content.markdown) > 0)

    def test_parse_page_html_full(self):
        (
            content,
            headings,
            links,
            images,
            metadata,
            forms,
            buttons,
            structured_data,
        ) = parse_page_html(SAMPLE_HTML, self.base_url, status_code=200)

        self.assertEqual(len(headings), 4)
        self.assertTrue(len(links) >= 4)
        self.assertEqual(len(images), 1)
        self.assertEqual(len(forms), 1)
        self.assertTrue(len(buttons) >= 2)
        self.assertEqual(metadata.title, "Acme Innovations — Next-Gen AI Solutions")
        self.assertEqual(len(structured_data.json_ld), 1)
        self.assertTrue(content.word_count > 0)


if __name__ == "__main__":
    unittest.main()
