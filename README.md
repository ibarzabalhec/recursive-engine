# The Recursive Engine

A lens that reveals the recursive geometry hidden inside any word.

Type anything — *skyscraper*, *mushroom*, *jazz*, *blood* — and the engine shows you the fractal, cross-sectional, resonant structure already present within it.

Powered by the framework from **RECURSIVE** by Hector Ibarzabal.

---

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure API keys

Copy `.env.example` to `.env.local` and add your keys:

```bash
cp .env.example .env.local
```

You need:

- **Anthropic API key** — [console.anthropic.com](https://console.anthropic.com)
- **Unsplash access key** — [unsplash.com/developers](https://unsplash.com/developers)

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Deploy to Vercel

1. Push this repo to GitHub
2. Import into [Vercel](https://vercel.com)
3. Add environment variables (`ANTHROPIC_API_KEY`, `UNSPLASH_ACCESS_KEY`)
4. Deploy

---

## Architecture

- **Frontend:** Next.js 14 + React 18
- **AI:** Claude Sonnet 4.5 via Anthropic API (streaming)
- **Images:** Unsplash API (free tier, 50 req/hr)
- **Equation:** KaTeX rendering of r = sqrt(R^2 - w_0^2)
- **Cache:** In-memory (24h text, 7d images)

---

## Cost

- ~$0.002 per query on Claude API
- Unsplash free tier: 50 requests/hour
- Budget at 1000 queries/day: ~$2/day

---

*Build it clean. Build it dark. Build it precise. The geometry does the rest.*
