import requests
from bs4 import BeautifulSoup
import pandas as pd

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
    "Accept-Language": "en-US,en;q=0.9",
    "Accept-Encoding": "gzip, deflate, br",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
}

def fetch_reviews(asin, num_pages=1):
    reviews = []

    for page in range(1, num_pages + 1):
        url = f"https://www.amazon.in/product-reviews/{asin}/?pageNumber={page}"
        res = requests.get(url, headers=headers)

        if res.status_code != 200:
            print(f"Failed to fetch page {page}")
            continue

        soup = BeautifulSoup(res.text, 'html.parser')
        blocks = soup.select(".review")

        for block in blocks:
            try:
                text = block.select_one(".review-text-content").get_text(strip=True)
                rating = block.select_one(".review-rating").get_text(strip=True)[0]
                reviews.append({"review_text": text, "rating": int(rating)})
            except:
                continue

    df = pd.DataFrame(reviews)
    df.to_csv("reviews/sample_reviews.csv", index=False)
    print(" Reviews saved to reviews/sample_reviews.csv")

if __name__ == "__main__":
    fetch_reviews("B07DJHV6VZ", num_pages=2)  # example: OnePlus Bullets Wireless
