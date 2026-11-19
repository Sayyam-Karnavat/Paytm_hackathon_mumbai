"""
SQLite Database for Paytm AI Hub & Merchant Operations
Provides persistent storage for Merchant Catalog, Customer Transactions, and Dispute Records.
"""
import sqlite3
import os
from pathlib import Path

DB_PATH = Path(__file__).resolve().parent / "paytm.db"


def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_database():
    """Initializes tables and seeds dummy data for one merchant scenario."""
    conn = get_db_connection()
    cursor = conn.cursor()

    # 1. Merchant Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS merchants (
        merchant_id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        upi_id TEXT NOT NULL,
        phone TEXT NOT NULL,
        address TEXT NOT NULL,
        rating REAL DEFAULT 4.9,
        is_verified INTEGER DEFAULT 1
    )
    """)

    # 2. Plans Catalog (Offered by this Merchant)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS merchant_plans (
        plan_id TEXT PRIMARY KEY,
        merchant_id TEXT NOT NULL,
        operator TEXT NOT NULL,
        price INTEGER NOT NULL,
        validity TEXT NOT NULL,
        data TEXT NOT NULL,
        calls TEXT NOT NULL,
        network TEXT NOT NULL,
        ott TEXT NOT NULL,
        badge TEXT,
        has_netflix INTEGER DEFAULT 0,
        FOREIGN KEY (merchant_id) REFERENCES merchants (merchant_id)
    )
    """)

    # 3. Customer Transactions with this Merchant
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS transactions (
        txn_id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        user_name TEXT NOT NULL,
        merchant_id TEXT NOT NULL,
        service TEXT NOT NULL,
        amount REAL NOT NULL,
        status TEXT NOT NULL,
        bank_name TEXT NOT NULL,
        bank_rrn TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        failure_reason TEXT,
        refund_status TEXT,
        refund_tat TEXT,
        FOREIGN KEY (merchant_id) REFERENCES merchants (merchant_id)
    )
    """)

    # 4. Dispute Cases
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS disputes (
        dispute_id TEXT PRIMARY KEY,
        txn_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        merchant_id TEXT NOT NULL,
        issue_title TEXT NOT NULL,
        status TEXT NOT NULL,
        assigned_agent TEXT NOT NULL,
        npci_circular TEXT NOT NULL,
        compensation_eligible INTEGER DEFAULT 1,
        created_at TEXT NOT NULL,
        FOREIGN KEY (txn_id) REFERENCES transactions (txn_id)
    )
    """)

    conn.commit()

    # Seed data if empty
    cursor.execute("SELECT COUNT(*) FROM merchants")
    if cursor.fetchone()[0] == 0:
        seed_data(cursor, conn)

    conn.close()


def seed_data(cursor, conn):
    # One Dedicated Merchant
    merchant_id = "MERCH_SHARMA_01"
    cursor.execute("""
    INSERT INTO merchants (merchant_id, name, category, upi_id, phone, address, rating, is_verified)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        merchant_id,
        "Sharma Telecom & Digital Services",
        "Authorized Telecom & Bharat BillPay Partner",
        "sharmatelecom@paytm",
        "+91 98201 99887",
        "Shop 14, Linking Road, Bandra West, Mumbai, MH 400050",
        4.94,
        1
    ))

    # Merchant Plans Catalog
    plans = [
        ("jio-299", merchant_id, "Jio", 299, "28 Days", "2 GB / Day", "Unlimited Calls", "True Unlimited 5G", "JioCinema, JioTV, JioCloud", "Best Value ⭐", 0),
        ("jio-349", merchant_id, "Jio", 349, "28 Days", "2.5 GB / Day", "Unlimited Calls", "True Unlimited 5G", "JioCinema Premium, JioTV", "Extra Data 🚀", 0),
        ("jio-398", merchant_id, "Jio", 398, "28 Days", "2 GB / Day", "Unlimited Calls", "True Unlimited 5G", "Netflix (Basic Mobile), JioTV, JioCinema", "Netflix Pack 🍿", 1),
        ("jio-857", merchant_id, "Jio", 857, "84 Days", "2 GB / Day", "Unlimited Calls", "True Unlimited 5G", "Amazon Prime Video Mobile, JioCinema", "84-Day Saver 🌟", 0),
        ("airtel-299", merchant_id, "Airtel", 299, "28 Days", "1.5 GB / Day", "Unlimited Calls", "Unlimited 5G Data", "Airtel Xstream Play, Wynk Music", "Popular ⭐", 0),
        ("airtel-349", merchant_id, "Airtel", 349, "28 Days", "2 GB / Day", "Unlimited Calls", "Unlimited 5G Data", "Airtel Xstream Play (20+ OTTs)", "Best 2GB 🌟", 0),
        ("vi-299", merchant_id, "Vi", 299, "28 Days", "1.5 GB / Day + Night", "Unlimited Calls", "Vi GIGAnet 4G", "Vi Movies & TV, Weekend Rollover", "Hero Binge 🦸", 0),
        ("elec-msedcl", merchant_id, "MSEDCL", 1420, "Monthly", "Standard Power", "N/A", "Grid Supply", "MSEDCL Consumer CA #002948192841", "Due in 3 Days 💡", 0)
    ]
    cursor.executemany("""
    INSERT INTO merchant_plans (plan_id, merchant_id, operator, price, validity, data, calls, network, ott, badge, has_netflix)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, plans)

    # Customer Transactions (Including the critical pending dispute scenario)
    transactions = [
        (
            "PTM7890124",
            "paytm_user_01",
            "Akash Bichukale",
            merchant_id,
            "Jio Prepaid Recharge (84 Days)",
            599.0,
            "PENDING_AT_SWITCH",
            "State Bank of India",
            "SBI_RRN_9820194812",
            "2026-11-19 10:14:22",
            "Bank debited ₹599.00. Telecom operator switch timeout during token exchange.",
            "INITIATED_AUTO_REVERSAL",
            "T+1 Business Days (By 2026-11-20 10:14:22)"
        ),
        (
            "PTM4819284",
            "paytm_user_01",
            "Akash Bichukale",
            merchant_id,
            "Airtel Xstream Fiber Bill",
            825.0,
            "SUCCESS",
            "State Bank of India",
            "SBI_RRN_4819283719",
            "2026-11-15 14:20:00",
            None,
            "NOT_APPLICABLE",
            "Completed"
        ),
        (
            "PTM3920191",
            "paytm_user_01",
            "Akash Bichukale",
            merchant_id,
            "FASTag Toll MH 12 AB 8921",
            500.0,
            "SUCCESS",
            "Paytm Wallet",
            "PTM_WAL_849201948",
            "2026-11-10 09:45:10",
            None,
            "NOT_APPLICABLE",
            "Completed"
        )
    ]
    cursor.executemany("""
    INSERT INTO transactions (txn_id, user_id, user_name, merchant_id, service, amount, status, bank_name, bank_rrn, timestamp, failure_reason, refund_status, refund_tat)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, transactions)

    # Dispute Case Linked to the failed transaction
    cursor.execute("""
    INSERT INTO disputes (dispute_id, txn_id, user_id, merchant_id, issue_title, status, assigned_agent, npci_circular, compensation_eligible, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        "DISP_9841",
        "PTM7890124",
        "paytm_user_01",
        merchant_id,
        "Money debited ₹599 but Jio recharge pack not activated",
        "UNDER_INVESTIGATION",
        "Priya Sharma (Senior Resolution Specialist)",
        "NPCI Harmonisation Circular No. 81 / RBI DPSS.CO.PD No.629/02.01.014/2019-20",
        1,
        "2026-11-19 10:20:15"
    ))

    conn.commit()


def get_merchant_full_data(merchant_id="MERCH_SHARMA_01"):
    """Fetches merchant profile, catalog plans, customer transactions, and disputes."""
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM merchants WHERE merchant_id = ?", (merchant_id,))
    merchant = dict(cursor.fetchone() or {})

    cursor.execute("SELECT * FROM merchant_plans WHERE merchant_id = ?", (merchant_id,))
    plans = [dict(r) for r in cursor.fetchall()]

    cursor.execute("SELECT * FROM transactions WHERE merchant_id = ? ORDER BY timestamp DESC", (merchant_id,))
    transactions = [dict(r) for r in cursor.fetchall()]

    cursor.execute("SELECT * FROM disputes WHERE merchant_id = ?", (merchant_id,))
    disputes = [dict(r) for r in cursor.fetchall()]

    conn.close()
    return {
        "merchant": merchant,
        "plans": plans,
        "transactions": transactions,
        "disputes": disputes
    }


# Auto-initialize on import
init_database()
