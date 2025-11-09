# DKG Shopify App Architecture

## Overview

The DKG Shopify app is a **multi-tenant application** that allows individual Shopify store owners to offer discounts to customers who hold DKG tokens.

## Multi-Tenant Design

### How It Works

1. **Each Shopify store is independent**
   - When a merchant installs the app, a unique `Shop` record is created in the database
   - Each shop can create and manage their own discount rules
   - Discount rules are scoped to the shop that created them
   - One shop cannot see or modify another shop's rules

2. **App Owner vs Store Partners**
   
   **App Owner (You):**
   - Configures global settings (token contract address, blockchain network)
   - Hosts and maintains the app infrastructure
   - Does NOT create discount rules for partners
   
   **Store Partners (Merchants):**
   - Install the app in their Shopify admin
   - Create custom discount rules for their own store
   - Set minimum token amounts, discount percentages, usage limits
   - Control which products/collections get discounts
   - Monitor their own discount usage and verified customers

### Database Schema

```
Shop (1) ----< (Many) DiscountRule
Shop (1) ----< (Many) VerifiedCustomer
DiscountRule (1) ----< (Many) CustomerUsage
```

Each entity is scoped to a specific shop, ensuring complete data isolation.

## Deployment Modes

### 1. Current Setup: Demo/Testing Interface

**URL:** `https://group.deakee.com`

**Purpose:**
- Development and testing
- Demo for potential partners
- Manual shop management during development

**Authentication:**
- Currently uses `?shop=test.myshopify.com` query parameter
- Allows testing without full Shopify OAuth flow

**Limitations:**
- Not embedded in Shopify Admin
- Manual shop parameter required
- Not suitable for production use by partners

### 2. Production Setup: Embedded Shopify App

**How Partners Will Use It:**

1. **Installation:**
   - Merchant searches for "DKG Token Discounts" in Shopify App Store
   - Clicks "Install App"
   - OAuth flow authenticates and creates Shop record
   - Merchant is redirected to app embedded in their Shopify Admin

2. **Daily Usage:**
   - Merchant opens "DKG Token Discounts" from their Shopify Admin apps menu
   - App loads embedded using Shopify App Bridge
   - Automatically authenticated to their shop
   - Creates and manages their own discount rules
   - Views their own analytics and verified customers

3. **Customer Experience:**
   - Customer visits merchant's online store
   - DKG widget appears on product pages
   - Customer connects wallet and verifies DKG token ownership
   - Discount automatically applied at checkout
   - Backend verifies token balance on Ethereum Sepolia

## Security & Data Isolation

### Multi-Tenancy Enforcement

All API routes verify shop ownership:

```javascript
// Get shop from Shopify session (production)
const shopDomain = res.locals.shopify.session.shop;

// Or from query parameter (development only)
const shopDomain = req.query.shop;

// Verify rule belongs to this shop
const shop = await prisma.shop.findUnique({ where: { shopDomain } });
const rule = await prisma.discountRule.findFirst({
  where: { id, shopId: shop.id }
});
```

### What Partners Can Access

**Their Own Data:**
- ✅ Their discount rules
- ✅ Their verified customers
- ✅ Their usage statistics
- ✅ Their shop settings

**Cannot Access:**
- ❌ Other shops' discount rules
- ❌ Other shops' customer data
- ❌ Global token contract address (configured by app owner)
- ❌ Other shops' statistics

## Shared vs Shop-Specific Configuration

### Shared (App Owner Configures)

These are set once in `/deakee/dkg_shopify/.env`:

```bash
# Global token contract (same for all partners)
DKG_TOKEN_CONTRACT_ADDRESS=0x...

# Blockchain network (same for all partners)
ETHEREUM_RPC_URL=https://sepolia.infura.io/v3/...

# Shopify API credentials
SHOPIFY_API_KEY=...
SHOPIFY_API_SECRET=...
```

### Shop-Specific (Each Partner Configures)

Each partner customizes through the embedded admin UI:

- **Discount Rules:**
  - Rule name and description
  - Minimum token amount required
  - Discount type (percentage or fixed amount)
  - Discount value
  - Maximum discount cap
  - Applicable products/collections
  - Usage limits (total and per customer)
  - Active date range

- **Future Shop Settings:**
  - Widget appearance/branding
  - Welcome messages
  - Email notifications
  - Custom verification requirements

## API Authentication Flow

### Development (Current)

```
Browser → https://group.deakee.com/discount-rules
         → GET /api/discounts?shop=test.myshopify.com
         → Returns rules for test.myshopify.com
```

### Production (Embedded App)

```
Merchant opens app in Shopify Admin
         ↓
Shopify OAuth callback authenticates merchant
         ↓
Session stored with shop domain
         ↓
App loads embedded with shop parameter
         ↓
GET /api/discounts (session contains shop domain)
         ↓
Returns rules scoped to authenticated shop
```

## Storefront Widget

The customer-facing widget is shop-specific:

```javascript
// Widget embedded in partner's theme
<script src="https://group.deakee.com/widget.js" 
        data-shop="{{ shop.myshopify.com }}"
        data-product-id="{{ product.id }}">
</script>
```

Widget automatically:
1. Identifies the shop from `data-shop` attribute
2. Fetches applicable discount rules for that shop
3. Checks customer's token balance
4. Applies highest applicable discount
5. All verification scoped to that shop's rules

## Scaling Considerations

### Current Architecture Supports:

- ✅ Unlimited number of partner shops
- ✅ Each shop can have unlimited discount rules
- ✅ Complete data isolation between shops
- ✅ Independent rule configuration per shop
- ✅ Shared token verification infrastructure

### Performance:

- Database queries filtered by `shopId` (indexed)
- Session storage isolates shop data
- Blockchain RPC calls shared across all shops
- Widget loads asynchronously per shop

## Next Steps for Production

1. **Enable Shopify OAuth:**
   - Complete app setup in Shopify Partner Dashboard
   - Configure redirect URLs and scopes
   - Implement full OAuth flow

2. **Embed in Shopify Admin:**
   - Use Shopify App Bridge
   - Remove query parameter authentication
   - Add session-based shop detection

3. **Publish to Shopify App Store:**
   - Submit app for review
   - Add listing description and screenshots
   - Set pricing model (free or subscription)

4. **Monitor Multi-Tenant Usage:**
   - Track shops using the app
   - Monitor discount rule creation
   - Analyze token verification patterns
   - Optimize blockchain RPC usage

## Summary

The DKG Shopify app is **already architected as a multi-tenant system**. Each partner shop:
- Has complete control over their discount rules
- Cannot access other shops' data
- Shares only the global token contract configuration
- Will access the app embedded in their Shopify Admin (production)
- Currently can demo at `group.deakee.com` (development)

