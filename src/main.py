import json
import os
from dotenv import load_dotenv

load_dotenv()

import datetime
from scrapers import get_rss_news, get_hacker_news, get_reddit_news, get_arxiv_papers
from summarizer import summarize_content
from image_generator import ensure_article_has_image

def main():
    print("Starting AI Daily News aggregation...")
    
    all_news = []
    
    # 1. RSS Feeds
    rss_urls = [
        'https://openai.com/blog/rss.xml',
        'https://deepmind.google/blog/rss.xml',
        'https://huggingface.co/blog/feed.xml'
    ]
    print("Fetching RSS feeds...")
    all_news.extend(get_rss_news(rss_urls))
    
    # 2. Hacker News
    print("Fetching Hacker News...")
    all_news.extend(get_hacker_news())
    
    # 3. Reddit
    print("Fetching Reddit...")
    all_news.extend(get_reddit_news())
    
    # 4. arXiv
    print("Fetching arXiv...")
    all_news.extend(get_arxiv_papers())
    
    print(f"Collected {len(all_news)} items. Deduplicating...")
    
    # Deduplicate by URL
    seen_urls = set()
    unique_news = []
    for item in all_news:
        if item['url'] not in seen_urls:
            seen_urls.add(item['url'])
            unique_news.append(item)
            
    print(f"Unique items: {len(unique_news)}. Processing up to 100 articles...")
    
    # Process more articles for a richer news feed
    # Limit to 100 to balance comprehensiveness with API costs
    articles_to_process = min(100, len(unique_news))
    
    final_news = []
    for i, item in enumerate(unique_news[:articles_to_process]):
        print(f"Processing {i+1}/{articles_to_process}: {item['title']}")
        
        try:
            # Ensure article has an image
            item = ensure_article_has_image(item)
            
            # Generate summary
            content_context = f"Title: {item['title']}\nSource: {item['source']}"
            summary = summarize_content(content_context)
            item['summary'] = summary
            final_news.append(item)
            
        except Exception as e:
            print(f"Failed to process {item['title']}: {e}")
            # Still add the article with basic info
            item['summary'] = "Summary unavailable."
            item = ensure_article_has_image(item)  # Ensure image even on error
            final_news.append(item)
            
    # Save to data/news.json
    output_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data', 'news.json')
    with open(output_path, 'w') as f:
        json.dump({
            'updated': datetime.datetime.now().isoformat(),
            'articles': final_news
        }, f, indent=2)
        
    print(f"Done! Saved {len(final_news)} articles to {output_path}")

if __name__ == "__main__":
    main()
