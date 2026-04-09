# YogaCandy AI Chat — Setup Guide

The chat widget supports **three AI providers** in priority order:

| Priority | Provider | Cost | Key needed |
|---|---|---|---|
| 1 | Chrome AI (Gemini Nano) | Free | None — runs in the browser |
| 2 | Google Gemini API | Free tier available | `NEXT_PUBLIC_GEMINI_API_KEY` |
| 3 | OpenAI (GPT-4o mini) | ~$0.15 / 1M tokens | `NEXT_PUBLIC_OPENAI_API_KEY` |
| 4 | Fallback | — | — |

The widget automatically uses the best available provider. You only need to configure **one** of options 2 or 3 (or both) for cloud AI to work.

---

## Option A — Google Gemini API (Recommended · Free tier)

### Step 1 — Get a Gemini API key

1. Go to **[Google AI Studio](https://aistudio.google.com/app/apikey)**
2. Sign in with a Google account
3. Click **"Create API key"**
4. Choose **"Create API key in new project"** (or an existing one)
5. Copy the key — it starts with `AIza…`

### Step 2 — Restrict the key to your domain (important for security)

1. Open **[Google Cloud Console → Credentials](https://console.cloud.google.com/apis/credentials)**
2. Find the API key you just created and click **Edit (pencil icon)**
3. Under **"Application restrictions"** select **"Websites"**
4. Under **"Website restrictions"** click **Add an item** and add:
   ```
   https://yogacandy.info/*
   https://www.yogacandy.info/*
   ```
5. Under **"API restrictions"** → **"Restrict key"** → select **"Generative Language API"**
6. Click **Save**

> **Why?** This prevents the key from being used on any other domain even if someone copies it from your page source.

### Step 3 — Add the key to your deployment

**For cPanel Apache deployment:**

1. In your project root create (or edit) `.env.local`:
   ```
   NEXT_PUBLIC_GEMINI_API_KEY=AIzaYourKeyHere
   ```
2. Rebuild locally: `npm run build`
3. Upload the new `out/` folder to cPanel as usual

**For automated deployment (GitHub Actions):**

1. Go to your GitHub repo → **Settings → Secrets and variables → Actions**
2. Click **New repository secret**
3. Name: `NEXT_PUBLIC_GEMINI_API_KEY`, Value: `AIzaYourKeyHere`
4. In your deploy workflow YAML, add:
   ```yaml
   env:
     NEXT_PUBLIC_GEMINI_API_KEY: ${{ secrets.NEXT_PUBLIC_GEMINI_API_KEY }}
   ```

---

## Option B — OpenAI API (ChatGPT / GPT-4o mini)

### Step 1 — Get an OpenAI API key

1. Go to **[platform.openai.com/api-keys](https://platform.openai.com/api-keys)**
2. Sign in or create an account
3. Click **"Create new secret key"**
4. Give it a name (e.g. `yogacandy-chat`)
5. Copy the key — it starts with `sk-…`
   ⚠️ **Copy it now — it will not be shown again**

### Step 2 — Set spend limits to protect your budget

1. Go to **[platform.openai.com/settings/organization/limits](https://platform.openai.com/settings/organization/limits)**
2. Set a **monthly budget limit** (e.g. $5 to start)
3. Set an **email notification** threshold (e.g. $3)

> GPT-4o mini costs ~$0.15 per 1 million input tokens. Each chat turn is typically 200–500 tokens, so $5/month ≈ 10,000–30,000 messages. More than enough.

### Step 3 — Add the key to your deployment

Same process as Gemini above, but use:
```
NEXT_PUBLIC_OPENAI_API_KEY=sk-YourKeyHere
```

> **Note:** OpenAI does not support HTTP referrer restrictions like Google does. Keep spend limits low and rotate the key if you see unexpected usage on your [usage dashboard](https://platform.openai.com/usage).

---

## Option C — Chrome AI / Gemini Nano (already built-in, no setup needed)

This works automatically in **Chrome 127+** on desktop when the user has enabled the experimental Prompt API. No key, no cost, no data leaves the browser.

**To test it yourself:**
1. Open Chrome → go to `chrome://flags`
2. Search for `Prompt API for Gemini Nano`
3. Set it to **Enabled**
4. Restart Chrome
5. Open your site — the status badge in the chat will show **"On-device AI · Gemini Nano"**

This is the most privacy-friendly option. The chat widget always tries Chrome AI first.

The current Chrome built-in AI API uses `LanguageModel.availability()` and `LanguageModel.create()`. Older `window.ai.languageModel` snippets you may find online are stale and will fail in this app.

---

## Using both Gemini and OpenAI together

You can set **both** keys. The widget will:
1. Try Chrome AI (Gemini Nano) first
2. If not available, use Gemini API
3. If Gemini fails, fall back to OpenAI

To prefer OpenAI over Gemini, swap the order in the provider selection logic in `components/ChatWidget.tsx`:

```ts
if (process.env.NEXT_PUBLIC_GEMINI_API_KEY) return "gemini";
if (process.env.NEXT_PUBLIC_OPENAI_API_KEY) return "openai";

// To:
if (process.env.NEXT_PUBLIC_OPENAI_API_KEY) return "openai";
if (process.env.NEXT_PUBLIC_GEMINI_API_KEY) return "gemini";
```

---

## Verifying it works

After deployment, open your site and:

1. Click the **chat bubble** in the bottom-right corner
2. Check the **status dot and label** next to the logo:
   - 🟢 Green dot = On-device AI (Chrome) or Gemini API
   - 🔵 Blue dot = Gemini API
   - 🟢 Emerald dot = OpenAI
   - 🟡 Yellow dot = No AI configured (fallback message shown)
3. Type `What yoga style is best for stress?` and verify you get a real answer

---

## Security summary

| Key | Exposure | Mitigation |
|---|---|---|
| `NEXT_PUBLIC_GEMINI_API_KEY` | Visible in browser source | Restrict to your domain + restrict to Generative Language API in Google Cloud Console |
| `NEXT_PUBLIC_OPENAI_API_KEY` | Visible in browser source | Set hard monthly spend limits; rotate key if abused |
| Supabase anon key | Already public by design | Row Level Security (RLS) controls all access |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only | Never use `NEXT_PUBLIC_` prefix; only used in GitHub Actions scripts |

---

## Optional — Upgrade to a secure proxy (advanced)

If you later want to keep API keys **completely hidden**, you can proxy calls through a **Supabase Edge Function**:

1. Create `supabase/functions/chat/index.ts` that accepts messages and calls the LLM
2. Store keys as Supabase **secrets** (not visible in source)
3. Update `ChatWidget.tsx` to call `https://<project>.supabase.co/functions/v1/chat` instead of the LLM directly
4. Apply Supabase Auth RLS on the function to rate-limit per user

This is the most secure approach and is recommended once you have regular traffic. Ask Claude to implement it when you're ready.
