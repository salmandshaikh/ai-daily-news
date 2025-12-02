import requests
import feedparser
import datetime
from urllib.parse import urlparse

def get_rss_news(feed_urls):
    news_items = []
    for url in feed_urls:
        try:
            feed = feedparser.parse(url)
            for entry in feed.entries[:5]: # Top 5 from each
                news_items.append({
                    'source': 'RSS',
                    'source_name': feed.feed.get('title', urlparse(url).netloc),
                    'title': entry.title,
                    'url': entry.link,
                    'published': entry.get('published', datetime.datetime.now().isoformat())
                })
        except Exception as e:
            print(f"Error fetching RSS {url}: {e}")
    return news_items

def get_hacker_news(limit=10):
    news_items = []
    try:
        # Get top stories IDs
        resp = requests.get('https://hacker-news.firebaseio.com/v0/topstories.json')
        story_ids = resp.json()[:30] # Check top 30 to filter for AI
        
        for sid in story_ids:
            item_resp = requests.get(f'https://hacker-news.firebaseio.com/v0/item/{sid}.json')
            item = item_resp.json()
            
            if not item or 'title' not in item or 'url' not in item:
                continue
                
            title_lower = item['title'].lower()
            if any(kw in title_lower for kw in ['ai', 'llm', 'gpt', 'machine learning', 'neural', 'model']):
                news_items.append({
                    'source': 'Hacker News',
                    'source_name': 'Hacker News',
                    'title': item['title'],
                    'url': item['url'],
                    'published': datetime.datetime.fromtimestamp(item.get('time', datetime.datetime.now().timestamp())).isoformat()
                })
                if len(news_items) >= limit:
                    break
    except Exception as e:
        print(f"Error fetching Hacker News: {e}")
    return news_items

def get_reddit_news(subreddits=['LocalLLaMA', 'ArtificialInteligence', 'MachineLearning'], limit=5):
    news_items = []
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'}
    
    for sub in subreddits:
        try:
            url = f'https://www.reddit.com/r/{sub}/top.json?t=day&limit={limit}'
            resp = requests.get(url, headers=headers)
            if resp.status_code != 200:
                print(f"Reddit error {resp.status_code} for {sub}")
                continue
                
            data = resp.json()
            for post in data['data']['children']:
                post_data = post['data']
                if post_data.get('stickied'): continue
                
                news_items.append({
                    'source': 'Reddit',
                    'source_name': f'r/{sub}',
                    'title': post_data['title'],
                    'url': f"https://www.reddit.com{post_data['permalink']}",
                    'published': datetime.datetime.fromtimestamp(post_data['created_utc']).isoformat()
                })
        except Exception as e:
            print(f"Error fetching Reddit {sub}: {e}")
    return news_items

def get_arxiv_papers(query='cat:cs.AI OR cat:cs.LG', limit=5):
    news_items = []
    try:
        url = f'http://export.arxiv.org/api/query?search_query={query}&start=0&max_results={limit}&sortBy=submittedDate&sortOrder=descending'
        feed = feedparser.parse(url)
        for entry in feed.entries:
            news_items.append({
                'source': 'arXiv',
                'source_name': 'arXiv',
                'title': entry.title.replace('\n', ' '),
                'url': entry.link,
                'published': entry.published
            })
    except Exception as e:
        print(f"Error fetching arXiv: {e}")
    return news_items
