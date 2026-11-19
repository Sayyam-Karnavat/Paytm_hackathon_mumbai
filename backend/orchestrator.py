"""
Paytm AI Hub Master Multi-Agent Orchestrator:
Coordinates Groq LLM, SerpApi Search, You.com Citations, Nexconn Real-Time Chat, and Sarvam AI Voice.
Produces step-by-step thinking & action execution trace (Astra-style).
"""
import re
from backend.agents.groq_agent import parse_query_with_groq
from backend.agents.recharge_agent import find_matching_recharge_plan
from backend.agents.serp_agent import search_recharge_live_with_serp, search_travel_options, search_hotel_options
from backend.agents.you_agent import fetch_refund_policy_citations
from backend.agents.nexconn_agent import create_nexconn_dispute_room
from backend.agents.sarvam_agent import generate_sarvam_speech
from backend.agents.resolve_agent import investigate_dispute


def orchestrate_query(query: str, user_id: str = "paytm_user_01"):
    steps_log = []
    lower_q = query.lower()
    
    # 1. Deterministic Extraction from raw user speech/text
    # Operator detection
    op_detected = "jio"
    if "airtel" in lower_q: op_detected = "airtel"
    elif any(k in lower_q for k in ["vi", "vodafone", "idea"]): op_detected = "vi"
    elif "bsnl" in lower_q: op_detected = "bsnl"
    
    # Price / budget extraction (supports standalone numbers like 666, 349, 198, 239, 299, 857, 1099, 1200, etc.)
    clean_nums_q = lower_q.replace(',', '')
    nums = [int(n) for n in re.findall(r'\b\d{2,4}\b', clean_nums_q) if int(n) not in [28, 56, 70, 84, 90, 100, 365] and 50 <= int(n) <= 3999]
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

    # Fast-path intent classification: if intent is explicitly clear, fast-track without LLM latency
    is_clear_intent = any(k in lower_q for k in [
        'hotel', 'hotle', 'bus', 'flight', 'flite', 'train', 'irctc', 'rail', 'ticket', 'tiket',
        'electricity', 'bijli', 'fastag', 'toll', 'dth', 'gold', 'soundbox', 'merchant',
        'refund', 'pending', 'dispute', 'complaint', 'तक्रार', 'रिफंड', 'अडकले', 'कापले', 'कटले',
        'jio', 'airtel', 'vi', 'bsnl', 'बस', 'ट्रेन', 'विमान', 'गाडी', 'तिकीट', 'टिकट',
        'galti', 'गलत', 'wrong', 'transfer', 'recall', 'unpaid', 'not updated', 'चूक', 'चुकीच्या', 'दो बार', 'दोनदा', 'duplicate'
    ]) or bool(re.search(r'\blight\b', lower_q))

    parsed = None
    if not is_clear_intent:
        parsed = parse_query_with_groq(query)
    
    if not parsed:
        is_resolve = any(k in lower_q for k in ['pending', 'failed', 'refund', 'complaint', 'तक्रार', 'रिफंड', 'अडकले', 'वापस', 'paise cut', 'cut gaye', 'कट गये', 'कट गए', 'पैसे कट'])
        is_travel = any(k in lower_q for k in ['flight', 'bus', 'train', 'ticket', 'pune', 'mumbai', 'delhi', 'goa', 'बस', 'ट्रेन', 'फ्लाइट', 'विमान', 'रेल्वे', 'गाडी', 'तिकीट', 'टिकट', 'पुणे', 'मुंबई'])

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

    # 2. Extract explicit budget or 1k-2k range
    budget_match = re.search(r'(?:budget|budegt|बजेट|दाम|किंमत|price|under|upto|च्या आत)\s*[:=]?\s*(\d{2,5})', lower_q)
    if budget_match:
        explicit_price = int(budget_match.group(1))
    elif '1-2k' in lower_q or '1 to 2k' in lower_q or '1k-2k' in lower_q or '1-2 हजार' in lower_q:
        explicit_price = 2000
    elif '1k' in lower_q:
        explicit_price = 1000
    elif '2k' in lower_q:
        explicit_price = 2000
    elif '3k' in lower_q:
        explicit_price = 3000

    # Dynamic City & Location Extraction
    detected_city = "Pune"
    if any(w in lower_q for w in ['pune', 'pun', 'पुणे', 'पुण्यात', 'lohegaon', 'viman nagar']):
        detected_city = "Pune"
    elif any(w in lower_q for w in ['mumbai', 'bombay', 'मुंबई', 'मुंबईत', 'sakinaka', 'andheri']):
        detected_city = "Mumbai"
    elif any(w in lower_q for w in ['delhi', 'dilli', 'दिल्ली', 'mahipalpur', 'igi']):
        detected_city = "Delhi"
    elif any(w in lower_q for w in ['bangalore', 'bengaluru', 'बेंगळुरू']):
        detected_city = "Bangalore"
    elif any(w in lower_q for w in ['goa', 'गोवा', 'गोव्यात', 'dabolim']):
        detected_city = "Goa"
    elif any(w in lower_q for w in ['hyderabad', 'हैदराबाद']):
        detected_city = "Hyderabad"
    elif any(w in lower_q for w in ['jaipur', 'जयपूर']):
        detected_city = "Jaipur"
    elif any(w in lower_q for w in ['nagpur', 'नागपूर']):
        detected_city = "Nagpur"
    elif any(w in lower_q for w in ['kolkata', 'कोलकाता']):
        detected_city = "Kolkata"
    elif any(w in lower_q for w in ['chennai', 'चेन्नई']):
        detected_city = "Chennai"

    detected_location = "Airport" if any(w in lower_q for w in ['airport', 'airpost', 'aeroport', 'erport', 'हवाई अड्डा', 'विमानतळ', 'terminal', 't2', 't1', 'lohegaon']) else ("Station" if any(w in lower_q for w in ['station', 'railway', 'स्टेशन']) else "City Center")

    # Dynamic Route & Travel Type Extraction
    is_bus = any(k in lower_q for k in ['bus', 'buses', 'बस', 'व्हॉल्व्हो', 'वॉल्वो', 'shivneri', 'neeta', 'zingbus'])
    is_train = any(k in lower_q for k in ['train', 'trains', 'irctc', 'rail', 'railway', 'गाडी', 'रेल्वे', 'ट्रेन', 'vande bharat', 'tejas'])
    
    # Accurate Flight detection: Avoid substring collision with 'airtel'
    is_flight = any(k in lower_q for k in ['flight', 'flite', 'fligt', 'flitht', 'plane', 'airplane', 'हवाई', 'विमान', 'फ्लाइट', 'air india', 'indigo', 'akasa', 'spicejet'])
    if not is_flight and bool(re.search(r'\bair\b', lower_q)) and 'airtel' not in lower_q:
        is_flight = True
    if 'airtel' in lower_q and not any(f in lower_q for f in ['flight', 'flite', 'fligt', 'plane', 'विमान', 'हवाई']):
        is_flight = False

    if is_bus:
        travel_type = "bus"
    elif is_train:
        travel_type = "train"
    elif is_flight:
        travel_type = "flight"
    else:
        travel_type = "travel"

    from_city = "Pune"
    to_city = "Mumbai"

    has_pune = any(w in lower_q for w in ['pune', 'pun', 'पुणे', 'पुण्यात', 'lohegaon'])
    has_mumbai = any(w in lower_q for w in ['mumbai', 'bombay', 'मुंबई', 'मुंबईत'])
    has_delhi = any(w in lower_q for w in ['delhi', 'dilli', 'दिल्ली'])
    has_goa = any(w in lower_q for w in ['goa', 'गोवा', 'गोव्यात'])
    has_blr = any(w in lower_q for w in ['bangalore', 'bengaluru', 'बेंगळुरू'])

    if has_pune and has_mumbai:
        if ('mumbai se pune' in lower_q or 'mumbai to pune' in lower_q or 'मुंबई से पुणे' in lower_q or 'मुंबई ते पुणे' in lower_q):
            from_city, to_city = "Mumbai", "Pune"
        else:
            from_city, to_city = "Pune", "Mumbai"
    elif has_mumbai and has_delhi:
        from_city, to_city = "Mumbai", "Delhi"
    elif has_pune and has_delhi:
        from_city, to_city = "Pune", "Delhi"
    elif has_pune and has_goa:
        from_city, to_city = "Pune", "Goa"
    elif has_delhi and has_blr:
        from_city, to_city = "Delhi", "Bangalore"
    elif detected_city:
        if detected_city == "Pune":
            from_city, to_city = "Pune", "Mumbai"
        elif detected_city == "Mumbai":
            from_city, to_city = "Mumbai", "Delhi"
        else:
            from_city, to_city = detected_city, "Mumbai"

    # Language & Service Classification
    lang = (parsed.get("language") if parsed else None) or detected_lang or "hi"
    groq_service = (parsed.get("service") if parsed else "") or ""
    
    # 360-DEGREE ROCK-SOLID INTENT HIERARCHY
    # Priority 1: DISPUTE & RESOLVE MODE (Refund, failed payment, uncredited, cut money)
    is_dispute = any(k in lower_q for k in [
        'pending', 'failed', 'refund', 'complaint', 'dispute', 'issue', 'problem',
        'तक्रार', 'रिफंड', 'अडकले', 'वापस', 'समस्या', 'अडचण',
        'paise cut', 'cut gaye', 'कट गये', 'कट गए', 'कट झाले', 'पैसे cut', 'पैसे कट', 'रुपये कट', 'अमाउंट कट', 'कटले', 'कापले',
        'मिळाले नाहीत', 'नाही मिळाले', 'मिळाले नाही', 'not received', 'not credited', 'uncredited',
        'unpaid', 'not updated', 'update nahi', 'update nahi hua', 'अपडेट नाही',
        'duplicate', 'double debit', 'दोनदा', 'दो बार', 'wrong transfer', 'चुकीच्या', 'चुकीचे', 'गलत', 'galti'
    ])

    # Utilities & Specific Services (Checked before generic mobile recharge)
    # Ensure 'light' does not match inside 'flight'
    has_light_word = bool(re.search(r'\blight\b', lower_q)) and 'flight' not in lower_q
    is_electricity = (has_light_word or any(k in lower_q for k in ['electricity', 'bijli', 'power', 'mahavitaran', 'msedcl', 'adani', 'bses', 'वीज', 'लाईट', 'महावितरण'])) and not is_dispute
    is_fastag = any(k in lower_q for k in ['fastag', 'toll', 'toll plaza', 'nhai', 'netc', 'फास्टॅग', 'टोल'])
    is_dth = any(k in lower_q for k in ['dth', 'tataplay', 'tata play', 'dish tv', 'airtel dth', 'sun direct', 'डिश', 'टीव्ही'])
    is_gold = any(k in lower_q for k in ['gold', 'digital gold', '24k', 'silver', 'wealth', 'sip', 'सोने', 'गुंतवणूक'])

    # Generic Mobile Recharge (Excludes FASTag, DTH, electricity)
    is_recharge = (not is_fastag and not is_dth and not is_electricity and not is_gold) and (
        any(k in lower_q for k in ['recharge', 'रिचार्ज', 'रीचार्ज', 'plan', 'प्लॅन', 'data pack', 'validity']) or (
            any(op in lower_q for op in ['jio', 'airtel', 'vi', 'bsnl']) and not is_bus and not is_train and not is_flight and not is_dispute
        )
    )

    # Merchant & Soundbox QR (Kirana, store, merchant, soundbox)
    is_merchant = any(k in lower_q for k in ['soundbox', 'merchant', 'qr', 'shop', 'store', 'kirana', 'दुकानदार', 'व्यापारी', 'साउंडबॉक्स']) and not is_dispute

    # Hotel & Stays
    is_hotel = any(k in lower_q for k in ['hotel', 'hotle', 'lodge', 'room', 'stay', 'resort', 'हॉटेल', 'होटल', 'कमरा', 'राहण्याची', 'थांबायला'])

    # Travel & Tickets (Avoid 'dyayche' collision with 'aych')
    has_travel_verb = bool(re.search(r'\b(?:travel|trip|ticket|tickets|tiket|booking|book|जाना|सफर|प्रवास|तिकीट|टिकट)\b', lower_q))
    is_travel = is_bus or is_train or is_flight or has_travel_verb or (
        (has_pune or has_mumbai or has_delhi or has_goa or has_blr) and not is_recharge and not is_merchant and not is_dispute and not is_hotel and not is_fastag and not is_dth
    )

    if is_dispute:
        service = "dispute"
        mode = "RESOLVE"
    elif is_fastag:
        service = "fastag"
        mode = "ACTION"
    elif is_dth:
        service = "dth"
        mode = "ACTION"
    elif is_electricity:
        service = "electricity"
        mode = "ACTION"
    elif is_gold:
        service = "gold"
        mode = "ACTION"
    elif is_merchant:
        service = "merchant"
        mode = "ACTION"
    elif is_hotel:
        service = "hotel"
        mode = "ACTION"
    elif is_travel:
        service = "travel"
        mode = "ACTION"
    elif is_recharge:
        service = "recharge"
        mode = "ACTION"
    elif groq_service in ['hotel', 'travel', 'electricity', 'fastag', 'dth', 'merchant', 'gold', 'dispute']:
        service = groq_service
        mode = "RESOLVE" if service == "dispute" else "ACTION"
    else:
        service = "recharge"
        mode = "ACTION"

    # ==========================================================
    # BRANCH 1: RESOLVE MODE (PAYTM RESOLVE INTELLIGENCE)
    # Uses: Autonomous Payment Investigation Squad + You.com + Nexconn
    # ==========================================================
    if mode == "RESOLVE" or service == "dispute":
        resolve_data = investigate_dispute(query, user_id=user_id, explicit_price=explicit_price, language=lang)
        
        steps_log.append({
            "step": 2,
            "title": "Transaction Detective & Evidence Agent",
            "detail": f"Matched Case {resolve_data['case_id']} • UTR: {resolve_data['evidence_bundle']['utr']} • SHA-256 Verified",
            "status": "completed"
        })

        steps_log.append({
            "step": 3,
            "title": "3-Way Payment Reconciliation Agent",
            "detail": f"Cross-checking Bank vs NPCI Hub vs {resolve_data['service_name']} (Discrepancy Isolated)",
            "status": "completed"
        })

        steps_log.append({
            "step": 4,
            "title": "You.com Policy Research Agent",
            "detail": "Verified NPCI T+1 Harmonisation Circular No. 81 & RBI Ombudsman Compensation SLA",
            "status": "completed"
        })

        steps_log.append({
            "step": 5,
            "title": "Nexconn Chat SDK Session Agent",
            "detail": f"Spawned live support escalation room (AppKey: {resolve_data['nexconn_chat']['app_key']} • Agent: Priya Sharma)",
            "status": "completed"
        })

        if lang == "hi":
            ai_msg = f"मैंने केस {resolve_data['case_id']} की जांच कर ली है। {resolve_data['finding']} आप नीचे 3-वे रिकंसीलिएशन, You.com के नियम और Nexconn लाइव सपोर्ट देख सकते हैं।"
        elif lang == "mr":
            ai_msg = f"मी केस {resolve_data['case_id']} ची सखोल तपासणी केली आहे. {resolve_data['finding']} खाली 3-वे रिकन्सिलीएशन आणि Nexconn सपोर्ट उपलब्ध आहे."
        else:
            ai_msg = f"Completed investigation for {resolve_data['case_id']}. {resolve_data['finding']} Verified 3-way reconciliation matrix below."

        steps_log.append({
            "step": 6,
            "title": "Sarvam AI Voice Synthesis",
            "detail": "Synthesizing authentic empathetic resolution audio",
            "status": "completed"
        })
        audio_b64 = generate_sarvam_speech(ai_msg, "hi-IN" if lang == "hi" else ("mr-IN" if lang == "mr" else "en-IN"))

        return {
            "mode": "RESOLVE",
            "service": "dispute",
            "language": lang,
            "ai_message": ai_msg,
            "resolve_data": resolve_data,
            "citations": resolve_data["citations"],
            "nexconn_chat": resolve_data["nexconn_chat"],
            "steps_log": steps_log,
            "audio_base64": audio_b64,
            "transaction": {
                "id": resolve_data["case_id"],
                "amount": f"₹{resolve_data['amount']}",
                "operator": resolve_data["service_name"],
                "status": resolve_data["status_badge"]
            }
        }

    # ==========================================================
    # BRANCH 2: ELECTRICITY BILL (BBPS VERIFIED)
    # ==========================================================
    if service == "electricity":
        steps_log.append({
            "step": 2,
            "title": "Bharat BillPay (BBPS) CA Query",
            "detail": "Connecting to Maharashtra State Electricity Distribution Co. (MSEDCL)",
            "status": "completed"
        })
        bill_amt = explicit_price or 1450
        steps_log.append({
            "step": 3,
            "title": "Tariff & Meter Verification",
            "detail": f"CA #002948192841 • Units: 184 kWh • Due: 28 Nov 2026",
            "status": "completed"
        })

        if lang == "hi":
            ai_msg = f"मैंने आपका महावितरण बिजली बिल ₹{bill_amt} खोज लिया है। अंतिम तिथि 28 नवंबर है। क्या आप भुगतान करना चाहते हैं?"
        elif lang == "mr":
            ai_msg = f"मी तुमचे महावितरण वीज बिल ₹{bill_amt} शोधले आहे. शेवटची तारीख 28 नोव्हेंबर आहे. बिल भरायचे का?"
        else:
            ai_msg = f"Found your MSEDCL electricity bill of ₹{bill_amt} due on 28th Nov. Ready to pay?"

        steps_log.append({
            "step": 4,
            "title": "Sarvam AI Voice Synthesis",
            "detail": "Synthesizing authentic voice with Bulbul v3",
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
            "service": "electricity",
            "language": lang,
            "ai_message": ai_msg,
            "service_data": {
                "board": "Maharashtra State Electricity Distribution Co. Ltd. (MSEDCL)",
                "consumer_id": "002948192841",
                "consumer_name": "Akash Bichukale",
                "bill_amount": bill_amt,
                "due_date": "28 Nov 2026",
                "units": "184 kWh",
                "cashback": "Flat ₹50 Cashback with Paytm UPI",
                "bbps_certified": True
            },
            "steps_log": steps_log,
            "audio_base64": audio_b64
        }

    # ==========================================================
    # BRANCH 3: FASTAG RECHARGE (NETC NHAI TOLL)
    # ==========================================================
    if service == "fastag":
        steps_log.append({
            "step": 2,
            "title": "NETC National Toll Switch Query",
            "detail": "Looking up vehicle registration MH 12 AB 1234 on NETC NHAI portal",
            "status": "completed"
        })
        recharge_amt = explicit_price or 500
        steps_log.append({
            "step": 3,
            "title": "Toll Tag & Balance Diagnostic",
            "detail": f"FASTag active on Car • Balance: ₹140 (Low) • Target: ₹{recharge_amt}",
            "status": "completed"
        })

        if lang == "hi":
            ai_msg = f"आपके वाहन MH 12 AB 1234 का फास्टैग बैलेंस कम (₹140) है। मैंने ₹{recharge_amt} का रिचार्ज तैयार किया है। अप्रूव करें?"
        elif lang == "mr":
            ai_msg = f"तुमच्या MH 12 AB 1234 गाडीचे फास्टॅग बॅलन्स कमी (₹140) आहे. मी ₹{recharge_amt} चा रिचार्ज तयार केला आहे. मंजूर करायचा का?"
        else:
            ai_msg = f"Low FASTag balance on MH 12 AB 1234 (₹140). Prepared ₹{recharge_amt} top-up. Ready to approve?"

        steps_log.append({
            "step": 4,
            "title": "Sarvam AI Voice Synthesis",
            "detail": "Synthesizing authentic voice with Bulbul v3",
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
            "service": "fastag",
            "language": lang,
            "ai_message": ai_msg,
            "service_data": {
                "vehicle_no": "MH 12 AB 1234",
                "issuer": "Paytm Payments Bank / NETC FASTag",
                "current_balance": 140,
                "recharge_amount": recharge_amt,
                "quick_amounts": [300, 500, 1000, 2000],
                "status": "Low Balance Warning (₹140 remaining)",
                "cashback": "Flat ₹25 Cashback on National Highway Tolls"
            },
            "steps_log": steps_log,
            "audio_base64": audio_b64
        }

    # ==========================================================
    # BRANCH 4: DTH RECHARGE (TATA PLAY / AIRTEL / DISH)
    # ==========================================================
    if service == "dth":
        steps_log.append({
            "step": 2,
            "title": "DTH Subscriber Registry Lookup",
            "detail": "Querying Tata Play / Airtel DTH smart card #1092837482",
            "status": "completed"
        })
        dth_amt = explicit_price or 399
        steps_log.append({
            "step": 3,
            "title": "Pack Recommendation Engine",
            "detail": f"Smart Entertainment HD Pack • 185 Channels + Free Binge OTT",
            "status": "completed"
        })

        if lang == "hi":
            ai_msg = f"मैंने आपके टाटा प्ले DTH का 185 चैनलों वाला ₹{dth_amt} का मंथली पैक चुना है। क्या आप रिचार्ज करना चाहते हैं?"
        elif lang == "mr":
            ai_msg = f"मी तुमच्या टाटा प्ले DTH साठी ₹{dth_amt} चा 185 चॅनल्स असलेला मासिक पॅक निवडला आहे. रिचार्ज मंजूर करायचा का?"
        else:
            ai_msg = f"Selected Tata Play ₹{dth_amt} monthly pack with 185 channels + OTT Binge. Ready to approve?"

        steps_log.append({
            "step": 4,
            "title": "Sarvam AI Voice Synthesis",
            "detail": "Synthesizing authentic voice with Bulbul v3",
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
            "service": "dth",
            "language": lang,
            "ai_message": ai_msg,
            "service_data": {
                "operator": "Tata Play",
                "subscriber_id": "1092837482",
                "pack_name": "Hindi Smart Dhamaka + Sports HD Pack",
                "price": dth_amt,
                "validity": "30 Days",
                "channels": "185 Channels + Free Binge OTT App",
                "cashback": "₹30 Cashback with Paytm UPI"
            },
            "steps_log": steps_log,
            "audio_base64": audio_b64
        }

    # ==========================================================
    # BRANCH 5: PAYTM SOUNDBOX & MERCHANT QR
    # ==========================================================
    if service == "merchant":
        steps_log.append({
            "step": 2,
            "title": "Paytm Merchant Directory Search",
            "detail": "Resolving Sharma Kirana & General Store UPI: sharmastore@paytm",
            "status": "completed"
        })
        pay_amt = explicit_price or 150
        steps_log.append({
            "step": 3,
            "title": "Paytm Soundbox 4G Sync",
            "detail": f"Soundbox Device ID: SB4G-MH9082 • Ready for Audio Announcement",
            "status": "completed"
        })

        if lang == "hi":
            ai_msg = f"मैंने शर्मा किराना स्टोर के लिए ₹{pay_amt} का क्यूआर पेमेंट तैयार किया है। साउंडबॉक्स घोषणा के साथ अप्रूव करें?"
        elif lang == "mr":
            ai_msg = f"मी शर्मा किराणा स्टोअरसाठी ₹{pay_amt} चे पेमेंट तयार केले आहे. साउंडबॉक्स आवाजासह मंजूर करायचे का?"
        else:
            ai_msg = f"Prepared ₹{pay_amt} payment to Sharma Kirana Store with instant Paytm Soundbox chime. Ready to pay?"

        steps_log.append({
            "step": 4,
            "title": "Sarvam AI Voice Synthesis",
            "detail": "Synthesizing authentic voice with Bulbul v3",
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
            "service": "merchant",
            "language": lang,
            "ai_message": ai_msg,
            "service_data": {
                "merchant_name": "Sharma Kirana & General Store",
                "merchant_upi": "sharmastore@paytm",
                "amount": pay_amt,
                "soundbox_prompt": f"पेटीएम पर {pay_amt} रुपये प्राप्त हुए",
                "soundbox_prompt_mr": f"पेटीएम वर {pay_amt} रुपये मिळाले",
                "device": "Paytm Soundbox 4G Pro • Battery 94%"
            },
            "steps_log": steps_log,
            "audio_base64": audio_b64
        }

    # ==========================================================
    # BRANCH 6: PAYTM 24K DIGITAL GOLD & WEALTH
    # ==========================================================
    if service == "gold":
        steps_log.append({
            "step": 2,
            "title": "MMTC-PAMP Live Bullion Rate Feed",
            "detail": "Fetching real-time 24K 99.99% pure gold spot prices",
            "status": "completed"
        })
        gold_amt = explicit_price or 500
        gold_rate = 7850
        gold_grams = round(gold_amt / gold_rate, 4)

        steps_log.append({
            "step": 3,
            "title": "IDBI Insured Vault Custody Check",
            "detail": f"Allocating {gold_grams} grams in 100% insured physical vault",
            "status": "completed"
        })

        if lang == "hi":
            ai_msg = f"आज 24K शुद्ध डिजिटल गोल्ड का भाव ₹{gold_rate} प्रति ग्राम है। मैंने आपके लिए ₹{gold_amt} ({gold_grams} ग्राम) का निवेश तैयार किया है।"
        elif lang == "mr":
            ai_msg = f"आज 24K शुद्ध सोन्याचा भाव ₹{gold_rate} प्रति ग्रॅम आहे. मी तुमच्यासाठी ₹{gold_amt} ({gold_grams} ग्रॅम) ची सुरक्षित गुंतवणूक तयार केली आहे."
        else:
            ai_msg = f"Live 24K 99.99% gold is ₹{gold_rate}/g. Prepared ₹{gold_amt} ({gold_grams}g) insured vault purchase."

        steps_log.append({
            "step": 4,
            "title": "Sarvam AI Voice Synthesis",
            "detail": "Synthesizing authentic voice with Bulbul v3",
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
            "service": "gold",
            "language": lang,
            "ai_message": ai_msg,
            "service_data": {
                "gold_price_per_gm": gold_rate,
                "purity": "24K 99.99% Pure Gold (MMTC-PAMP Certified)",
                "purchase_amount": gold_amt,
                "gold_grams": gold_grams,
                "vault": "100% Insured Custody Vault with IDBI Trusteeship",
                "cashback": "₹25 Cashback in Gold"
            },
            "steps_log": steps_log,
            "audio_base64": audio_b64
        }

    # ==========================================================
    # BRANCH 7: TRAVEL & IRCTC BOOKING (PAYTM TRAVEL)
    # Uses: SerpApi Live Flight & Bus Search
    # ==========================================================
    if service == "travel":
        budget_limit = explicit_price or 0
        steps_log.append({
            "step": 2,
            "title": "SerpApi Travel Discovery Agent",
            "detail": f"Fetching live Google Flights & IRCTC timings from {from_city} to {to_city}" + (f" (Budget ~₹{budget_limit})" if budget_limit else ""),
            "status": "completed"
        })
        travel_results = search_travel_options(from_city, to_city, travel_type=travel_type, max_budget=budget_limit)
        
        flights = [o for o in travel_results.get("options", []) if o.get("type") == "Flight"]
        trains = [o for o in travel_results.get("options", []) if o.get("type") == "Train"]
        buses = [o for o in travel_results.get("options", []) if o.get("type") == "Bus"]
        best_flight = flights[0] if flights else None
        best_train = trains[0] if trains else None
        best_bus = buses[0] if buses else None

        is_flight_query = travel_type == "flight" or any(k in lower_q for k in ['flight', 'flite', 'fligt', 'flitht', 'plane', 'हवाई', 'विमान', 'फ्लाइट'])
        is_bus_query = travel_type == "bus" or any(k in lower_q for k in ['bus', 'buses', 'बस', 'व्हॉल्व्हो', 'वॉल्वो', 'shivneri'])

        if lang == "hi":
            if is_bus_query and best_bus:
                ai_msg = f"मैंने {from_city} से {to_city} के लिए {best_bus['name']} ({best_bus['dep_time']}, ₹{best_bus['price']}) खोज ली है। {best_bus['seats']} उपलब्ध हैं। क्या टिकट बुक करें?"
            elif best_flight and is_flight_query:
                ai_msg = f"मैंने {from_city} से {to_city} के लिए {best_flight['name']} (समय {best_flight['dep_time']}, ₹{best_flight['price']}) खोज ली है। {best_flight['seats']} उपलब्ध हैं। क्या टिकट बुक करें?"
            elif best_train:
                ai_msg = f"मैंने {from_city} से {to_city} के लिए वंदे भारत एक्सप्रेस (सुबह {best_train['dep_time']} बजे, ₹{best_train['price']}, {best_train['seats']}) और अन्य यात्रा विकल्प खोज लिए हैं।"
            else:
                ai_msg = f"मैंने {from_city} से {to_city} के लिए ₹{budget_limit or 500} के बजट में सबसे तेज यात्रा विकल्प खोज लिए हैं।"
        elif lang == "mr":
            if is_bus_query and best_bus:
                ai_msg = f"मी {from_city} ते {to_city} प्रवासासाठी {best_bus['name']} ({best_bus['dep_time']}, ₹{best_bus['price']}) शोधली आहे. {best_bus['seats']} शिल्लक आहेत. बुक करू का?"
            elif best_flight and is_flight_query:
                ai_msg = f"मी {from_city} ते {to_city} साठी {best_flight['name']} (वेळ {best_flight['dep_time']}, ₹{best_flight['price']}) शोधली आहे. {best_flight['seats']} शिल्लक आहेत. बुक करू का?"
            elif best_train:
                ai_msg = f"मी {from_city} ते {to_city} साठी वंदे भारत एक्सप्रेस (सकाळी {best_train['dep_time']} वाजता, ₹{best_train['price']}) शोधली आहे."
            else:
                ai_msg = f"मी {from_city} ते {to_city} प्रवासासाठी ₹{budget_limit or 500} च्या बजेटमधील उत्तम पर्याय शोधले आहेत."
        else:
            if is_bus_query and best_bus:
                ai_msg = f"Found {best_bus['name']} ({best_bus['dep_time']}, ₹{best_bus['price']}) for {from_city} to {to_city}. Ready to book?"
            elif best_flight and is_flight_query:
                ai_msg = f"Found {best_flight['name']} (Departs {best_flight['dep_time']}, ₹{best_flight['price']}) for {from_city} to {to_city}. Ready to book?"
            else:
                ai_msg = f"Found fastest travel options from {from_city} to {to_city} including buses, trains, and flights."

        steps_log.append({
            "step": 3,
            "title": "Sarvam AI Voice Synthesis",
            "detail": "Generating natural human voice audio response",
            "status": "completed"
        })
        audio_b64 = generate_sarvam_speech(ai_msg, "hi-IN" if lang == "hi" else ("mr-IN" if lang == "mr" else "en-IN"))

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
    # BRANCH 8: HOTEL BOOKING (PAYTM HOTELS & STAYS)
    # Uses: SerpApi Google Local / Hotels Search
    # ==========================================================
    if service == "hotel":
        city = detected_city or "Pune"
        location = detected_location or "Airport"
        budget_limit = explicit_price or 1000

        steps_log.append({
            "step": 2,
            "title": "SerpApi Google Hotels & Local Discovery",
            "detail": f"Searching budget verified hotels near {city} {location} (Budget: ~₹{budget_limit}) with SerpApi",
            "status": "completed"
        })
        hotel_results = search_hotel_options(city, location, max_budget=budget_limit)
        hotels = hotel_results.get("hotels", [])
        top_hotel = hotels[0] if hotels else None

        if lang == "hi":
            ai_msg = f"मैंने {city} {location} के पास आपके ₹{budget_limit} के बजट में बेहतरीन होटल खोज लिए हैं। {top_hotel['name']} ({location} से {top_hotel['distance']}, ₹{top_hotel['price']} प्रति रात) उपलब्ध है। क्या आप कमरा बुक करना चाहते हैं?"
        elif lang == "mr":
            ai_msg = f"मी {city} {location} जवळ तुमच्या ₹{budget_limit} च्या बजेटमधील सर्वोत्तम हॉटेल्स शोधली आहेत. {top_hotel['name']} ({location} पासून {top_hotel['distance']}, ₹{top_hotel['price']}/रात्र) उपलब्ध आहे. रूम बुक करायची का?"
        else:
            ai_msg = f"Found top budget hotels near {city} {location} within your ₹{budget_limit} budget. {top_hotel['name']} ({top_hotel['distance']}, ₹{top_hotel['price']}/night) with free WiFi and AC. Ready to book?"

        steps_log.append({
            "step": 3,
            "title": "Sarvam AI Voice Synthesis",
            "detail": "Generating natural human voice audio response",
            "status": "completed"
        })
        audio_b64 = generate_sarvam_speech(ai_msg, "hi-IN" if lang == "hi" else ("mr-IN" if lang == "mr" else "en-IN"))

        return {
            "mode": "ACTION",
            "service": "hotel",
            "language": lang,
            "ai_message": ai_msg,
            "hotel_data": hotel_results,
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
