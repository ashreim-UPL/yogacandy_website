"""
sync_events.py — Pull yoga events from Eventbrite + Meetup and upsert into Supabase.

Required env vars:
  SUPABASE_URL, SUPABASE_SERVICE_KEY
  EVENTBRITE_TOKEN  (get free at eventbrite.com/platform/api-keys)
  MEETUP_KEY        (optional — Meetup Pro API)
"""
import os, json, re
from datetime import datetime, timezone, timedelta
from supabase import create_client, Client
from postgrest.exceptions import APIError

SUPABASE_URL = os.environ["SUPABASE_URL"]
SUPABASE_KEY = os.environ["SUPABASE_SERVICE_KEY"]
EVENTBRITE_TOKEN = os.environ.get("EVENTBRITE_TOKEN", "")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

YOGA_KEYWORDS = ["yoga", "vinyasa", "ashtanga", "yin yoga", "meditation", "pranayama",
                 "kundalini", "hatha", "pilates yoga", "breathwork", "mindfulness yoga"]

TARGET_LOCATIONS = [
    {"city": "Dubai", "country": "United Arab Emirates", "country_code": "AE", "lat": 25.2048, "lng": 55.2708},
    {"city": "London", "country": "United Kingdom", "country_code": "GB", "lat": 51.5074, "lng": -0.1278},
    {"city": "New York", "country": "United States", "country_code": "US", "lat": 40.7128, "lng": -74.0060},
    {"city": "Sydney", "country": "Australia", "country_code": "AU", "lat": -33.8688, "lng": 151.2093},
    {"city": "Berlin", "country": "Germany", "country_code": "DE", "lat": 52.5200, "lng": 13.4050},
    {"city": "Mumbai", "country": "India", "country_code": "IN", "lat": 19.0760, "lng": 72.8777},
]

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
        "Apply migrations before running sync."
    )

def to_target_row(ev: dict, table_name: str) -> dict:
    if table_name == "events":
        return ev
    # public.event_listings has a narrower schema than public.events.
    return {
        "title": ev["title"],
        "description": ev.get("description") or "",
        "event_date": ev["event_date"],
        "format": ev.get("format", "In person"),
        "city": ev.get("city"),
        "country": ev.get("country"),
        "country_code": ev.get("country_code", "GL"),
        "price": ev.get("price"),
        "source_name": ev.get("source_name", "Eventbrite"),
        "source_url": ev.get("source_url"),
        "tags": ev.get("tags", []),
        "location_key": ev.get("location_key"),
    }

def is_yoga_event(title: str, description: str) -> bool:
    text = (title + " " + description).lower()
    return any(kw in text for kw in YOGA_KEYWORDS)

def infer_style_slug(title: str, description: str) -> str | None:
    text = (title + " " + description).lower()
    mapping = {
        "ashtanga": "ashtanga", "vinyasa": "vinyasa", "yin yoga": "yin-yoga",
        "yin ": "yin-yoga", "kundalini": "kundalini", "hatha": "hatha",
        "restorative": "restorative", "iyengar": "iyengar", "power yoga": "power-yoga",
        "hot yoga": "bikram-hot-yoga", "bikram": "bikram-hot-yoga",
        "aerial": "suspension-swing", "acro": "acro-yoga", "yoga nidra": "yoga-nidra",
    }
    for keyword, slug in mapping.items():
        if keyword in text:
            return slug
    return None

def fetch_eventbrite_events(location: dict) -> list[dict]:
    if not EVENTBRITE_TOKEN:
        print(f"  No Eventbrite token — skipping {location['city']}")
        return []

    import requests
    url = "https://www.eventbriteapi.com/v3/events/search/"
    params = {
        "q": "yoga",
        "location.latitude": location["lat"],
        "location.longitude": location["lng"],
        "location.within": "20km",
        "start_date.range_start": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "start_date.range_end": (datetime.now(timezone.utc) + timedelta(days=90)).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "expand": "venue",
        "page_size": 50,
    }
    headers = {"Authorization": f"Bearer {EVENTBRITE_TOKEN}"}
    try:
        resp = requests.get(url, params=params, headers=headers, timeout=15)
        resp.raise_for_status()
        data = resp.json()
    except Exception as e:
        print(f"  Eventbrite error for {location['city']}: {e}")
        return []

    events = []
    for ev in data.get("events", []):
        title = ev.get("name", {}).get("text", "")
        desc = ev.get("description", {}).get("text", "") or ""
        if not is_yoga_event(title, desc):
            continue

        start = ev.get("start", {}).get("utc", "")
        if not start:
            continue

        venue = ev.get("venue") or {}
        city = venue.get("address", {}).get("city") or location["city"]
        is_online = ev.get("online_event", False)

        ticket_url = ev.get("url", "")
        is_free = ev.get("is_free", False)
        price = "Free" if is_free else "See website"

        events.append({
            "title": title[:200],
            "description": desc[:500],
            "event_date": start[:10],
            "format": "Online" if is_online else "In person",
            "city": "Online" if is_online else city,
            "country": location["country"],
            "country_code": "GL" if is_online else location["country_code"],
            "price": price,
            "booking_url": ticket_url,
            "source_name": "Eventbrite",
            "source_url": ticket_url,
            "tags": ["yoga", location["city"].lower()],
            "location_key": f"{'gl:online' if is_online else location['country_code'].lower()+':'+city.lower().replace(' ','-')}",
            "style_slug": infer_style_slug(title, desc),
            "featured": False,
        })

    print(f"  Eventbrite: {len(events)} yoga events found for {location['city']}")
    return events

def upsert_events(events: list[dict]):
    if not events:
        return
    table_name = resolve_events_table()
    # Use title+event_date as natural dedup key
    for ev in events:
        row = to_target_row(ev, table_name)
        # Check if it already exists
        existing = supabase.table(table_name) \
            .select("id") \
            .eq("title", row["title"]) \
            .eq("event_date", row["event_date"]) \
            .execute()
        if existing.data:
            print(f"    Skipped (exists): {ev['title']}")
            continue
        supabase.table(table_name).insert(row).execute()
        print(f"    Inserted: {ev['title']}")

def main():
    print("=== YogaCandy Event Sync ===")
    all_events = []
    for loc in TARGET_LOCATIONS:
        print(f"\nFetching events for {loc['city']}...")
        all_events.extend(fetch_eventbrite_events(loc))

    print(f"\nUpserting {len(all_events)} events to Supabase...")
    upsert_events(all_events)
    print("\nDone.")

if __name__ == "__main__":
    main()
