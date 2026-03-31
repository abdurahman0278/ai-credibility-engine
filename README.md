# 🛡️ AI-Information Sources- Credibility Engine

An intelligent multi-agent system that evaluates text credibility using Google's Gemini AI with real-time fact-checking powered by Google Search.

## 🌟 What is AI-Information Sources- Credibility Engine?

AI-Information Sources- Credibility Engine AI is a sophisticated credibility assessment platform that:

- **Extracts Claims**: Automatically identifies factual statements from any text
- **Analyzes Bias**: Evaluates source credibility based on type and language patterns
- **Verifies Facts**: Uses live Google Search to cross-reference claims
- **Detects Conflicts**: Intelligently handles updates and contradictions
- **Generates Reports**: Creates refined intelligence summaries with false claims filtered out

## 🎯 Perfect For

- Due diligence on company reports
- Fact-checking press releases
- Academic paper verification
- News article analysis
- Financial document assessment

## ⚡ Quick Start

### Prerequisites
- Node.js v18+
- Google Gemini API key (free at [Google AI Studio](https://aistudio.google.com/app/apikey))

### Installation (3 Steps)

1. **Get API Key**
   ```bash
   # Visit https://aistudio.google.com/app/apikey
   # Create API key and copy it
   ```

2. **Configure Environment**
   ```bash
   # Create .env file in project root
   echo "API_KEY=your_gemini_api_key_here" > .env
   ```

3. **Install & Run**
   ```bash
   npm install
   npm run dev
   ```

4. **Open Browser**: http://localhost:3000

## 📚 Documentation

- **[QUICK_START.md](./QUICK_START.md)** - Get running in 30 seconds
- **[LOCAL_SETUP_GUIDE.md](./LOCAL_SETUP_GUIDE.md)** - Comprehensive setup guide with troubleshooting

## 🔄 Conversion from Google Cloud

This project has been **fully converted to run locally**. Key changes:

| Aspect | Before | After |
|--------|--------|-------|
| **Deployment** | Google Cloud Functions | Local Vite Dev Server |
| **SDK** | `@google/genai` | `@google/generative-ai` |
| **Authentication** | Service Account Keys | Simple API Key |
| **Configuration** | Cloud Console | `.env` file |
| **Development** | Cloud-dependent | Fully local |

## 🏗️ Architecture

### Multi-Agent System

1. **Extraction Agent** - Analyzes text and extracts factual claims
2. **Bias Analyzer** - Scores credibility based on source type and language
3. **Verification Agent** - Uses Google Search to fact-check claims
4. **Conflict Resolver** - Handles incremental updates and contradictions
5. **Report Generator** - Synthesizes truth-filtered intelligence reports

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **AI**: Google Gemini 2.0 Flash
- **Search**: Google Search Grounding
- **Icons**: Lucide React

## 📁 Project Structure

```
AI-Information Sources- Credibility Engine-ai---credibility-engine/
├── src/
│   ├── components/          # React UI components
│   ├── services/            # Gemini AI integration
│   ├── App.tsx              # Main application
│   ├── types.ts             # TypeScript definitions
│   └── index.css            # Global styles
├── .env                     # API configuration (create this!)
├── .env.example             # Template
├── package.json             # Dependencies
├── vite.config.ts           # Dev server config
└── tailwind.config.js       # Styling config
```

## 🎨 Features

### Dashboard
- Real-time claim extraction and scoring
- Visual credibility indicators (High/Medium/Low)
- Interactive verification with live search results
- Bias analysis for each claim

### Incremental Updates
- Add supplemental sources without re-analyzing everything
- Automatic conflict detection
- Smart claim merging and scoring adjustments

### Refined Reports
- Auto-generated intelligence summaries
- False claims filtered out
- Enhanced with verified facts
- Professional markdown formatting

## 🔒 Security

- API keys stored in `.env` (git-ignored)
- No credentials in code
- Client-side only API calls
- No backend server required

## 🐛 Troubleshooting

### Common Issues

**"Cannot find module '@google/generative-ai'"**
```bash
npm install
```

**"API Key not found"**
- Ensure `.env` file exists in project root
- Verify API key starts with `AIzaSy`
- Restart dev server after creating `.env`

**Port 3000 already in use**
```bash
# Edit vite.config.ts and change port to 3001 or any other
```

## 📊 API Usage

The Gemini API has a generous free tier:
- 15 requests per minute
- 1 million tokens per minute
- 1,500 requests per day

Perfect for development and small-scale production use.

## 🚀 Building for Production

```bash
# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

The built files will be in the `dist/` folder, ready for deployment to any static hosting service (Vercel, Netlify, GitHub Pages, etc.).

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🤝 Contributing

This is a demonstration project showcasing AI-powered credibility analysis. Feel free to fork and adapt for your needs.

## 📄 License

This project is provided as-is for educational and demonstration purposes.

## 🔗 Resources

- [Google Gemini API Documentation](https://ai.google.dev/docs)
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

---

**Built with ❤️ using Google Gemini AI**
