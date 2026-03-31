# 🚀 WAND AI - Local Setup Guide

This guide will help you convert and run the WAND AI Credibility Engine locally on your machine.

## 📋 Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- A **Google Gemini API Key** - Free to get!

## 🔑 Step 1: Get Your Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy the API key (it will look something like: `AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`)
5. Keep this key safe - you'll need it in the next step!

**Note**: The Gemini API has a generous free tier that's perfect for development and testing.

## ⚙️ Step 2: Configure Environment Variables

1. In the project root directory, you'll find a file called `.env.example`
2. **Create a new file** named `.env` (no .example extension!)
3. Copy the content from `.env.example` to `.env`
4. Replace `your_gemini_api_key_here` with your actual API key:

```env
API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

**⚠️ IMPORTANT**: Never commit your `.env` file to Git! It's already in `.gitignore` to protect your API key.

## 📦 Step 3: Install Dependencies

Open your terminal in the project directory and run:

```bash
npm install
```

This will install all necessary packages including:
- React & React DOM
- Vite (development server)
- Google Generative AI SDK
- Tailwind CSS & PostCSS
- TypeScript
- Various UI components (lucide-react)

## 🎯 Step 4: Run the Development Server

Start the local development server with:

```bash
npm run dev
```

You should see output like:

```
  VITE v5.1.4  ready in 500 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

## 🌐 Step 5: Open the Application

1. Open your browser and navigate to: **http://localhost:3000**
2. You should see the WAND AI Credibility Engine interface!

## 🧪 Step 6: Test the Application

The application comes with demo data pre-loaded. To test:

1. Click **"Run Analysis"** button - This will analyze the pre-loaded CEO transcript
2. Wait for claims to appear (uses Gemini AI to extract and score claims)
3. Click **"Verify Claim"** on any claim to use Google Search grounding
4. Click **"Ingest Supplemental Update"** to test the conflict resolution feature
5. Click **"Refined Report"** tab to generate a synthesized intelligence report

## 🏗️ Additional Commands

### Build for Production
```bash
npm run build
```
Compiles the app for production deployment. Output goes to the `dist/` folder.

### Preview Production Build
```bash
npm run preview
```
Serves the production build locally for testing.

### Run Linter
```bash
npm run lint
```
Checks your code for potential issues.

## 🔧 Project Structure

```
wand-ai---credibility-engine/
├── src/
│   ├── components/           # React components
│   │   ├── ClaimCard.tsx    # Individual claim display
│   │   └── StrategyView.tsx # Strategy documentation
│   ├── services/            # API services
│   │   └── geminiService.ts # Gemini AI integration
│   ├── App.tsx              # Main application
│   ├── index.tsx            # Entry point
│   ├── types.ts             # TypeScript types
│   └── index.css            # Tailwind styles
├── .env                     # Your API keys (create this!)
├── .env.example             # Template for .env
├── package.json             # Dependencies
├── vite.config.ts           # Vite configuration
├── tailwind.config.js       # Tailwind CSS config
└── tsconfig.json            # TypeScript config
```

## 🎨 Key Features

1. **Multi-Agent Credibility Analysis**: Extracts claims and analyzes bias
2. **Google Search Grounding**: Verifies claims against live web data
3. **Incremental Updates**: Handles new information with conflict resolution
4. **Refined Reports**: Auto-generates truth-filtered intelligence reports

## 🐛 Troubleshooting

### "Cannot find module '@google/generative-ai'"
- Run `npm install` again
- Delete `node_modules` folder and `package-lock.json`, then run `npm install`

### "API Key not found" or 401 errors
- Check that your `.env` file exists in the project root
- Verify the API key is correct and has no extra spaces
- Make sure the key starts with `AIzaSy`
- Restart the dev server after creating/modifying `.env`

### Port 3000 already in use
- Change the port in `vite.config.ts`:
```typescript
server: {
  port: 3001, // or any other port
}
```

### TypeScript errors in IDE
- Run `npm install` to ensure all type definitions are installed
- Restart your IDE/editor
- Check that `@types/node` is in devDependencies

## 🔒 Security Notes

- **Never** share your `.env` file or API key publicly
- The `.env` file is git-ignored by default
- For production deployments, use environment variables provided by your hosting platform
- Consider using API key restrictions in Google Cloud Console

## 📚 Additional Resources

- [Google Gemini API Documentation](https://ai.google.dev/docs)
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)

## 🆘 Need Help?

If you encounter issues:
1. Check the browser console (F12) for error messages
2. Check the terminal for server errors
3. Verify your API key is valid at [Google AI Studio](https://aistudio.google.com/)
4. Ensure all dependencies are installed with `npm install`

---

**🎉 You're all set!** The WAND AI Credibility Engine is now running locally on your machine.
