# Vercel Deployment Instructions

## Prerequisites

- GitHub account with GovConnect repository
- Vercel account (free at vercel.com)

## Setup Steps

### 1. Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign in with your GitHub account
3. Click "New Project"
4. Select "GovConnect" repository
5. Click "Import"

### 2. Configure Environment Variables

After importing, Vercel will ask for environment variables. Add these:

**Required for Production:**

- `MONGODB_URI` - Your MongoDB Atlas connection string
  - Get from: https://www.mongodb.com/cloud/atlas
  - Format: `mongodb+srv://username:password@cluster.mongodb.net/dbname`

**Optional (will use defaults if not set):**

- `JWT_SECRET` - Any strong random string (default will be generated)
- `TWILIO_ACCOUNT_SID` - Get from Twilio dashboard (optional)
- `TWILIO_AUTH_TOKEN` - Get from Twilio dashboard (optional)
- `FIREBASE_PROJECT_ID` - Get from Firebase console (optional)
- `CORS_ORIGIN` - Will auto-detect your Vercel URL

### 3. Deploy

1. Click "Deploy"
2. Wait for build to complete (3-5 minutes)
3. Your app will be live at `your-project.vercel.app`

### 4. Verify Deployment

- Frontend: https://your-project.vercel.app
- Backend API: https://your-project.vercel.app/api/health
- Should return: `{"status":"OK",...}`

## Local Development

To test locally before deploying:

```bash
cd backend
npm install
npm run dev
# In another terminal
cd frontend
npm install
npm start
```

## Troubleshooting

**Build Error: "Cannot find module"**

- Clear build cache in Vercel dashboard: Settings → Build Cache → Clear

**MongoDB Connection Error**

- Make sure MONGODB_URI is set in Vercel environment variables
- Verify MongoDB Atlas IP whitelist includes Vercel IPs

**CORS Errors**

- The app auto-detects CORS_ORIGIN from Vercel deployment URL
- For custom domains, manually set CORS_ORIGIN variable

**API Calls Failing**

- Check that backend is deployed at /api routes
- Verify frontend REACT_APP_API_URL points to correct domain

## Environment Variables Reference

| Variable    | Purpose             | Example                                          |
| ----------- | ------------------- | ------------------------------------------------ |
| MONGODB_URI | Database connection | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| JWT_SECRET  | Token signing       | Any random string (auto-generated if not set)    |
| CORS_ORIGIN | Frontend domain     | `https://yourapp.vercel.app`                     |
| NODE_ENV    | Environment         | `production`                                     |
| PORT        | Server port         | `3000` (auto-set by Vercel)                      |

## Monitoring

After deployment, monitor your app:

- Vercel Dashboard: View logs and analytics
- Real-time logs: `vercel logs <project-name>`
- Monitor database: MongoDB Atlas dashboard

## Custom Domain

To add a custom domain:

1. Go to Project Settings → Domains
2. Add your domain (e.g., govconnect.rw)
3. Follow DNS configuration instructions
4. Wait 5-10 minutes for DNS propagation

---

**Documentation:** See [docs/DOCUMENTATION.md](../docs/DOCUMENTATION.md) for more info.
