"""
generate_articles.py — Use Claude API to generate high-quality yoga articles,
then publish them to Supabase.

Required env vars:
  ANTHROPIC_API_KEY
  SUPABASE_URL, SUPABASE_SERVICE_KEY

Optional env vars (from workflow_dispatch inputs):
  TOPIC   — specific topic to write about
  REGION  — ISO-3166-1 code or 'global'
  COUNT   — number of articles to generate (default 3)
"""
import os, json, re
from datetime import datetime, timezone
from slugify import slugify
import anthropic
from supabase import create_client

ANTHROPIC_API_KEY = os.environ["ANTHROPIC_API_KEY"]
SUPABASE_URL = os.environ["SUPABASE_URL"]
SUPABASE_KEY = os.environ["SUPABASE_SERVICE_KEY"]
REGION = os.environ.get("REGION", "global")
COUNT = int(os.environ.get("COUNT", "3"))
CUSTOM_TOPIC = os.environ.get("TOPIC", "")

client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

YOGA_STYLES = [
    "Hatha", "Vinyasa", "Ashtanga", "Yin Yoga", "Restorative", "Power Yoga",
    "Kundalini", "Iyengar", "Bikram/Hot Yoga", "Yoga Nidra", "AcroYoga",
    "Sivananda", "Kripalu", "Anusara", "Aerial Yoga",
]

TOPIC_POOL = {
    "global": [
        "The science of yoga and stress reduction",
        "How to build a sustainable home yoga practice",
        "Yoga for better sleep: the evidence",
        "Beginner mistakes and how to avoid them",
        "Breathwork (pranayama) explained for modern practitioners",
        "How yoga complements strength training",
        "The history of yoga in the West",
        "Yoga philosophy for everyday life",
        "Choosing a yoga teacher training programme",
        "Digital detox and yoga: finding stillness",
    ],
    "AE": [
        "Yoga in Dubai: the booming wellness scene",
        "Best outdoor yoga spots in the UAE",
        "Practising yoga during Ramadan",
        "Wellness tourism in Abu Dhabi and Dubai",
        "Hot yoga in a hot climate: what you need to know",
    ],
    "US": [
        "The best yoga retreats in the United States",
        "Corporate yoga programmes: ROI for companies",
        "Veterans and yoga: healing through practice",
        "Yoga studios vs gym yoga: what is the difference?",
    ],
    "GB": [
        "Yoga in London: neighbourhood guide",
        "British Wheel of Yoga vs Yoga Alliance: which certification?",
        "Yoga festivals in the UK",
    ],
    "IN": [
        "Yoga pilgrimage: Mysore, Rishikesh, and Pune",
        "The Yoga Sutras explained for modern practitioners",
        "India's government yoga programmes and their impact",
    ],
    "AU": [
        "Yoga festivals in Australia: the complete guide",
        "Surf and yoga retreats on the Australian coast",
    ],
    "DE": [
        "Yoga in Berlin: the scene explained",
        "German health insurance and yoga: what is covered?",
    ],
}

STYLE_SLUG_MAP = {s.lower().replace("/","-").replace(" ","-"): s for s in YOGA_STYLES}

SYSTEM_PROMPT = """You are a senior yoga editor and wellness journalist writing for YogaCandy,
an AI-powered yoga community platform. Your articles are:
- Evidence-based, citing real studies or reputable organisations when relevant
- Practical, actionable, and warm in tone — not preachy or overly spiritual
- 600–900 words in clear Markdown
- SEO-optimised with a natural keyword density
- Free from exaggerated claims or medical advice
- Inclusive of all fitness levels and backgrounds

Always respond with valid JSON only, no markdown code fences."""

def pick_topics(region: str, count: int, custom: str) -> list[dict]:
    topics = []
    if custom:
        topics.append({"topic": custom, "region": region})
        count -= 1

    regional = TOPIC_POOL.get(region, [])
    global_topics = TOPIC_POOL["global"]

    import random
    random.shuffle(regional)
    random.shuffle(global_topics)

    for t in (regional + global_topics)[:count]:
        topics.append({"topic": t, "region": region if t in regional else "global"})

    return topics[:count + (1 if custom else 0)]

def generate_article(topic: str, region: str) -> dict | None:
    region_context = {
        "AE": "targeting readers in the UAE and Gulf region",
        "US": "targeting US readers",
        "GB": "targeting UK readers",
        "IN": "targeting Indian readers",
        "AU": "targeting Australian readers",
        "DE": "targeting German and European readers",
        "global": "for an international audience",
    }.get(region, "for an international audience")

    prompt = f"""Write a high-quality yoga article {region_context}.

Topic: {topic}

Return ONLY a JSON object with these exact fields:
{{
  "title": "SEO-friendly article title",
  "excerpt": "2-sentence summary for previews and meta description",
  "body_md": "Full article in Markdown (600-900 words)",
  "category": "one of: Beginners | Research | Lifestyle | Local Guide | Travel | Events | Technology | Platform",
  "tags": ["array", "of", "3-6", "tags"],
  "style_slug": "yoga style slug if relevant (e.g. ashtanga, yin-yoga) or null",
  "read_min": estimated_reading_minutes_as_integer,
  "seo_title": "60-char max SEO title",
  "seo_description": "155-char max meta description"
}}"""

    try:
        message = client.messages.create(
            model="claude-opus-4-5",
            max_tokens=2000,
            system=SYSTEM_PROMPT,
            messages=[{"role": "user", "content": prompt}]
        )
        raw = message.content[0].text.strip()
        # Strip any accidental markdown fences
        raw = re.sub(r"^```json\s*", "", raw)
        raw = re.sub(r"\s*```$", "", raw)
        data = json.loads(raw)
        return data
    except Exception as e:
        print(f"  Error generating article for '{topic}': {e}")
        return None

def publish_article(article: dict, region: str):
    slug = slugify(article["title"])[:80]

    # Check for duplicate slug
    existing = supabase.table("articles").select("id").eq("slug", slug).execute()
    if existing.data:
        slug = f"{slug}-{datetime.now().strftime('%Y%m%d')}"

    regions = [region] if region != "global" else ["global"]

    row = {
        "slug": slug,
        "title": article["title"],
        "excerpt": article.get("excerpt"),
        "body_md": article.get("body_md"),
        "category": article.get("category", "Lifestyle"),
        "tags": article.get("tags", []),
        "style_slug": article.get("style_slug"),
        "regions": regions,
        "read_min": article.get("read_min", 5),
        "author": "YogaCandy Editorial",
        "ai_generated": True,
        "ai_model": "claude-opus-4-5",
        "published": True,
        "published_at": datetime.now(timezone.utc).isoformat(),
        "seo_title": article.get("seo_title", article["title"])[:60],
        "seo_description": article.get("seo_description", article.get("excerpt", ""))[:155],
    }

    result = supabase.table("articles").insert(row).execute()
    if result.data:
        print(f"  Published: {article['title']} (/{slug})")
    else:
        print(f"  Failed to publish: {article['title']}")

def main():
    print(f"=== YogaCandy Article Generator ===")
    print(f"Region: {REGION} | Count: {COUNT} | Custom topic: {CUSTOM_TOPIC or 'none'}")

    topics = pick_topics(REGION, COUNT, CUSTOM_TOPIC)
    print(f"\nTopics selected: {[t['topic'] for t in topics]}\n")

    for item in topics:
        print(f"Generating: {item['topic']}...")
        article = generate_article(item["topic"], item["region"])
        if article:
            publish_article(article, item["region"])
        else:
            print(f"  Skipped (generation failed)")

    print("\nDone.")

if __name__ == "__main__":
    main()
