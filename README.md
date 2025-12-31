# ScanWhat - Image to Text OCR App

ScanWhat is a web application that allows users to take photos or upload images and convert them to editable text using OCR (Optical Character Recognition) technology.

## Features

- 📸 **Take Photos**: Capture text using your device's camera
- 📤 **Upload Images**: Upload single or multiple images for text extraction
- 🔄 **Batch Processing**: Process multiple images at once with progress tracking
- 📝 **Editable Text**: View and edit extracted text
- 📚 **Scan History**: Automatically save all scans with timestamps
- 🗑️ **Swipe to Delete**: Right-swipe on scan items to delete them
- 🌙 **Dark Mode**: Automatic dark mode support

## Run Locally

**Prerequisites:** Node.js 18+

1. Install dependencies:
   ```bash
   npm install
   ```

2. For local development, you can set environment variables in a `.env.local` file:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

3. Run the app:
   ```bash
   npm run dev
   ```

4. Open your browser to `http://localhost:3000`

## Deploy to Netlify

### Prerequisites

1. A GitHub account
2. A Netlify account (free tier works)
3. An API key for the OCR service (Gemini API key or DeepSeek API key)

### Deployment Steps

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/scanwhat.git
   git push -u origin main
   ```

2. **Connect to Netlify**:
   - Go to [Netlify](https://www.netlify.com/)
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub account and select the `scanwhat` repository
   - Netlify will automatically detect the build settings from `netlify.toml`

3. **Configure Environment Variables**:
   - In Netlify dashboard, go to Site settings → Environment variables
   - Add one of the following:
     - `DEEPSEEK_API_KEY` (for DeepSeek-OCR API)
     - `GEMINI_API_KEY` (for Google Gemini API)
   - The function will use whichever is available

4. **Deploy**:
   - Netlify will automatically build and deploy your site
   - The build command is: `npm run build`
   - The publish directory is: `dist`

### Netlify Configuration

The project includes a `netlify.toml` file with the following configuration:
- Build command: `npm run build`
- Publish directory: `dist`
- Node version: 18
- Netlify Functions: Located in `netlify/functions/`

### API Configuration

The OCR API is called through a Netlify Function (`netlify/functions/ocr.ts`) which:
- Keeps your API key secure on the server side
- Handles CORS properly
- Processes image data and returns extracted text

**Note**: Make sure to set the API key in Netlify's environment variables, not in your code!

## Project Structure

```
scanwhat/
├── netlify/
│   ├── functions/
│   │   └── ocr.ts          # Netlify Function for OCR API calls
│   └── functions/
│       └── tsconfig.json    # TypeScript config for functions
├── components/
│   ├── icons.tsx            # Icon components
│   ├── ScanList.tsx         # List of saved scans
│   └── ScanListItem.tsx     # Individual scan item with swipe-to-delete
├── services/
│   └── geminiService.ts     # OCR service (calls Netlify Function)
├── utils/
│   └── imageHelper.ts       # Image compression utilities
├── App.tsx                  # Main application component
├── types.ts                 # TypeScript type definitions
├── netlify.toml            # Netlify deployment configuration
└── package.json            # Dependencies and scripts
```

## Usage

1. **Single Image**:
   - Click "Take Photo" or "Upload Image"
   - Select/preview your image
   - Click "Extract Text"
   - View and edit the extracted text

2. **Multiple Images**:
   - Click "Upload Image" and select multiple images
   - Preview all selected images
   - Click "Extract Text from X Images"
   - View progress as each image is processed
   - All results are saved to your scan history

3. **View History**:
   - All scans are automatically saved
   - Click on any scan to view/edit it
   - Swipe right on any scan to delete it

## Technologies Used

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling (via CDN)
- **Netlify Functions** - Serverless functions for API calls
- **Google Gemini API** / **DeepSeek-OCR** - OCR service

## License

MIT
