# DKG Token Holder Widget - Installation Guide

This guide will help you add the DKG Token Holder Widget to your Shopify store's cart drawer.

## 📋 Prerequisites

Before you begin, make sure you have:
- ✅ Installed the DKG Token Holder app from the Shopify App Store
- ✅ Access to your Shopify Admin panel
- ✅ Basic familiarity with editing theme code (or contact your developer)

---

## 📁 Your Theme Structure

```
snippets/
├── cart-drawer.liquid        ← Main cart drawer component
├── cart-summary.liquid        ← Subtotal, checkout button
├── cart-products.liquid       ← Cart items list
└── cart-bubble.liquid         ← Cart count badge
```

---

## ✅ Option 1: Add to `cart-drawer.liquid` (RECOMMENDED - Easier)

### File: `snippets/cart-drawer.liquid`

**Find this code** (around line 76-80):

```liquid
<div
  class="cart-drawer__summary"
>
  {% render 'cart-summary' %}
</div>
```

**Replace with:**

```liquid
<div
  class="cart-drawer__summary"
>
  {%- if cart.item_count > 0 -%}
    <!-- DKG Token Holder Widget -->
    <div class="cart-drawer__dkg-widget" style="margin: 12px; padding: 16px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
      <div style="font-size: 14px; font-weight: 600; color: white; text-align: center; margin-bottom: 8px;">
        🪙 Token Holder Exclusive
      </div>
      <div style="font-size: 12px; color: rgba(255,255,255,0.9); text-align: center; margin-bottom: 12px;">
        Connect your wallet to unlock special discounts
      </div>
      <script src="https://group.deakee.com/storefront/dkg-widget.js" defer></script>
      <div id="dkg-token-widget" data-shop="{{ shop.permanent_domain }}"></div>
    </div>
  {%- endif -%}
  
  {% render 'cart-summary' %}
</div>
```

### Result:
```
┌─────────────────────────┐
│ Your Cart          [×]  │
├─────────────────────────┤
│ [Product Items...]      │
├─────────────────────────┤
│ 🪙 Token Widget ← HERE  │ ← Widget appears here
├─────────────────────────┤
│ Subtotal:      $50.00   │
│ [Checkout]              │
└─────────────────────────┘
```

---

## ✅ Option 2: Add to `cart-summary.liquid` (More Integrated)

### File: `snippets/cart-summary.liquid`

**Find this code** (around line 100):

```liquid
<div class="cart__ctas">
  <button
    type="submit"
    id="checkout"
    class="cart__checkout-button button"
    name="checkout"
    {% if cart == empty %}
      disabled
    {% endif %}
    form="cart-form"
  >
    {{ 'content.checkout' | t }}
  </button>
```

**Replace with:**

```liquid
<div class="cart__ctas">
  {%- if cart.item_count > 0 -%}
    <!-- DKG Token Holder Widget -->
    <div class="cart__dkg-widget" style="margin-bottom: 16px; padding: 16px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
      <div style="font-size: 14px; font-weight: 600; color: white; text-align: center; margin-bottom: 8px;">
        🪙 Token Holder Exclusive
      </div>
      <div style="font-size: 12px; color: rgba(255,255,255,0.9); text-align: center; margin-bottom: 12px;">
        Connect your wallet to unlock special discounts
      </div>
      <script src="https://group.deakee.com/storefront/dkg-widget.js" defer></script>
      <div id="dkg-token-widget" data-shop="{{ shop.permanent_domain }}"></div>
    </div>
  {%- endif -%}
  
  <button
    type="submit"
    id="checkout"
    class="cart__checkout-button button"
    name="checkout"
    {% if cart == empty %}
      disabled
    {% endif %}
    form="cart-form"
  >
    {{ 'content.checkout' | t }}
  </button>
```

### Result:
```
┌─────────────────────────┐
│ Your Cart          [×]  │
├─────────────────────────┤
│ [Product Items...]      │
├─────────────────────────┤
│ Subtotal:      $50.00   │
│ Estimated Total: $50.00 │
├─────────────────────────┤
│ 🪙 Token Widget ← HERE  │ ← Widget appears here
│ [Checkout]              │
└─────────────────────────┘
```

---

## 🎯 Which Option Should You Choose?

| Option | Pros | Cons |
|--------|------|------|
| **Option 1** (cart-drawer.liquid) | ✅ Easier to find/edit<br>✅ Widget above all summary info<br>✅ Cleaner separation | Widget not on full `/cart` page |
| **Option 2** (cart-summary.liquid) | ✅ Works in both drawer AND `/cart` page<br>✅ Right above checkout button | Slightly harder to find later |

### 💡 My Recommendation: **Option 1**

It's cleaner and easier to maintain. You can add Option 2 later if you also want the widget on the full cart page.

---

## 📝 Complete Code Snippet (Copy & Paste)

### For Option 1 - `cart-drawer.liquid`:

```liquid
<div
  class="cart-drawer__summary"
>
  {%- if cart.item_count > 0 -%}
    <!-- DKG Token Holder Widget -->
    <div class="cart-drawer__dkg-widget" style="margin: 12px; padding: 16px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
      <div style="font-size: 14px; font-weight: 600; color: white; text-align: center; margin-bottom: 8px;">
        🪙 Token Holder Exclusive
      </div>
      <div style="font-size: 12px; color: rgba(255,255,255,0.9); text-align: center; margin-bottom: 12px;">
        Connect your wallet to unlock special discounts
      </div>
      <script src="https://group.deakee.com/storefront/dkg-widget.js" defer></script>
      <div id="dkg-token-widget" data-shop="{{ shop.permanent_domain }}"></div>
    </div>
  {%- endif -%}
  
  {% render 'cart-summary' %}
</div>
```

### For Option 2 - `cart-summary.liquid`:

```liquid
<div class="cart__ctas">
  {%- if cart.item_count > 0 -%}
    <!-- DKG Token Holder Widget -->
    <div class="cart__dkg-widget" style="margin-bottom: 16px; padding: 16px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
      <div style="font-size: 14px; font-weight: 600; color: white; text-align: center; margin-bottom: 8px;">
        🪙 Token Holder Exclusive
      </div>
      <div style="font-size: 12px; color: rgba(255,255,255,0.9); text-align: center; margin-bottom: 12px;">
        Connect your wallet to unlock special discounts
      </div>
      <script src="https://group.deakee.com/storefront/dkg-widget.js" defer></script>
      <div id="dkg-token-widget" data-shop="{{ shop.permanent_domain }}"></div>
    </div>
  {%- endif -%}
  
  <button
    type="submit"
    id="checkout"
    class="cart__checkout-button button"
    name="checkout"
    {% if cart == empty %}
      disabled
    {% endif %}
    form="cart-form"
  >
    {{ 'content.checkout' | t }}
  </button>
```

---

## 🧪 Testing Steps

After adding the widget:

1. **Save the file** in Shopify theme editor
2. **Go to your store** (open in new tab)
3. **Add a product to cart**
4. **Click the cart icon** (should open drawer)
5. **Look for the purple gradient widget** with "🪙 Token Holder Exclusive"
6. **Hard refresh** if you don't see it: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)

### What You Should See:

```
┌───────────────────────────┐
│ Your Cart            [×]  │
├───────────────────────────┤
│ Product Name              │
│ $50.00          [Remove]  │
├───────────────────────────┤
│ ╔═══════════════════════╗ │
│ ║ 🪙 Token Holder       ║ │ ← Beautiful purple gradient
│ ║    Exclusive          ║ │
│ ║ Connect wallet to     ║ │
│ ║ unlock discounts      ║ │
│ ║ [Connect Wallet]      ║ │ ← Widget button
│ ╚═══════════════════════╝ │
├───────────────────────────┤
│ Subtotal:         $50.00  │
│ Estimated Total:  $50.00  │
│ [    Checkout    ]        │ ← Checkout button
└───────────────────────────┘
```

---

## 🐛 Troubleshooting

### Widget Not Showing?

1. **Check cart has items** - Widget only shows when `cart.item_count > 0`
2. **Hard refresh** - Browser might cache old version
3. **Check console** - Press F12, look for errors
4. **Verify script loads** - In Network tab, search for `dkg-widget.js`

### Widget Shows But Doesn't Work?

1. **Check shop parameter** - Should be `{{ shop.permanent_domain }}`
2. **Check API endpoint** - Should be `https://group.deakee.com`
3. **Check CORS** - Backend should allow Shopify domains

### Widget Looks Broken?

1. **Check drawer width** - The drawer might be too narrow on mobile
2. **Try compact version** - Reduce font sizes and padding
3. **Check theme CSS** - Might be overriding widget styles

---

## 🎨 Styling Variations

### Compact Version (for narrow drawers):

```liquid
<div style="margin: 8px; padding: 12px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px;">
  <div style="font-size: 13px; font-weight: 600; color: white; text-align: center; margin-bottom: 6px;">
    🪙 Token Discounts
  </div>
  <script src="https://group.deakee.com/storefront/dkg-widget.js" defer></script>
  <div id="dkg-token-widget" data-shop="{{ shop.permanent_domain }}"></div>
</div>
```

### Minimal Version (just the widget, no header):

```liquid
<div style="margin: 12px;">
  <script src="https://group.deakee.com/storefront/dkg-widget.js" defer></script>
  <div id="dkg-token-widget" data-shop="{{ shop.permanent_domain }}"></div>
</div>
```

### Bold CTA Version:

```liquid
<div style="margin: 12px; padding: 20px; background: #1a1a1a; border-radius: 12px; border: 2px solid #667eea;">
  <div style="font-size: 16px; font-weight: 700; color: #667eea; text-align: center; margin-bottom: 10px;">
    ⚡ EXCLUSIVE TOKEN HOLDER DISCOUNT
  </div>
  <div style="font-size: 13px; color: #aaa; text-align: center; margin-bottom: 14px;">
    Connect your wallet to save more
  </div>
  <script src="https://group.deakee.com/storefront/dkg-widget.js" defer></script>
  <div id="dkg-token-widget" data-shop="{{ shop.permanent_domain }}"></div>
</div>
```

---

## 📊 Summary

| Step | Action | File |
|------|--------|------|
| 1️⃣ | Choose option (recommend Option 1) | - |
| 2️⃣ | Open file in Shopify theme editor | `snippets/cart-drawer.liquid` |
| 3️⃣ | Find the section to modify | Look for `<div class="cart-drawer__summary">` |
| 4️⃣ | Paste widget code | Add before `{% render 'cart-summary' %}` |
| 5️⃣ | Save and test | Add item to cart, open drawer |

---

**Ready?** Pick your option and let me know when you've added it! 🚀

