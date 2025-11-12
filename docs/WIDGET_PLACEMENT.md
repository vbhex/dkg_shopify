# Widget Placement Guide

## Recommended: Checkout Page Only

For the best user experience, we recommend displaying the DKG Token widget **only on the checkout page** where customers can immediately apply the discount code.

## Shopify Plans and Checkout Customization

### For Shopify Plus Stores (Recommended)

Shopify Plus allows full checkout customization with HTML/JavaScript:

1. **Go to Shopify Admin**
2. **Settings → Checkout**
3. **Scroll to "Order status page" section**
4. **Find "Additional scripts"** field
5. **Add this code:**

```html
<!-- DKG Token Holder Widget -->
<script src="https://group.deakee.com/storefront/dkg-widget.js" defer></script>
<div id="dkg-token-widget" data-shop="{{ shop.permanent_domain }}"></div>

<style>
  /* Position widget nicely on checkout */
  #dkg-token-widget {
    margin: 20px 0;
  }
  
  /* Optional: Make widget full width on checkout */
  .dkg-widget {
    max-width: 100% !important;
  }
</style>
```

6. **Click "Save"**

### For Standard Shopify Plans

Standard plans have limited checkout customization. Here are your options:

#### Option 1: Cart Page (Before Checkout)
Show widget on cart page so customers get their discount code before checkout:

1. **Go to Shopify Admin → Online Store → Themes**
2. **Click "Actions" → "Edit code"**
3. **Find `sections/main-cart.liquid` or `templates/cart.liquid`**
4. **Add widget code where you want it to appear:**

```liquid
<!-- DKG Token Holder Widget -->
<div class="dkg-widget-container" style="margin: 30px 0;">
  <h3>🪙 Token Holder Discounts</h3>
  <p>Connect your wallet to check for exclusive DKG token holder discounts</p>
  
  <script src="https://group.deakee.com/storefront/dkg-widget.js" defer></script>
  <div id="dkg-token-widget" data-shop="{{ shop.permanent_domain }}"></div>
</div>
```

**Best placement in cart.liquid:**
- After the cart items list
- Before the "Checkout" button
- In a prominent section with clear heading

#### Option 2: Product Pages
Show widget on product pages so customers know about discounts:

1. **Edit `sections/main-product.liquid` or `templates/product.liquid`**
2. **Add widget code below product description:**

```liquid
<!-- DKG Token Holder Discounts -->
<div class="dkg-discount-banner" style="margin: 20px 0; padding: 15px; background: #f5f5f5; border-radius: 8px;">
  <script src="https://group.deakee.com/storefront/dkg-widget.js" defer></script>
  <div id="dkg-token-widget" data-shop="{{ shop.permanent_domain }}"></div>
</div>
```

#### Option 3: All Pages (Theme.liquid)
Show widget site-wide (less recommended, but easiest):

1. **Edit `layout/theme.liquid`**
2. **Add before `</body>` tag:**

```liquid
<!-- DKG Token Holder Widget -->
<script src="https://group.deakee.com/storefront/dkg-widget.js" defer></script>
<div id="dkg-token-widget" data-shop="{{ shop.permanent_domain }}"></div>
```

## Recommended User Flow

### Optimal: Cart Page Widget

```
Customer Journey:
1. Browse products → Add to cart
2. Go to cart page
3. See DKG widget: "Connect wallet to unlock discounts"
4. Connect wallet → Get discount code
5. Copy discount code
6. Click "Checkout"
7. Paste discount code in checkout → Save money! 🎉
```

**Advantages:**
- Widget appears at the right moment (when ready to checkout)
- Customers can get discount code before entering checkout
- Works on all Shopify plans
- No checkout customization needed

### Alternative: Product Page Widget

```
Customer Journey:
1. View product page
2. See DKG widget below product description
3. Connect wallet → Get discount code
4. Remember code or copy it
5. Add to cart → Checkout
6. Apply discount code at checkout
```

**Advantages:**
- Customers discover discount early
- Can influence purchase decision
- Works on all Shopify plans

## Styling for Different Placements

### Cart Page - Full Width
```html
<style>
  .dkg-widget {
    max-width: 100% !important;
    margin: 20px 0;
  }
</style>
```

### Product Page - Sidebar Style
```html
<style>
  .dkg-widget {
    max-width: 350px !important;
    margin: 0 auto;
  }
</style>
```

### Floating Widget (Advanced)
```html
<style>
  #dkg-token-widget {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 1000;
    max-width: 400px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  }
  
  @media (max-width: 768px) {
    #dkg-token-widget {
      bottom: 10px;
      right: 10px;
      left: 10px;
      max-width: none;
    }
  }
</style>
```

## Complete Cart Page Example

Here's a complete example for `sections/main-cart.liquid`:

```liquid
{% comment %}
  Add this section after the cart items and before the checkout button
{% endcomment %}

<div class="cart__footer">
  <!-- Existing cart subtotal code -->
  {{ form }}
  
  <!-- DKG Token Holder Discounts -->
  <div class="cart__dkg-discounts" style="margin: 30px 0; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; color: white;">
    <h3 style="margin: 0 0 10px 0; font-size: 20px;">🪙 Token Holder Exclusive Discounts</h3>
    <p style="margin: 0 0 15px 0; opacity: 0.9;">
      Hold DKG tokens? Connect your wallet below to unlock special discounts!
    </p>
    
    <script src="https://group.deakee.com/storefront/dkg-widget.js" defer></script>
    <div id="dkg-token-widget" data-shop="{{ shop.permanent_domain }}"></div>
  </div>
  
  <!-- Existing checkout button -->
  <button type="submit" class="btn btn--primary">
    Proceed to Checkout
  </button>
</div>
```

## User Instructions to Display

You might want to add instructions near the widget:

```html
<div class="dkg-instructions" style="margin: 15px 0; padding: 15px; background: #f9f9f9; border-left: 4px solid #667eea;">
  <h4>How to get your discount:</h4>
  <ol style="margin: 10px 0 0 20px; padding: 0;">
    <li>Click "Connect Wallet" below</li>
    <li>Approve the connection in MetaMask</li>
    <li>Sign the verification message (no gas fees)</li>
    <li>Copy your discount code</li>
    <li>Apply it at checkout to save money!</li>
  </ol>
</div>
```

## Conditional Display (Advanced)

Only show widget if cart has items:

```liquid
{% if cart.item_count > 0 %}
  <script src="https://group.deakee.com/storefront/dkg-widget.js" defer></script>
  <div id="dkg-token-widget" data-shop="{{ shop.permanent_domain }}"></div>
{% endif %}
```

Only show on specific products:

```liquid
{% if product.tags contains 'dkg-eligible' %}
  <script src="https://group.deakee.com/storefront/dkg-widget.js" defer></script>
  <div id="dkg-token-widget" data-shop="{{ shop.permanent_domain }}"></div>
{% endif %}
```

## Testing Your Placement

After adding the widget:

1. ✅ **View the page** where you added it (cart, product, or checkout)
2. ✅ **Check if widget appears** correctly
3. ✅ **Test on mobile** to ensure responsive design
4. ✅ **Connect wallet** to verify functionality
5. ✅ **Get discount code** and test at checkout

## Troubleshooting Placement

### Widget Not Appearing
- Check browser console for errors
- Verify the script URL is correct: `https://group.deakee.com/storefront/dkg-widget.js`
- Ensure `data-shop="{{ shop.permanent_domain }}"` is present
- Clear browser cache

### Widget Looks Wrong
- Check CSS conflicts with theme
- Add custom CSS to override theme styles
- Use browser inspector to debug layout issues

### Widget Too Large/Small
- Adjust `max-width` in custom CSS
- Use responsive breakpoints for mobile

## Best Practices

1. **Clear Call-to-Action**: Add heading and instructions
2. **Visual Prominence**: Use colors/borders to make widget stand out
3. **Mobile-Friendly**: Test on mobile devices
4. **Loading Performance**: The `defer` attribute prevents blocking
5. **User Guidance**: Add step-by-step instructions nearby

## Recommendation Summary

| Placement | Shopify Plan | Pros | Cons |
|-----------|--------------|------|------|
| **Cart Page** | All plans | ✅ Best timing<br>✅ Easy to implement<br>✅ Clear CTA | - |
| **Checkout (Additional Scripts)** | Plus only | ✅ Perfect timing<br>✅ Highest conversion | ❌ Plus only |
| **Product Pages** | All plans | ✅ Early awareness<br>✅ Influences purchase | ⚠️ May distract |
| **Theme.liquid (All Pages)** | All plans | ✅ Easiest setup | ❌ Shows everywhere<br>❌ May be intrusive |

**Our recommendation: Cart page for all users, checkout page for Shopify Plus stores.**

