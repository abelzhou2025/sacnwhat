# Netlify Deployment Checklist

## Before Deploying

- [ ] Push code to GitHub repository
- [ ] Ensure all dependencies are in `package.json`
- [ ] Verify `netlify.toml` is configured correctly
- [ ] Test locally with `npm run build`

## Netlify Setup

1. **Connect Repository**
   - Go to Netlify Dashboard
   - Add new site → Import from Git
   - Select your GitHub repository

2. **Build Settings** (should auto-detect from `netlify.toml`)
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: 18

3. **Environment Variables**
   - Go to Site settings → Environment variables
   - Add one of:
     - `DEEPSEEK_API_KEY` = your DeepSeek API key
     - `GEMINI_API_KEY` = your Google Gemini API key
   - The function will use whichever is available

4. **Deploy**
   - Click "Deploy site"
   - Wait for build to complete
   - Your site will be live!

## Testing After Deployment

- [ ] Test single image upload
- [ ] Test multiple image upload
- [ ] Test camera capture (on mobile)
- [ ] Test text extraction
- [ ] Test scan history
- [ ] Test swipe-to-delete
- [ ] Verify API calls work (check Netlify Functions logs)

## Troubleshooting

### Function Errors
- Check Netlify Functions logs in the dashboard
- Verify environment variables are set correctly
- Check API key is valid

### Build Errors
- Ensure Node version is 18+
- Check all dependencies are installed
- Verify TypeScript compiles without errors

### API Errors
- Verify API key is correct
- Check API endpoint URL in `netlify/functions/ocr.ts`
- For DeepSeek-OCR, you may need to adjust the API endpoint

## Updating API Endpoint

If you need to use a different OCR API (like DeepSeek-OCR), edit `netlify/functions/ocr.ts`:

1. Update the `fetch` URL to the correct API endpoint
2. Adjust the request body format if needed
3. Update the response parsing logic
4. Redeploy the site

