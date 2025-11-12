# Adding DKG Widget to AJAX Cart Drawer

## Problem

Modern Shopify themes use an **AJAX cart drawer** (popup/slide-out) instead of redirecting to `/cart` page:

```
Customer clicks cart icon → Popup appears → Customer clicks checkout
                                ↓
                        Skips /cart page entirely!
```

**Solution:** Add widget to the cart drawer template.

---

## Step 1: Find Your Cart Drawer File

The cart drawer is usually in one of these files:

### Check These Files (in order):

1. **`snippets/cart-drawer.liquid`** ← Most common
2. **`sections/cart-drawer.liquid`**
3. **`snippets/ajax-cart.liquid`**
4. **`sections/ajax-cart.liquid`**
5. **`sections/cart-notification.liquid`**

### How to Find It:

1. **Shopify Admin → Online Store → Themes**
2. **Actions → Edit code**
3. **Search in left sidebar** for files with "drawer" or "ajax-cart"
4. **Or search file contents** for: `cart drawer`, `mini-cart`, or `ajax-cart`

---

## Step 2: Where to Add Widget Code

### Option A: Before Checkout Button (Best)

Find the checkout button in the drawer file:

```liquid
<button type="submit" name="checkout" class="cart-drawer__checkout">
  {{ 'sections.cart.checkout' | t }}
</button>
```

**Add widget ABOVE the button:**

```liquid
{%- if cart.item_count > 0 -%}
  <!-- DKG Token Holder Widget -->
  <div class="cart-drawer__dkg-widget" style="margin: 20px 0; padding: 15px; background: #f5f5f5; border-radius: 8px;">
    <div style="font-size: 16px; font-weight: 600; margin-bottom: 10px;">
      🪙 Token Holder Discounts
    </div>
    <script src="https://group.deakee.com/storefront/dkg-widget.js" defer></script>
    <div id="dkg-token-widget" data-shop="{{ shop.permanent_domain }}"></div>
  </div>
{%- endif -%}

<!-- Checkout button below -->
<button type="submit" name="checkout" class="cart-drawer__checkout">
  {{ 'sections.cart.checkout' | t }}
</button>
```

### Option B: After Subtotal

Find the subtotal section:

```liquid
<div class="cart-drawer__subtotal">
  <span>Subtotal</span>
  <span>{{ cart.total_price | money }}</span>
</div>
```

**Add widget AFTER subtotal:**

```liquid
<div class="cart-drawer__subtotal">
  <span>Subtotal</span>
  <span>{{ cart.total_price | money }}</span>
</div>

{%- if cart.item_count > 0 -%}
  <!-- DKG Token Holder Widget -->
  <div class="cart-drawer__dkg-widget" style="margin: 20px 0; padding: 15px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px; color: white;">
    <div style="font-size: 16px; font-weight: 600; margin-bottom: 10px;">
      🪙 Token Holder Exclusive
    </div>
    <script src="https://group.deakee.com/storefront/dkg-widget.js" defer></script>
    <div id="dkg-token-widget" data-shop="{{ shop.permanent_domain }}"></div>
  </div>
{%- endif -%}
```

---

## Step 3: Also Add to Full Cart Page

Keep the widget on `/cart` page too (for users who visit directly):

**File:** `sections/main-cart.liquid`

Add the same widget code before the checkout button.

---

## Complete Example: Cart Drawer

### Example `snippets/cart-drawer.liquid`:

```liquid
<div class="drawer cart-drawer" id="cart-drawer">
  <div class="drawer__inner">
    <div class="drawer__header">
      <h2>{{ 'sections.cart.title' | t }}</h2>
      <button class="drawer__close" aria-label="Close">×</button>
    </div>

    <div class="drawer__contents">
      {%- if cart.item_count > 0 -%}
        <!-- Cart Items -->
        <div class="cart-drawer__items">
          {% for item in cart.items %}
            <div class="cart-item">
              <img src="{{ item.image | img_url: '100x' }}" alt="{{ item.title }}">
              <div class="cart-item__details">
                <h3>{{ item.title }}</h3>
                <p>{{ item.price | money }}</p>
              </div>
            </div>
          {% endfor %}
        </div>

        <!-- Subtotal -->
        <div class="cart-drawer__footer">
          <div class="cart-drawer__subtotal">
            <span>{{ 'sections.cart.subtotal' | t }}</span>
            <span>{{ cart.total_price | money }}</span>
          </div>

          <!-- ✅ ADD WIDGET HERE -->
          <div class="cart-drawer__dkg-widget" style="margin: 20px 0;">
            <div style="font-size: 15px; font-weight: 600; margin-bottom: 12px; color: #333;">
              🪙 Token Holder Discounts Available
            </div>
            <div style="font-size: 13px; color: #666; margin-bottom: 12px;">
              Connect your wallet to unlock exclusive discounts
            </div>
            <script src="https://group.deakee.com/storefront/dkg-widget.js" defer></script>
            <div id="dkg-token-widget" data-shop="{{ shop.permanent_domain }}"></div>
          </div>

          <!-- Checkout Button -->
          <button type="submit" name="checkout" class="cart-drawer__checkout button button--primary">
            {{ 'sections.cart.checkout' | t }}
          </button>
        </div>
      {%- else -%}
        <p>{{ 'sections.cart.empty' | t }}</p>
      {%- endif -%}
    </div>
  </div>
</div>
```

---

## Step 4: Styling for Small Drawer

The cart drawer is usually narrow, so use compact styling:

### Compact Widget Styling:

```liquid
{%- if cart.item_count > 0 -%}
  <div class="cart-drawer__dkg-widget" style="
    margin: 16px 12px;
    padding: 16px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  ">
    <div style="
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 8px;
      color: white;
      text-align: center;
    ">
      🪙 Token Holder Exclusive
    </div>
    <div style="
      font-size: 12px;
      color: rgba(255,255,255,0.9);
      margin-bottom: 12px;
      text-align: center;
    ">
      Unlock special discounts
    </div>
    <script src="https://group.deakee.com/storefront/dkg-widget.js" defer></script>
    <div id="dkg-token-widget" data-shop="{{ shop.permanent_domain }}"></div>
  </div>
{%- endif -%}
```

---

## Step 5: Test the Widget

### Testing Checklist:

1. **Add items to cart** (at least 1 item)
2. **Click cart icon** in header (should open drawer/popup)
3. **Look for widget** in the drawer
4. **Hard refresh** if not visible: `Ctrl+Shift+R`
5. **Check browser console** for errors (F12)

### What You Should See:

```
┌──────────────────────────┐
│ Cart           [×]       │
├──────────────────────────┤
│ Product 1        $50.00  │
│ Qty: 1          [Remove] │
├──────────────────────────┤
│                          │
│ Subtotal:        $50.00  │
├──────────────────────────┤
│ 🪙 Token Holder          │
│    Exclusive             │
│ ┌──────────────────────┐ │
│ │ Connect Wallet       │ │ ← Widget here
│ └──────────────────────┘ │
├──────────────────────────┤
│ [   Checkout   ]         │
└──────────────────────────┘
```

---

## Troubleshooting

### Widget Not Showing in Drawer?

#### 1. Check if Drawer File Exists

**Test:** Click cart icon. Does a popup/slide-out appear?
- **Yes:** Your theme uses cart drawer
- **No:** Your theme might redirect to `/cart` page

#### 2. Find the Correct File

**Search theme files for:**
```liquid
cart.items
checkout
cart-drawer
mini-cart
```

**Common patterns:**
```liquid
<div class="cart-drawer">
<div class="mini-cart">
<aside id="cart-drawer">
<div id="ajaxCart">
```

#### 3. Check Multiple Files

Sometimes the drawer is split across files:
- Main drawer: `sections/cart-drawer.liquid`
- Footer section: `snippets/cart-drawer-footer.liquid`
- Items: `snippets/cart-item.liquid`

**Add widget to the file with the checkout button.**

#### 4. Verify Script Loads

1. **Open cart drawer**
2. **Press F12** (DevTools)
3. **Go to Network tab**
4. **Search for:** `dkg-widget.js`
5. **Should see:** `200 OK` status

#### 5. Check for Conflicts

Some themes lazy-load cart drawer content:
- Widget might need to be re-initialized
- Check if drawer uses AJAX to fetch content

---

## Alternative: Add to Cart Page AND Drawer

### Best Practice: Cover Both Cases

1. **Add to cart drawer** (for popup users)
2. **Add to cart page** (for direct `/cart` visitors)
3. **Use same widget code** in both places

The widget is smart enough to only initialize once!

---

## Common Theme Files Location

### Dawn Theme (Shopify Default):

```
sections/
├── main-cart-items.liquid      ← Add widget here too
└── main-cart-footer.liquid     ← And here for full cart page

snippets/
└── cart-drawer.liquid          ← Add widget here for drawer
```

### Debut Theme:

```
sections/
└── ajax-cart-template.liquid   ← Add widget here

snippets/
└── ajax-cart.liquid            ← Or here
```

### Brooklyn Theme:

```
snippets/
└── ajax-cart-template.liquid   ← Add widget here
```

### Narrative Theme:

```
sections/
└── header.liquid               ← Cart drawer is here
```

---

## Quick Find Method

### Search All Files:

1. **In theme editor, click "Search files"** (magnifying glass icon)
2. **Search for:** `checkout`
3. **Look for files** containing "drawer", "ajax", or "mini"
4. **Open each file** and search for the checkout button
5. **Add widget above that button**

---

## Visual Guide

### Cart Drawer Layout:

```
┌─────────────────────────────────┐
│ Your Cart                  [×]  │ ← Header
├─────────────────────────────────┤
│                                 │
│ [Product 1]         $50.00      │ ← Items
│ [Product 2]         $30.00      │
│                                 │
├─────────────────────────────────┤
│ Subtotal:           $80.00      │ ← Subtotal
├─────────────────────────────────┤
│                                 │
│ 🪙 Token Holder Discounts       │ ← ADD WIDGET HERE
│ [Connect Wallet]                │
│                                 │
├─────────────────────────────────┤
│ [      Checkout      ]          │ ← Button
└─────────────────────────────────┘
```

---

## ✅ Quick Start for Your Setup

Since you found `cart-drawer.liquid` in **`snippets/`** folder:

### Your Theme Structure:

Your `cart-drawer.liquid` uses a custom component structure with:
- `<cart-items-component>` - displays cart items
- `{% render 'cart-summary' %}` - displays subtotal and checkout button

### Where to Add the Widget:

1. **Go to:** Shopify Admin → Online Store → Themes → Edit code
2. **Open:** `snippets/cart-drawer.liquid`
3. **Find this section:**
```liquid
<div class="cart-drawer__summary">
  {% render 'cart-summary' %}
</div>
```

4. **Replace with:**
```liquid
<div class="cart-drawer__summary">
  {%- if cart.item_count > 0 -%}
    <!-- DKG Token Holder Widget -->
    <div style="margin: 12px; padding: 16px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
      <div style="font-size: 14px; font-weight: 600; color: white; text-align: center; margin-bottom: 8px;">
        🪙 Token Holder Exclusive
      </div>
      <div style="font-size: 12px; color: rgba(255,255,255,0.9); text-align: center; margin-bottom: 12px;">
        Unlock special discounts
      </div>
      <script src="https://group.deakee.com/storefront/dkg-widget.js" defer></script>
      <div id="dkg-token-widget" data-shop="{{ shop.permanent_domain }}"></div>
    </div>
  {%- endif -%}
  
  {% render 'cart-summary' %}
</div>
```

5. **Save** and test!

---

## Summary

**Problem:** Cart drawer popup skips `/cart` page  
**Solution:** Add widget to cart drawer file  
**Files:** `snippets/cart-drawer.liquid` ← Your location  
**Location:** Above checkout button or after subtotal  
**Benefit:** Widget visible in popup that customers actually use! ✅

