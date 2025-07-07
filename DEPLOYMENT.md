# Deployment Guide for DetectReference

## Important: API Key Security

⚠️ **CRITICAL**: The API keys in the repository have been exposed. Before deploying:
1. Go to Google Cloud Console and regenerate all API keys
2. Never commit real API keys to GitHub

## Environment Configuration

### Local Development (with proxy)
```env
USE_PROXY=true
PROXY_URL=http://127.0.0.1:7890
```

### Production Deployment (Cloudflare, Vercel, etc.)
```env
USE_PROXY=false
# Remove or comment out PROXY_URL
```

## Deployment Steps

### 1. Prepare for Deployment

1. **Update API Keys**
   - Generate new API keys from:
     - [Google Cloud Console](https://console.cloud.google.com/)
     - [Google AI Studio](https://aistudio.google.com/app/apikey)
   
2. **Configure Environment**
   - Copy `.env.example` to `.env`
   - Set `USE_PROXY=false` for production
   - Add your new API keys

### 2. Frontend Configuration

For production, update the API endpoint in your frontend build:

**Option A: Environment Variable (Recommended)**
```bash
# During build
VITE_API_URL=https://your-backend-url.com npm run build
```

**Option B: Update vite.config.js**
```javascript
// For production builds
proxy: {
  '/api': {
    target: 'https://your-backend-url.com',
    changeOrigin: true
  }
}
```

### 3. Cloudflare Deployment

#### Backend (Cloudflare Workers)
1. Install Wrangler: `npm install -g wrangler`
2. Configure wrangler.toml
3. Set environment variables in Cloudflare dashboard
4. Deploy: `wrangler publish`

#### Frontend (Cloudflare Pages)
1. Connect GitHub repository
2. Build command: `npm run build`
3. Build output directory: `dist`
4. Set environment variables in Pages settings

### 4. Environment Variables for Production

Required variables:
```
GEMINI_API_KEY=your_new_key
GOOGLE_SEARCH_API_KEY=your_new_key
GOOGLE_CSE_ID=your_cse_id
USE_PROXY=false
GEMINI_MODEL_NAME=gemini-2.5-flash-lite-preview-06-17
```

### 5. Post-Deployment Checklist

- [ ] Verify API endpoints are accessible
- [ ] Test reference verification functionality
- [ ] Check citation formatting works
- [ ] Monitor API usage in Google Cloud Console
- [ ] Set up rate limiting if needed

## Security Notes

1. Never expose API keys in frontend code
2. Use environment variables for all sensitive data
3. Enable CORS only for your domain in production
4. Consider implementing rate limiting
5. Monitor API usage to prevent abuse

## Troubleshooting

### Issue: API calls failing in production
- Check `USE_PROXY=false` is set
- Verify API keys are correct
- Check CORS configuration

### Issue: Frontend can't reach backend
- Verify backend URL in frontend config
- Check Cloudflare firewall rules
- Ensure both services are in same region