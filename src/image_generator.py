import os
import requests
import hashlib
from pathlib import Path
from duckduckgo_search import DDGS
import time
import random

def generate_image_prompt(title, summary=""):
    """Generate a descriptive prompt for image generation based on article content"""
    prompt = f"A professional, modern illustration representing: {title}"
    if summary and len(summary) > 10:
        # Add key context from summary
        prompt += f". Context: {summary[:200]}"
    prompt += ". Style: clean, tech-focused, professional news media aesthetic."
    return prompt

def get_cache_path(article_title):
    """Generate a cache filename based on article title"""
    cache_dir = Path(__file__).parent.parent / 'data' / 'images'
    cache_dir.mkdir(parents=True, exist_ok=True)
    
    # Create hash of title for filename
    title_hash = hashlib.md5(article_title.encode()).hexdigest()
    return cache_dir / f"{title_hash}.png"

def fetch_image_from_web(query):
    """Fetch an image URL using DuckDuckGo"""
    try:
        with DDGS() as ddgs:
            # Search for images
            results = list(ddgs.images(
                query,
                max_results=1,
                safesearch='on',
                size='Medium',
                type_image='photo'
            ))
            
            if results and len(results) > 0:
                return results[0]['image']
    except Exception as e:
        print(f"Error fetching image for '{query}': {e}")
    return None

def generate_article_image(title, summary="", force=False):
    """
    Fetch a real-world image for an article or return cached version
    
    Args:
        title: Article title
        summary: Article summary for context
        force: Force regeneration even if cached
        
    Returns:
        Relative path to generated image or None if generation fails
    """
    cache_path = get_cache_path(title)
    
    # Return cached image if exists (as relative path)
    if cache_path.exists() and not force:
        # Convert to relative path for web usage
        return f"data/images/{cache_path.name}"
    
    try:
        # 1. Try to fetch a relevant image from the web
        # Clean up title for better search results
        search_query = f"{title} technology news"
        image_url = fetch_image_from_web(search_query)
        
        # 2. Fallback to Unsplash if web search fails
        if not image_url:
            keywords = extract_keywords(title)
            image_url = get_unsplash_image(keywords)
        
        if image_url:
            # Download and cache
            # Add a user agent to avoid being blocked
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
            response = requests.get(image_url, headers=headers, timeout=15)
            if response.status_code == 200:
                with open(cache_path, 'wb') as f:
                    f.write(response.content)
                # Return relative path for web usage
                return f"data/images/{cache_path.name}"
            else:
                print(f"Failed to download image from {image_url}: Status {response.status_code}")
                
    except Exception as e:
        print(f"Image fetching failed for '{title}': {e}")
    
    return None

def extract_keywords(title):
    """Extract key terms from title for image search"""
    # AI/ML related keywords
    ai_keywords = ['ai', 'artificial intelligence', 'machine learning', 'deep learning', 
                   'neural network', 'llm', 'gpt', 'model', 'algorithm', 'data']
    
    title_lower = title.lower()
    
    # Check for AI keywords
    for keyword in ai_keywords:
        if keyword in title_lower:
            return 'artificial intelligence technology'
    
    # Default tech theme
    return 'technology innovation'

def get_unsplash_image(keywords):
    """Get a relevant image from Unsplash based on keywords"""
    # Curated AI/tech themed images from Unsplash
    tech_images = [
        "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=450&fit=crop",  # AI chip
        "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&h=450&fit=crop",  # AI brain
        "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=450&fit=crop",  # Code/data
        "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=450&fit=crop",  # Server/tech
        "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=450&fit=crop",  # Abstract tech
        "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=450&fit=crop",  # Robot/AI
        "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=450&fit=crop",  # Tech workspace
    ]
    
    # Rotate through images based on keyword hash
    index = hash(keywords) % len(tech_images)
    return tech_images[index]

def ensure_article_has_image(article):
    """
    Ensure an article has an image, generating one if needed
    
    Args:
        article: Article dict with title, url, summary, etc.
        
    Returns:
        Updated article dict with image field
    """
    if not article.get('image') or article['image'] == '':
        # Try to generate/fetch an image
        generated_image = generate_article_image(
            article.get('title', ''),
            article.get('summary', '')
        )
        
        if generated_image:
            article['image'] = generated_image
        else:
            # Ultimate fallback
            article['image'] = "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=450&fit=crop"
    
    return article
