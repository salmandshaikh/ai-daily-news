import os
import time
from groq import Groq
from openai import OpenAI

def summarize_content(text, model_preference="groq"):
    """
    Summarizes text using Groq (primary) or OpenRouter (fallback).
    """
    system_prompt = "You are a helpful assistant that summarizes tech news for a daily digest. Keep it concise (2-3 sentences), engaging, and focus on the key innovation or impact."
    
    # Try Groq first
    if model_preference == "groq":
        try:
            groq_api_key = os.environ.get("GROQ_API_KEY")
            if not groq_api_key:
                raise ValueError("GROQ_API_KEY not set")
            
            client = Groq(api_key=groq_api_key)
            completion = client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[
                    {"role": "system", "content": system_prompt},
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
            print(f"Groq failed: {e}. Switching to OpenRouter...")
            return summarize_with_openrouter(text, system_prompt)

    return summarize_with_openrouter(text, system_prompt)

def summarize_with_openrouter(text, system_prompt):
    try:
        openrouter_api_key = os.environ.get("OPENROUTER_API_KEY")
        if not openrouter_api_key:
            return "Error: No API keys available for summarization."
            
        client = OpenAI(
            base_url="https://openrouter.ai/api/v1",
            api_key=openrouter_api_key,
        )
        
        completion = client.chat.completions.create(
            model="meta-llama/llama-3.1-8b-instruct:free",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Summarize this:\n\n{text}"}
            ]
        )
        return completion.choices[0].message.content
    except Exception as e:
        print(f"OpenRouter failed: {e}")
        return "Summary unavailable."
