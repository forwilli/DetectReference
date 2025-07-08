# Cite - Reference Verifier & Citation Generator

A free web tool that detects AI hallucinations and fabricated references in academic papers. Verify citations with CrossRef and Google Scholar, then format them in APA, MLA, Chicago, or Harvard styles.

🔗 **Live Demo**: [cite.alx37.com](https://cite.alx37.com)

## Features

- 🔍 **Reference Verification**: Check if citations are real using CrossRef and Google Scholar
- 🤖 **AI Hallucination Detection**: Identify fabricated or AI-generated references
- 📝 **Citation Formatting**: Convert references to APA, MLA, Chicago, or Harvard formats
- ✨ **Rich Text Copy**: Preserve italics when copying to Word
- 🚀 **Free Forever**: No signup, no limits, no ads

## Tech Stack

- **Frontend**: React, Tailwind CSS, Vite
- **Backend**: Node.js, Express
- **APIs**: CrossRef, Google Scholar, Gemini AI
- **Deployment**: Vercel

## Development

```bash
# Install dependencies
cd frontend && npm install
cd ../backend && npm install

# Run frontend (http://localhost:5173)
cd frontend && npm run dev

# Run backend (http://localhost:3001)
cd backend && npm start
```

## Environment Variables

Create `.env` file in backend directory:
```env
PORT=3001
GEMINI_API_KEY=your_gemini_api_key
GOOGLE_API_KEY=your_google_api_key
GOOGLE_CSE_ID=your_custom_search_engine_id
```

## Contributing

Pull requests are welcome! Please feel free to submit a PR.

## License

MIT License - feel free to use this in your own projects!

---

Made with ❤️ for students everywhere