# -*- coding: utf-8 -*-
import requests
import json
import sys

test_cases = [
    # 1. Travel Bus (The user's exact query!)
    ("मुझे पुणे से मुंबई जाना है बस देखो अच्छे से टिकट", "ACTION", "travel", "bus"),
    ("pune se mumbai bus ki ticket", "ACTION", "travel", "bus"),
    ("मला पुणे ते मुंबई बस चे तिकीट हवे आहे", "ACTION", "travel", "bus"),
    
    # 2. Travel Flights & Trains
    ("pune to mumbai flight ticket timing", "ACTION", "travel", "flight"),
    ("मुंबई ते दिल्ली ट्रेन चे तिकीट दाखवा", "ACTION", "travel", "train"),
    
    # 3. Airport Hotels
    ("pune airport passun 1000 chya aat hotel dakhva", "ACTION", "hotel", None),
    ("मुंबई एयरपोर्ट के पास कम बजट में होटल दिखाओ", "ACTION", "hotel", None),
    
    # 4. Mobile Recharge (Disambiguation test with 'airtel')
    ("mala airtel cha 349 cha plan dakhva", "ACTION", "recharge", None),
    ("Jio 299 ka 2gb daily data plan", "ACTION", "recharge", None),
    
    # 5. Utilities (Disambiguation with 'recharge')
    ("FASTag recharge 500", "ACTION", "fastag", None),
    ("Tata Play DTH recharge 399", "ACTION", "dth", None),
    ("MSEDCL bijli bill 1450 bhara", "ACTION", "electricity", None),
    ("Buy 500 digital gold", "ACTION", "gold", None),
    ("sharma kirana store la 150 rupaye dyayche ahet", "ACTION", "merchant", None),
    
    # 6. Paytm Resolve Intelligence Squad (Dispute Mode)
    ("पैसे कट झाले पण Jio Recharge झाला नाही", "RESOLVE", "dispute", None),
    ("Mere 599 rupees cut gaye par recharge pending hai", "RESOLVE", "dispute", None),
    ("Refund not received yet 4 days passed", "RESOLVE", "dispute", None),
    ("Merchant claims payment not received but money debited", "RESOLVE", "dispute", None),
    ("MSEDCL bill paid but showing unpaid on portal", "RESOLVE", "dispute", None),
    ("Galti se dusre number par UPI transfer ho gaya", "RESOLVE", "dispute", None),
    
    # 7. Shopping & Mall Deals (The user's query!)
    ("मुझे शॉपिंग करनी हे बेस्ट ऑफर देखो पुणे में।", "ACTION", "shopping", None),
    ("Pushpa 2 movie tickets in Pune", "ACTION", "movie", None)
]

passed = 0
failed = 0

import time

print("STARTING 360-DEGREE AUDIT TEST SUITE (20 TEST CASES)...", flush=True)
for i, (q, exp_mode, exp_service, exp_travel_type) in enumerate(test_cases, 1):
    try:
        t0 = time.time()
        r = requests.post("http://127.0.0.1:8000/api/chat", json={"query": q}, timeout=15)
        elapsed = time.time() - t0
        data = r.json()
        mode = data.get("mode")
        service = data.get("service")
        
        ok = (mode == exp_mode and service == exp_service)
        if exp_travel_type and ok:
            travel_type = data.get("travel_data", {}).get("type")
            if travel_type != exp_travel_type:
                ok = False
        
        if ok:
            passed += 1
            print(f"[{i:02d}/20] PASS ({elapsed:.1f}s): '{q[:35]}...' -> {mode}/{service}", flush=True)
        else:
            failed += 1
            print(f"[{i:02d}/20] FAIL ({elapsed:.1f}s): '{q}' -> Got: {mode}/{service}, Expected: {exp_mode}/{exp_service}", flush=True)
    except Exception as e:
        failed += 1
        print(f"[{i:02d}/20] ERR: {e}", flush=True)

print(f"\n==========================================")
print(f"TOTAL: {passed} PASSED, {failed} FAILED ({passed/(passed+failed)*100:.1f}%)")
print(f"==========================================")
