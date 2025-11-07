# Finding App URL Settings in Shopify Partner Dashboard

## Updated Guide (2024)

The location of URL settings depends on your app type and when it was created.

## Option 1: For Apps Created via Partners Dashboard

### If You See These Menus: Overview, API access requests, Admin performance, Distribution, App history

**You need to go to the App Setup section, not the app listing!**

### Step-by-Step:

1. **Go to Partners Dashboard**
   - Visit: https://partners.shopify.com/
   - Log in to your account

2. **Navigate to Apps List**
   - Click **"Apps"** in the left sidebar
   - You'll see a list of your apps

3. **IMPORTANT: Click the Gear/Settings Icon or "App setup" Button**
   - Look for a **gear icon** (⚙️) next to your app name
   - OR look for an **"App setup"** button
   - OR hover over your app and click **"Manage"** or **"Edit"**
   - **DO NOT** just click the app name (that takes you to Overview)

4. **Alternative: Direct URL**
   - Go to: `https://partners.shopify.com/[YOUR_ORG_ID]/apps/[APP_ID]/edit`
   - Or look for **"Client details"** or **"API credentials"** section

5. **Find URLs Section**
   - Look for **"App URL"** field
   - Look for **"Allowed redirection URL(s)"** or **"Redirect URLs"**

6. **Update URLs**
   ```
   App URL: https://group.deakee.com
   
   Allowed redirection URL(s):
   https://group.deakee.com/api/auth/callback
   ```

7. **Save Changes**
   - Click **"Save"** button

## Option 2: For Custom Apps (Store-Specific)

If you created a **custom app** directly in a Shopify store:

1. **Go to Your Shopify Store Admin**
   - Visit: `https://your-store.myshopify.com/admin`

2. **Navigate to Apps**
   - Click **"Settings"** (bottom left)
   - Click **"Apps and sales channels"**
   - Click **"Develop apps"** or **"App development"**

3. **Select Your App**
   - Click on your app name

4. **Configuration Tab**
   - Click **"Configuration"** tab
   - Find **"App URL"** and **"Allowed redirection URL(s)"**

## Option 3: For New App Extensions (Remix Apps)

If you're using the new Shopify CLI app structure:

1. **Check `shopify.app.toml` file**
   - These settings are now in your app's configuration file
   
   ```toml
   [app_url]
   redirect_urls = [
     "https://group.deakee.com/api/auth/callback"
   ]
   application_url = "https://group.deakee.com"
   ```

2. **Deploy Configuration**
   ```bash
   shopify app deploy
   ```

## Can't Find These Settings?

### Scenario A: Using Embedded App SDK (Older Method)

If your app doesn't have these fields visible, you might need to:

1. **Click "Configuration" tab**
2. Look for **"URLs"** or **"App URL"** section
3. If still not visible, check under:
   - **"App setup"**
   - **"Distribution"** → **"App listing"**

### Scenario B: You're Creating a New App

If you haven't created the app yet:

1. **Go to Partner Dashboard**
2. Click **"Apps"** → **"Create app"**
3. Choose **"Create app manually"**
4. Fill in:
   - **App name**: DKG Token Discounts
   - **App URL**: `https://group.deakee.com`
5. After creation, go to **Configuration** to add redirect URLs

### Scenario C: Development vs Production URLs

For development/testing, you can add **multiple redirect URLs**:

```
https://group.deakee.com/api/auth/callback
http://localhost:8080/api/auth/callback
https://your-ngrok-url.ngrok.io/api/auth/callback
```

## Visual Guide - Where to Look

```
Shopify Partners Dashboard
└── Apps
    └── [Your App Name]
        └── Configuration (← Look here!)
            ├── App credentials
            │   ├── Client ID (API Key)
            │   └── Client secret (API Secret)
            ├── App URL (← Set this to https://group.deakee.com)
            └── Redirection URLs
                └── Allowed redirection URL(s)
                    (← Add https://group.deakee.com/api/auth/callback)
```

## Alternative: Create App Using Shopify CLI

If the Partner Dashboard isn't working, you can create the app using CLI:

```bash
# Install Shopify CLI
npm install -g @shopify/cli @shopify/app

# Create new app
shopify app init

# This will guide you through setup and handle URLs automatically
```

## Common Issues

### Issue 1: "Configuration" Tab Missing
**Solution**: You might be in the wrong section. Make sure you're in:
- **Apps** (not Extensions or Themes)
- Your specific app (not the apps list)

### Issue 2: URLs Section Grayed Out
**Solution**: 
- Save other required fields first
- Check if app is in development mode
- Verify you have proper permissions

### Issue 3: Can't Add Redirect URLs
**Solution**: 
- Click **"Add URL"** or **"+"** button
- URLs must start with `https://` (except localhost)
- URLs must include the full path including `/api/auth/callback`

## What If Settings Still Not Found?

If you absolutely cannot find these settings, you have two options:

### Option A: Use a Different App Type

Create an **embedded app** which has clearer URL settings:

1. Partner Dashboard → Apps → Create app
2. Choose **"Embedded app"**
3. URLs will be in the main configuration screen

### Option B: Use Custom App in Store

Instead of Partner Dashboard app:

1. Go to your Shopify store admin
2. Settings → Apps and sales channels
3. **Develop apps** → **Create an app**
4. This gives you API credentials without needing OAuth URLs

**Note**: Custom apps don't need redirect URLs since they don't use OAuth - they use direct API access tokens.

## For Your DKG Shopify App

Since this is a **public app** (meant to be installed by multiple stores), you need:

### Required in Partner Dashboard:
- ✅ App URL: `https://group.deakee.com`
- ✅ Redirect URL: `https://group.deakee.com/api/auth/callback`

### Screenshot Locations (Look for these):
1. **"Configuration"** tab (most common)
2. **"App setup"** section
3. **"URLs"** section under configuration
4. **"OAuth"** settings

## Need More Help?

If you're still stuck, please tell me:
1. What do you see when you click on your app in Partner Dashboard?
2. What tabs/sections are visible?
3. Are you creating a new app or updating an existing one?
4. Is this a public app or custom app?

I can then provide more specific guidance!

---

**Quick Answer**: Look for **"Configuration"** tab in your app in Partner Dashboard, then scroll to find **"App URL"** and **"Allowed redirection URL(s)"** fields.

