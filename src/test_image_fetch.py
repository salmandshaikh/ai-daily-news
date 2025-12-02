from image_generator import fetch_image_from_web, generate_article_image

def test_fetching():
    queries = [
        "Nvidia Blackwell chip",
        "Sam Altman OpenAI",
        "Google Gemini AI"
    ]
    
    print("Testing raw fetching...")
    for query in queries:
        print(f"Fetching for '{query}'...")
        url = fetch_image_from_web(query)
        print(f"Result: {url}")
        
    print("\nTesting full generation (mock)...")
    # We won't actually download to avoid cluttering, just check if it finds a URL
    # But generate_article_image downloads it. Let's just test one.
    path = generate_article_image("Test Nvidia Article", "Nvidia releases new AI chips", force=True)
    print(f"Generated image path: {path}")

if __name__ == "__main__":
    test_fetching()
