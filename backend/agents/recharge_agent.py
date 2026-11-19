"""
Recharge Agent: Comprehensive Telecom Plans Database (Jio, Airtel, Vi, BSNL) 2024-2026
Provides accurate matching based on budget, daily data (1GB - 3GB), validity (28-365 days), and OTT perks.
"""

TELECOM_PLANS = {
    "jio": [
        {
            "id": "jio-198",
            "price": 198,
            "validity": "14 Days",
            "data": "2 GB / Day",
            "total_data": "28 GB",
            "calls": "Unlimited Calls",
            "sms": "100 SMS / Day",
            "network": "True Unlimited 5G",
            "badge": "5G Booster 🚀",
            "ott": ["JioTV", "JioCinema"],
            "has_netflix": False,
            "cashback": "₹15 Cashback",
            "description": "Short validity 2GB/day unlimited 5G starter pack."
        },
        {
            "id": "jio-209",
            "price": 209,
            "validity": "22 Days",
            "data": "1 GB / Day",
            "total_data": "22 GB",
            "calls": "Unlimited Calls",
            "sms": "100 SMS / Day",
            "network": "Jio 4G LTE",
            "badge": "Budget 1GB 🏷️",
            "ott": ["JioTV", "JioCinema"],
            "has_netflix": False,
            "cashback": "₹15 Cashback",
            "description": "Pocket-friendly 1GB daily data pack."
        },
        {
            "id": "jio-239",
            "price": 239,
            "validity": "28 Days",
            "data": "1.5 GB / Day",
            "total_data": "42 GB",
            "calls": "Unlimited Calls",
            "sms": "100 SMS / Day",
            "network": "Jio 4G / 5G",
            "badge": "Daily 1.5GB 📱",
            "ott": ["JioTV", "JioCinema"],
            "has_netflix": False,
            "cashback": "₹20 Cashback",
            "description": "Standard 1.5GB daily data plan for 28 days."
        },
        {
            "id": "jio-299",
            "price": 299,
            "validity": "28 Days",
            "data": "2 GB / Day",
            "total_data": "56 GB",
            "calls": "Unlimited Calls",
            "sms": "100 SMS / Day",
            "network": "True Unlimited 5G",
            "badge": "Best Value ⭐",
            "ott": ["JioCinema", "JioTV", "JioCloud"],
            "has_netflix": False,
            "cashback": "₹25 Cashback with Paytm UPI",
            "description": "Ideal 2GB daily data plan with unlimited 5G data & high-speed calls."
        },
        {
            "id": "jio-349",
            "price": 349,
            "validity": "28 Days",
            "data": "2.5 GB / Day",
            "total_data": "70 GB",
            "calls": "Unlimited Calls",
            "sms": "100 SMS / Day",
            "network": "True Unlimited 5G",
            "badge": "Extra Data 🚀",
            "ott": ["JioCinema Premium", "JioTV"],
            "has_netflix": False,
            "cashback": "₹30 Cashback",
            "description": "2.5 GB per day power plan with JioCinema Premium subscription."
        },
        {
            "id": "jio-398",
            "price": 398,
            "validity": "28 Days",
            "data": "2 GB / Day",
            "total_data": "56 GB",
            "calls": "Unlimited Calls",
            "sms": "100 SMS / Day",
            "network": "True Unlimited 5G",
            "badge": "Netflix Bundle 🍿",
            "ott": ["Netflix (Basic Mobile)", "JioTV", "JioCinema"],
            "has_netflix": True,
            "cashback": "₹40 Cashback",
            "description": "Includes official Netflix Mobile subscription + 2GB daily 5G data."
        },
        {
            "id": "jio-448",
            "price": 448,
            "validity": "28 Days",
            "data": "2 GB / Day",
            "total_data": "56 GB",
            "calls": "Unlimited Calls",
            "sms": "100 SMS / Day",
            "network": "True Unlimited 5G",
            "badge": "12 OTT Suite 🎬",
            "ott": ["SonyLIV", "Zee5", "JioCinema Premium", "Lionsgate Play"],
            "has_netflix": False,
            "cashback": "₹45 Cashback",
            "description": "Mega entertainment pack with 12 OTT subscriptions included."
        },
        {
            "id": "jio-666",
            "price": 666,
            "validity": "70 Days",
            "data": "1.5 GB / Day",
            "total_data": "105 GB",
            "calls": "Unlimited Calls",
            "sms": "100 SMS / Day",
            "network": "True Unlimited 5G",
            "badge": "70 Days Value 🌟",
            "ott": ["JioTV", "JioCinema"],
            "has_netflix": False,
            "cashback": "₹50 Cashback",
            "description": "70 days long validity plan with 1.5GB daily data."
        },
        {
            "id": "jio-857",
            "price": 857,
            "validity": "84 Days",
            "data": "2 GB / Day",
            "total_data": "168 GB",
            "calls": "Unlimited Calls",
            "sms": "100 SMS / Day",
            "network": "True Unlimited 5G",
            "badge": "Amazon Prime 84D 📦",
            "ott": ["Amazon Prime Video Mobile", "JioCinema"],
            "has_netflix": False,
            "cashback": "₹50 Cashback",
            "description": "84 days validity pack with Amazon Prime Video subscription."
        },
        {
            "id": "jio-1099",
            "price": 1099,
            "validity": "84 Days",
            "data": "2 GB / Day",
            "total_data": "168 GB",
            "calls": "Unlimited Calls",
            "sms": "100 SMS / Day",
            "network": "True Unlimited 5G",
            "badge": "Netflix 84 Days 🍿",
            "ott": ["Netflix (Basic)", "Unlimited 5G Data"],
            "has_netflix": True,
            "cashback": "₹75 Cashback",
            "description": "84 Days validity with Netflix Basic included for high-volume users."
        },
        {
            "id": "jio-2999",
            "price": 2999,
            "validity": "365 Days (1 Year)",
            "data": "2.5 GB / Day",
            "total_data": "912.5 GB",
            "calls": "Unlimited Calls",
            "sms": "100 SMS / Day",
            "network": "True Unlimited 5G",
            "badge": "Annual Super Saver 👑",
            "ott": ["JioCinema Premium", "JioTV", "JioCloud"],
            "has_netflix": False,
            "cashback": "₹150 Cashback",
            "description": "Full 1 year validity with 2.5GB daily data and unlimited 5G."
        }
    ],
    "airtel": [
        {
            "id": "airtel-199",
            "price": 199,
            "validity": "28 Days",
            "data": "2 GB Total",
            "total_data": "2 GB",
            "calls": "Unlimited Calls",
            "sms": "100 SMS / Day",
            "network": "Airtel 4G/5G",
            "badge": "Calling Special 📞",
            "ott": ["Free Hellotunes", "Wynk Music"],
            "has_netflix": False,
            "cashback": "₹15 Cashback",
            "description": "Unlimited calling pack for users with low data usage."
        },
        {
            "id": "airtel-299",
            "price": 299,
            "validity": "28 Days",
            "data": "1.5 GB / Day",
            "total_data": "42 GB",
            "calls": "Unlimited Calls",
            "sms": "100 SMS / Day",
            "network": "Unlimited 5G Data",
            "badge": "Popular ⭐",
            "ott": ["Airtel Xstream Play (20+ OTTs)", "Wynk Music"],
            "has_netflix": False,
            "cashback": "₹20 Cashback",
            "description": "Airtel flagship 28 days pack with Xstream OTT suite."
        },
        {
            "id": "airtel-349",
            "price": 349,
            "validity": "28 Days",
            "data": "2 GB / Day",
            "total_data": "56 GB",
            "calls": "Unlimited Calls",
            "sms": "100 SMS / Day",
            "network": "Unlimited 5G Data",
            "badge": "Best 2GB 🌟",
            "ott": ["Airtel Xstream Play", "Free Hellotunes"],
            "has_netflix": False,
            "cashback": "₹30 Cashback",
            "description": "2GB per day with unlimited 5G high-speed connectivity."
        },
        {
            "id": "airtel-399",
            "price": 399,
            "validity": "28 Days",
            "data": "2.5 GB / Day",
            "total_data": "70 GB",
            "calls": "Unlimited Calls",
            "sms": "100 SMS / Day",
            "network": "Unlimited 5G Data",
            "badge": "Hotstar Pack 🏏",
            "ott": ["Disney+ Hotstar (3 Months)", "Airtel Xstream"],
            "has_netflix": False,
            "cashback": "₹35 Cashback",
            "description": "2.5GB daily data with 3 months Disney+ Hotstar subscription."
        },
        {
            "id": "airtel-839",
            "price": 839,
            "validity": "84 Days",
            "data": "2 GB / Day",
            "total_data": "168 GB",
            "calls": "Unlimited Calls",
            "sms": "100 SMS / Day",
            "network": "Unlimited 5G Data",
            "badge": "Hotstar 84D 🏏",
            "ott": ["Disney+ Hotstar (3 Months)", "Airtel Xstream"],
            "has_netflix": False,
            "cashback": "₹50 Cashback",
            "description": "84 Days with Disney+ Hotstar Mobile subscription."
        },
        {
            "id": "airtel-999",
            "price": 999,
            "validity": "84 Days",
            "data": "2.5 GB / Day",
            "total_data": "210 GB",
            "calls": "Unlimited Calls",
            "sms": "100 SMS / Day",
            "network": "Unlimited 5G Data",
            "badge": "Amazon Prime 84D 📦",
            "ott": ["Amazon Prime Membership (84 Days)", "Airtel Xstream"],
            "has_netflix": False,
            "cashback": "₹60 Cashback",
            "description": "84 Days validity with Amazon Prime full membership."
        },
        {
            "id": "airtel-1199",
            "price": 1199,
            "validity": "84 Days",
            "data": "2.5 GB / Day",
            "total_data": "210 GB",
            "calls": "Unlimited Calls",
            "sms": "100 SMS / Day",
            "network": "Unlimited 5G Data",
            "badge": "Netflix + Prime 🍿",
            "ott": ["Netflix (Basic)", "Amazon Prime", "Airtel Xstream"],
            "has_netflix": True,
            "cashback": "₹80 Cashback",
            "description": "Dual subscription pack: Netflix Basic and Amazon Prime."
        },
        {
            "id": "airtel-2999",
            "price": 2999,
            "validity": "365 Days (1 Year)",
            "data": "2 GB / Day",
            "total_data": "730 GB",
            "calls": "Unlimited Calls",
            "sms": "100 SMS / Day",
            "network": "Unlimited 5G Data",
            "badge": "Annual Pack 👑",
            "ott": ["Apollo 24/7", "Free Hellotunes", "Wynk Music"],
            "has_netflix": False,
            "cashback": "₹150 Cashback",
            "description": "Full 365 days of 2GB/day data & unlimited calls."
        }
    ],
    "vi": [
        {
            "id": "vi-199",
            "price": 199,
            "validity": "18 Days",
            "data": "1 GB / Day",
            "total_data": "18 GB",
            "calls": "Unlimited Calls",
            "sms": "100 SMS / Day",
            "network": "Vi GIGAnet 4G",
            "badge": "Short Term 🏷️",
            "ott": ["Vi Movies & TV"],
            "has_netflix": False,
            "cashback": "₹15 Cashback",
            "description": "Quick recharge with 1GB daily data."
        },
        {
            "id": "vi-299",
            "price": 299,
            "validity": "28 Days",
            "data": "1.5 GB / Day + Night Free",
            "total_data": "42 GB + Unlimited Night Data",
            "calls": "Unlimited Calls",
            "sms": "100 SMS / Day",
            "network": "Vi GIGAnet 4G",
            "badge": "Hero Unlimited 🦸",
            "ott": ["Vi Movies & TV", "Weekend Data Rollover", "Binge All Night"],
            "has_netflix": False,
            "cashback": "₹25 Cashback",
            "description": "Unlimited night data from 12 AM to 6 AM with Weekend Rollover."
        },
        {
            "id": "vi-365",
            "price": 365,
            "validity": "28 Days",
            "data": "2 GB / Day",
            "total_data": "56 GB",
            "calls": "Unlimited Calls",
            "sms": "100 SMS / Day",
            "network": "Vi GIGAnet 4G",
            "badge": "Hotstar Special 🍿",
            "ott": ["Disney+ Hotstar Mobile", "Binge All Night", "Weekend Rollover"],
            "has_netflix": False,
            "cashback": "₹35 Cashback",
            "description": "2GB/Day + Disney+ Hotstar + Unlimited Night data."
        },
        {
            "id": "vi-839",
            "price": 839,
            "validity": "84 Days",
            "data": "2 GB / Day",
            "total_data": "168 GB",
            "calls": "Unlimited Calls",
            "sms": "100 SMS / Day",
            "network": "Vi GIGAnet 4G",
            "badge": "84 Days Hero 🦸",
            "ott": ["Binge All Night", "Weekend Rollover", "Vi Movies & TV"],
            "has_netflix": False,
            "cashback": "₹50 Cashback",
            "description": "84 days pack with Hero Unlimited night benefits."
        },
        {
            "id": "vi-2899",
            "price": 2899,
            "validity": "365 Days (1 Year)",
            "data": "1.5 GB / Day",
            "total_data": "547.5 GB",
            "calls": "Unlimited Calls",
            "sms": "100 SMS / Day",
            "network": "Vi GIGAnet 4G",
            "badge": "Annual Hero 👑",
            "ott": ["Binge All Night", "Weekend Rollover"],
            "has_netflix": False,
            "cashback": "₹150 Cashback",
            "description": "1 year plan with Binge All Night and weekend data rollover."
        }
    ],
    "bsnl": [
        {
            "id": "bsnl-107",
            "price": 107,
            "validity": "35 Days",
            "data": "3 GB Total",
            "total_data": "3 GB",
            "calls": "200 Mins Voice",
            "sms": "Standard Rates",
            "network": "BSNL 4G/3G",
            "badge": "Super Economy 🏷️",
            "ott": ["BSNL Tunes"],
            "has_netflix": False,
            "cashback": "₹10 Cashback",
            "description": "35 days longest validity under ₹110."
        },
        {
            "id": "bsnl-197",
            "price": 197,
            "validity": "70 Days",
            "data": "2 GB / Day (for 18 days)",
            "total_data": "36 GB",
            "calls": "Unlimited (18 days)",
            "sms": "100 SMS / Day (18 days)",
            "network": "BSNL 4G",
            "badge": "70 Days Saver 🌟",
            "ott": ["Zing"],
            "has_netflix": False,
            "cashback": "₹15 Cashback",
            "description": "70 days incoming validity with 18 days unlimited calls."
        },
        {
            "id": "bsnl-397",
            "price": 397,
            "validity": "150 Days",
            "data": "2 GB / Day (for 30 days)",
            "total_data": "60 GB",
            "calls": "Unlimited (30 days)",
            "sms": "100 SMS / Day",
            "network": "BSNL 4G",
            "badge": "150 Days Validity 👑",
            "ott": ["Free PRBT"],
            "has_netflix": False,
            "cashback": "₹25 Cashback",
            "description": "150 days secondary SIM validity saver pack."
        }
    ]
}


def find_matching_recharge_plan(operator: str = "jio", budget: int = 300, data_daily: str = "", validity_days: int = 0, wants_netflix: bool = False):
    op = operator.lower() if operator else "jio"
    plans = TELECOM_PLANS.get(op, TELECOM_PLANS["jio"])

    target_budget = budget or 299

    # 1. Exact price match takes absolute highest priority
    if budget and budget > 0:
        exact_matches = [p for p in plans if p["price"] == budget]
        if exact_matches:
            best = exact_matches[0]
            alts = [p for p in plans if p["id"] != best["id"]][:5]
            return {
                "best": best,
                "alternatives": alts
            }

    # 2. If Netflix is explicitly requested
    if wants_netflix:
        netflix_matches = [p for p in plans if p.get("has_netflix")]
        if netflix_matches:
            best_netflix = min(netflix_matches, key=lambda x: abs(x["price"] - target_budget))
            alts = [p for p in plans if p["id"] != best_netflix["id"]][:5]
            return {
                "best": best_netflix,
                "alternatives": alts
            }

    # 3. Budget & Feature Scored Match
    scored_plans = []
    for p in plans:
        score = 0
        diff = abs(p["price"] - target_budget)
        
        # Price closeness gives up to 500 points
        score += max(0, 500 - (diff * 2))

        # Data match
        if data_daily and data_daily.lower().replace(" ", "") in p["data"].lower().replace(" ", ""):
            score += 80

        # Validity match
        if validity_days > 0 and str(validity_days) in p["validity"]:
            score += 100

        scored_plans.append((score, p))

    scored_plans.sort(key=lambda x: x[0], reverse=True)
    best_candidate = scored_plans[0][1]
    alternatives = [item[1] for item in scored_plans if item[1]["id"] != best_candidate["id"]][:5]

    return {
        "best": best_candidate,
        "alternatives": alternatives
    }
