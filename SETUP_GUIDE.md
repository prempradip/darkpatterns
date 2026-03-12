# Setup Guide - Dark Pattern Detector

Complete guide to set up and run the Dark Pattern Detector with real analysis.

## 📋 Prerequisites

- Node.js 16+ installed
- npm or yarn
- 2GB RAM minimum
- Internet connection

## 🚀 Quick Start

### Step 1: Install Backend Dependencies

```bash
cd backend
npm install
```

This will install:
- express (web server)
- puppeteer (web scraping)
- cheerio (HTML parsing)
- tesseract.js (OCR for images)
- multer (file uploads)
- sharp (image processing)
- cors (cross-origin requests)

### Step 2: Start the Backend Server

```bash
npm start
```

You should see:
```
╔═══════════════════════════════════════════════════════╗
║   Dark Pattern Detector API Server                   ║
║   Running on: http://localhost:3000                  ║
╚═══════════════════════════════════════════════════════╝

Ready to detect dark patterns! 🔍
```

### Step 3: Open the Frontend

Open `index.html` in your browser or use a local server:

```bash
# Option 1: Direct file
open index.html

# Option 2: Python server
python -m http.server 8000

# Option 3: Node server
npx http-server
```

### Step 4: Test It!

1. Enter a URL: `https://amazon.com`
2. Click "Analyze"
3. Wait 5-15 seconds
4. See real results!

---

## 📦 Installation Details

### Backend Installation

```bash
cd backend
npm install
```

**What gets installed:**

| Package | Purpose | Size |
|---------|---------|------|
| express | Web server | ~200KB |
| puppeteer | Browser automation | ~300MB |
| cheerio | HTML parsing | ~1MB |
| tesseract.js | OCR engine | ~4MB |
| multer | File uploads | ~100KB |
| sharp | Image processing | ~10MB |
| cors | CORS handling | ~10KB |

**Total size:** ~315MB (mostly Chromium for Puppeteer)

### First Run

On first run, Puppeteer will download Chromium (~150MB). This is normal and only happens once.

---

## 🔧 Configuration

### Environment Variables

Create `backend/.env`:

```bash
PORT=3000
NODE_ENV=development
```

### Frontend Configuration

Edit `script.js` if backend runs on different port:

```javascript
const API_BASE_URL = 'http://localhost:3000';  // Change if needed
```

---

## 🧪 Testing

### Test Backend Health

```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "ok",
  "message": "Dark Pattern Detector API is running",
  "version": "1.0.0"
}
```

### Test URL Analysis

```bash
curl -X POST http://localhost:3000/api/analyze-url \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}'
```

### Test Image Analysis

```bash
curl -X POST http://localhost:3000/api/analyze-image \
  -F "image=@screenshot.png"
```

---

## 🐛 Troubleshooting

### Issue: "Cannot connect to backend server"

**Solution:**
1. Make sure backend is running: `cd backend && npm start`
2. Check if port 3000 is available
3. Try different port in `.env`: `PORT=3001`

### Issue: Puppeteer fails to launch

**Solution (Windows):**
```bash
npm install puppeteer --ignore-scripts=false
```

**Solution (Linux):**
```bash
sudo apt-get install -y chromium-browser
```

**Solution (Mac):**
```bash
brew install chromium
```

### Issue: "Module not found"

**Solution:**
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

### Issue: Image analysis is slow

**Reason:** OCR is CPU-intensive

**Solutions:**
- Use smaller images (< 2MB)
- Resize images before upload
- Increase Node.js memory: `node --max-old-space-size=4096 server.js`

### Issue: CORS errors

**Solution:**
Backend already has CORS enabled. If still having issues:

```javascript
// backend/server.js
app.use(cors({
    origin: '*',  // Allow all origins (development only!)
    methods: ['GET', 'POST']
}));
```

---

## 📊 Performance

### URL Analysis
- **Time:** 5-15 seconds
- **Depends on:** Website size, loading speed
- **Memory:** ~200MB per analysis

### Image Analysis
- **Time:** 3-10 seconds
- **Depends on:** Image size, text amount
- **Memory:** ~150MB per analysis

### Optimization Tips

1. **Use caching** (future enhancement):
   ```javascript
   // Cache results for 1 hour
   const cache = new Map();
   ```

2. **Limit concurrent requests**:
   ```javascript
   // Max 3 concurrent analyses
   const queue = new PQueue({ concurrency: 3 });
   ```

3. **Use worker threads** for CPU-intensive tasks

---

## 🚀 Deployment

### Deploy Backend

#### Option 1: Heroku
```bash
cd backend
heroku create darkpattern-detector
git push heroku main
```

#### Option 2: DigitalOcean
```bash
# Create droplet
# SSH into server
git clone https://github.com/prempradip/darkpatterns.git
cd darkpatterns/backend
npm install
npm start
```

#### Option 3: AWS Lambda
Use serverless framework:
```bash
npm install -g serverless
serverless deploy
```

### Deploy Frontend

#### Option 1: GitHub Pages
Already set up! Just enable in repository settings.

#### Option 2: Netlify
```bash
# Connect GitHub repo
# Build command: (none)
# Publish directory: /
```

#### Option 3: Vercel
```bash
vercel --prod
```

### Update Frontend API URL

For production, update `script.js`:

```javascript
const API_BASE_URL = 'https://your-backend-url.com';
```

---

## 📝 Development

### Run in Development Mode

```bash
cd backend
npm run dev  # Auto-reloads on changes
```

### Add New Pattern Detection

Edit `backend/analyzers/url-analyzer.js`:

```javascript
// Add new pattern check
const hasNewPattern = /* your logic */;
if (hasNewPattern) {
    patterns.push({
        category: 'dark',
        type: 'new_pattern_type',
        confidence: 0.8,
        evidence: 'Description',
        location: 'Where found'
    });
}
```

### Add New Pattern Type

1. Add to `scoring-logic.js` PATTERN_DEFINITIONS
2. Add detection logic to analyzers
3. Update frontend to display new type

---

## 🔐 Security

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Add rate limiting
- [ ] Add authentication (if needed)
- [ ] Validate all inputs
- [ ] Use HTTPS
- [ ] Set CORS to specific origins
- [ ] Add request logging
- [ ] Monitor for abuse

### Rate Limiting Example

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

---

## 📚 Additional Resources

- [Puppeteer Documentation](https://pptr.dev/)
- [Tesseract.js Documentation](https://tesseract.projectnaptha.com/)
- [Express.js Guide](https://expressjs.com/)
- [Dark Patterns Hall of Shame](https://www.darkpatterns.org/)

---

## ✅ Verification Checklist

After setup, verify:

- [ ] Backend starts without errors
- [ ] Health endpoint responds
- [ ] URL analysis works
- [ ] Image analysis works
- [ ] Frontend connects to backend
- [ ] Results are accurate
- [ ] No CORS errors
- [ ] Performance is acceptable

---

## 🎯 Next Steps

1. ✅ Backend is running
2. ✅ Frontend is connected
3. ✅ Real analysis is working
4. 🔄 Test with various websites
5. 🔄 Fine-tune pattern detection
6. 🔄 Deploy to production
7. 🔄 Add more pattern types
8. 🔄 Implement caching
9. 🔄 Add user accounts
10. 🔄 Build pattern database

---

## 💡 Tips

- Start backend before opening frontend
- Use Chrome DevTools to debug API calls
- Check backend console for detailed logs
- Test with known dark pattern sites
- Compare results with manual inspection

---

## 🆘 Need Help?

1. Check backend logs: `cd backend && npm start`
2. Check browser console: F12 → Console
3. Review error messages
4. Check IMPLEMENTATION_STATUS.md
5. Open GitHub issue

---

Congratulations! Your Dark Pattern Detector is now fully functional with real analysis! 🎉
