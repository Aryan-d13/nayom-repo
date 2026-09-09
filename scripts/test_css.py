import requests
import re

url = "https://aryan-d13.github.io/nayom-repo/aryansharmaswe_vercel_app/"
r = requests.get(url)
print("HTML Status:", r.status_code)

hrefs = re.findall(r'href=["\'](.*?)["\']', r.text)
for h in hrefs:
    if "css" in h:
        print("CSS href found:", h)
        full_css_url = f"https://aryan-d13.github.io{h}" if h.startswith("/") else f"https://aryan-d13.github.io/nayom-repo/aryansharmaswe_vercel_app/{h}"
        css_r = requests.get(full_css_url)
        print(f" -> Testing {full_css_url}: Status {css_r.status_code}, Length: {len(css_r.text)}")
