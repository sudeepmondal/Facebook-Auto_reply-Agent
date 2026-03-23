<div align="center">

# 🤖 Facebook Auto-Reply Agent
### ShopBot BD — AI-Powered Customer Service Bot

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![n8n](https://img.shields.io/badge/n8n-Workflow-EA4B71?style=for-the-badge&logo=n8n&logoColor=white)](https://n8n.io)
[![Groq](https://img.shields.io/badge/Groq-LLaMA_3.3-F55036?style=for-the-badge)](https://groq.com)
[![Meta](https://img.shields.io/badge/Meta-Graph_API-0866FF?style=for-the-badge&logo=facebook&logoColor=white)](https://developers.facebook.com)

**Automatically replies to Facebook Page messages using AI — 100% FREE tools**

[Features](#-features) • [Architecture](#-architecture) • [Setup](#-setup) • [Usage](#-usage) • [FAQ](#-faq-context)

</div>

---

## 📌 Overview

Facebook Auto-Reply Agent is a fully automated customer service bot for Facebook Pages. It receives incoming Messenger messages, understands **Bangla + English** mixed language, generates intelligent replies using **Groq AI (LLaMA 3.3)**, and sends responses automatically — with **zero manual intervention**.

Built for small businesses and e-commerce pages in Bangladesh.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🧠 **AI-Powered Replies** | Uses Groq LLaMA 3.3-70b for intelligent, context-aware responses |
| 🇧🇩 **Bilingual Support** | Understands Bangla + English mixed messages |
| 📋 **FAQ Context Memory** | 5 predefined FAQ pairs injected into every AI prompt |
| ⚡ **Real-time Response** | Replies within 2-3 seconds of receiving a message |
| 🔄 **n8n Workflow** | Full visual workflow for monitoring and execution logs |
| 🛡️ **Error Handling** | Fallback messages if AI or Facebook API fails |
| 🔁 **Echo Prevention** | Skips delivery receipts, read receipts, and echo messages |
| 💸 **100% Free** | Uses only free-tier tools (Groq, ngrok, n8n, Express) |

---

## 🏗️ Architecture

```
Facebook User
      │
      │ Sends Message
      ▼
Meta Graph API (Webhook POST)
      │
      ▼
┌─────────────────────┐
│   Express Server    │  ← server.js (port 3000)
│   (Webhook Handler) │
└─────────────────────┘
      │
      │ Forwards to n8n
      ▼
┌─────────────────────────────────────────────────────────┐
│                   n8n Workflow                          │
│                                                         │
│  [1] Receive from Server                                │
│         ↓                                               │
│  [2] Extract Message (sender ID + text)                 │
│         ↓                                               │
│  [3] Build FAQ Context (5 predefined Q&A)               │
│         ↓                                               │
│  [4] Build Groq Payload (system prompt + user msg)      │
│         ↓                                               │
│  [5] Call Groq API (LLaMA 3.3-70b-versatile)           │
│         ↓                                               │
│  [6] Extract AI Reply                                   │
│         ↓                                               │
│  [7] Send to Facebook (Graph API POST)                  │
│         ↓                                               │
│  [8] Logger (timestamp + preview)                       │
└─────────────────────────────────────────────────────────┘
      │
      │ Sends Reply
      ▼
Facebook User ✅
```

---

## 📁 Project Structure

```
facebook-autoreply-agent/
├── server.js            ← Express webhook server (port 3000)
├── n8n-workflow.json    ← Import this into n8n
├── faq.json             ← FAQ data (customize for your business)
├── system-prompt.txt    ← AI system prompt template
├── .env                 ← Your secret keys (never commit!)
├── .gitignore           ← Ignores .env and node_modules
├── package.json         ← Node.js dependencies
├── start.bat            ← Windows one-click starter
├── start.sh             ← Mac/Linux one-click starter
└── README.md            ← This file
```

---

## 🛠️ Tech Stack

| Tool | Purpose | Cost |
|------|---------|------|
| **Node.js + Express** | Webhook server | Free |
| **n8n** (self-hosted) | Workflow automation + monitoring | Free |
| **ngrok** | Expose localhost to internet | Free |
| **Groq API** | LLaMA 3.3-70b AI model | Free |
| **Meta Graph API** | Facebook Messenger send/receive | Free |

---

## 🚀 Setup

### Prerequisites

- [Node.js v18+](https://nodejs.org)
- [ngrok account](https://ngrok.com) (free)
- [Groq API key](https://console.groq.com) (free)
- [Meta Developer account](https://developers.facebook.com) (free)
- Facebook Page (create one at facebook.com/pages/create)

---

### Step 1 — Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/facebook-autoreply-agent.git
cd facebook-autoreply-agent
npm install
```

---

### Step 2 — Configure Keys

Rename `.env.example` to `.env` and fill in your keys:

```env
VERIFY_TOKEN=shopbot_verify_2024
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxx
PAGE_ACCESS_TOKEN=EAAxxxxxxxxxxxxxxxxxxxxx
```

Update `server.js` with the same values:

```js
const VERIFY_TOKEN      = 'shopbot_verify_2024';
const GROQ_API_KEY      = 'gsk_xxxxxxxxxxxxxxxxxxxx';
const PAGE_ACCESS_TOKEN = 'EAAxxxxxxxxxxxxxxxxxxxxx';
```

---

### Step 3 — Get a Permanent Page Token

Temporary tokens expire in ~1 hour. Get a permanent one:

```bash
# Replace with your App ID, App Secret, and short-lived token
node -e "
const fetch = require('node-fetch');
fetch('https://graph.facebook.com/v18.0/oauth/access_token?grant_type=fb_exchange_token&client_id=YOUR_APP_ID&client_secret=YOUR_APP_SECRET&fb_exchange_token=YOUR_SHORT_TOKEN')
  .then(r => r.json())
  .then(d => console.log(d));
"
```

> App ID and Secret: `developers.facebook.com` → Your App → Settings → Basic

---

### Step 4 — Start Everything

**Windows:**
```bash
# Terminal 1 — ngrok
ngrok http 3000

# Terminal 2 — n8n
n8n start

# Terminal 3 — Express server
node server.js
```

```

---

### Step 5 — Configure Meta Webhook

1. Go to `developers.facebook.com` → Your App → Messenger → Webhooks
2. Click **Edit** and enter:
   - **Callback URL:** `https://YOUR-NGROK-URL/webhook`
   - **Verify Token:** `shopbot_verify_2024`
3. Click **Verify and Save**
4. Subscribe your Page with fields: `messages`, `messaging_postbacks`

---

### Step 6 — Import n8n Workflow

1. Open `http://localhost:5678`
2. New Workflow → `...` menu → **Import from JSON**
3. Paste contents of `n8n-workflow.json`
4. Update **"6. Call Groq API"** node → `Authorization: Bearer YOUR_GROQ_KEY`
5. Update **"8. Send to Facebook"** node → add your Page Access Token
6. Click **Active** toggle → turn ON

---

## 💬 Usage

Once running, send a message to your Facebook Page:

| User Sends | Bot Replies |
|-----------|-------------|
| `delivery কত দিন লাগে?` | ডেলিভারি সময় ২-৩ কার্যদিবস। ঢাকার মধ্যে ১-২ দিন। |
| `payment method কি?` | আমরা Cash on Delivery (COD) গ্রহণ করি। পণ্য পেয়ে টাকা দিন। |
| `do you deliver outside dhaka?` | সারা বাংলাদেশে ডেলিভারি দেওয়া হয়। সকল জেলায় সার্ভিস আছে। |
| `return policy?` | পণ্য পাওয়ার ৩ দিনের মধ্যে সমস্যা হলে বিনামূল্যে রিপ্লেসমেন্ট। |
| `দাম কত?` | আপনার প্রশ্নটি বুঝতে পারিনি, একটু বিস্তারিত বলবেন? |

---

## 📋 FAQ Context

Edit `faq.json` to customize for your business:

```json
{
  "faqs": [
    { "question": "delivery কত দিন", "answer": "২-৩ কার্যদিবস" },
    { "question": "payment method", "answer": "Cash on Delivery" },
    { "question": "location",       "answer": "সারা বাংলাদেশ"   },
    { "question": "return policy",  "answer": "৩ দিন রিপ্লেসমেন্ট" },
    { "question": "quality",        "answer": "Premium Export Quality" }
  ]
}
```

---

## 🔧 Troubleshooting

| Problem | Solution |
|---------|----------|
| Webhook verification fails | Make sure `node server.js` is running and ngrok is on port 3000 |
| No messages received | Check Meta Webhook subscription for `messages` field |
| Token expired error | Generate a new long-lived token (see Step 3) |
| Groq model error | Update `GROQ_MODEL` in server.js to `llama-3.3-70b-versatile` |
| n8n not receiving data | Check workflow is **Active** and webhook path is `facebook-message` |

---

## 🌐 Production Deployment

For permanent deployment without ngrok URL changes, deploy n8n and server.js to:

- [Railway.app](https://railway.app) — Free tier available
- [Render.com](https://render.com) — Free tier available
- [Fly.io](https://fly.io) — Free tier available

Then set a fixed domain in Meta Webhook settings.

---

## ⚠️ Important Notes

- **Never commit `.env`** to GitHub — it contains secret keys
- **ngrok free tier** changes URL on every restart — update Meta Webhook each time
- **Development mode** — only the App Admin can test; switch to Live mode for public use
- **Meta App Review** required for sending messages to users who haven't initiated contact

---

<div align="center">

**Built with ❤️ for Bangladeshi e-commerce businesses**

If this helped you, please ⭐ star the repo!

</div>
