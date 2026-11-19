"""
Paytm AI Hub Master Orchestrator:
Routes queries between Paytm ONE (Action Mode) and Paytm Resolve (Dispute Mode)
"""
import re
from backend.agents.recharge_agent import find_matching_recharge_plan
from backend.agents.serp_agent import search_travel_options
from backend.agents.you_agent import fetch_refund_policy_citations
from backend.agents.nexconn_agent import initiate_live_support_session


def detect_language(query: str) -> str:
    lower = query.lower()
    marathi_markers = ['मला', 'करायचं', 'आहे', 'पाहिजे', 'पैसे', 'कट', 'झाले', 'दाखव', 'करा', 'नाही', 'बजेट', 'दिवस']
    hindi_markers = ['मुझे', 'करना', 'है', 'चाहिए', 'कट', 'गए', 'दिखाओ', 'रिचार्ज', 'दिन', 'बताओ']

    if any(m in lower for m in marathi_markers):
        return 'mr'
    if any(m in lower for m in hindi_markers):
        return 'hi'
    return 'en'


def orchestrate_query(query: str, user_id: str = "guest_user"):
    lower = query.lower()
    lang = detect_language(query)

    # 1. RESOLVE MODE CHECK
    dispute_keywords = ['cut', 'कट', 'pending', 'failed', 'refund', 'अडकले', 'झाला नाही', 'issue', 'complaint', 'पैसे कट']
    if any(k in lower for k in dispute_keywords):
        citation_data = fetch_refund_policy_citations()
        chat_data = initiate_live_support_session(user_id, query)

        msg = "मी तुमचा पेंडिंग ट्रॅन्झॅक्शन तपासत आहे. You.com द्वारे NPCI रिफंड पॉलिसी शोधली आहे." if lang == 'mr' else (
            "मैं आपका पेंडिंग ट्रांजैक्शन चेक कर रहा हूं। You.com द्वारा रिफंड पॉलिसी जांची गई है।" if lang == 'hi' else
            "Investigating your pending transaction. Verified NPCI guidelines via You.com."
        )

        return {
            "mode": "RESOLVE",
            "service": "dispute",
            "detected_language": lang,
            "ai_message": msg,
            "citations": citation_data,
            "nexconn_chat": chat_data,
            "transaction": {
                "id": "PTM7890124",
                "amount": "₹599",
                "operator": "Jio",
                "status": "Pending at Telecom Switch"
            }
        }

    # 2. TRAVEL MODE CHECK
    travel_keywords = ['flight', 'train', 'bus', 'ticket', 'mumbai', 'pune', 'तिकीट', 'प्रवास']
    if any(k in lower for k in travel_keywords):
        travel_results = search_travel_options("Pune", "Mumbai")
        msg = "पुणे-मुंबई प्रवासासाठी SerpApi वरून स्वस्त पर्याय शोधले आहेत." if lang == 'mr' else (
            "पुणे-मुंबई के लिए SerpApi से सस्ते विकल्प खोजे गए हैं।" if lang == 'hi' else
            "Found live travel options for Pune-Mumbai via SerpApi."
        )
        return {
            "mode": "ACTION",
            "service": "travel",
            "detected_language": lang,
            "ai_message": msg,
            "travel_data": travel_results
        }

    # 3. RECHARGE MODE (FLAGSHIP PAYTM ONE)
    operator = "jio"
    if "airtel" in lower or "एअरटेल" in lower:
        operator = "airtel"
    elif "vi" in lower or "vodafone" in lower or "व्होडाफोन" in lower:
        operator = "vi"

    budget = 300
    prices = [int(p) for p in re.findall(r'\b\d{3,4}\b', query) if 100 <= int(p) <= 2000]
    if prices:
        budget = prices[0]

    wants_netflix = "netflix" in lower or "नेटफ्लिक्स" in lower
    plan_result = find_matching_recharge_plan(operator=operator, budget=budget, wants_netflix=wants_netflix)

    best = plan_result["best"]
    msg = f"मी तुमच्यासाठी {operator.upper()} चा बेस्ट ₹{best['price']} चा {best['data']} प्लॅन शोधला आहे! रिचार्ज मंजूर करायचा का?" if lang == 'mr' else (
        f"मैंने आपके लिए {operator.upper()} का बेस्ट ₹{best['price']} का {best['data']} प्लान चुना है। क्या रिचार्ज कन्फर्म करें?" if lang == 'hi' else
        f"Found best match {operator.upper()} ₹{best['price']} with {best['data']}. Ready to approve?"
    )

    return {
        "mode": "ACTION",
        "service": "recharge",
        "detected_language": lang,
        "operator": operator,
        "budget": budget,
        "wants_netflix": wants_netflix,
        "ai_message": msg,
        "plan_data": plan_result
    }
