"""
Recharge Agent: Detects and matches real Indian Telecom plans (Jio, Airtel, Vi)
"""

TELECOM_PLANS = {
    "jio": [
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
            "id": "jio-857",
            "price": 857,
            "validity": "84 Days",
            "data": "2 GB / Day",
            "total_data": "168 GB",
            "calls": "Unlimited Calls",
            "sms": "100 SMS / Day",
            "network": "True Unlimited 5G",
            "badge": "84 Days Super Saver 🌟",
            "ott": ["Amazon Prime Video Mobile", "JioCinema"],
            "has_netflix": False,
            "cashback": "₹50 Cashback",
            "description": "Long validity 84 days pack with Amazon Prime Video subscription."
        }
    ],
    "airtel": [
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
        }
    ],
    "vi": [
        {
            "id": "vi-299",
            "price": 299,
            "validity": "28 Days",
            "data": "1.5 GB / Day + Binge All Night",
            "total_data": "42 GB + Unlimited Night Data",
            "calls": "Unlimited Calls",
            "sms": "100 SMS / Day",
            "network": "Vi GIGAnet 4G",
            "badge": "Hero Unlimited 🦸",
            "ott": ["Vi Movies & TV", "Weekend Data Rollover"],
            "has_netflix": False,
            "cashback": "₹25 Cashback",
            "description": "Unlimited data from 12 AM to 6 AM with Weekend Rollover."
        }
    ]
}


def find_matching_recharge_plan(operator: str = "jio", budget: int = 300, wants_netflix: bool = False):
    op = operator.lower() if operator else "jio"
    plans = TELECOM_PLANS.get(op, TELECOM_PLANS["jio"])
    
    if wants_netflix:
        for p in plans:
            if p.get("has_netflix"):
                return {
                    "best": p,
                    "alternatives": [item for item in plans if item["id"] != p["id"]]
                }
    
    # Sort by closest budget
    sorted_plans = sorted(plans, key=lambda x: abs(x["price"] - (budget or 300)))
    return {
        "best": sorted_plans[0],
        "alternatives": sorted_plans[1:4]
    }
