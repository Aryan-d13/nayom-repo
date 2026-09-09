import urllib.request
import json
import os

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

def search_photos(query, count=15):
    url = f"https://unsplash.com/napi/search/photos?query={urllib.parse.quote(query)}&per_page={count}"
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            print(f"--- Query: {query} (total: {data.get('total')}) ---")
            results = []
            for item in data.get('results', []):
                desc = item.get('description') or item.get('alt_description')
                raw_url = item.get('urls', {}).get('regular')
                print(f"ID: {item.get('id')} | Desc: {desc}")
                results.append((item.get('id'), desc, raw_url))
            return results
    except Exception as e:
        print(f"Error {query}: {e}")
        return []

if __name__ == '__main__':
    search_photos('garage door house')
    search_photos('residential garage door')
    search_photos('garage door repair')
