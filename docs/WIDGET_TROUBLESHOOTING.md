# Widget Troubleshooting Guide

## Common Issues and Solutions

### Widget Not Appearing on Storefront

**Problem:** The widget doesn't show up on your store pages.

**Solutions:**

1. **Check if the code was added correctly**
   - Open your theme's `layout/theme.liquid` file
   - Look for the widget code just before `</body>`
   - Make sure both the script and div are present:
   ```html
   <script src="https://group.deakee.com/storefront/dkg-widget.js" defer></script>
   <div id="dkg-token-widget" data-shop="{{ shop.permanent_domain }}"></div>
   ```

2. **Clear your browser cache**
   - Press `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
   - Or open in Incognito/Private mode

3. **Check browser console for errors**
   - Right-click → Inspect → Console tab
   - Look for error messages related to `dkg-widget.js`

### "404 Not Found" Errors When Connecting Wallet

**Problem:** Console shows errors like `POST https://your-store.myshopify.com/api/verify/init 404`

**Solution:** This issue is now fixed in the latest version. The widget uses the correct API endpoint (`https://group.deakee.com`). Make sure you:

1. **Clear browser cache** to get the latest widget version
2. **Hard refresh** the page: `Ctrl+Shift+R` or `Cmd+Shift+R`
3. **Verify the script source** in your HTML is:
   ```html
   <script src="https://group.deakee.com/storefront/dkg-widget.js" defer></script>
   ```

### "Please install MetaMask" Error When MetaMask is Installed

**Problem:** The widget shows "Please install MetaMask" even though MetaMask is installed.

**Solutions:**

1. **Refresh MetaMask extension**
   - Click the MetaMask icon in your browser toolbar
   - Lock and unlock your wallet
   - Refresh the store page

2. **Check MetaMask is unlocked**
   - MetaMask must be unlocked before connecting
   - Open MetaMask and enter your password

3. **Try a different browser**
   - Some browsers have better MetaMask support
   - Chrome and Firefox work best

4. **Disable other wallet extensions**
   - Other crypto wallets can conflict with MetaMask
   - Temporarily disable them and try again

### Widget is Too Large / Doesn't Fit

**Problem:** The widget takes up too much space on the page.

**Solution:** This is now fixed in the latest version. The widget is compact (max-width: 400px) and centered. To further customize:

1. **Add custom CSS** to your theme:
   ```css
   .dkg-widget {
     max-width: 300px !important;
     padding: 12px !important;
     margin: 10px auto !important;
   }
   ```

2. **Position the widget** in a specific location:
   - Instead of adding to `theme.liquid`, add to specific templates
   - Example: Add only to product pages in `product.liquid`
   - Example: Add to cart page in `cart.liquid`

### Wrong Network / Chain Error

**Problem:** "Please switch to Ethereum Sepolia" or chain ID errors.

**Solution:**

1. **Switch MetaMask to Ethereum Sepolia**
   - Open MetaMask
   - Click the network dropdown (top left)
   - Select "Ethereum Sepolia"
   - If not listed, enable "Show test networks" in MetaMask settings

2. **Add Sepolia manually** (if not in list):
   - Network Name: `Ethereum Sepolia`
   - RPC URL: `https://rpc.sepolia.org`
   - Chain ID: `11155111`
   - Currency Symbol: `ETH`
   - Block Explorer: `https://sepolia.etherscan.io`

### "Insufficient DKG Tokens" Message

**Problem:** Widget says you don't have enough tokens.

**Solutions:**

1. **Verify you're using the correct wallet**
   - Make sure you connected the wallet that holds your DKG tokens
   - Check your wallet address in the widget matches your token-holding wallet

2. **Check token balance on Etherscan**
   - Go to: `https://sepolia.etherscan.io/address/YOUR_WALLET_ADDRESS`
   - Look for DKG token balance under "Tokens"
   - Verify the token contract address matches the one configured in the app

3. **Check discount rule requirements**
   - Each discount has a minimum token requirement
   - Store owner can see requirements in the admin panel (`https://group.deakee.com/discount-rules`)

### Discount Code Not Working at Checkout

**Problem:** The discount code is copied but doesn't work at checkout.

**Solutions:**

1. **Check if the code was created**
   - Store owners should check Shopify Admin → Discounts
   - The app automatically creates discount codes when applied
   - Code format: `DKG-XXXXX` (5 random characters)

2. **Verify discount is still active**
   - Discount rules can have expiration dates
   - Check if the discount has usage limits that were reached

3. **Check product/collection restrictions**
   - Some discounts only apply to specific products or collections
   - Make sure your cart contains eligible items

## Performance Issues

### Slow Widget Loading

**Problem:** The widget takes a long time to appear.

**Solutions:**

1. **Check `defer` attribute is present**
   ```html
   <script src="https://group.deakee.com/storefront/dkg-widget.js" defer></script>
   ```
   The `defer` attribute prevents blocking page rendering

2. **Check server status**
   - Visit: `https://group.deakee.com/api/health`
   - Should return: `{"status":"ok","timestamp":"..."}`

3. **Network issues**
   - Check your internet connection
   - Try a different network/WiFi

## Developer Console Errors

### CORS Errors

**Problem:** Console shows CORS policy errors.

**Solution:** This should be handled by the server. If you see CORS errors:

1. Contact the DKG Shopify app administrator
2. The server needs proper CORS headers (already configured in Nginx)

### JSON Parse Errors

**Problem:** `SyntaxError: Unexpected token '<', "<!DOCTYPE "... is not valid JSON`

**Solution:** This was caused by the old widget trying to reach the wrong API endpoint. Fixed in the latest version:

1. **Clear browser cache completely**
2. **Hard refresh**: `Ctrl+Shift+R` or `Cmd+Shift+R`
3. **Verify** the script loads from `https://group.deakee.com/storefront/dkg-widget.js`

## Still Having Issues?

If none of these solutions work:

1. **Check browser console** for specific error messages
2. **Take a screenshot** of the error
3. **Contact the app administrator** with:
   - Your store domain
   - Browser name and version
   - Screenshot of the console error
   - Steps to reproduce the issue

## Technical Details

### API Endpoints

The widget communicates with these endpoints:

- `POST /api/verify/init` - Initialize verification session
- `POST /api/verify/signature` - Verify wallet signature  
- `POST /api/verify/token-balance` - Check token balance and eligibility
- `POST /api/apply-discount` - Generate discount code

All endpoints are at: `https://group.deakee.com`

### Required Browser Features

The widget requires:
- Modern browser (Chrome 90+, Firefox 88+, Safari 14+)
- JavaScript enabled
- LocalStorage enabled
- MetaMask extension installed

### Security Notes

- The widget never requests your private keys
- Signature verification is gas-free (no transaction fees)
- All communication is over HTTPS
- Session tokens expire after 1 hour

