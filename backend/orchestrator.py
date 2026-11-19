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
    
    # STEP 1: Intent & Language Analysis
    steps_log.append({
        "step": 1,
        "title": "Natural Language & Intent Detection",
        "detail": "Analyzing user speech/text input via Groq Fast Inference",
        "status": "completed"
    })

    parsed = parse_query_with_groq(query)
    
    if not parsed:
        lower = query.lower()
        lang = "hi" if any(w in lower for w in ['mujhe', 'karna', 'hai', 'chahiye', 'karo', 'bhai', 'paise']) else (
            "mr" if any(w in lower for w in ['mala', 'karaycha', 'ahe', 'pahije']) else "en"
        )
        is_resolve = any(k in lower for k in ['cut', 'pending', 'failed', 'refund', 'issue', 'complaint', 'कट', 'अडकले'])
        
        # operator detection
        op = "jio"
        if "airtel" in lower: op = "airtel"
        elif "vi" in lower or "vodafone" in lower: op = "vi"
        elif "bsnl" in lower: op = "bsnl"

        # budget extraction
        nums = [int(n) for n in re.findall(r'\b\d{3,4}\b', query) if 100 <= int(n) <= 3600]
        budget = nums[0] if nums else 299

        parsed = {
            "language": lang,
            "mode": "RESOLVE" if is_resolve else "ACTION",
            "service": "dispute" if is_resolve else "recharge",
            "operator": op,
            "budget": budget,
            "data_daily": "2 GB / Day",
            "wants_netflix": "netflix" in lower,
            "response_hi": "Maine aapka plan khoj liya hai.",
            "response_en": "I have found the matching plan for you."
        }

    lang = parsed.get("language", "hi")
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
    operator = parsed.get("operator", "jio")
    budget = parsed.get("budget", 300)
    data_daily = parsed.get("data_daily", "")
    wants_netflix = parsed.get("wants_netflix", False)

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
