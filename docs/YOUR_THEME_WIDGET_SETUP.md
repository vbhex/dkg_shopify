# DKG Widget Setup - Your Specific Theme

## 📋 Your Theme Structure

Your theme has a custom component-based structure:

```
snippets/
├── cart-drawer.liquid          ← Main drawer container
└── cart-summary.liquid         ← Totals & checkout button
```

---

## ✅ STEP 1: Add Widget to Cart Drawer

### File: `snippets/cart-drawer.liquid`

**Find this section** (around line 100-105):

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
    <div class="cart-drawer__dkg-widget" style="margin: 12px; padding: 16px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
      <div style="font-size: 14px; font-weight: 600; color: white; text-align: center; margin-bottom: 8px;">
        🪙 Token Holder Exclusive
      </div>
      <div style="font-size: 12px; color: rgba(255,255,255,0.9); text-align: center; margin-bottom: 12px;">
        Connect wallet to unlock special discounts
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

This will create the following structure in your cart drawer:

```
┌─────────────────────────────────┐
│ Your Cart                  [×]  │ ← Header
├─────────────────────────────────┤
│                                 │
│ [Product 1]         $50.00      │ ← Cart Items
│ [Product 2]         $30.00      │
│                                 │
├─────────────────────────────────┤ ← cart-drawer__summary starts
│                                 │
│ 🪙 Token Holder Exclusive       │ ← DKG Widget (NEW!)
│ Connect wallet to unlock...     │
│ [Connect Wallet]                │
│                                 │
├─────────────────────────────────┤
│ Subtotal:           $80.00      │ ← cart-summary.liquid
│ Estimated Total:    $80.00      │
│ [      Checkout      ]          │
└─────────────────────────────────┘
```

---

## 📝 Alternative Placement Options

### Option A: Above Totals (Recommended) ✅

This is what we're doing above - widget appears before all the price calculations.

**Pros:**
- First thing customers see after cart items
- Clear call-to-action before checkout
- Natural flow

### Option B: Between Totals and Checkout Button

If you want the widget **after** the estimated total but **before** the checkout button:

**File:** `snippets/cart-summary.liquid`

**Find this section** (around line 65):

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
    <div class="cart__dkg-widget" style="margin-bottom: 16px; padding: 16px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px;">
      <div style="font-size: 14px; font-weight: 600; color: white; text-align: center; margin-bottom: 8px;">
        🪙 Token Holder Benefits
      </div>
      <div style="font-size: 12px; color: rgba(255,255,255,0.9); text-align: center; margin-bottom: 12px;">
        Connect to unlock discounts
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

## 🎯 Recommended Approach

**Use Option A (cart-drawer.liquid)** for these reasons:

1. ✅ **Less invasive** - only edits one file
2. ✅ **Better visibility** - widget seen immediately after cart items
3. ✅ **Cleaner separation** - summary stays focused on pricing
4. ✅ **Easier maintenance** - widget is separate from checkout logic

---

## 🧪 Testing Steps

After making the change:

1. **Save the file** in Shopify theme editor
2. **Open your store** (in a new tab or incognito)
3. **Add a product to cart**
4. **Click the cart icon** (should open drawer/popup)
5. **Look for the widget** with purple gradient background
6. **Hard refresh** if needed: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)

---

## 🐛 Troubleshooting

### Widget Not Showing?

1. **Check browser console** (F12)
   - Look for JavaScript errors
   - Verify `dkg-widget.js` loads (Network tab)

2. **Clear cache**
   - Browser cache: `Ctrl+Shift+Delete`
   - Shopify cache: Wait 1-2 minutes after saving

3. **Verify cart has items**
   - Widget only shows when `cart.item_count > 0`

4. **Check for CSS conflicts**
   - Widget might be hidden by theme CSS
   - Try adding `!important` to `display` property

### Widget Appears But Doesn't Load?

1. **Check API endpoint**
   ```
   https://group.deakee.com/storefront/dkg-widget.js
   ```
   Should return JavaScript file (200 OK)

2. **Verify shop domain**
   - Widget uses `{{ shop.permanent_domain }}`
   - Should be your `.myshopify.com` domain

3. **Check CORS settings**
   - Backend must allow requests from your Shopify domain
   - Already configured in `server/index.js`

---

## 🎨 Customization

### Change Colors

Replace the gradient background:

```liquid
background: linear-gradient(135deg, #your-color-1 0%, #your-color-2 100%);
```

**Examples:**
- Blue/Purple: `#667eea 0%, #764ba2 100%` (current)
- Orange/Red: `#ff6b6b 0%, #ee5a6f 100%`
- Green/Teal: `#11998e 0%, #38ef7d 100%`
- Gold: `#f2994a 0%, #f2c94c 100%`

### Change Size

Adjust padding and font sizes:

```liquid
<!-- More compact -->
<div style="margin: 8px; padding: 12px; ...">
  <div style="font-size: 12px; ...">
  
<!-- Larger -->
<div style="margin: 16px; padding: 20px; ...">
  <div style="font-size: 16px; ...">
```

### Change Text

Customize the messages:

```liquid
<div>
  🪙 VIP Token Holders
</div>
<div>
  Connect your wallet for exclusive pricing
</div>
```

---

## 📊 Expected Customer Flow

```
1. Customer adds product to cart
        ↓
2. Clicks cart icon → Drawer opens
        ↓
3. Sees DKG widget with "Connect Wallet" button
        ↓
4. Clicks "Connect Wallet" → MetaMask popup
        ↓
5. Signs message to verify ownership
        ↓
6. Widget shows: ✅ "Verified! Discount Applied"
        ↓
7. Cart total updates with discount
        ↓
8. Customer proceeds to checkout
```

---

## 🔄 Full Cart Page (Optional)

If you also want the widget on the full `/cart` page:

**File:** `sections/main-cart.liquid` or `sections/main-cart-footer.liquid`

Add the same widget code before the checkout button in that file.

---

## ✅ Final Checklist

- [ ] Edit `snippets/cart-drawer.liquid`
- [ ] Add widget code before `{% render 'cart-summary' %}`
- [ ] Save file
- [ ] Test with items in cart
- [ ] Verify widget loads
- [ ] Test wallet connection
- [ ] Test discount application

---

## 🎉 You're Done!

The widget should now appear in your cart drawer popup, perfectly positioned to catch customers' attention before checkout!

If you encounter any issues, check the troubleshooting section or let me know! 🚀

