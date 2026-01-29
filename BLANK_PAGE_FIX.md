# 🔧 GovConnect Blank Page - Troubleshooting Guide

## Problem

Your deployed GovConnect application on Netlify (<https://govconnecting.netlify.app>) is showing a blank white page.

## Root Causes & Solutions

### 1. ❌ **Environment Variables Not Set (MOST LIKELY)**

**Problem:** Environment variables defined in `.env.local` only work locally. They are NOT automatically transferred to Netlify.

**Solution:**

1. Go to Netlify Dashboard: <https://app.netlify.com>
2. Select your "GovConnect" site  
3. Go to: **Site Settings** → **Environment variables**
4. Add these variables:

```env
REACT_APP_API_URL=https://your-backend-api.com/api
REACT_APP_SOCKET_URL=https://your-backend-api.com
REACT_APP_SUPABASE_URL=https://qwisdiwxrdhyhjpmnhhj.supabase.co
REACT_APP_SUPABASE_ANON_KEY=sb_publishable_aAOzGGUNslQT2Z_bapW-HA_ZcuPdZyR
DISABLE_ESLINT_PLUGIN=true
SKIP_PREFLIGHT_CHECK=true
CI=false
GENERATE_SOURCEMAP=false
```

1. After adding, go to **Deploys** → Click **Trigger deploy** → **Clear cache and deploy**

---

### 2. 🌐 **Backend API Not Deployed**

**Problem:** Your React app is trying to connect to `http://localhost:5000/api` which doesn't exist in production.

**Solution:**

- Deploy your backend to a service like:
  - Render (<https://render.com>)
  - Railway (<https://railway.app>)
  - Heroku
  - Vercel (for serverless)
  
- Update `REACT_APP_API_URL` with the deployed backend URL

---

### 3. 📦 **Build Errors**

**Problem:** The build might have failed silently.

**Check:**

1. Go to Netlify Dashboard → **Deploys**
2. Click on the latest deploy
3. Look at the **Deploy log**
4. Search for errors (words like "ERROR", "Failed", "Cannot find")

**Common Build Errors:**

- Missing dependencies (run `npm install` in frontend folder)
- Import errors (check file paths are correct)
- Syntax errors in JavaScript/React files

---

### 4. 🔍 **Check Browser Console**

**How to check:**

1. Open <https://govconnecting.netlify.app> in your browser
2. Press `F12` or right-click → Inspect
3. Go to **Console** tab
4. Look for red error messages

**Common Console Errors:**

- `Uncaught SyntaxError`: JavaScript syntax issue
- `Failed to fetch`: API connection problem
- `Cannot read property of undefined`: Data loading issue

---

### 5. 🛠️ **Testing Locally First**

Before deploying, make sure it works locally:

```bash
cd frontend
npm install
npm start
```

- If it works locally but not on Netlify → Environment variable issue
- If it doesn't work locally → Fix code first

---

## 📋 Quick Checklist

- [ ] Environment variables set in Netlify
- [ ] Backend API is deployed and accessible
- [ ] Build completed successfully (check deploy logs)
- [ ] No errors in browser console
- [ ] Local development works fine

---

## 🔗 Useful Links

- **Diagnostics Page**: <https://govconnecting.netlify.app/diagnostics.html>
- **Netlify Dashboard**: <https://app.netlify.com>
- **Netlify Deploy Logs**: Site Settings → Deploys → Click latest deploy

---

## 🚀 Quick Fix Steps

1. **Set Environment Variables** (see section 1)
2. **Deploy Backend** if not deployed
3. **Clear cache and redeploy**:

   ```bash
   Netlify Dashboard → Deploys → Trigger deploy → Clear cache and deploy
   ```

4. **Check deploy logs** for any errors
5. **Open site in incognito** mode and check console

---

## 📞 Still Having Issues?

1. Visit diagnostics page: `/diagnostics.html`
2. Check the console output section
3. Share the error messages for further help

---

## 🎯 Most Common Fix

**90% of blank page issues are due to environment variables not being set on Netlify.**

After setting them, you MUST trigger a new deploy for changes to take effect!
