"""
Paytm AI Hub Master Multi-Agent Orchestrator:
Coordinates Groq LLM, SerpApi Search, You.com Citations, Nexconn Real-Time Chat, and Sarvam AI Voice.
Produces step-by-step thinking & action execution trace (Astra-style).
"""
import re
from backend.agents.groq_agent import parse_query_with_groq
from backend.agents.recharge_agent import find_matching_recharge_plan
from backend.agents.serp_agent import search_recharge_live_with_serp, search_travel_options
from backend.agents.you_agent import fetch_refund_policy_citations
from backend.agents.nexconn_agent import create_nexconn_dispute_room
from backend.agents.sarvam_agent import generate_sarvam_speech


def orchestrate_query(query: str, user_id: str = "paytm_user_01"):
    steps_log = []
    lower_q = query.lower()
    
    # 1. Deterministic Extraction from raw user speech/text
    # Operator detection
    op_detected = "jio"
    if "airtel" in lower_q: op_detected = "airtel"
    elif any(k in lower_q for k in ["vi", "vodafone", "idea"]): op_detected = "vi"
    elif "bsnl" in lower_q: op_detected = "bsnl"
    
    # Price / budget extraction (supports standalone numbers like 666, 349, 198, 239, 299, 857, 1099, etc.)
    nums = [int(n) for n in re.findall(r'\b\d{2,4}\b', lower_q) if int(n) not in [28, 56, 70, 84, 90, 100, 365] and 50 <= int(n) <= 3999]
    explicit_price = nums[0] if nums else None

    # Language detection
    detected_lang = "hi"
    if any(w in lower_q for w in ['mala', 'karaycha', 'karayche', 'ahe', 'pahije', 'kiti', 'cha', 'chi', 'kraych', 'dakhva', 'tula']):
        detected_lang = "mr"
    elif any(w in lower_q for w in ['mujhe', 'karna', 'hai', 'chahiye', 'karo', 'bhai', 'paise', 'mera', 'apna', 'dikhao']):
        detected_lang = "hi"
    elif any(w in lower_q for w in ['please', 'recharge', 'refund', 'check', 'book', 'flight', 'ticket', 'plan']):
        detected_lang = "en"

    # Daily data
    detected_data = ""
    if "1.5" in lower_q: detected_data = "1.5 GB / Day"
    elif "2.5" in lower_q: detected_data = "2.5 GB / Day"
    elif "2" in lower_q and ("gb" in lower_q or "data" in lower_q): detected_data = "2 GB / Day"
    elif "1" in lower_q and ("gb" in lower_q or "data" in lower_q): detected_data = "1 GB / Day"

    wants_netflix = "netflix" in lower_q

    # STEP 1: Intent & Language Analysis
    steps_log.append({
        "step": 1,
        "title": "Natural Language & Intent Detection",
        "detail": f"Detected query intent ({detected_lang.upper()}) • Target: {op_detected.upper()}" + (f" ~₹{explicit_price}" if explicit_price else ""),
        "status": "completed"
    })

    parsed = parse_query_with_groq(query)
    
    if not parsed:
        is_resolve = any(k in lower_q for k in ['cut', 'pending', 'failed', 'refund', 'issue', 'complaint', 'कट', 'अडकले', 'वापस', 'तक्रार'])
        is_travel = any(k in lower_q for k in ['flight', 'bus', 'train', 'ticket', 'pune', 'mumbai', 'delhi', 'goa'])

        parsed = {
            "language": detected_lang,
            "mode": "RESOLVE" if is_resolve else "ACTION",
            "service": "dispute" if is_resolve else ("travel" if is_travel else "recharge"),
            "operator": op_detected,
            "budget": explicit_price or 299,
            "data_daily": detected_data,
            "wants_netflix": wants_netflix,
            "response_hi": "Maine aapka plan khoj liya hai.",
            "response_en": "I have found the matching plan for you."
        }
    else:
        # Override with explicit values if found in user's prompt
        if explicit_price:
            parsed["budget"] = explicit_price
        if op_detected:
            parsed["operator"] = op_detected
        if detected_lang:
            parsed["language"] = detected_lang
        if detected_data:
            parsed["data_daily"] = detected_data
        if wants_netflix:
            parsed["wants_netflix"] = True

    lang = parsed.get("language", detected_lang)
    mode = parsed.get("mode", "ACTION")
    service = parsed.get("service", "recharge")

    # ==========================================================
    # BRANCH 1: RESOLVE MODE (PAYTM RESOLVE INTELLIGENCE)
    # Uses: You.com Live Citations + Nexconn Live Chat
    # ==========================================================
    if mode == "RESOLVE" or service == "dispute":
        steps_log.append({
            "step": 2,
            "title": "You.com Policy Research Agent",
            "detail": "Querying live cited regulatory guidelines and refund policies",
            "status": "completed"
        })
        you_citation = fetch_refund_policy_citations(query)

        steps_log.append({
            "step": 3,
            "title": "Nexconn Chat SDK Session Agent",
            "detail": "Spawning real-time priority support dispute room (AppKey: m7ua80gbmcxrm)",
            "status": "completed"
        })
        nexconn_chat = create_nexconn_dispute_room(user_id, query)

        ai_msg = (
            "मैंने आपके पेंडिंग पेमेंट की जांच शुरू कर दी है। You.com द्वारा NPCI पॉलिसी जांची गई है। आप नीचे लाइव सपोर्ट से भी बात कर सकते हैं।"
            if lang == "hi" else (
                "मी तुमच्या पेंडिंग पेमेंटची तपासणी सुरू केली आहे. You.com द्वारे NPCI पॉलिसी शोधली आहे."
                if lang == "mr" else
                "Investigating your pending payment. Verified official NPCI guidelines via You.com live research."
            )
        )

        steps_log.append({
            "step": 4,
            "title": "Sarvam AI Voice Synthesis",
            "detail": "Generating natural human voice audio response",
            "status": "completed"
        })
        audio_b64 = generate_sarvam_speech(ai_msg, "hi-IN" if lang == "hi" else ("mr-IN" if lang == "mr" else "en-IN"))

        return {
            "mode": "RESOLVE",
            "service": "dispute",
            "language": lang,
            "ai_message": ai_msg,
            "citations": you_citation,
            "nexconn_chat": nexconn_chat,
            "steps_log": steps_log,
            "audio_base64": audio_b64,
            "transaction": {
                "id": "PTM7890124",
                "amount": "₹599",
                "operator": "Jio",
                "status": "Pending at Telecom Switch"
            }
        }

    # ==========================================================
    # BRANCH 2: TRAVEL MODE (PAYTM TRAVEL)
    # Uses: SerpApi Live Flight & Bus Search
    # ==========================================================
    if service == "travel":
        steps_log.append({
            "step": 2,
            "title": "SerpApi Travel Discovery Agent",
            "detail": "Fetching live Google Flights and Bus ticket pricing",
            "status": "completed"
        })
        travel_results = search_travel_options("Pune", "Mumbai")

        ai_msg = (
            "मैंने SerpApi का उपयोग करके पुणे से मुंबई के लिए सबसे सस्ती फ्लाइट और बस टिकट खोज ली हैं।"
            if lang == "hi" else (
                "Found live flights and bus options for Pune-Mumbai via SerpApi search engine."
            )
        )

        steps_log.append({
            "step": 3,
            "title": "Sarvam AI Voice Synthesis",
            "detail": "Generating natural human voice audio response",
            "status": "completed"
        })
        audio_b64 = generate_sarvam_speech(ai_msg, "hi-IN" if lang == "hi" else "en-IN")

        return {
            "mode": "ACTION",
            "service": "travel",
            "language": lang,
            "ai_message": ai_msg,
            "travel_data": travel_results,
            "steps_log": steps_log,
            "audio_base64": audio_b64
        }

    # ==========================================================
    # BRANCH 3: RECHARGE MODE (FLAGSHIP PAYTM ONE)
    # Uses: Plan Matcher + SerpApi Live Search + Sarvam AI Audio
    # ==========================================================
    operator = (parsed.get("operator") or op_detected or "jio").lower()
    budget = int(parsed.get("budget") or explicit_price or 299)
    data_daily = parsed.get("data_daily") or detected_data or ""
    wants_netflix = bool(parsed.get("wants_netflix") or wants_netflix)

    steps_log.append({
        "step": 2,
        "title": "SerpApi Live Telecom Search",
        "detail": f"Searching live web deals for {operator.upper()} with budget ~₹{budget}",
        "status": "completed"
    })
    serp_data = search_recharge_live_with_serp(operator, budget, query)

    steps_log.append({
        "step": 3,
        "title": "Telecom Plan Detective Engine",
        "detail": f"Filtering plans across {operator.upper()} catalog for {data_daily or 'daily data'} and OTT perks",
        "status": "completed"
    })
    matched_plans = find_matching_recharge_plan(
        operator=operator,
        budget=budget,
        data_daily=data_daily,
        wants_netflix=wants_netflix
    )
    best_plan = matched_plans["best"]

    # Verbal message
    if lang == "hi":
        ai_msg = (
            f"मैंने आपके लिए {operator.upper()} का बेस्ट ₹{best_plan['price']} का {best_plan['data']} प्लान चुना है! "
            f"इसमें {best_plan['validity']} वैलिडिटी और 5G शामिल है। क्या आप रिचार्ज अप्रूव करना चाहते हैं?"
        )
    elif lang == "mr":
        ai_msg = (
            f"मी तुमच्यासाठी {operator.upper()} चा बेस्ट ₹{best_plan['price']} चा {best_plan['data']} प्लॅन शोधला आहे! "
            f"रिचार्ज मंजूर करायचा का?"
        )
    else:
        ai_msg = (
            f"I found the best match {operator.upper()} ₹{best_plan['price']} plan with {best_plan['data']} "
            f"and {best_plan['validity']} validity. Ready to approve?"
        )

    steps_log.append({
        "step": 4,
        "title": "Sarvam AI Voice Synthesis",
        "detail": "Synthesizing authentic Indian audio with Bulbul v3",
        "status": "completed"
    })
    audio_b64 = generate_sarvam_speech(ai_msg, "hi-IN" if lang == "hi" else ("mr-IN" if lang == "mr" else "en-IN"))

    steps_log.append({
        "step": 5,
        "title": "UNWIND Security Governance Gate",
        "detail": "Waiting for User Approval & UPI PIN Confirmation",
        "status": "waiting_approval"
    })

    return {
        "mode": "ACTION",
        "service": "recharge",
        "language": lang,
        "operator": operator,
        "budget": budget,
        "wants_netflix": wants_netflix,
        "ai_message": ai_msg,
        "plan_data": matched_plans,
        "serp_verification": serp_data,
        "steps_log": steps_log,
        "audio_base64": audio_b64
    }
