# Dark Pattern Detector - Backend API

Real-time analysis of websites and images for dark patterns using Puppeteer and Tesseract.js.

## Features

- ✅ **URL Analysis**: Scrapes and analyzes actual websites
- ✅ **Image Analysis**: OCR and pattern detection in screenshots
- ✅ **Real Pattern Detection**: 10+ pattern types detected
- ✅ **Confidence Scores**: Each detection includes confidence level
- ✅ **Evidence**: Specific evidence for each detected pattern

## Installation

```bash
cd backend
npm install
```

## Configuration

Create a `.env` file:

```bash
cp .env.example .env
```

Edit `.env` if needed (default port is 3000).

## Running the Server

### Development mode (with auto-reload):
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

Server will start on `http://localhost:3000`

## API Endpoints

### 1. Health Check
```http
GET /health
```

Response:
```json
{
  "status": "ok",
  "message": "Dark Pattern Detector API is running",
  "version": "1.0.0"
}
```

### 2. Analyze URL
```http
POST /api/analyze-url
Content-Type: application/json

{
  "url": "https://example.com"
}
```

Response:
```json
{
  "success": true,
  "url": "https://example.com",
  "analyzedAt": "2024-01-15T10:30:00.000Z",
  "patterns": [
    {
      "category": "dark",
      "type": "sneak_into_basket",
      "confidence": 0.9,
      "evidence": "Found 2 pre-checked checkbox(es)",
      "location": "Form inputs"
    }
  ],
  "metadata": {
    "title": "Example Site",
    "description": "Site description",
    "url": "https://example.com"
  },
  "summary": {
    "totalPatterns": 5,
    "darkPatterns": 2,
    "greyPatterns": 1,
    "whitePatterns": 2
  }
}
```

### 3. Analyze Image
```http
POST /api/analyze-image
Content-Type: multipart/form-data

image: [file]
```

Response:
```json
{
  "success": true,
  "filename": "screenshot.png",
  "size": 245678,
  "analyzedAt": "2024-01-15T10:30:00.000Z",
  "patterns": [
    {
      "category": "dark",
      "type": "confirmshaming",
      "confidence": 0.9,
      "evidence": "Found guilt-tripping language: \"no thanks\"",
      "location": "Button/CTA text"
    }
  ],
  "metadata": {
    "width": 1920,
    "height": 1080,
    "format": "png",
    "textLength": 1234,
    "extractedText": "..."
  },
  "summary": {
    "totalPatterns": 3,
    "darkPatterns": 1,
    "greyPatterns": 1,
    "whitePatterns": 1
  }
}
```

## Pattern Types Detected

### Dark Patterns (category: "dark")
- `sneak_into_basket` - Pre-checked boxes
- `confirmshaming` - Guilt-tripping language
- `hidden_costs` - Costs revealed late
- `roach_motel` - Difficult cancellation
- `trick_questions` - Confusing double-negatives
- `forced_continuity` - Hard to cancel subscriptions

### Grey Patterns (category: "grey")
- `urgency_messaging` - Fake urgency/scarcity
- `social_proof_unverified` - Unverified testimonials
- `default_options` - Pre-selected options
- `obstruction` - Hidden settings/options

### White Patterns (category: "white")
- `clear_pricing` - Transparent pricing
- `verified_social_proof` - Verified reviews
- `explicit_consent` - Clear consent options
- `clear_navigation` - Easy to find settings
- `easy_cancellation` - Simple cancellation
- `transparent_data_usage` - Clear privacy info

## Testing

### Test URL Analysis:
```bash
curl -X POST http://localhost:3000/api/analyze-url \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}'
```

### Test Image Analysis:
```bash
curl -X POST http://localhost:3000/api/analyze-image \
  -F "image=@screenshot.png"
```

## Error Handling

All errors return JSON with:
```json
{
  "error": "Error type",
  "message": "Detailed error message"
}
```

Common errors:
- `400` - Bad request (missing/invalid parameters)
- `500` - Server error (analysis failed)

## Performance

- URL Analysis: ~5-15 seconds (depends on website)
- Image Analysis: ~3-10 seconds (depends on image size)

## Requirements

- Node.js 16+
- 2GB RAM minimum
- Internet connection (for URL analysis)

## Troubleshooting

### Puppeteer issues:
```bash
# Install Chromium dependencies (Linux)
sudo apt-get install -y chromium-browser

# Or use system Chrome
export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
export PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
```

### Memory issues:
Increase Node.js memory:
```bash
node --max-old-space-size=4096 server.js
```

## License

MIT
