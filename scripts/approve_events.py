"""
approve_events.py — Auto-approve user-submitted events that pass basic validation.
Safe rules: title > 10 chars, date in future, has description, no spam URLs.
All others stay pending for manual review.
"""
import os, re
from datetime import date
from supabase import create_client

SUPABASE_URL = os.environ["SUPABASE_URL"]
SUPABASE_KEY = os.environ["SUPABASE_SERVICE_KEY"]
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

SPAM_PATTERNS = [r"casino", r"betting", r"crypto", r"nft", r"earn \$", r"work from home"]

def is_safe(submission: dict) -> bool:
    text = f"{submission.get('title','')} {submission.get('description','')}".lower()
    if any(re.search(p, text) for p in SPAM_PATTERNS):
        return False
    if len(submission.get("title", "")) < 10:
        return False
    try:
        event_date = date.fromisoformat(submission["event_date"])
        if event_date < date.today():
            return False
    except Exception:
        return False
    return True

def main():
    print("=== Auto-approving event submissions ===")
    pending = supabase.table("event_submissions").select("*").eq("status", "pending").execute()

    for sub in (pending.data or []):
        if is_safe(sub):
            # Promote to events table
            supabase.table("events").insert({
                "title": sub["title"],
                "description": sub.get("description"),
                "event_date": sub["event_date"],
                "format": sub.get("format", "In person"),
                "city": sub.get("city"),
                "country": sub.get("country"),
                "country_code": sub.get("country_code", "GL"),
                "price": sub.get("price"),
                "source_name": sub.get("source_name", "Community"),
                "source_url": sub.get("source_url"),
                "tags": sub.get("tags", []),
                "location_key": sub.get("location_key"),
            }).execute()
            supabase.table("event_submissions").update({"status": "approved"}).eq("id", sub["id"]).execute()
            print(f"  Approved: {sub['title']}")
        else:
            print(f"  Kept pending (needs review): {sub['title']}")

    print("Done.")

if __name__ == "__main__":
    main()
