"""
Sarvam AI Bulbul v3 Integration (Priority 3: Indian Language Voice AI)
Generates natural, human-grade Indian speech audio in Hindi, Marathi, and Indian English.
"""
import os
import requests
from dotenv import load_dotenv

load_dotenv('C:/Users/hp/paytmone/backend/.env', override=True)
SARVAM_API_KEY = os.getenv("SARVAM_API_KEY", "")


def generate_sarvam_speech(text: str, language_code: str = "hi-IN", speaker: str = "priya"):
    """
    Calls Sarvam AI Bulbul v3 Text-to-Speech API. Returns base64 audio string.
    """
    if not SARVAM_API_KEY or not text:
        return None

    try:
        url = "https://api.sarvam.ai/text-to-speech"
        headers = {
            "api-subscription-key": SARVAM_API_KEY,
            "Content-Type": "application/json"
        }
        
        # Keep speech concise for fast audio synthesis
        clean_text = text[:250].strip()

        payload = {
            "inputs": [clean_text],
            "target_language_code": language_code if language_code in ["hi-IN", "mr-IN", "en-IN"] else "hi-IN",
            "speaker": speaker,
            "model": "bulbul:v3"
        }

        resp = requests.post(url, headers=headers, json=payload, timeout=6)
        if resp.status_code == 200:
            audios = resp.json().get("audios", [])
            if audios and len(audios[0]) > 0:
                return audios[0]
    except Exception as e:
        print("Sarvam AI TTS error:", e)

    return None
