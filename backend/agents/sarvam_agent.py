"""
Sarvam AI Bulbul v3 Integration (Priority 3: Indian Language Voice AI)
Generates natural, human-grade Indian speech audio in Hindi, Marathi, and Indian English.
"""
import os
import re
import requests
from dotenv import load_dotenv

env_file = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), '.env')
if os.path.exists(env_file):
    load_dotenv(env_file, override=True)
else:
    load_dotenv(override=True)
SARVAM_API_KEY = os.getenv("SARVAM_API_KEY", "")

_TTS_CACHE = {}


def generate_sarvam_speech(text: str, language_code: str = "hi-IN", speaker: str = "priya"):
    """
    Calls Sarvam AI Bulbul v3 Text-to-Speech API with in-memory caching for sub-second responses.
    """
    if not SARVAM_API_KEY or not text:
        return None

    # Clean text of markdown and special symbols for smooth neural vocal delivery
    clean = re.sub(r'[\*\#\_\[\]\(\)\{\}\<\>•–—\|]', ' ', text)
    clean = re.sub(r'\s+', ' ', clean).strip()

    # For sub-second voice synthesis and low latency, speak the primary concise finding (up to 180 chars)
    if len(clean) > 180:
        truncated = clean[:180]
        last_punct = -1
        for p in ['।', '.', '?', '!']:
            idx = truncated.rfind(p)
            if idx > last_punct:
                last_punct = idx
        if last_punct > 50:
            clean_text = truncated[:last_punct + 1].strip()
        else:
            clean_text = truncated.strip()
    else:
        clean_text = clean

    if not clean_text:
        clean_text = text[:300].strip()

    cache_key = f"{language_code}_{clean_text}"
    if cache_key in _TTS_CACHE:
        return _TTS_CACHE[cache_key]

    try:
        url = "https://api.sarvam.ai/text-to-speech"
        headers = {
            "api-subscription-key": SARVAM_API_KEY,
            "Content-Type": "application/json"
        }

        payload = {
            "inputs": [clean_text],
            "target_language_code": language_code if language_code in ["hi-IN", "mr-IN", "en-IN"] else "hi-IN",
            "speaker": speaker,
            "model": "bulbul:v3"
        }

        resp = requests.post(url, headers=headers, json=payload, timeout=(1.5, 3.5))
        if resp.status_code == 200:
            audios = resp.json().get("audios", [])
            if audios and len(audios[0]) > 0:
                _TTS_CACHE[cache_key] = audios[0]
                print(f"[Sarvam AI] Generated real Indian voice ({language_code}) for: '{clean_text[:40]}...'")
                return audios[0]
        else:
            print(f"[Sarvam AI] HTTP {resp.status_code}: {resp.text[:150]}")
    except Exception as e:
        print("[Sarvam AI] TTS error (falling back to Web Speech):", e)

    return None
