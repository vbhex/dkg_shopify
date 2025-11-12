# Widget Placement - Visual Guide

## Recommended: Cart Page

### Why Cart Page is Best

✅ **Perfect Timing**: Customers see it when ready to checkout  
✅ **Clear Intent**: They're already buying, just need the discount  
✅ **Immediate Application**: Get code → Copy → Checkout → Paste  
✅ **All Shopify Plans**: Works on Basic, Shopify, and Advanced  
✅ **High Conversion**: Reduces cart abandonment by offering discounts  

---

## Visual Layout

### Cart Page with Widget

```
┌─────────────────────────────────────────────────────────────┐
│                    Your Shopping Cart                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Product 1                          $50.00    [Remove]      │
│  ────────────────────────────────────────────               │
│  Quantity: 1                                                 │
│                                                              │
│  Product 2                          $30.00    [Remove]      │
│  ────────────────────────────────────────────               │
│  Quantity: 2                                                 │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Subtotal:                                    $110.00       │
│                                                              │
├═════════════════════════════════════════════════════════════┤
│                                                              │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  🪙 DKG Token Holder Discounts                        │ │
│  │  Connect your wallet to unlock exclusive discounts    │ │
│  │                                                        │ │
│  │  ┌──────────────────────────────┐                     │ │
│  │  │     Connect Wallet           │  ← Widget Here!     │ │
│  │  └──────────────────────────────┘                     │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  [       Proceed to Checkout       ]  ← Button below widget │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Implementation Example

### Step 1: Find Cart Template

**Shopify Admin → Online Store → Themes → Actions → Edit code**

Look for one of these files:
- `sections/main-cart.liquid`
- `sections/cart-template.liquid`
- `templates/cart.liquid`

### Step 2: Find the Right Location

Search for keywords in the file:
- `cart__footer`
- `checkout` button
- `subtotal`

Insert the widget **after subtotal** and **before checkout button**.

### Step 3: Add Widget Code

```liquid
{% comment %} Cart items and subtotal above this {% endcomment %}

{%- if cart.item_count > 0 -%}
  <div class="cart__dkg-widget">
    <div class="dkg-discount-section">
      <h3>🪙 Token Holder Exclusive Discounts</h3>
      <p>Hold DKG tokens? Connect your wallet to unlock special discounts!</p>
      
      <script src="https://group.deakee.com/storefront/dkg-widget.js" defer></script>
      <div id="dkg-token-widget" data-shop="{{ shop.permanent_domain }}"></div>
      
      <div class="dkg-instructions">
        <small>
          <strong>How it works:</strong>
          1. Connect wallet
          2. Sign verification message
          3. Copy discount code
          4. Apply at checkout
        </small>
      </div>
    </div>
  </div>
{%- endif -%}

{% comment %} Checkout button below this {% endcomment %}
```

### Step 4: Add Custom Styling (Optional)

```liquid
<style>
  .cart__dkg-widget {
    margin: 30px 0;
    padding: 0;
  }
  
  .dkg-discount-section {
    padding: 25px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 12px;
    color: white;
    text-align: center;
  }
  
  .dkg-discount-section h3 {
    margin: 0 0 10px 0;
    font-size: 22px;
    font-weight: 700;
  }
  
  .dkg-discount-section p {
    margin: 0 0 20px 0;
    opacity: 0.95;
    font-size: 15px;
  }
  
  .dkg-instructions {
    margin-top: 15px;
    padding: 15px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    font-size: 13px;
    text-align: left;
  }
  
  .dkg-instructions strong {
    display: block;
    margin-bottom: 8px;
  }
  
  @media (max-width: 768px) {
    .dkg-discount-section {
      padding: 20px;
    }
    
    .dkg-discount-section h3 {
      font-size: 18px;
    }
  }
</style>
```

---

## User Flow Example

### 1. Customer Views Cart

```
Customer has items in cart:
- Product A: $50
- Product B: $60
Total: $110

Sees widget: "🪙 Token Holder Exclusive Discounts"
```

### 2. Customer Connects Wallet

```
Clicks "Connect Wallet"
→ MetaMask popup appears
→ Approves connection
→ Widget button changes to "Disconnect Wallet"
```

### 3. Customer Verifies Tokens

```
Widget initiates verification
→ MetaMask prompts: "Sign this message..."
→ Customer signs (no gas fees)
→ Widget: "✓ Verification Successful!"
```

### 4. Widget Shows Discounts

```
┌─────────────────────────────────────────┐
│ ✓ Verification Successful!             │
│ You have 2 discount(s) available.      │
│                                         │
│ 🎉 You're eligible for these discounts:│
│                                         │
│ ┌─────────────────────────────────────┐│
│ │ Gold Member Discount                ││
│ │ 20% OFF                             ││
│ │ For holders of 100+ DKG tokens      ││
│ │ [  Apply This Discount  ]           ││
│ └─────────────────────────────────────┘│
│                                         │
│ Connected: 0x1234...5678                │
└─────────────────────────────────────────┘
```

### 5. Customer Applies Discount

```
Clicks "Apply This Discount"
→ Widget generates Shopify discount code
→ Shows: "DKG-X7K2M"
→ Customer clicks "Copy Code"
→ Code copied to clipboard ✓
```

### 6. Customer Checks Out

```
Customer clicks "Proceed to Checkout"
→ Shopify checkout page loads
→ Customer pastes discount code: "DKG-X7K2M"
→ Discount applied: -$22.00 (20% off)
→ New total: $88.00
→ Customer completes purchase 🎉
```

---

## Alternative Placements

### Option 2: Product Page

Good for awareness, but customers might forget the code by checkout:

```
┌─────────────────────────────────────────────┐
│  Product Image                              │
│                                             │
│  Product Name         $50.00                │
│  ★★★★★ (42 reviews)                        │
│                                             │
│  Description...                             │
│                                             │
├─────────────────────────────────────────────┤
│  🪙 DKG Token Holder Discount Available!   │← Widget here
│  [Widget displays here]                     │
├─────────────────────────────────────────────┤
│                                             │
│  [ Add to Cart ]                            │
└─────────────────────────────────────────────┘
```

### Option 3: Floating Widget

Advanced option - stays visible while browsing:

```
┌─────────────────────────────────────────────┐
│  Your Store                            🛒   │
│                                             │
│  [Browse products...]                       │
│                                             │
│                                             │
│                                             │
│                                             │
│                            ┌──────────────┐│
│                            │ 🪙 DKG       ││← Floating
│                            │ Discounts    ││  widget
│                            │ Available!   ││
│                            │ [Connect]    ││
│                            └──────────────┘│
└─────────────────────────────────────────────┘
```

---

## Shopify Plus: Checkout Page

**Best option if you have Shopify Plus!**

### Location
**Settings → Checkout → Additional scripts**

### Code
```html
<!-- DKG Token Holder Widget on Checkout -->
<div class="checkout-dkg-widget">
  <h3>🪙 Have DKG Tokens? Get a Discount!</h3>
  <p>Connect your wallet to check for exclusive discounts</p>
  
  <script src="https://group.deakee.com/storefront/dkg-widget.js" defer></script>
  <div id="dkg-token-widget" data-shop="{{ shop.permanent_domain }}"></div>
</div>

<style>
  .checkout-dkg-widget {
    margin: 20px 0;
    padding: 20px;
    background: #f9f9f9;
    border: 2px solid #667eea;
    border-radius: 8px;
  }
  
  .checkout-dkg-widget h3 {
    margin: 0 0 10px 0;
    color: #667eea;
  }
</style>
```

### Checkout Flow
```
1. Customer enters checkout
2. Sees widget right on checkout page
3. Connects wallet & gets code
4. Applies code immediately
5. Sees discount applied in real-time
6. Completes purchase with discount ✅
```

---

## Comparison Table

| Placement | Conversion | Ease | Timing | Shopify Plan |
|-----------|-----------|------|--------|--------------|
| **Cart Page** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | Perfect | All |
| **Checkout (Plus)** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Perfect | Plus only |
| **Product Page** | ⭐⭐⭐ | ⭐⭐⭐⭐ | Too early | All |
| **All Pages** | ⭐⭐ | ⭐⭐⭐⭐⭐ | Always | All |
| **Floating** | ⭐⭐⭐⭐ | ⭐⭐ | Always | All |

---

## Testing Your Placement

After adding the widget:

✅ **Desktop**: Check layout, spacing, colors  
✅ **Mobile**: Verify responsive design  
✅ **Tablet**: Test medium screen sizes  
✅ **Different Themes**: Ensure compatibility  
✅ **With/Without Cart Items**: Test empty cart state  

---

## Tips for Success

1. **Clear Heading**: Use emojis and clear text (e.g., "🪙 Token Holder Discounts")
2. **Instructions**: Add brief how-to steps
3. **Visual Design**: Match your store's theme colors
4. **Mobile First**: Test on mobile devices primarily
5. **Loading State**: Widget handles loading gracefully
6. **Error Messages**: Widget shows clear error messages

---

## Need Help?

- 📖 **Full documentation**: `docs/WIDGET_PLACEMENT.md`
- 🐛 **Troubleshooting**: `docs/WIDGET_TROUBLESHOOTING.md`
- 🎨 **Customization**: Edit CSS to match your theme
- 💬 **Questions**: Contact the app developer

---

**Recommendation**: Start with **cart page** placement. It's the sweet spot between conversion rate and ease of implementation!

