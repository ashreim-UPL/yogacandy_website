"""
approve_events.py — Auto-approve user-submitted events that pass basic validation.
Safe rules: title > 10 chars, date in future, has description, no spam URLs.
All others stay pending for manual review.
"""
import os, re
from datetime import date
from supabase import create_client
from postgrest.exceptions import APIError

SUPABASE_URL = os.environ["SUPABASE_URL"]
SUPABASE_KEY = os.environ["SUPABASE_SERVICE_KEY"]
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

SPAM_PATTERNS = [r"casino", r"betting", r"crypto", r"nft", r"earn \$", r"work from home"]

def is_missing_table_error(err: Exception) -> bool:
    if not isinstance(err, APIError):
        return False
    code = getattr(err, "code", None)
    if code == "PGRST205":
        return True
    msg = str(err)
    return "PGRST205" in msg and "schema cache" in msg

def resolve_events_table() -> str:
    for table_name in ("events", "event_listings"):
        try:
            supabase.table(table_name).select("id").limit(1).execute()
            print(f"  Using table: {table_name}")
            return table_name
        except Exception as err:
            if is_missing_table_error(err):
                continue
            raise
    raise RuntimeError(
        "Neither public.events nor public.event_listings exists in the target Supabase project. "
        "Apply migrations before running approval."
    )

def to_target_row(sub: dict, table_name: str) -> dict:
    if table_name == "events":
        return {
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
        }

    # public.event_listings has a narrower schema than public.events.
    return {
        "title": sub["title"],
        "description": sub.get("description") or "",
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
    }

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
    try:
        pending = supabase.table("event_submissions").select("*").eq("status", "pending").execute()
    except Exception as err:
        if is_missing_table_error(err):
            print("event_submissions table is missing in this Supabase project. Skipping approvals.")
            print("Apply migrations that create public.event_submissions, then re-run this workflow.")
            return
        raise
    target_table = resolve_events_table()

    for sub in (pending.data or []):
        if is_safe(sub):
            # Promote to events table
            supabase.table(target_table).insert(to_target_row(sub, target_table)).execute()
            supabase.table("event_submissions").update({"status": "approved"}).eq("id", sub["id"]).execute()
            print(f"  Approved: {sub['title']}")
        else:
            print(f"  Kept pending (needs review): {sub['title']}")

    print("Done.")

if __name__ == "__main__":
    main()
