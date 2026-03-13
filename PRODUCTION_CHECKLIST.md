# Production Deployment Checklist

## ✅ Pre-Deployment

### Backend Configuration
- [ ] Create `.env` file in backend directory
- [ ] Set `NODE_ENV=production`
- [ ] Configure `ALLOWED_ORIGINS` with your frontend domain(s)
- [ ] Test backend locally: `cd backend && npm start`
- [ ] Verify health endpoint: `curl http://localhost:3000/health`

### Frontend Configuration
- [ ] Update `API_BASE_URL` in `script.js` with your production backend URL
- [ ] Replace `https://your-backend-url.com` with actual backend domain
- [ ] Test frontend locally with production backend URL

### Security
- [ ] Verify no secrets in code (✅ Already checked - clean)
- [ ] Confirm `.env` is in `.gitignore` (✅ Already configured)
- [ ] Review CORS settings match your domains
- [ ] Enable HTTPS on both frontend and backend

## 🚀 Deployment Steps

### 1. Deploy Backend First

**Recommended: Render.com (Free tier)**
1. Go to https://render.com/
2. Create new Web Service
3. Connect GitHub repository
4. Configure:
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment: Node
5. Add environment variables:
   - `NODE_ENV` = `production`
   - `ALLOWED_ORIGINS` = `https://your-frontend-domain.netlify.app`
6. Deploy and note the backend URL (e.g., `https://darkpattern-api.onrender.com`)

**Alternative: Railway.app**
- Similar process, automatic HTTPS
- May require credit card for free tier

### 2. Update Frontend with Backend URL

After backend is deployed:
1. Edit `script.js`
2. Replace `https://your-backend-url.com` with actual backend URL
3. Commit and push changes

### 3. Deploy Frontend

**Netlify (Recommended)**
1. Go to https://netlify.com/
2. "Add new site" → "Import from Git"
3. Select your repository
4. Configure:
   - Build command: (leave empty)
   - Publish directory: `.`
5. Deploy
6. Note your frontend URL (e.g., `https://darkpattern-detector.netlify.app`)

### 4. Update Backend CORS

1. Go back to your backend hosting (Render/Railway)
2. Update `ALLOWED_ORIGINS` environment variable with your Netlify URL
3. Restart backend service

## 🧪 Post-Deployment Testing

- [ ] Visit your frontend URL
- [ ] Test URL analysis with a real website
- [ ] Test image upload with a screenshot
- [ ] Check browser console for errors
- [ ] Verify patterns are detected correctly
- [ ] Test on mobile device
- [ ] Check backend logs for errors

## ⚠️ Known Limitations

### Puppeteer on Free Hosting
- Render.com free tier may have issues with Puppeteer/Chromium
- If URL analysis fails, consider:
  - Upgrading to paid tier ($7/month)
  - Using Railway.app instead
  - Self-hosting on VPS

### Free Tier Limitations
- **Render.com**: Service sleeps after 15 min inactivity (cold start ~30s)
- **Netlify**: 100GB bandwidth/month, 300 build minutes/month
- **Railway**: $5 free credit/month

## 📊 Monitoring (Optional but Recommended)

### Uptime Monitoring
- Set up UptimeRobot (free): https://uptimerobot.com/
- Monitor both frontend and backend `/health` endpoint

### Error Tracking
- Consider Sentry for error tracking (free tier available)
- Add to both frontend and backend

### Analytics
- Google Analytics for frontend usage
- Backend: Log analysis patterns detected

## 🔒 Security Hardening (Production)

### Rate Limiting
Add to backend (install: `npm install express-rate-limit`):
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

### Helmet.js for Security Headers
```bash
cd backend
npm install helmet
```

Add to server.js:
```javascript
const helmet = require('helmet');
app.use(helmet());
```

## 💰 Cost Estimate

### Free Tier (Recommended for Demo)
- Frontend (Netlify): $0
- Backend (Render.com): $0
- **Total: $0/month**
- Limitations: Cold starts, limited resources

### Production Ready
- Frontend (Netlify): $0
- Backend (Render.com Starter): $7/month
- **Total: $7/month**
- Benefits: No cold starts, better performance

### Self-Hosted
- VPS (DigitalOcean/Linode): $6-12/month
- Full control, best performance

## 🆘 Troubleshooting

### Backend won't start
- Check Node.js version (need 18.17+)
- Verify all dependencies installed
- Check environment variables set correctly

### URL analysis fails
- Puppeteer/Chromium issue on hosting platform
- Check backend logs for specific error
- May need to upgrade hosting tier

### CORS errors
- Verify `ALLOWED_ORIGINS` includes your frontend domain
- Check protocol (http vs https) matches
- Restart backend after changing CORS settings

### Image upload fails
- Check file size < 10MB
- Verify file type is image (jpg, png, gif, webp)
- Check backend logs for Tesseract errors

## 📝 Final Notes

Your application is **90% production ready**. The main tasks are:

1. Deploy backend to Render/Railway
2. Update frontend with backend URL
3. Deploy frontend to Netlify
4. Test thoroughly

Estimated setup time: 30-45 minutes

Good luck with your deployment! 🚀
