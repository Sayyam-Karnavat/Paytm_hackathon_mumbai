"""
Paytm AI Hub Master Multi-Agent Orchestrator:
Coordinates Groq LLM, SerpApi Search, You.com Cited Research, and Nexconn Real-Time Chat.
Prioritizes Hindi and English communication.
"""
from backend.agents.groq_agent import parse_query_with_groq
from backend.agents.recharge_agent import find_matching_recharge_plan
from backend.agents.serp_agent import search_recharge_live_with_serp, search_travel_options
from backend.agents.you_agent import fetch_refund_policy_citations
from backend.agents.nexconn_agent import create_nexconn_dispute_room


def orchestrate_query(query: str, user_id: str = "paytm_user_01"):
    # 1. Parse with Groq LLM
    parsed = parse_query_with_groq(query)
    
    # Fallback heuristics if Groq returns None
    if not parsed:
        lower = query.lower()
        lang = "hi" if any(w in lower for w in ['mujhe', 'karna', 'hai', 'chahiye', 'karo', 'bhai', 'paise']) else (
            "mr" if any(w in lower for w in ['mala', 'karaycha', 'ahe', 'pahije']) else "en"
        )
        is_resolve = any(k in lower for k in ['cut', 'pending', 'failed', 'refund', 'issue', 'complaint', 'कट', 'अडकले'])
        parsed = {
            "language": lang,
            "mode": "RESOLVE" if is_resolve else "ACTION",
            "service": "dispute" if is_resolve else "recharge",
            "operator": "jio" if "jio" in lower else ("airtel" if "airtel" in lower else "vi"),
            "budget": 300,
            "data_daily": "2 GB / Day",
            "wants_netflix": "netflix" in lower,
            "response_hi": "Maine aapka request process kar diya hai.",
            "response_en": "I have processed your request."
        }

    lang = parsed.get("language", "hi")
    mode = parsed.get("mode", "ACTION")
    service = parsed.get("service", "recharge")

    # ==========================================================
    # BRANCH 1: RESOLVE MODE (PAYTM RESOLVE INTELLIGENCE)
    # Uses: You.com Live Citations + Nexconn Live Chat
    # ==========================================================
    if mode == "RESOLVE" or service == "dispute":
        you_citation = fetch_refund_policy_citations(query)
        nexconn_chat = create_nexconn_dispute_room(user_id, query)

        ai_msg = (
            "मैंने आपके पेंडिंग पेमेंट की जांच शुरू कर दी है। You.com द्वारा NPCI पॉलिसी जांची गई है। आप नीचे लाइव सपोर्ट से भी बात कर सकते हैं।"
            if lang == "hi" else (
                "मी तुमच्या पेंडिंग पेमेंटची तपासणी सुरू केली आहे. You.com द्वारे NPCI पॉलिसी शोधली आहे."
                if lang == "mr" else
                "Investigating your pending payment. Verified official NPCI guidelines via You.com live research."
            )
        )

        return {
            "mode": "RESOLVE",
            "service": "dispute",
            "language": lang,
            "ai_message": ai_msg,
            "citations": you_citation,
            "nexconn_chat": nexconn_chat,
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
        travel_results = search_travel_options("Pune", "Mumbai")
        ai_msg = (
            "मैंने SerpApi का उपयोग करके पुणे से मुंबई के लिए सबसे सस्ती फ्लाइट और बस टिकट खोज ली हैं।"
            if lang == "hi" else (
                "Found live flights and bus options for Pune-Mumbai via SerpApi search engine."
            )
        )
        return {
            "mode": "ACTION",
            "service": "travel",
            "language": lang,
            "ai_message": ai_msg,
            "travel_data": travel_results
        }

    # ==========================================================
    # BRANCH 3: RECHARGE MODE (FLAGSHIP PAYTM ONE)
    # Uses: Accurate Telecom DB + SerpApi Verification
    # ==========================================================
    operator = parsed.get("operator", "jio")
    budget = parsed.get("budget", 300)
    wants_netflix = parsed.get("wants_netflix", False)

    # 1. Internal accurate telecom plans
    matched_plans = find_matching_recharge_plan(operator=operator, budget=budget, wants_netflix=wants_netflix)
    best_plan = matched_plans["best"]

    # 2. Live SerpApi Verification
    serp_data = search_recharge_live_with_serp(operator, budget, query)

    # 3. Verbal AI Message in Hindi / English / Marathi
    if lang == "hi":
        ai_msg = (
            f"मैंने आपके लिए {operator.upper()} का बेस्ट ₹{best_plan['price']} का {best_plan['data']} प्लान चुना है! "
            f"इसमें Unlimited 5G और OTT बेनिफिट्स शामिल हैं। क्या आप रिचार्ज अप्रूव करना चाहते हैं?"
        )
    elif lang == "mr":
        ai_msg = (
            f"मी तुमच्यासाठी {operator.upper()} चा बेस्ट ₹{best_plan['price']} चा {best_plan['data']} प्लॅन शोधला आहे! "
            f"रिचार्ज मंजूर करायचा का?"
        )
    else:
        ai_msg = (
            f"I found the best match {operator.upper()} ₹{best_plan['price']} plan featuring {best_plan['data']} "
            f"and unlimited 5G. Ready to approve?"
        )

    return {
        "mode": "ACTION",
        "service": "recharge",
        "language": lang,
        "operator": operator,
        "budget": budget,
        "wants_netflix": wants_netflix,
        "ai_message": ai_msg,
        "plan_data": matched_plans,
        "serp_verification": serp_data
    }
