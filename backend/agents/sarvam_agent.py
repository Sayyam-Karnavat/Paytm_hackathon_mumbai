"""
Sarvam AI Bulbul v3 Integration (Priority 3: Indian Language Voice AI)
Generates natural, human-grade Indian speech audio in Hindi, Marathi, and Indian English.
"""
import os
import re
import requests
import threading
from dotenv import load_dotenv

env_file = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), '.env')
if os.path.exists(env_file):
    load_dotenv(env_file, override=True)
else:
    load_dotenv(override=True)
SARVAM_API_KEY = os.getenv("SARVAM_API_KEY", "")

_TTS_CACHE = {}


def _fetch_and_cache(clean_text, language_code, speaker, cache_key):
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
        resp = requests.post(url, headers=headers, json=payload, timeout=(1.5, 4.0))
        if resp.status_code == 200:
            audios = resp.json().get("audios", [])
            if audios and len(audios[0]) > 0:
                _TTS_CACHE[cache_key] = audios[0]
                print(f"[Sarvam AI] Async cached audio ({language_code}) for: '{clean_text[:30]}...'")
    except Exception as e:
        print("[Sarvam AI] Async caching error:", e)


def generate_sarvam_speech(text: str, language_code: str = "hi-IN", speaker: str = "priya", fast_only: bool = False):
    """
    Calls Sarvam AI Bulbul v3 Text-to-Speech API with in-memory caching for sub-second responses.
    If fast_only=True and not in cache, kicks off background caching and returns None immediately.
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

    if fast_only:
        threading.Thread(target=_fetch_and_cache, args=(clean_text, language_code, speaker, cache_key), daemon=True).start()
        return None

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

        resp = requests.post(url, headers=headers, json=payload, timeout=(1.0, 2.0))
        if resp.status_code == 200:
            audios = resp.json().get("audios", [])
            if audios and len(audios[0]) > 0:
                _TTS_CACHE[cache_key] = audios[0]
                return audios[0]
    except Exception as e:
        print("[Sarvam AI] TTS sync error:", e)

    return None
