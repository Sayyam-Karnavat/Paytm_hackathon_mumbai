"""
FastAPI Server for Paytm AI Hub
Provides unified REST API for Paytm ONE (Action Mode) & Paytm Resolve (Dispute Mode)
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from backend.orchestrator import orchestrate_query

app = FastAPI(
    title="Paytm AI Hub API",
    description="Backend Multi-Agent Service for Paytm Hackathon Mumbai",
    version="1.0.0"
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
    language: Optional[str] = "auto"


@app.get("/")
def root():
    return {
        "status": "online",
        "product": "Paytm AI Hub",
        "sponsor_integrations": ["SerpApi", "You.com", "Nexconn Chat SDK"]
    }


@app.post("/api/chat")
def handle_chat_query(req: QueryRequest):
    if not req.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty")
    
    result = orchestrate_query(req.query, req.user_id)
    return result


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
