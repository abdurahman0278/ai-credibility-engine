# ⚡ Quick Start - 30 Seconds to Launch

Follow these steps to get WAND AI running on your local machine in under a minute!

## 🎯 Quick Steps

### 1️⃣ Get API Key (1 minute)
Go to [Google AI Studio](https://aistudio.google.com/app/apikey) → Create API Key → Copy it

### 2️⃣ Configure (10 seconds)
Create `.env` file in project root:
```env
API_KEY=paste_your_api_key_here
```

### 3️⃣ Install & Run (20 seconds)
```bash
npm install
npm run dev
```

### 4️⃣ Open Browser
Visit: **http://localhost:3000**

---

## ✅ What Changed from Google Cloud?

| Before (Google Cloud) | After (Local) |
|----------------------|---------------|
| `@google/genai` SDK | `@google/generative-ai` SDK |
| Cloud-only deployment | Runs on localhost |
| Complex auth setup | Simple API key in `.env` |
| Gemini via Cloud Functions | Direct Gemini API calls |

## 🎨 Key Files Changed

1. **package.json** - Updated SDK dependency
2. **src/services/geminiService.ts** - Updated imports and API calls
3. **.env** - New file for API key (you create this!)
4. **vite.config.ts** - Already configured for local dev

## 📖 Need More Details?

See [LOCAL_SETUP_GUIDE.md](./LOCAL_SETUP_GUIDE.md) for comprehensive documentation.

---

**That's it!** 🎉 Your WAND AI is now running locally.
