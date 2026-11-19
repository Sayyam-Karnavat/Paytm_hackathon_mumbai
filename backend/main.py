"""
FastAPI Server for Paytm AI Hub
Provides unified REST API backed by SQLite Merchant Database and Pure AI Agent.
"""
import sys
import os
import time
from pathlib import Path
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

# Ensure backend directory is in sys.path
backend_dir = Path(__file__).resolve().parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

try:
    from database import get_merchant_full_data, get_db_connection
    from ai_agent import run_pure_ai_agent
except ImportError:
    from backend.database import get_merchant_full_data, get_db_connection
    from backend.ai_agent import run_pure_ai_agent

app = FastAPI(
    title="Paytm AI Hub API",
    description="Backend Multi-Agent Service with SQLite Merchant Database for Paytm Hackathon Mumbai",
    version="2.0.0"
)

# Enable CORS for frontend web clients
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class QueryRequest(BaseModel):
    query: str
    user_id: Optional[str] = "paytm_user_01"
    merchant_id: Optional[str] = "MERCH_SHARMA_01"
    language: Optional[str] = "auto"


class ActionRequest(BaseModel):
    action_type: str  # 'PAYMENT' | 'DISPUTE'
    user_id: str = "paytm_user_01"
    user_name: str = "Akash Bichukale"
    merchant_id: str = "MERCH_SHARMA_01"
    amount: float
    service: str
    bank_name: Optional[str] = "State Bank of India"


@app.get("/")
def root():
    return {
        "status": "online",
        "product": "Paytm AI Hub - Pure AI Agent with SQLite",
        "database": "SQLite (paytm.db)",
        "default_merchant": "MERCH_SHARMA_01 (Sharma Telecom & Digital Services)",
        "sponsor_integrations": ["Groq LLM", "SerpApi", "You.com", "Nexconn Chat SDK"]
    }


@app.get("/api/merchant-data")
def get_merchant_data(merchant_id: str = "MERCH_SHARMA_01"):
    """Returns the merchant's live catalog, transactions, and disputes from SQLite."""
    return get_merchant_full_data(merchant_id)


@app.post("/api/chat")
def handle_chat_query(req: QueryRequest):
    """Processes user queries purely using the AI agent grounded in SQLite merchant data."""
    if not req.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty")
    
    result = run_pure_ai_agent(req.query, req.user_id, req.merchant_id or "MERCH_SHARMA_01")
    return result


@app.post("/api/action")
def handle_action(req: ActionRequest):
    """Executes a real action and updates the SQLite database."""
    conn = get_db_connection()
    cursor = conn.cursor()

    if req.action_type == "PAYMENT":
        txn_id = f"PTM{int(time.time() * 1000) % 1000000000}"
        bank_rrn = f"SBI_RRN_{int(time.time() * 100) % 100000000}"
        timestamp = time.strftime("%Y-%m-%d %H:%M:%S")

        cursor.execute("""
        INSERT INTO transactions (txn_id, user_id, user_name, merchant_id, service, amount, status, bank_name, bank_rrn, timestamp, failure_reason, refund_status, refund_tat)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            txn_id, req.user_id, req.user_name, req.merchant_id, req.service, req.amount,
            "SUCCESS", req.bank_name, bank_rrn, timestamp, None, "NOT_APPLICABLE", "Completed"
        ))
        conn.commit()
        conn.close()

        return {
            "status": "SUCCESS",
            "txn_id": txn_id,
            "bank_rrn": bank_rrn,
            "amount": req.amount,
            "message": f"Successfully paid ₹{req.amount} for {req.service} via Paytm UPI"
        }

    conn.close()
    return {"status": "ACK"}


# Simple, direct execution with `python main.py`
if __name__ == "__main__":
    import uvicorn
    print("\n" + "="*60)
    print("  Starting Paytm AI Hub Server on http://0.0.0.0:8000")
    print("  Connected to SQLite: paytm.db")
    print("  Merchant: Sharma Telecom & Digital Services (MERCH_SHARMA_01)")
    print("="*60 + "\n")
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True, app_dir=str(backend_dir))
