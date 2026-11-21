"""
Groq LLM Engine: Fast intent classification, constraint extraction, and natural language synthesis in Hindi, English, and Marathi.
"""
import os
import json
import requests
from dotenv import load_dotenv

env_file = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), '.env')
if os.path.exists(env_file):
    load_dotenv(env_file, override=True)
else:
    load_dotenv(override=True)
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
GROQ_MODEL = "qwen/qwen3.8-27b"


def call_groq_llm(prompt: str, system_prompt: str = "") -> str:
    """
    Calls Groq OpenAI-compatible chat completion endpoint with strict JSON mode.
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
            "response_format": {"type": "json_object"},
            "temperature": 0.2,
            "max_tokens": 500
        }
        resp = requests.post(url, headers=headers, json=payload, timeout=(2.0, 6.0))
        if resp.status_code == 200:
            return resp.json()["choices"][0]["message"]["content"].strip()
    except Exception as e:
        print("Groq LLM call error:", e)
    
    return ""


def parse_query_with_groq(query: str):
    """
    Uses Groq LLM (ChatGPT / Gemini grade) to intelligently extract intent, entities, 
    locations (from_city, to_city, city), amounts, and generate natural responses in Marathi, Hindi & English.
    """
    system_prompt = (
        "You are the Paytm AI Hub Master Intelligent Assistant (conversational like ChatGPT & Gemini). "
        "Analyze the user's input (in Hindi, Marathi, Devanagari, English, or Hinglish) "
        "and return a strict JSON object with these keys:\n"
        "- language: 'mr' (Marathi), 'hi' (Hindi/Hinglish), or 'en' (English)\n"
        "- mode: 'CHAT' (for general chat, greetings like 'aur kaise ho', asking 'kya help kar sakte ho', general knowledge, questions), "
        "'ACTION' (for recharges, travel, bus, flight, train, hotels, movies, shopping, bill payments, expenses, merchant dashboard), "
        "or 'RESOLVE' (for failed payments, pending transactions, refund requests, complaints, lost money)\n"
        "- service: 'chat' (general chitchat/help), 'travel' (bus, train, flight, ticket), 'hotel' (hotel, stay), "
        "'recharge' (mobile recharge), 'electricity', 'fastag', 'dth', 'shopping' (deals, offers), "
        "'movie' (cinema, films), 'gold', 'merchant' (pay to merchant qr), 'merchant_summary' (merchant asking today's collection/soundbox total/earnings), "
        "'expense' (spending analysis, expense breakdown, 'या महिन्यात माझे पैसे कुठे खर्च झाले', 'मेरा खर्चा दिखाओ'), or 'dispute' (payment problems/refunds)\n"
        "- from_city: string English name of departure city (e.g. 'Phaltan' for पलटन/फलटण, 'Pune', 'Mumbai', 'Delhi', 'Nagpur', 'Goa', etc.) or null\n"
        "- to_city: string English name of arrival/destination city (e.g. 'Pune', 'Mumbai', 'Goa', 'Delhi', etc.) or null\n"
        "- travel_type: 'flight', 'train', 'bus', or 'travel'\n"
        "- city: string English name of city for movies, hotels, or local shopping (e.g. 'Phaltan', 'Pune', 'Mumbai') or null\n"
        "- operator: 'jio', 'airtel', 'vi', or 'bsnl' (if applicable) or null\n"
        "- amount: integer specific amount mentioned (e.g. 500, 599, 230, 299, 1200) or null\n"
        "- budget: integer budget limit or null\n"
        "- data_daily: string like '2 GB / Day' or null\n"
        "- wants_netflix: boolean true if netflix is mentioned\n"
        "- response_mr: Friendly, highly intelligent, natural conversational response in Marathi\n"
        "- response_hi: Friendly, highly intelligent, natural conversational response in Hindi / Hinglish\n"
        "- response_en: Friendly, highly intelligent, natural conversational response in English\n"
        "- suggested_replies: array of 4 short, relevant follow-up prompt suggestions\n"
        "IMPORTANT RULES:\n"
        "1. If user just greets or asks 'aur kaise ho', 'kya help kar sakte ho', 'who are you', 'how does this work', mode MUST BE 'CHAT' and service MUST BE 'chat'. Give a warm, helpful reply explaining both Action Mode and Resolve Mode!\n"
        "2. If user mentions travel from one city to another (e.g. 'पलटन से पुणे', 'Phaltan to Pune', 'Nagpur to Goa'), extract from_city and to_city accurately! Phaltan/पलटन/फलटण is 'Phaltan'.\n"
        "3. If user mentions movie or hotel, extract city (e.g. 'पलटन में मूवी' -> city: 'Phaltan', service: 'movie').\n"
        "4. Only use 'dispute' when user is complaining about failed transaction, lost money, or requesting a refund.\n"
        "Return ONLY raw valid JSON, no markdown formatting."
    )

    llm_output = call_groq_llm(query, system_prompt)
    if llm_output:
        try:
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
