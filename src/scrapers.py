import requests
import feedparser
import datetime
from urllib.parse import urlparse
from bs4 import BeautifulSoup

def extract_image(url, retries=2):
    """Extract Open Graph image from URL with retry logic, fallback to placeholder"""
    for attempt in range(retries):
        try:
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
            response = requests.get(url, headers=headers, timeout=3, allow_redirects=True)
            
            if response.status_code != 200:
                continue
                
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Try Open Graph image
            og_image = soup.find('meta', property='og:image')
            if og_image and og_image.get('content'):
                img_url = og_image['content']
                # Ensure absolute URL
                if img_url.startswith('//'):
                    img_url = 'https:' + img_url
                elif img_url.startswith('/'):
                    from urllib.parse import urljoin
                    img_url = urljoin(url, img_url)
                return img_url
            
            # Try Open Graph image:secure_url
            og_image_secure = soup.find('meta', property='og:image:secure_url')
            if og_image_secure and og_image_secure.get('content'):
                return og_image_secure['content']
            
            # Try Twitter image
            twitter_image = soup.find('meta', attrs={'name': 'twitter:image'})
            if twitter_image and twitter_image.get('content'):
                return twitter_image['content']
            
            # Try Twitter image:src
            twitter_image_src = soup.find('meta', attrs={'name': 'twitter:image:src'})
            if twitter_image_src and twitter_image_src.get('content'):
                return twitter_image_src['content']
            
            # Try article:image
            article_image = soup.find('meta', property='article:image')
            if article_image and article_image.get('content'):
                return article_image['content']
                
        except requests.Timeout:
            if attempt < retries - 1:
                continue
            print(f"Image extraction timeout for {url}")
        except Exception as e:
            if attempt < retries - 1:
                continue
            print(f"Image extraction failed for {url}: {e}")
    
    # Fallback placeholder from Unsplash (AI theme) - return empty to let image_generator handle it
    return ""

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
                    'published': entry.get('published', datetime.datetime.now().isoformat()),
                    'image': ""  # Let image_generator handle all images for consistency
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
                    'published': datetime.datetime.fromtimestamp(item.get('time', datetime.datetime.now().timestamp())).isoformat(),
                    'image': extract_image(item['url'])
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
                
                # Reddit often has preview images
                image = "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=450&fit=crop"
                if 'preview' in post_data and 'images' in post_data['preview']:
                    image = post_data['preview']['images'][0]['source']['url'].replace('&amp;', '&')
                elif 'thumbnail' in post_data and post_data['thumbnail'].startswith('http'):
                    image = post_data['thumbnail']
                
                news_items.append({
                    'source': 'Reddit',
                    'source_name': f'r/{sub}',
                    'title': post_data['title'],
                    'url': f"https://www.reddit.com{post_data['permalink']}",
                    'published': datetime.datetime.fromtimestamp(post_data['created_utc']).isoformat(),
                    'image': image
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
                'published': entry.published,
                'image': "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=450&fit=crop"  # Academic theme
            })
    except Exception as e:
        print(f"Error fetching arXiv: {e}")
    return news_items
