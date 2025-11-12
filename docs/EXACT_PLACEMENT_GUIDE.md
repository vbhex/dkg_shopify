# Exact Widget Placement Guide for Your Theme

## 🎯 Your Theme Structure

Your theme uses:
- **`snippets/cart-drawer.liquid`** - Main cart drawer container
- **`snippets/cart-summary.liquid`** - Contains checkout button and totals

---

## ✅ Option 1: Add to `cart-summary.liquid` (RECOMMENDED)

This places the widget **right before the checkout button**.

### File: `snippets/cart-summary.liquid`

**Find this section (near the bottom):**

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

---

## ✅ Option 2: Add to `cart-drawer.liquid` (Alternative)

This places the widget **before the entire summary section**.

### File: `snippets/cart-drawer.liquid`

**Find this section:**

```liquid
<div class="cart-drawer__summary">
  {% render 'cart-summary' %}
</div>
```

**Replace with:**

```liquid
<div class="cart-drawer__summary">
  {%- if cart.item_count > 0 -%}
    <!-- DKG Token Holder Widget -->
    <div style="margin: 12px; padding: 16px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
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

---

## 🎨 Visual Layout

### With Option 1 (in cart-summary.liquid):

```
┌─────────────────────────────┐
│ Your Cart              [×]  │
├─────────────────────────────┤
│ Product 1         $50.00    │
│ Product 2         $30.00    │
├─────────────────────────────┤
│ Subtotal:         $80.00    │
│ Discount: -10%    -$8.00    │
│ Estimated Total:  $72.00    │
├─────────────────────────────┤
│ 🪙 Token Holder Exclusive   │ ← Widget here
│ [Connect Wallet]            │
├─────────────────────────────┤
│ [      Checkout      ]      │
└─────────────────────────────┘
```

### With Option 2 (in cart-drawer.liquid):

```
┌─────────────────────────────┐
│ Your Cart              [×]  │
├─────────────────────────────┤
│ Product 1         $50.00    │
│ Product 2         $30.00    │
├─────────────────────────────┤
│ 🪙 Token Holder Exclusive   │ ← Widget here
│ [Connect Wallet]            │
├─────────────────────────────┤
│ Subtotal:         $80.00    │
│ Discount: -10%    -$8.00    │
│ Estimated Total:  $72.00    │
├─────────────────────────────┤
│ [      Checkout      ]      │
└─────────────────────────────┘
```

---

## 🚀 Recommended: Use Option 1

**Why?**
- ✅ Widget appears after totals are shown
- ✅ Right before checkout (last chance to connect)
- ✅ More logical flow for customers
- ✅ Only one file to edit

---

## 📝 Step-by-Step Instructions

1. **Go to:** Shopify Admin → Online Store → Themes
2. **Click:** Actions → Edit code
3. **In left sidebar:** Expand "Snippets" folder
4. **Click:** `cart-summary.liquid`
5. **Scroll down** to find the `<div class="cart__ctas">` section
6. **Copy the code** from Option 1 above
7. **Replace** the existing `<div class="cart__ctas">` section
8. **Click:** Save (top right)
9. **Test:** Add items to cart → Click cart icon → See widget!

---

## 🧪 Testing Checklist

After adding the widget:

- [ ] Add at least 1 item to cart
- [ ] Click cart icon (drawer should slide out)
- [ ] Look for the purple gradient widget box
- [ ] Widget should say "🪙 Token Holder Exclusive"
- [ ] Click "Connect Wallet" button
- [ ] MetaMask should pop up
- [ ] Sign the message
- [ ] Widget should show your wallet address and token balance

### If widget doesn't appear:

1. **Hard refresh:** `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
2. **Clear cache:** Close and reopen cart drawer
3. **Check console:** Press F12, look for errors
4. **Verify script:** Network tab should show `dkg-widget.js` loaded

---

## 🎨 Styling Options

### Minimal Style (Less Visual):

```liquid
<div style="margin-bottom: 12px; padding: 12px; border: 2px solid #667eea; border-radius: 8px; background: #f9f9ff;">
  <div style="font-size: 13px; font-weight: 600; color: #667eea; margin-bottom: 8px;">
    🪙 Token Holder Discounts Available
  </div>
  <script src="https://group.deakee.com/storefront/dkg-widget.js" defer></script>
  <div id="dkg-token-widget" data-shop="{{ shop.permanent_domain }}"></div>
</div>
```

### Bold Style (More Attention):

```liquid
<div style="margin-bottom: 16px; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);">
  <div style="font-size: 16px; font-weight: 700; color: white; text-align: center; margin-bottom: 6px;">
    🪙 EXCLUSIVE TOKEN HOLDER BENEFITS
  </div>
  <div style="font-size: 12px; color: rgba(255,255,255,0.95); text-align: center; margin-bottom: 14px;">
    Connect wallet to unlock your special discount
  </div>
  <script src="https://group.deakee.com/storefront/dkg-widget.js" defer></script>
  <div id="dkg-token-widget" data-shop="{{ shop.permanent_domain }}"></div>
</div>
```

---

## 🔧 Troubleshooting

### Widget shows but button doesn't work?

**Check backend is running:**
```bash
cd /deakee/dkg_shopify
pm2 status
```

Should see `dkg-shopify` with status **"online"**.

### Widget doesn't show at all?

1. Check if cart has items (`if cart.item_count > 0`)
2. Verify script URL is correct: `https://group.deakee.com/storefront/dkg-widget.js`
3. Check browser console (F12) for errors
4. Make sure you saved the file after editing

### Styling looks broken?

- Try removing inline styles and use simpler styling
- Check if theme CSS is conflicting
- Try adding `!important` to critical styles

---

## 📌 Quick Reference

**Files to edit:**
- **Option 1 (Recommended):** `snippets/cart-summary.liquid`
- **Option 2 (Alternative):** `snippets/cart-drawer.liquid`

**What to add:**
- Widget code (see Option 1 or 2 above)

**Where to add:**
- **Option 1:** Before `<button id="checkout">`
- **Option 2:** Before `{% render 'cart-summary' %}`

**Test URL:**
- Your store + `/cart` (or click cart icon)

---

## ✅ You're Ready!

Now go add the widget to `snippets/cart-summary.liquid` using **Option 1** code above! 🚀

Let me know once you've added it and we can test it together!

