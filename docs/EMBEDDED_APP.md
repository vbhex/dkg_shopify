# Embedded Shopify App Guide

## What is an Embedded Shopify App?

An embedded Shopify app runs **inside** the Shopify Admin interface, providing a seamless experience for merchants. Instead of opening a separate website, merchants access your app directly from their Shopify Admin navigation.

## Current vs Production Experience

### Current Setup (Demo Mode)

**URL:** `https://group.deakee.com`

Merchants currently access the app as a standalone website:
1. Open browser
2. Navigate to `https://group.deakee.com?shop=their-store.myshopify.com`
3. Use the interface (separate from Shopify)

**Limitations:**
- Requires manual shop parameter
- Not integrated with Shopify navigation
- Separate login/authentication
- Not discoverable in Shopify App Store

### Production Setup (Embedded Mode)

**Access:** Shopify Admin → Apps → DKG Token Discounts

Merchants access the app embedded in Shopify Admin:
1. Log into their Shopify Admin
2. Click "Apps" in left sidebar
3. Click "DKG Token Discounts"
4. App loads embedded in an iframe within Shopify Admin
5. Automatic authentication via Shopify session
6. Seamless navigation between app and Shopify features

**Benefits:**
- ✅ Native Shopify experience
- ✅ Automatic authentication
- ✅ Consistent UI with Shopify Admin
- ✅ Access to Shopify App Bridge APIs
- ✅ Discoverable in Shopify App Store
- ✅ Familiar workflow for merchants

## How Embedding Works

### Technical Overview

```
┌─────────────────────────────────────────┐
│     Shopify Admin (shopify.com)         │
│  ┌───────────────────────────────────┐  │
│  │  Shopify Navigation & Header      │  │
│  ├───────────────────────────────────┤  │
│  │                                   │  │
│  │  ┌─────────────────────────────┐ │  │
│  │  │   Your App (iframe)         │ │  │
│  │  │   https://group.deakee.com  │ │  │
│  │  │                             │ │  │
│  │  │   - Dashboard               │ │  │
│  │  │   - Discount Rules          │ │  │
│  │  │   - Analytics               │ │  │
│  │  │                             │ │  │
│  │  └─────────────────────────────┘ │  │
│  │                                   │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

### Shopify App Bridge

Shopify provides **App Bridge** - a JavaScript library that enables:
- Communication between your app and Shopify Admin
- Navigation within Shopify Admin
- Toast notifications
- Modal dialogs
- Resource pickers (products, collections, customers)
- Title bar buttons and actions

```javascript
import createApp from '@shopify/app-bridge';
import { Redirect } from '@shopify/app-bridge/actions';

// Initialize App Bridge
const app = createApp({
  apiKey: 'your-api-key',
  host: host, // Provided by Shopify in URL
});

// Navigate within Shopify Admin
const redirect = Redirect.create(app);
redirect.dispatch(Redirect.Action.ADMIN_PATH, '/products');
```

## Authentication Flow

### Embedded App OAuth

When a merchant installs or opens your embedded app:

```
1. Merchant clicks "Install App" or opens app
   ↓
2. Shopify redirects to your app with parameters:
   - shop (e.g., example.myshopify.com)
   - host (base64 encoded host)
   - timestamp
   - hmac (signature for verification)
   ↓
3. Your app verifies the HMAC signature
   ↓
4. If no session exists, redirect to OAuth:
   https://example.myshopify.com/admin/oauth/authorize?
     client_id=YOUR_API_KEY&
     scope=read_products,write_discounts&
     redirect_uri=https://group.deakee.com/api/auth/callback
   ↓
5. Merchant approves permissions
   ↓
6. Shopify redirects to your callback with:
   - code (authorization code)
   - hmac (signature)
   - shop
   ↓
7. Your app exchanges code for access token
   ↓
8. Store access token and create session
   ↓
9. Redirect merchant to embedded app
   ↓
10. App loads in iframe with valid session
```

### Session Management

```javascript
// Server-side session storage
import { SQLiteSessionStorage } from '@shopify/shopify-app-session-storage-sqlite';

const sessionStorage = new SQLiteSessionStorage('./shopify-sessions.db');

// Store session after OAuth
await sessionStorage.storeSession(session);

// Verify session on subsequent requests
const session = await sessionStorage.loadSession(sessionId);
if (!session || !session.isActive()) {
  // Redirect to re-authenticate
}
```

## Multi-Tenant Shop Scoping

### Automatic Shop Detection

In embedded mode, the shop is automatically detected:

```javascript
// Middleware extracts shop from session
app.use(shopify.validateAuthenticatedSession());

// Route handler has access to shop
app.get('/api/discounts', async (req, res) => {
  const shop = res.locals.shopify.session.shop;
  
  // Fetch data scoped to this shop
  const rules = await prisma.discountRule.findMany({
    where: { 
      shop: { shopDomain: shop }
    }
  });
  
  res.json({ rules });
});
```

### Data Isolation

Every API request automatically scoped to authenticated shop:

```javascript
// ✅ Correct: Shop from authenticated session
const shop = res.locals.shopify.session.shop;
const rules = await getDiscountRules(shop);

// ❌ Wrong: Shop from query parameter (dev only)
const shop = req.query.shop; // Insecure in production!
```

## Configuration for Embedded Apps

### App Setup Requirements

**Shopify Partner Dashboard Settings:**

1. **App URL:** `https://group.deakee.com`
   - The main URL where your app is hosted

2. **Allowed redirection URL(s):**
   - `https://group.deakee.com/api/auth/callback`
   - `https://group.deakee.com/api/auth`

3. **Embedded app:** ✅ Enabled
   - This must be checked to run in iframe

4. **App proxy:** (Optional)
   - For accessing app from storefront
   - Example: `https://store.com/apps/dkg-discounts`

### Security Headers

Your app must allow embedding in Shopify's iframe:

```nginx
# Nginx configuration
location / {
  # Allow embedding in Shopify Admin only
  add_header X-Frame-Options "ALLOW-FROM https://admin.shopify.com" always;
  
  # Or use Content-Security-Policy
  add_header Content-Security-Policy "frame-ancestors https://*.myshopify.com https://admin.shopify.com" always;
  
  proxy_pass http://localhost:6100;
}
```

**Important:** Don't use `X-Frame-Options: DENY` or `SAMEORIGIN` - these prevent embedding!

## Frontend Configuration

### App Bridge Integration

Update your React app to use App Bridge:

```jsx
import { AppProvider } from '@shopify/polaris';
import { Provider } from '@shopify/app-bridge-react';

function App() {
  const urlParams = new URLSearchParams(window.location.search);
  const host = urlParams.get('host'); // Provided by Shopify
  
  const config = {
    apiKey: import.meta.env.VITE_SHOPIFY_API_KEY,
    host: host,
    forceRedirect: true
  };
  
  return (
    <Provider config={config}>
      <AppProvider>
        {/* Your app components */}
      </AppProvider>
    </Provider>
  );
}
```

### Navigation

Use App Bridge for navigation within Shopify:

```jsx
import { useNavigate } from '@shopify/app-bridge-react';

function MyComponent() {
  const navigate = useNavigate();
  
  const viewProduct = (productId) => {
    // Navigate to Shopify's product page
    navigate(`/products/${productId}`);
  };
  
  return <Button onClick={() => viewProduct(123)}>View Product</Button>;
}
```

## Testing Embedded Apps

### Development Workflow

1. **Use ngrok or Cloudflare Tunnel:**
   ```bash
   # Expose local dev server
   ngrok http 6100
   # Use HTTPS URL in Shopify Partner Dashboard
   ```

2. **Test Installation:**
   - Create a development store in Shopify Partners
   - Install your app on the dev store
   - Verify OAuth flow completes
   - Check app loads embedded

3. **Debug Issues:**
   ```javascript
   // Add console logs
   console.log('Shop:', res.locals.shopify.session.shop);
   console.log('Access Token:', res.locals.shopify.session.accessToken);
   
   // Check session storage
   pm2 logs dkg-shopify --lines 100
   ```

### Common Issues

**Issue:** App loads blank page
- **Cause:** X-Frame-Options blocking iframe
- **Fix:** Update nginx to allow embedding

**Issue:** Authentication loop
- **Cause:** Session not persisting
- **Fix:** Check session storage and cookie settings

**Issue:** API returns 401 Unauthorized
- **Cause:** Session expired or invalid
- **Fix:** Implement proper session refresh logic

**Issue:** Shop parameter missing
- **Cause:** Not using Shopify session
- **Fix:** Use `res.locals.shopify.session.shop` instead of query parameter

## Migration from Demo to Production

### Checklist

- [ ] Update Shopify App settings (enable embedding)
- [ ] Configure security headers (allow iframe)
- [ ] Implement full OAuth flow
- [ ] Switch from query parameter auth to session auth
- [ ] Test on development store
- [ ] Add App Bridge to frontend
- [ ] Update navigation to use App Bridge
- [ ] Test all features in embedded context
- [ ] Submit app for review
- [ ] Publish to Shopify App Store

### Code Changes Required

**Before (Demo Mode):**
```javascript
// Client: Manual shop parameter
const shop = new URLSearchParams(window.location.search).get('shop');
fetch(`/api/discounts?shop=${shop}`);

// Server: Shop from query parameter
const shop = req.query.shop;
```

**After (Production):**
```javascript
// Client: No shop parameter needed
fetch('/api/discounts'); // Session contains shop

// Server: Shop from authenticated session
const shop = res.locals.shopify.session.shop;
```

## Benefits for Merchants

### Seamless Experience

1. **Single Dashboard:** Manage products, orders, and DKG discounts in one place
2. **Automatic Login:** No separate credentials needed
3. **Consistent UI:** Matches Shopify's design language
4. **Quick Access:** One click from main navigation
5. **Familiar Workflow:** Feels native to Shopify

### Trust & Security

1. **Official App Store:** Vetted by Shopify
2. **Secure OAuth:** Industry-standard authentication
3. **Permission Management:** Merchants control what data you access
4. **Data Isolation:** Each shop's data is completely separate
5. **Easy Uninstall:** Standard Shopify app management

## Summary

**Current Demo Mode:**
- Standalone website at `https://group.deakee.com`
- Manual shop parameter for testing
- Perfect for development and demos

**Production Embedded Mode:**
- Integrated into Shopify Admin
- Automatic authentication and shop detection
- Professional merchant experience
- Required for Shopify App Store listing

The architecture is already multi-tenant and ready for embedding - you just need to complete the OAuth flow and App Bridge integration!

