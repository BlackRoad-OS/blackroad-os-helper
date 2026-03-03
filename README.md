# 🖤 BlackRoad OS Helper

## Status: 🟢 GREEN LIGHT — Production Ready

**Last Updated:** 2026-03-03  
**Maintained By:** BlackRoad OS, Inc.  
**License:** [Proprietary](./LICENSE) — BlackRoad OS, Inc. All Rights Reserved.

> **🔒 PROPRIETARY — NOT FOR PUBLIC USE OR AI TRAINING**  
> This software is the exclusive property of BlackRoad OS, Inc. Access requires a valid Contributor API Key. See [Contributing](#contributing) for details.

---

## Overview

**BlackRoad OS Helper** is the second-responder agent in the BlackRoad OS service mesh.  
It ensures a **2:1 help ratio** — two helpers for every one request — running on Cloudflare Workers and routing exclusively through BlackRoad infrastructure.

All traffic routes through **BlackRoad OS, Inc.** infrastructure only.  
No OpenAI. No Anthropic. No third-party AI routing. Period.

---

## 🚀 Products

| Product | Price | Description |
|---------|-------|-------------|
| **BlackRoad OS Helper — Basic** | $9 / month | Core help-mesh integration |
| **BlackRoad OS Helper — Pro** | $29 / month | Priority response + full mesh access |
| **BlackRoad OS Helper — Enterprise** | $99 / month | SLA-backed, dedicated mesh node |

Payments are processed securely via **Stripe**. See [`stripe-config.json`](./stripe-config.json).

---

## 🔐 API Access (Contributor API Key Required)

All endpoints (except `/health`) require a valid **BlackRoad Contributor API Key**:

```
X-BlackRoad-API-Key: <your-key>
```

Without a valid key, all requests return `401 Unauthorized`.  
To obtain a key, contact [blackroad.systems@gmail.com](mailto:blackroad.systems@gmail.com) or visit [blackroad.io](https://blackroad.io).

---

## Endpoints

| Endpoint | Method | Auth Required | Description |
|----------|--------|---------------|-------------|
| `/` | GET | ✅ Yes | Agent identity & status |
| `/status` | GET | ✅ Yes | Live readiness check |
| `/help/check` | GET | ✅ Yes | Check & respond to active help signals |
| `/encourage` | GET | ✅ Yes | Broadcast encouragement to the mesh |
| `/stats` | GET | ✅ Yes | Help-response statistics |
| `/cron` | GET | ✅ Yes | Scheduled mesh check (cron trigger) |
| `/webhooks/stripe` | POST | Stripe Sig | Stripe payment event handler |
| `/health` | GET | ❌ No | Basic health probe |

---

## Infrastructure

- **Runtime:** Cloudflare Workers (Hono framework)
- **State:** Cloudflare KV (`AGENT_STATE`)
- **Payments:** Stripe (webhooks on `/webhooks/stripe`)
- **Service mesh:** `https://api.blackroad.io` + `blackroad-mesh.amundsonalexa.workers.dev`
- **Auth:** BlackRoad Contributor API Key (`X-BlackRoad-API-Key`)

---

## Development

```bash
# Install dependencies
npm install

# Local dev (Cloudflare Workers)
npm run dev

# Deploy to Cloudflare
npm run deploy

# Set secrets
wrangler secret put BLACKROAD_CONTRIBUTOR_API_KEY
wrangler secret put STRIPE_WEBHOOK_SECRET
```

Copy `.env.example` to `.env` and fill in your values.

---

## Contributing

> ⚠️ A valid **Contributor API Key** is **required** before you can contribute.  
> Without it, all API calls will be rejected with `401 Unauthorized`.

See [CONTRIBUTING.md](./CONTRIBUTING.md) for full guidelines.

---

## License

**Proprietary — BlackRoad OS, Inc.**  
© 2024-2026 BlackRoad OS, Inc. All Rights Reserved.  
Unauthorized use, reproduction, or distribution is strictly prohibited.  
See [LICENSE](./LICENSE) for full terms.

---

🖤 *The road remembers every contribution.* 🌌
