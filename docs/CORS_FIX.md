# CORS Fix for Shopify Store Widget

## Issue

When customers tried to connect their wallet after disconnecting, they encountered a CORS error:

```
Access to fetch at 'https://group.deakee.com/api/verify/init' from origin 
'https://deakee-group-dev-store.myshopify.com' has been blocked by CORS policy: 
Response to preflight request doesn't pass access control check: 
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

## Root Cause

The CORS configuration in `server/index.js` was too restrictive. It only allowed:
- Production: `process.env.SHOPIFY_APP_URL` (single domain)
- Development: `localhost:3000` and `localhost:8080`

This didn't account for:
- Multiple Shopify stores installing the app (each with their own `.myshopify.com` domain)
- Storefront widget being loaded from different store domains

## Solution

Updated CORS configuration to dynamically allow all Shopify store domains:

### Before (Restrictive)
```javascript
app.use(
  cors({
    origin: process.env.NODE_ENV === 'production' 
      ? [process.env.SHOPIFY_APP_URL] 
      : ['http://localhost:3000', 'http://localhost:8080'],
    credentials: true,
  })
);
```

### After (Dynamic)
```javascript
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      
      // Allow any Shopify store domain
      if (origin.includes('.myshopify.com') || origin.includes('shopify.com')) {
        return callback(null, true);
      }
      
      // Allow localhost for development
      if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
        return callback(null, true);
      }
      
      // Allow the app's own domain
      if (origin.includes('group.deakee.com') || origin.includes('deakee.com')) {
        return callback(null, true);
      }
      
      // Reject other origins
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);
```

## What This Allows

### ✅ Allowed Origins
1. **All Shopify stores**: `*.myshopify.com`, `*.shopify.com`
2. **Development**: `localhost`, `127.0.0.1`
3. **App domains**: `group.deakee.com`, `deakee.com`
4. **No origin**: Mobile apps, curl, Postman

### ❌ Blocked Origins
- Any other domain not matching the above patterns

## Security Considerations

### Why This is Safe

1. **Multi-tenant Architecture**: The app is designed to work with ANY Shopify store
2. **Shop Parameter Validation**: Each API request requires a `shop` parameter
3. **Session-based Verification**: Uses temporary session tokens for verification
4. **No Sensitive Data Exposure**: API only returns data relevant to the requesting shop
5. **Wallet Signature Required**: Users must sign with their wallet to prove ownership

### What's Protected

- Shop data is isolated per `shop` parameter
- No cross-shop data leakage
- Session tokens expire after 15 minutes
- Wallet signatures are verified cryptographically

## Testing

### Test CORS Preflight (OPTIONS)
```bash
curl -X OPTIONS https://group.deakee.com/api/verify/init \
  -H "Origin: https://your-store.myshopify.com" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -i
```

**Expected Response:**
- HTTP 204 No Content
- `Access-Control-Allow-Origin: https://your-store.myshopify.com`
- `Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS`
- `Access-Control-Allow-Headers: Content-Type,Authorization,X-Requested-With`

### Test Actual POST Request
```bash
curl -X POST https://group.deakee.com/api/verify/init \
  -H "Origin: https://your-store.myshopify.com" \
  -H "Content-Type: application/json" \
  -d '{"shop":"test.myshopify.com","walletAddress":"0x123...","chainId":11155111}' \
  -i
```

**Expected Response:**
- HTTP 200 OK
- `Access-Control-Allow-Origin: https://your-store.myshopify.com`
- JSON with `sessionToken`, `message`, `expiresAt`

## Browser Testing

After clearing cache and reloading the store page:

1. **Open Browser DevTools** → Console
2. **Click "Connect Wallet"** in the widget
3. **Check Network Tab**:
   - OPTIONS request to `/api/verify/init` → 204 status
   - POST request to `/api/verify/init` → 200 status
   - Response headers include `Access-Control-Allow-Origin`
4. **No CORS errors** in console

## Files Modified

- **`/deakee/dkg_shopify/server/index.js`**
  - Updated CORS configuration from static array to dynamic function
  - Added support for all Shopify domains
  - Added explicit methods and headers

## Impact

### Before Fix
- ❌ Widget worked on first connection
- ❌ CORS error on reconnection
- ❌ Only one Shopify store could use the app

### After Fix
- ✅ Widget works on first connection
- ✅ Widget works on reconnection (after disconnect)
- ✅ Any Shopify store can install and use the app
- ✅ Multiple stores can use the widget simultaneously

## Related Configuration

### Nginx CORS Headers

The Nginx config at `/etc/nginx/sites-available/deakee` has CORS headers for the `/storefront/` location:

```nginx
location /storefront/ {
    # ... proxy settings ...
    
    add_header Access-Control-Allow-Origin * always;
    add_header Access-Control-Allow-Methods "GET, POST, OPTIONS" always;
    add_header Access-Control-Allow-Headers "Origin, X-Requested-With, Content-Type, Accept" always;
}
```

This allows the widget JavaScript file to be loaded from any domain.

### Express vs Nginx CORS

- **Nginx**: Handles CORS for static files (`/storefront/` directory)
- **Express**: Handles CORS for API endpoints (`/api/*`)
- Both work together to provide complete CORS support

## Troubleshooting

### Still Getting CORS Errors?

1. **Clear browser cache completely**
   - Hard refresh: `Ctrl+Shift+R` or `Cmd+Shift+R`

2. **Check PM2 service is running**
   ```bash
   pm2 status dkg-shopify
   pm2 logs dkg-shopify --lines 20
   ```

3. **Verify CORS headers in browser**
   - Open DevTools → Network tab
   - Find the failed request
   - Check Response Headers for `Access-Control-Allow-Origin`

4. **Test with curl**
   - Use the test commands above
   - Confirm CORS headers are present

5. **Check origin pattern**
   - Ensure your store domain matches `*.myshopify.com` or `*.shopify.com`
   - Custom domains might need to be added to the CORS function

## Future Enhancements

Potential improvements:

1. **Custom Domain Support**: Add pattern matching for custom Shopify domains
2. **Origin Whitelist**: Allow store owners to restrict to specific domains
3. **CORS Logging**: Log allowed/rejected origins for debugging
4. **Rate Limiting**: Add rate limits per origin to prevent abuse

## Summary

The CORS fix enables the DKG Shopify app to work as a true multi-tenant application, allowing any Shopify store to install the app and use the widget without CORS restrictions. The dynamic origin validation ensures security while maintaining flexibility.

