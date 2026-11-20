"""
Sarvam AI Bulbul v3 Integration (Priority 3: Indian Language Voice AI)
Generates natural, human-grade Indian speech audio in Hindi, Marathi, and Indian English.
"""
import os
import re
import requests
from dotenv import load_dotenv

load_dotenv('C:/Users/hp/paytmone/backend/.env', override=True)
SARVAM_API_KEY = os.getenv("SARVAM_API_KEY", "")

_TTS_CACHE = {}


def generate_sarvam_speech(text: str, language_code: str = "hi-IN", speaker: str = "priya"):
    """
    Calls Sarvam AI Bulbul v3 Text-to-Speech API with in-memory caching for sub-second responses.
    """
    if not SARVAM_API_KEY or not text:
        return None

    # Strip markdown and special symbols for clean vocal delivery
    clean = re.sub(r'[\*\#\_\[\]\(\)\{\}\<\>•\-–—\|]', ' ', text)
    clean = re.sub(r'\s+', ' ', clean).strip()

    # Keep speech concise for fast sub-second synthesis (up to ~140 chars)
    if len(clean) > 140:
        match = re.search(r'([।\.\?!])\s*', clean[:140])
        if match:
            clean_text = clean[:match.end()].strip()
        else:
            clean_text = clean[:140].strip()
    else:
        clean_text = clean

    if not clean_text:
        clean_text = text[:100].strip()

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

        resp = requests.post(url, headers=headers, json=payload, timeout=(3.0, 15.0))
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
