# 🚀 How to Run WAND AI Locally

## Step-by-Step Instructions

### 1. Get Your Gemini API Key (2 minutes)

1. Go to: https://aistudio.google.com/app/apikey
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key (starts with `AIzaSy...`)

### 2. Create .env File (30 seconds)

In the project root folder, create a file named `.env` (just .env, no other extension) and paste:

```
API_KEY=paste_your_actual_api_key_here
```

Replace `paste_your_actual_api_key_here` with the API key you copied.

**Example:**
```
API_KEY=AIzaSyAaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPp
```

### 3. Install Dependencies (Already Done!)

The dependencies are already installed. If you need to reinstall:

```bash
npm install
```

### 4. Start the Development Server

```bash
npm run dev
```

You should see:
```
VITE v5.1.4  ready in 300 ms

➜  Local:   http://localhost:3000/
➜  press h + enter to show help
```

### 5. Open in Browser

Open your browser and go to: **http://localhost:3000**

## 🎯 Using the Application

1. **Dashboard Tab** - The main interface with:
   - Text input area (pre-filled with demo data)
   - "Run Analysis" button to analyze text
   - Claims will appear with credibility scores
   - "Verify Claim" button on each claim for fact-checking

2. **Refined Report Tab** - Generate final intelligence reports

## 🛑 To Stop the Server

Press `Ctrl + C` in the terminal

## ✅ That's It!

Your WAND AI Credibility Engine is now running locally!
