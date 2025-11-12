# Widget Still Showing After Removal - Troubleshooting

## Issue
You removed the widget code from `layout/theme.liquid` but it still appears on the page.

## Common Causes & Solutions

### 1. Browser Cache (Most Common)

**Solution: Hard Refresh**

- **Windows/Linux**: `Ctrl + Shift + R` or `Ctrl + F5`
- **Mac**: `Cmd + Shift + R`
- **Alternative**: Open in Incognito/Private mode

### 2. Shopify Theme Cache

**Solution: Clear Shopify cache**

1. **Save the theme again** (even without changes)
   - Go to **Online Store → Themes**
   - Click **Actions → Edit code**
   - Open `layout/theme.liquid`
   - Click **Save** (forces Shopify to rebuild)

2. **Or preview theme**
   - Click **Actions → Preview**
   - This uses a fresh version

### 3. Service Worker Cache

Some browsers use service workers that cache JavaScript files.

**Solution: Clear site data**

1. **Chrome/Edge:**
   - Open DevTools (F12)
   - Go to **Application** tab
   - Click **Clear storage** on left
   - Check all boxes
   - Click **Clear site data**

2. **Firefox:**
   - Open DevTools (F12)
   - Go to **Storage** tab
   - Right-click on your domain
   - Select **Delete All**

### 4. CDN Cache

Shopify's CDN might be serving cached files.

**Solution: Wait or force refresh**

1. **Wait 5-10 minutes** for CDN cache to expire
2. **Add version parameter** to script (if re-adding later):
   ```html
   <script src="https://group.deakee.com/storefront/dkg-widget.js?v=2" defer></script>
   ```

### 5. Multiple Instances

You might have added the widget in multiple locations.

**Solution: Search all files**

1. **In Shopify Admin → Edit code**
2. **Use search** (magnifying glass icon)
3. **Search for:** `dkg-widget` or `group.deakee.com`
4. **Check these files:**
   - `layout/theme.liquid` ✓ (you already removed)
   - `sections/main-cart.liquid`
   - `sections/cart-template.liquid`
   - `templates/cart.liquid`
   - `templates/product.liquid`
   - `sections/main-product.liquid`
   - Any custom sections

### 6. App Embeds or Theme Extensions

If you previously installed this as a Shopify app, it might have app embeds.

**Solution: Check theme customizer**

1. **Go to Online Store → Themes**
2. **Click Customize** (not Edit code)
3. **Click on any section** to open sidebar
4. **Look for "App embeds"** at bottom of sidebar
5. **Disable or remove** DKG widget if listed there

---

## Step-by-Step Troubleshooting

### Step 1: Verify Code is Removed

1. Go to **Shopify Admin → Online Store → Themes**
2. Click **Actions → Edit code**
3. Open `layout/theme.liquid`
4. Press `Ctrl+F` (or `Cmd+F`) to search
5. Search for: `dkg-widget`
6. **Confirm**: Should show "No results found"
7. Search for: `group.deakee.com`
8. **Confirm**: Should show "No results found"

### Step 2: Search All Theme Files

1. In the theme editor, use the **search icon** (top right)
2. Search for: `dkg-widget`
3. Check results - remove from any files where it appears
4. Save all changes

### Step 3: Clear All Caches

1. **Hard refresh** your browser: `Ctrl+Shift+R` (or `Cmd+Shift+R`)
2. **Clear browser data** for the site:
   - Open DevTools (F12)
   - Application → Clear storage → Clear site data
3. **Try incognito/private mode** to confirm

### Step 4: Verify Widget Div

Even if the script is removed, the div might still be there.

**Search for:**
```html
<div id="dkg-token-widget"
```

This div needs to be removed too!

### Step 5: Theme Reload

1. Go to **Online Store → Themes**
2. Click **Actions → Edit code**
3. Click **Save** on `theme.liquid` (even without changes)
4. Wait 1-2 minutes
5. Hard refresh your store page

---

## Quick Test Checklist

Run through this checklist:

- [ ] Searched `theme.liquid` for `dkg-widget` → Not found
- [ ] Searched `theme.liquid` for `group.deakee.com` → Not found
- [ ] Searched ALL theme files for `dkg-widget` → Not found
- [ ] Saved theme files
- [ ] Hard refreshed browser (`Ctrl+Shift+R`)
- [ ] Cleared browser site data
- [ ] Tested in incognito/private mode
- [ ] Waited 5-10 minutes for CDN cache
- [ ] Checked theme customizer for app embeds

---

## What to Remove

Make sure BOTH of these are removed:

### Script Tag
```html
<script src="https://group.deakee.com/storefront/dkg-widget.js" defer></script>
```

### Widget Div
```html
<div id="dkg-token-widget" data-shop="{{ shop.permanent_domain }}"></div>
```

**Both must be removed!** If only the script is gone but the div remains, you'll see an empty box.

---

## Verification

After clearing all caches, the widget should be gone. To verify:

1. **Open your store** in incognito mode
2. **Right-click** on the page → **Inspect**
3. **Press** `Ctrl+F` in the Elements tab
4. **Search for:** `dkg-widget`
5. **Result**: Should say "0 of 0" (not found)

---

## Still Seeing It?

If you still see the widget after all steps:

### Check Browser Extensions
- Disable browser extensions temporarily
- Some extensions inject content into pages

### Check Browser DevTools Console
1. Open DevTools (F12)
2. Go to **Console** tab
3. Look for any DKG-related messages
4. Check if script is loading

### Check Network Tab
1. Open DevTools (F12)
2. Go to **Network** tab
3. Refresh page
4. Search for: `dkg-widget.js`
5. If it appears, check where it's being loaded from

### Verify Theme
Make sure you're editing the **published/live theme**, not a draft:

1. Go to **Online Store → Themes**
2. Check which theme says **"Current theme"**
3. Make sure you edited the current theme

---

## Prevention

When re-adding the widget later:

1. **Use version parameter** to force cache refresh:
   ```html
   <script src="https://group.deakee.com/storefront/dkg-widget.js?v=2" defer></script>
   ```

2. **Keep note** of where you add it

3. **Use comments** to mark it:
   ```liquid
   {% comment %}DKG Widget Start{% endcomment %}
   <script src="..."></script>
   <div id="dkg-token-widget"></div>
   {% comment %}DKG Widget End{% endcomment %}
   ```

---

## Summary

**Most likely cause**: Browser cache

**Quick fix**: 
1. Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
2. Try incognito mode
3. Wait 5-10 minutes for CDN cache to clear

**If still showing**: Search all theme files for remaining widget code

