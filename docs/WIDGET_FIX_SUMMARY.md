# Widget Fix Summary

## Issues Fixed

### 1. ✅ Wrong API Endpoint
**Problem:** Widget was trying to call APIs on the Shopify store domain instead of the DKG app server.

**Root Cause:** 
```javascript
const API_BASE_URL = window.location.origin; // This used the current page's URL
```

**Fix:**
```javascript
const API_BASE_URL = 'https://group.deakee.com'; // Now uses the correct server
```

**Impact:** All API calls (`/api/verify/init`, `/api/verify/signature`, `/api/verify/token-balance`, `/api/apply-discount`) now correctly reach the DKG Shopify app server.

---

### 2. ✅ Widget Size Too Large
**Problem:** Widget was taking up too much space on the storefront.

**Changes Made:**

#### Before (Large):
- Padding: `24px`
- Title font: `24px`
- Button font: `16px`
- Button padding: `12px 24px`
- No max-width constraint

#### After (Compact):
- Padding: `16px`
- Title font: `18px`
- Button font: `14px`
- Button padding: `10px 20px`
- **Max-width: `400px` with auto centering**

**Result:** The widget now appears as a compact, centered card that fits nicely on all screen sizes.

---

### 3. ✅ Static File Serving
**Problem:** Storefront widget files weren't being served by Express.

**Fix Added to `server/index.js`:**
```javascript
// Serve storefront widget files (MUST be before client build catch-all)
const storefrontPath = path.join(__dirname, '../storefront');
app.use('/storefront', express.static(storefrontPath, {
  maxAge: '1h',
  immutable: true,
}));
```

**Impact:** Widget JavaScript and assets are now accessible at `https://group.deakee.com/storefront/dkg-widget.js`

---

## Files Modified

1. **`/deakee/dkg_shopify/storefront/dkg-widget.js`**
   - Changed `API_BASE_URL` to hardcoded `https://group.deakee.com`
   - Reduced widget dimensions and padding
   - Made all text and spacing more compact
   - Added `max-width: 400px` for better layout

2. **`/deakee/dkg_shopify/server/index.js`**
   - Added static file serving for `/storefront` directory
   - Configured 1-hour browser caching for widget files

3. **`/deakee/dkg_shopify/README.md`**
   - Added widget features section
   - Documented compact design

4. **`/deakee/dkg_shopify/docs/WIDGET_TROUBLESHOOTING.md`** (NEW)
   - Comprehensive troubleshooting guide
   - Common issues and solutions
   - Developer console error explanations

---

## Testing Checklist

- [x] Widget JavaScript file accessible at `https://group.deakee.com/storefront/dkg-widget.js`
- [x] API endpoint hardcoded correctly
- [x] Widget appears with compact styling
- [ ] **User to test:** Click "Connect Wallet" button
- [ ] **User to test:** Verify wallet connection works
- [ ] **User to test:** Check token balance verification
- [ ] **User to test:** Apply discount and copy code

---

## Next Steps for User

1. **Clear your browser cache completely**
   - Hard refresh: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
   - Or use Incognito/Private mode

2. **Reload your Shopify store page**
   - The widget should now appear smaller and centered

3. **Test wallet connection**
   - Click "Connect Wallet"
   - Approve MetaMask connection
   - Widget should communicate with `https://group.deakee.com` APIs

4. **Check browser console**
   - Right-click → Inspect → Console
   - Should see NO 404 errors
   - Should see successful API calls to `group.deakee.com`

---

## Configuration Summary

| Component | Value |
|-----------|-------|
| **Widget Script** | `https://group.deakee.com/storefront/dkg-widget.js` |
| **API Base URL** | `https://group.deakee.com` |
| **Max Width** | `400px` |
| **Browser Cache** | `1 hour` |
| **Network** | Ethereum Sepolia (`chainId: 11155111`) |
| **Token Contract** | Configured in `.env` as `DKG_TOKEN_CONTRACT_ADDRESS` |

---

## Troubleshooting

If the widget still doesn't work after these fixes:

1. **Check browser console** for any remaining errors
2. **Verify MetaMask is unlocked** and connected to Sepolia network
3. **Test API health**: Visit `https://group.deakee.com/api/health` (should return JSON)
4. **Review** `/deakee/dkg_shopify/docs/WIDGET_TROUBLESHOOTING.md` for detailed solutions

---

## PM2 Service Status

```bash
# Current status
pm2 status dkg-shopify

# View logs
pm2 logs dkg-shopify --lines 50

# Restart if needed
pm2 restart dkg-shopify
```

The service was restarted after applying all fixes (restart count: 127).

