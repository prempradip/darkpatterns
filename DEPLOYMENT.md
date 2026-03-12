# Deployment Guide

## Production Deployment Options

### Option 1: Netlify (Frontend Only - Recommended for Demo)

The frontend can be deployed to Netlify for free. Note: Backend features (URL analysis, image analysis) will not work without a backend server.

#### Steps:
1. Push your code to GitHub
2. Go to [Netlify](https://www.netlify.com/)
3. Click "Add new site" → "Import an existing project"
4. Connect your GitHub repository
5. Configure build settings:
   - Build command: (leave empty)
   - Publish directory: `.`
6. Click "Deploy site"

Your frontend will be live at: `https://your-site-name.netlify.app`

**Note**: The backend API endpoints won't work. You'll need to deploy the backend separately.

### Option 2: Full Stack Deployment

For a fully functional application with backend, you need to deploy both frontend and backend:

#### Frontend: Netlify or Vercel
- Deploy the root directory (index.html, script.js, styles.css)

#### Backend Options:

**A. Render.com (Free tier available)**
1. Create account at [Render](https://render.com/)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - Name: `darkpattern-detector-api`
   - Root Directory: `backend`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Instance Type: Free
5. Add environment variable:
   - `NODE_ENV` = `production`
6. Deploy

**B. Railway.app**
1. Go to [Railway](https://railway.app/)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Configure:
   - Root Directory: `backend`
   - Start Command: `npm start`
5. Deploy

**C. Heroku**
1. Install Heroku CLI
2. Create `Procfile` in backend directory:
   ```
   web: node server.js
   ```
3. Deploy:
   ```bash
   cd backend
   heroku create darkpattern-detector-api
   git push heroku main
   ```

### Option 3: Self-Hosted (VPS)

Deploy on your own server (DigitalOcean, AWS EC2, etc.):

#### Frontend:
- Serve static files with Nginx or Apache
- Or use a CDN like Cloudflare Pages

#### Backend:
```bash
# Install Node.js 18.17+ or 20 LTS
cd backend
npm install --production
npm start
```

Use PM2 for process management:
```bash
npm install -g pm2
pm2 start server.js --name darkpattern-api
pm2 save
pm2 startup
```

### Connecting Frontend to Backend

After deploying the backend, update `script.js`:

```javascript
const API_BASE_URL = 'https://your-backend-url.com';
```

Replace `http://localhost:3000` with your actual backend URL.

## Environment Variables

### Backend (.env file):
```
PORT=3000
NODE_ENV=production
```

## Important Notes

1. **Node.js Version**: Ensure your hosting platform uses Node.js 18.17.0 or higher
2. **Puppeteer**: Some platforms may require additional configuration for Puppeteer/Chromium
3. **CORS**: The backend is configured to accept requests from any origin. Restrict this in production:
   ```javascript
   app.use(cors({
     origin: 'https://your-frontend-domain.com'
   }));
   ```

## Testing Production Build

Before deploying:
1. Test frontend locally: Open `index.html` in browser
2. Test backend locally: `cd backend && npm start`
3. Verify all features work
4. Check browser console for errors

## Monitoring

After deployment:
- Monitor backend logs for errors
- Set up uptime monitoring (UptimeRobot, Pingdom)
- Monitor API response times
- Track error rates

## Security Checklist

- [ ] Update CORS settings to specific domains
- [ ] Add rate limiting to API endpoints
- [ ] Enable HTTPS (automatic on Netlify/Vercel)
- [ ] Set secure headers (already configured in netlify.toml)
- [ ] Keep dependencies updated
- [ ] Don't commit .env files to git

## Cost Estimates

- **Netlify (Frontend)**: Free
- **Render.com (Backend)**: Free tier available (sleeps after inactivity)
- **Railway (Backend)**: $5/month for hobby plan
- **Heroku (Backend)**: $7/month for basic dyno
- **VPS (Full Stack)**: $5-10/month (DigitalOcean, Linode)

## Support

For deployment issues:
- Check platform-specific documentation
- Review backend logs for errors
- Ensure Node.js version compatibility
- Verify all environment variables are set
