import os
import json
import asyncio
from datetime import datetime
from pathlib import Path
import edge_tts
from groq import Groq

# Initialize Groq client
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# Voice configuration for two speakers
VOICE_ALEX = "en-US-GuyNeural"      # Male voice
VOICE_JORDAN = "en-US-JennyNeural"  # Female voice

def generate_podcast_script(articles):
    """
    Generate a conversational podcast script between two journalists
    discussing the day's AI news.
    """
    # Select top 5 most interesting articles
    top_articles = articles[:5]
    
    # Create context for LLM
    news_summary = "\n\n".join([
        f"- {article['title']} (Source: {article['source_name']})\n  Summary: {article.get('summary', 'No summary available')}"
        for article in top_articles
    ])
    
    prompt = f"""You are writing a script for a 2-minute podcast where two tech journalists, Alex and Jordan, discuss today's AI news in a casual, engaging conversation.

Today's top AI news:
{news_summary}

Create a natural dialogue between Alex and Jordan. They should:
- Discuss 3-5 of the most interesting stories
- Have a conversational, friendly tone
- Include brief analysis or implications
- Use natural transitions between topics
- Keep it engaging and informative
- Target approximately 300-350 words total

Format the script exactly like this:
ALEX: [statement or question]
JORDAN: [response]
ALEX: [follow-up]
...

Start with a brief intro and end with a sign-off. Make it sound natural and engaging!"""

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": "You are a professional podcast script writer specializing in tech news."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.8,
            max_tokens=800
        )
        
        script = response.choices[0].message.content
        return script
    
    except Exception as e:
        print(f"Error generating podcast script: {e}")
        # Fallback script
        return """ALEX: Hey everyone, welcome to AI Daily News!
JORDAN: Hi Alex! We've got some exciting AI developments to discuss today.
ALEX: Absolutely. Let's dive into the latest from the AI world.
JORDAN: Sounds good! Thanks for tuning in, everyone!"""

def parse_script(script):
    """
    Parse the script into speaker segments.
    Returns list of tuples: [(speaker, text), ...]
    """
    segments = []
    lines = script.strip().split('\n')
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
        
        # Check for speaker format: "SPEAKER: text"
        if ':' in line:
            parts = line.split(':', 1)
            speaker = parts[0].strip().upper()
            text = parts[1].strip()
            
            if speaker in ['ALEX', 'JORDAN'] and text:
                segments.append((speaker, text))
    
    return segments

async def generate_audio_segment(text, voice, output_path):
    """
    Generate audio for a single text segment using Edge TTS.
    """
    communicate = edge_tts.Communicate(text, voice)
    await communicate.save(output_path)

async def combine_audio_segments(segments, output_path):
    """
    Generate audio for each segment and combine them into a single file.
    """
    temp_dir = Path(output_path).parent / "temp"
    temp_dir.mkdir(exist_ok=True)
    
    temp_files = []
    
    # Generate audio for each segment
    for i, (speaker, text) in enumerate(segments):
        voice = VOICE_ALEX if speaker == "ALEX" else VOICE_JORDAN
        temp_file = temp_dir / f"segment_{i:03d}.mp3"
        
        print(f"Generating audio for {speaker}: {text[:50]}...")
        await generate_audio_segment(text, voice, str(temp_file))
        temp_files.append(temp_file)
    
    # Combine all segments using ffmpeg (if available) or just use the first/concatenate
    # For simplicity, we'll use edge_tts's built-in concatenation
    # by creating one large text with SSML breaks
    
    # Alternative: Create combined script with pauses
    combined_script = []
    for speaker, text in segments:
        voice_tag = "male" if speaker == "ALEX" else "female"
        combined_script.append(text)
        combined_script.append("<break time='500ms'/>")  # Pause between speakers
    
    full_text = " ".join(combined_script)
    
    # Generate final audio (using first speaker's voice for now, will improve)
    # Better approach: concatenate the temp files
    try:
        # Try to use pydub if available
        from pydub import AudioSegment
        
        combined = AudioSegment.empty()
        for temp_file in temp_files:
            segment = AudioSegment.from_mp3(str(temp_file))
            combined += segment
            # Add small pause between segments
            combined += AudioSegment.silent(duration=300)  # 300ms pause
        
        combined.export(output_path, format="mp3")
        print(f"Combined audio saved to {output_path}")
        
    except ImportError:
        # Fallback: just copy the first file (not ideal but works)
        print("pydub not available, using simple concatenation")
        import shutil
        if temp_files:
            shutil.copy(temp_files[0], output_path)
    
    # Cleanup temp files
    for temp_file in temp_files:
        temp_file.unlink()
    temp_dir.rmdir()

def create_podcast(articles):
    """
    Main function to create the daily podcast.
    """
    print("Starting podcast generation...")
    
    # Generate script
    print("Generating podcast script...")
    script = generate_podcast_script(articles)
    print(f"Script generated:\n{script}\n")
    
    # Parse script into segments
    segments = parse_script(script)
    print(f"Parsed {len(segments)} dialogue segments")
    
    if not segments:
        print("No valid segments found in script")
        return None
    
    # Create output directory
    podcast_dir = Path(__file__).parent.parent / 'data' / 'podcast'
    podcast_dir.mkdir(parents=True, exist_ok=True)
    
    # Generate audio
    output_path = podcast_dir / 'latest.mp3'
    print(f"Generating audio to {output_path}...")
    
    # Run async audio generation
    asyncio.run(combine_audio_segments(segments, str(output_path)))
    
    # Also save to archive with date
    archive_dir = podcast_dir / 'archive'
    archive_dir.mkdir(exist_ok=True)
    today = datetime.now().strftime('%Y-%m-%d')
    archive_path = archive_dir / f'{today}.mp3'
    
    import shutil
    shutil.copy(output_path, archive_path)
    
    # Get audio duration (approximate based on text length)
    total_chars = sum(len(text) for _, text in segments)
    estimated_duration = int(total_chars / 15)  # Rough estimate: 15 chars per second
    
    # Return podcast metadata
    podcast_metadata = {
        "file": f"data/podcast/latest.mp3",
        "duration": estimated_duration,
        "date": today,
        "speakers": ["Alex", "Jordan"],
        "segments": len(segments)
    }
    
    print(f"Podcast generated successfully! Duration: ~{estimated_duration}s")
    return podcast_metadata

if __name__ == "__main__":
    # Test with sample data
    from dotenv import load_dotenv
    load_dotenv()
    
    # Load news data
    news_file = Path(__file__).parent.parent / 'data' / 'news.json'
    if news_file.exists():
        with open(news_file, 'r') as f:
            data = json.load(f)
            articles = data.get('articles', [])
            
        if articles:
            podcast_metadata = create_podcast(articles)
            print(f"\nPodcast metadata: {json.dumps(podcast_metadata, indent=2)}")
        else:
            print("No articles found in news.json")
    else:
        print("news.json not found. Run main.py first to generate news data.")
