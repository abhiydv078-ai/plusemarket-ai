# PulseMarket India — AI-Powered Product Intelligence SaaS

## Project Overview
- **Name**: PulseMarket India
- **Goal**: Real-time dropshipping product research platform for the Indian market
- **Stack**: Hono + TypeScript + Cloudflare Pages + Chart.js + TailwindCSS
- **Inspired by**: Dropship.io — full SaaS-grade product intelligence
- **GitHub**: https://github.com/abhiydv078-ai/plusemarket-ai

---

## Pages (16 Total)

| Page | URL | Status | Description |
|------|-----|--------|-------------|
| Home / Landing | `/` | ✅ Live | Hero landing with feature showcase |
| Dashboard | `/dashboard` | ✅ Live | KPI cards, live stats, top products |
| Product Finder | `/product-finder` | ✅ Live | Semantic search across 63 products |
| Trend Analyzer | `/trend-analyzer` | ✅ Live | Google Trends + regional interest |
| Viral Products | `/viral-products` | ✅ Live | AI-ranked winning products |
| Profit Calculator | `/profit-calculator` | ✅ Live | GST + platform fee + margin calc |
| Competitor Tracker | `/competitor-tracker` | ✅ Live | Market saturation + pricing analysis |
| Supplier Finder | `/supplier-finder` | ✅ Live | MOQ, lead time, certifications |
| Pricing | `/pricing` | ✅ Live | Plan comparison (Free / Pro / Enterprise) |
| Login | `/login` | ✅ Live | Email + social auth UI |
| Signup | `/signup` | ✅ Live | Registration with validation |
| **Shopping Mode** | `/shopping` | ✅ Live | Reels-style feed, wishlist, price compare |
| **AI Agents** | `/ai-agents` | ✅ Live | 6 AI agent chat interfaces |
| **Analytics Engine** | `/analytics` | ✅ Live | Revenue forecast, India heatmap, 90-day prediction |
| **Marketplace** | `/marketplace` | ✅ Live | Affiliate price comparison + commission tracking |
| **Notifications** | `/notifications` | ✅ Live | Smart AI alerts panel + configuration |

---

## API Endpoints (17 Total)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/stats` | GET | Dashboard KPI statistics |
| `/api/categories` | GET | All product categories |
| `/api/search` | GET | Semantic search with word-boundary matching |
| `/api/trending` | GET | Trending products by category |
| `/api/product/:id` | GET | Single product details |
| `/api/trends` | GET | Google Trends data by region |
| `/api/ai/recommendations` | GET | AI-scored winning products |
| `/api/viral-score/:id` | GET | Viral score breakdown (multi-signal) |
| `/api/competitors` | GET | Competitor analysis |
| `/api/suppliers` | GET | Supplier finder |
| `/api/calculate` | POST | Profit calculator |
| **`/api/ai/chat`** | POST | AI agent chat (6 agent types) |
| **`/api/notifications`** | GET | Smart AI alerts (8 structured alerts) |
| **`/api/analytics`** | GET | Revenue forecast + India heatmap + growth data |
| **`/api/marketplace`** | GET | Affiliate products with 3-platform price compare |

---

## Product Pool (63 Products)

| Category | Count | Examples |
|----------|-------|---------|
| Electronics | 12 | TWS Earbuds, Smartwatch, Ring Light, Webcam, Numpad, Wireless Charger |
| Beauty & Personal Care | 8 | Jade Roller, Lip Gloss Kit, Hair Straightener, Face Wash, Eyebrow Pen |
| Home & Kitchen | 7 | Air Purifier, Bamboo Organizer, Electric Kettle, Cutting Board |
| Fashion | 6 | Kurta Set, Lehenga Choli, Oversized Hoodie, Tote Bag |
| Sports & Fitness | 5 | Yoga Mat, Resistance Bands, Dumbbell, Knee Support |
| Garden | 3 | Drip Irrigation, Garden Tool Set, LED Grow Light |
| Tools & Hardware | 3 | Digital Multimeter, Cordless Drill, Cable Organizer |
| Jewelry | 3 | Kundan Necklace, Oxidized Bangles, Diamond Studs |
| Food & Grocery | 3 | Coconut Oil, Pink Salt, Protein Shaker |
| Health | 2 | Infrared Thermometer, Whey Protein |
| Books & Stationery | 2 | Dotted Notebook, Acrylic Paint Set |
| Pet | 2 | Pet Grooming Kit, Automatic Feeder |
| Toys & Games | 2 | Building Blocks, Remote Control Car |
| Automotive | 2 | Dash Camera, Car Seat Organizer |
| Baby | 1 | Baby Food Maker |

---

## Key Features

### 🛍️ Personal Shopping Mode (`/shopping`)
- Reels-style card grid with hover zoom and gradient overlays
- Inline 3-platform price comparison (Amazon / Flipkart / Meesho) with BEST badge
- Slide-in wishlist drawer persisted to `localStorage`
- Debounced search (400ms), category filter, and sort options
- Affiliate buy buttons + Web Share API with clipboard fallback

### 🤖 AI Agents (`/ai-agents`)
- 6 specialized AI agent chat interfaces:
  - **Trend Agent** — viral product forecasting
  - **Supplier Agent** — sourcing and MOQ recommendations
  - **SEO Agent** — listing optimization
  - **Research Agent** — market deep-dives
  - **Pricing Agent** — margin and competitive pricing
  - **Competitor Agent** — market gap analysis
- Full chat UI: typing indicator (3-dot bounce), markdown bold rendering
- Quick prompt chips, agent info panel, Today's AI Insights

### 📊 Analytics Engine (`/analytics`)
- KPI row: Total Revenue, Best State, Best Category, Avg Growth
- 12-month revenue bar chart with actual vs forecast (Chart.js)
- Category growth doughnut chart (top 5 categories)
- India state demand heatmap (12 states with gradient bars)
- 90-day growth prediction dual-line chart
- Top 8 products by revenue table with rank medals

### 🏪 Marketplace / Affiliate (`/marketplace`)
- Affiliate stats banner: Est. Commission ₹12,400 / month
- Per-product 3-platform price comparison (Amazon / Flipkart / Meesho)
- Commission badges (`+₹X/sale`) with estimated monthly earnings
- One-click affiliate link copy (`/ref/PM-{ID}`)
- Sort by Commission / Demand / Price

### 🔔 Smart Notifications (`/notifications`)
- 8 structured AI alert types: viral, price, competitor, trend, supplier, seasonal, insight
- Filter tabs: All / Viral / Price Drops / Competitors / Trends / Seasonal
- Priority-colored alert cards with unread indicators
- Channel setup: Telegram / WhatsApp / Email
- 6-toggle alert configuration panel

### 🔍 Semantic Search Engine
- 3-tier scoring: phrase match → word-boundary token match → synonym expansion
- Word-boundary regex (`(?<![a-z0-9])term(?![a-z0-9])`) — no false substring matches
- GENERIC_TOKENS penalty (0.3×) for ubiquitous words (smart, wireless, automatic)
- 60+ synonym pairs (earbuds → tws/airpods, yoga → exercise/fitness, etc.)
- Per-product PRODUCT_TAGS for extended searchable identity

---

## Navigation Structure (Sidebar — 4 Groups)

| Group | Pages |
|-------|-------|
| **INTELLIGENCE** | Home, Dashboard, Analytics Engine 🆕, Smart Alerts (8) |
| **DISCOVERY** | Product Finder, Trend Analyzer, Viral Products 🔥, Shopping Mode 🆕 |
| **AI TOOLS** | AI Agents 🆕, Competitor Tracker, Supplier Finder, Profit Calculator |
| **COMMERCE** | Marketplace 🆕, Pricing |

---

## Architecture

- **Backend**: Hono on Cloudflare Workers (single `src/index.tsx`, ~5500 lines)
- **Frontend**: Vanilla JS + Chart.js 4.4.0 + TailwindCSS CDN + FontAwesome 6.4.0
- **Build**: Vite + `@hono/vite-cloudflare-pages` → `dist/_worker.js`
- **Dev Server**: PM2 → `wrangler pages dev dist` on port 3000
- **Auth**: Client-side with localStorage (Supabase-ready)
- **Data**: Structured product pool + algorithmic scoring (no database required)
- **Deployment**: Cloudflare Pages

---

## Deployment

| Item | Value |
|------|-------|
| **Platform** | Cloudflare Pages |
| **Build command** | `npm run build` |
| **Output dir** | `dist/` |
| **Bundle size** | `dist/_worker.js` 252.92 kB |
| **Status** | ✅ Build passing, ready to deploy |
| **Last Updated** | 2026-05-12 |

---

## Git History

| Commit | Description |
|--------|-------------|
| `99dc3e9` | feat: implement master vision — Shopping, AI Agents, Analytics, Marketplace, Notifications, 63 products |
| `939f495` | fix: implement proper semantic search engine with word-boundary matching |
| `6359268` | docs: update README with complete platform documentation |
| `a055fa4` | feat: complete AI-powered product intelligence SaaS — PulseMarket India |

---

## Local Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Start dev server (PM2)
pm2 start ecosystem.config.cjs

# Test
curl http://localhost:3000

# Check logs
pm2 logs pulsemarket --nostream
```
