"""
You.com API Integration: Real-time citation & policy research for disputes
"""
import os
import requests

YOU_API_KEY = os.getenv("YOU_API_KEY", "")

def fetch_refund_policy_citations(issue_type: str = "failed_upi_recharge"):
    """
    Uses You.com Search / RAG API to retrieve NPCI guidelines and Paytm dispute policies
    """
    if YOU_API_KEY:
        try:
            url = f"https://api.ydc-index.io/search?query=NPCI+UPI+failed+recharge+refund+turnaround+time+guidelines"
            headers = {"X-API-Key": YOU_API_KEY}
            resp = requests.get(url, headers=headers, timeout=5)
            if resp.status_code == 200:
                data = resp.json()
                hits = data.get("hits", [])
                if hits:
                    return {
                        "citation": hits[0].get("snippets", [""])[0],
                        "source": hits[0].get("url", "https://www.npci.org.in")
                    }
        except Exception as e:
            print("You.com query error:", e)

    return {
        "citation": "Under NPCI Harmonisation Circular No. 81, any UPI debit without service fulfillment must be reconciled within T+1 days with ₹100/day compensation for delay.",
        "source": "https://www.npci.org.in/what-we-do/upi/circulars",
        "authority": "National Payments Corporation of India (NPCI)"
    }
