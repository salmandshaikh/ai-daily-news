import os
import time
from groq import Groq
from openai import OpenAI

SYSTEM_PROMPT = "You are a helpful assistant that summarizes tech news for a daily digest. Keep it concise (2-3 sentences), engaging, and focus on the key innovation or impact."

def summarize_content(text, model_preference="groq", retries=3):
    """
    Summarizes text using Groq (primary) or OpenRouter (fallback).
    Retries on rate limit errors with exponential backoff.
    """
    # Try Groq first
    if model_preference == "groq":
        groq_api_key = os.environ.get("GROQ_API_KEY")
        if groq_api_key:
            for attempt in range(retries):
                try:
                    client = Groq(api_key=groq_api_key)
                    completion = client.chat.completions.create(
                        model="llama-3.3-70b-versatile",
                        messages=[
                            {"role": "system", "content": SYSTEM_PROMPT},
                            {"role": "user", "content": f"Summarize this:\n\n{text}"}
                        ],
                        temperature=0.5,
                        max_tokens=150,
                        top_p=1,
                        stop=None,
                        stream=False
                    )
                    return completion.choices[0].message.content
                except Exception as e:
                    err = str(e).lower()
                    if 'rate' in err or '429' in err or 'quota' in err:
                        wait = 2 ** attempt  # 1s, 2s, 4s
                        print(f"Groq rate limited (attempt {attempt+1}/{retries}), waiting {wait}s...")
                        time.sleep(wait)
                    else:
                        print(f"Groq failed: {e}. Switching to OpenRouter...")
                        break
            else:
                print("Groq rate limit exhausted, switching to OpenRouter...")
        else:
            print("GROQ_API_KEY not set, switching to OpenRouter...")

    return summarize_with_openrouter(text)

def summarize_with_openrouter(text, retries=2):
    openrouter_api_key = os.environ.get("OPENROUTER_API_KEY")
    if not openrouter_api_key:
        print("OPENROUTER_API_KEY not set, no summary available.")
        return "Summary unavailable."

    for attempt in range(retries):
        try:
            client = OpenAI(
                base_url="https://openrouter.ai/api/v1",
                api_key=openrouter_api_key,
            )
            completion = client.chat.completions.create(
                model="meta-llama/llama-3.1-8b-instruct:free",
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": f"Summarize this:\n\n{text}"}
                ]
            )
            return completion.choices[0].message.content
        except Exception as e:
            err = str(e).lower()
            if ('rate' in err or '429' in err or 'quota' in err) and attempt < retries - 1:
                wait = 2 ** attempt
                print(f"OpenRouter rate limited (attempt {attempt+1}/{retries}), waiting {wait}s...")
                time.sleep(wait)
            else:
                print(f"OpenRouter failed: {e}")
                break

    return "Summary unavailable."
