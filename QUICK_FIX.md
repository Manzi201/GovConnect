# 🚀 QUICK FIX - Blank Page on Netlify

## ⚡ 3-Minute Fix

### Step 1: Set Environment Variables on Netlify

1. Go to <https://app.netlify.com>
2. Click your GovConnect site
3. Go to: **Site Settings** → **Environment variables** → **Add a variable**
4. Add each of these (click "Add" after each one):

| Key | Value |
|-----|-------|
| `REACT_APP_API_URL` | `https://your-backend-url.com/api` |
| `REACT_APP_SOCKET_URL` | `https://your-backend-url.com` |
| `REACT_APP_SUPABASE_URL` | `https://qwisdiwxrdhyhjpmnhhj.supabase.co` |
| `REACT_APP_SUPABASE_ANON_KEY` | `sb_publishable_aAOzGGUNslQT2Z_bapW-HA_ZcuPdZyR` |
| `CI` | `false` |
| `GENERATE_SOURCEMAP` | `false` |

### Step 2: Redeploy

1. Go to **Deploys** tab
2. Click **Trigger deploy** button
3. Select **Clear cache and deploy site**
4. Wait for deploy to complete (~2 minutes)

### Step 3: Check Results

1. Visit <https://govconnecting.netlify.app>
2. Press **F12** to open console
3. Look for: "✅ App rendered successfully"

---

## ⚠️ Still Not Working?

### Quick Diagnostics

- Visit: `/diagnostics.html`
- Check what's missing
- Follow the recommendations

### Check Console for

- Red error messages
- "NOT SET ⚠️" warnings
- API connection failures

---

## 📱 Need Help?

**Read Full Guide:** `BLANK_PAGE_FIX.md`  
**View Summary:** `BLANK_PAGE_SOLUTION_SUMMARY.md`  
**Diagnostic Tool:** Visit `/diagnostics.html` on your site

---

## 🎯 Remember

**90% of blank pages = missing environment variables!**  
After adding them, you **MUST** trigger a new deploy!
