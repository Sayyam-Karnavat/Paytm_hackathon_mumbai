"""
Groq LLM Engine: Fast intent classification, constraint extraction, and natural language synthesis in Hindi, English, and Marathi.
"""
import os
import json
import requests
from pathlib import Path
from dotenv import load_dotenv

# Load .env from backend directory or project root
load_dotenv(dotenv_path=Path(__file__).resolve().parent / '.env')
load_dotenv(dotenv_path=Path(__file__).resolve().parent.parent / '.env')
load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
GROQ_MODEL = "openai/gpt-oss-20b"


def call_groq_llm(prompt: str, system_prompt: str = "") -> str:
    """
    Calls Groq OpenAI-compatible chat completion endpoint.
    """
    if not GROQ_API_KEY:
        return ""
    
    url = "https://api.groq.com/openai/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }

    messages = []
    if system_prompt:
        messages.append({"role": "system", "content": system_prompt})
    messages.append({"role": "user", "content": prompt})

    try:
        payload = {
            "model": GROQ_MODEL,
            "messages": messages,
            "temperature": 0.3,
            "max_tokens": 450
        }
        resp = requests.post(url, headers=headers, json=payload, timeout=8)
        if resp.status_code == 200:
            return resp.json()["choices"][0]["message"]["content"].strip()
    except Exception as e:
        print("Groq LLM call error:", e)
    
    return ""


def parse_query_with_groq(query: str):
    """
    Uses Groq LLM to intelligently extract intent, language, operator, budget, data, and OTT perks.
    """
    system_prompt = (
        "You are the Paytm ONE Master Orchestrator for India's leading digital payments app. "
        "Analyze the user's input (which may be in Hindi, English, Hinglish, or Marathi) "
        "and return a strict JSON object with these keys:\n"
        "- language: 'hi' (Hindi/Hinglish), 'en' (English), or 'mr' (Marathi)\n"
        "- mode: 'ACTION' (for recharges, travel, bills, shopping) or 'RESOLVE' (for failed payments, refunds, pending transactions, complaints)\n"
        "- service: 'recharge', 'travel', 'bill', 'shopping', or 'dispute'\n"
        "- operator: 'jio', 'airtel', 'vi', or 'bsnl' (if applicable)\n"
        "- budget: integer approximate price limit or 300\n"
        "- data_daily: string like '2 GB / Day' or '1.5 GB / Day'\n"
        "- wants_netflix: boolean true if netflix is mentioned\n"
        "- response_hi: Friendly, concise, professional response in Hindi / Hinglish\n"
        "- response_en: Friendly, concise, professional response in English\n"
        "Return ONLY raw valid JSON, no markdown formatting."
    )

    llm_output = call_groq_llm(query, system_prompt)
    if llm_output:
        try:
            # Clean markdown code blocks if any
            clean_json = llm_output.strip()
            if clean_json.startswith("```json"):
                clean_json = clean_json[7:]
            if clean_json.startswith("```"):
                clean_json = clean_json[3:]
            if clean_json.endswith("```"):
                clean_json = clean_json[:-3]
            return json.loads(clean_json.strip())
        except Exception as e:
            print("Groq JSON parsing error:", e)

    return None
