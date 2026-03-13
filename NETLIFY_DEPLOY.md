# Quick Netlify Deployment Guide

## Deploy Your Dark Pattern Detector to Netlify

### Step 1: Prepare Your Repository
✅ Already done! Your code is on GitHub at: `https://github.com/prempradip/darkpatterns.git`

### Step 2: Deploy to Netlify

1. **Go to Netlify**
   - Visit: https://app.netlify.com/
   - Sign up or log in (you can use your GitHub account)

2. **Import Your Project**
   - Click "Add new site" → "Import an existing project"
   - Choose "Deploy with GitHub"
   - Authorize Netlify to access your GitHub
   - Select your repository: `prempradip/darkpatterns`

3. **Configure Build Settings**
   - Site name: `darkpattern-detector` (or choose your own)
   - Branch to deploy: `main`
   - Build command: (leave empty)
   - Publish directory: `.`
   - Click "Deploy site"

4. **Wait for Deployment**
   - Netlify will deploy your site in ~30 seconds
   - Your site will be live at: `https://darkpattern-detector.netlify.app`
   - (or your custom name: `https://your-site-name.netlify.app`)

### Step 3: Important Note About Backend

⚠️ **The frontend will work, but backend features won't work yet** because:
- URL Analysis requires a backend server
- Image Analysis requires a backend server

The frontend will show an error: "Cannot connect to backend server"

### Step 4: Deploy Backend (Optional)

To make the full app work, deploy the backend to Render.com:

1. **Go to Render**
   - Visit: https://render.com/
   - Sign up with GitHub

2. **Create Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select `prempradip/darkpatterns`

3. **Configure Service**
   - Name: `darkpattern-api`
   - Root Directory: `backend`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Instance Type: `Free`

4. **Add Environment Variable**
   - Key: `NODE_ENV`
   - Value: `production`

5. **Deploy**
   - Click "Create Web Service"
   - Wait 5-10 minutes for deployment

6. **Update Frontend**
   - Copy your Render backend URL (e.g., `https://darkpattern-api.onrender.com`)
   - Update `script.js` line 2:
     ```javascript
     const API_BASE_URL = 'https://darkpattern-api.onrender.com';
     ```
   - Commit and push changes
   - Netlify will auto-redeploy

### Alternative: Frontend-Only Demo

If you want to deploy just the frontend for demonstration:

1. The Pattern Ethics Score calculator will work
2. Manual pattern detection will work
3. URL and Image analysis won't work (requires backend)
4. Add a notice on your site explaining backend features are disabled

### Custom Domain (Optional)

1. In Netlify dashboard, go to "Domain settings"
2. Click "Add custom domain"
3. Follow instructions to configure DNS

### Your Live URLs

After deployment:
- **Frontend**: `https://your-site-name.netlify.app`
- **Backend** (if deployed): `https://darkpattern-api.onrender.com`

### Troubleshooting

**Issue**: Site shows blank page
- **Fix**: Check browser console for errors
- **Fix**: Verify all files are committed to GitHub

**Issue**: Backend not connecting
- **Fix**: Update `API_BASE_URL` in `script.js` with your backend URL
- **Fix**: Ensure backend is deployed and running

**Issue**: Render backend sleeps after inactivity
- **Note**: Free tier sleeps after 15 minutes of inactivity
- **Fix**: Upgrade to paid plan ($7/month) or accept 30-second wake-up time

### Next Steps

1. ✅ Code pushed to GitHub
2. 🚀 Deploy frontend to Netlify (5 minutes)
3. 🔧 Deploy backend to Render (10 minutes)
4. 🔗 Connect frontend to backend
5. 🎉 Share your live URL!

### Need Help?

- Netlify Docs: https://docs.netlify.com/
- Render Docs: https://render.com/docs
- Your GitHub Repo: https://github.com/prempradip/darkpatterns
