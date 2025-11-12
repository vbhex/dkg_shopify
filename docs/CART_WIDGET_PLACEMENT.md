# Cart Page Widget Placement Guide

## Issue: Widget Not Showing on Cart Page

The widget code was added to `sections/main-cart.liquid` but isn't visible. This is usually because it was placed in the wrong section of the file.

---

## Where to Place the Widget Code

### Step 1: Open the Cart File

1. **Shopify Admin → Online Store → Themes**
2. **Actions → Edit code**
3. **Find and open:** `sections/main-cart.liquid`

### Step 2: Find the Right Location

Look for one of these sections (in order of preference):

#### Option A: Before the Checkout Button (Best)

Search for lines containing:
- `checkout` button
- `type="submit"`
- `cart__checkout`
- `button--primary`

**Add widget code ABOVE the checkout button:**

```liquid
{%- if cart.item_count > 0 -%}
  <!-- DKG Token Holder Widget -->
  <div class="cart__dkg-widget" style="margin: 30px 0;">
    <script src="https://group.deakee.com/storefront/dkg-widget.js" defer></script>
    <div id="dkg-token-widget" data-shop="{{ shop.permanent_domain }}"></div>
  </div>
{%- endif -%}

<!-- Existing checkout button below -->
<button type="submit" name="checkout" class="cart__checkout-button">
  {{ 'sections.cart.checkout' | t }}
</button>
```

#### Option B: After Cart Footer

Search for:
- `cart__footer`
- `</div>` closing the footer section

**Add widget code inside the footer, before the closing tag:**

```liquid
<div class="cart__footer">
  <!-- Existing subtotal and other content -->
  
  {%- if cart.item_count > 0 -%}
    <!-- DKG Token Holder Widget -->
    <div class="cart__dkg-widget" style="margin: 30px 0;">
      <script src="https://group.deakee.com/storefront/dkg-widget.js" defer></script>
      <div id="dkg-token-widget" data-shop="{{ shop.permanent_domain }}"></div>
    </div>
  {%- endif -%}
  
  <!-- Checkout button -->
</div>
```

#### Option C: At the Very Bottom (Safest)

If you can't find the above sections, add at the very bottom of the file:

```liquid
<!-- Existing cart template code above -->

{%- if cart.item_count > 0 -%}
  <!-- DKG Token Holder Widget -->
  <div class="cart__dkg-widget" style="margin: 30px 0; padding: 20px;">
    <script src="https://group.deakee.com/storefront/dkg-widget.js" defer></script>
    <div id="dkg-token-widget" data-shop="{{ shop.permanent_domain }}"></div>
  </div>
{%- endif -%}

{% schema %}
...
{% endschema %}
```

---

## Complete Example

Here's a complete example showing where to place the widget:

```liquid
{% comment %}
  sections/main-cart.liquid
{% endcomment %}

<div class="cart-template">
  <!-- Cart items list -->
  <div class="cart__items">
    {% for item in cart.items %}
      <!-- cart item markup -->
    {% endfor %}
  </div>
  
  <!-- Cart footer with totals -->
  <div class="cart__footer">
    <div class="cart__subtotal">
      {{ 'sections.cart.subtotal' | t }}
      <span>{{ cart.total_price | money }}</span>
    </div>
    
    <!-- ✅ ADD WIDGET HERE (OPTION 1) -->
    {%- if cart.item_count > 0 -%}
      <div class="cart__dkg-widget" style="margin: 30px 0;">
        <h3 style="margin-bottom: 15px;">🪙 Token Holder Discounts</h3>
        <script src="https://group.deakee.com/storefront/dkg-widget.js" defer></script>
        <div id="dkg-token-widget" data-shop="{{ shop.permanent_domain }}"></div>
      </div>
    {%- endif -%}
    
    <!-- Checkout button -->
    <button type="submit" name="checkout" class="cart__checkout-button button button--primary">
      {{ 'sections.cart.checkout' | t }}
    </button>
  </div>
</div>

<!-- ✅ OR ADD HERE (OPTION 2) - Outside main cart div -->
{%- if cart.item_count > 0 -%}
  <div style="margin: 30px auto; max-width: 600px; padding: 0 20px;">
    <script src="https://group.deakee.com/storefront/dkg-widget.js" defer></script>
    <div id="dkg-token-widget" data-shop="{{ shop.permanent_domain }}"></div>
  </div>
{%- endif -%}

{% schema %}
{
  "name": "Cart",
  "class": "section-cart"
}
{% endschema %}
```

---

## Troubleshooting

### Widget Still Not Showing?

#### 1. Check if Code is Actually Saved

- Make sure you clicked **Save** after adding the code
- Green "Saved" message should appear

#### 2. Check Cart Has Items

The widget only shows if `cart.item_count > 0`:

- **Add items to cart** before checking
- View cart page: `/cart`

#### 3. Check Page Source

1. **Go to cart page**: `https://your-store.myshopify.com/cart`
2. **Right-click → View Page Source**
3. **Search for:** `dkg-widget`
4. **If found:** Widget code is there, might be CSS issue
5. **If not found:** Code wasn't added in the right place

#### 4. Check Browser Console

1. **Open cart page**
2. **Press F12** (DevTools)
3. **Go to Console tab**
4. **Check for DKG-related messages**
5. **Ignore:** Shopify's internal errors (like the ones you showed)

#### 5. Check if Script Loads

1. **Open DevTools (F12)**
2. **Go to Network tab**
3. **Refresh cart page**
4. **Search for:** `dkg-widget.js`
5. **Should see:** `200 OK` status

---

## About Those Console Errors

The errors you're seeing:

```
GET https://deakee-group-dev-store.myshopify.com/private_access_tokens?id=...
Failed to execute action. Retrying in 2066ms.
```

**These are NOT related to the DKG widget!** These are:
- Shopify's internal telemetry/monitoring errors
- Shopify's checkout system trying to load data
- Network issues with Shopify's own services
- Safe to ignore

The DKG widget errors would look like:
```
Failed to load resource: https://group.deakee.com/storefront/dkg-widget.js
```

---

## Important: Cart Page vs. Checkout Page

### Where to Find the Widget

**✅ Widget shows on:** `/cart` (Shopping Cart page)
- URL: `https://your-store.myshopify.com/cart`
- This is where customers review items before checkout
- This is where the DKG widget lives

**❌ Widget does NOT show on:** `/checkouts` (Checkout/Payment page)
- URL: `https://your-store.myshopify.com/checkouts/...`
- This is where customers enter payment info
- Only Shopify's default discount input field is here
- Custom widgets require Shopify Plus ($2000/month)

### Why This Design Works

1. **Customer Flow:**
   - Cart page → Connect wallet → Get discount code
   - Checkout page → Paste code → Apply discount

2. **Benefits:**
   - Works on all Shopify plans (not just Plus)
   - No interruption during payment
   - Better security (checkout page locked down)
   - Customer has code ready before paying

3. **Shopify's Default Discount Field:**
   - The simple text input on checkout is NOT our widget
   - It's Shopify's built-in feature for entering codes
   - Our widget GENERATES codes; that field APPLIES codes

---

## Testing Steps

### After Adding Widget Code:

1. ✅ **Save the file** in theme editor
2. ✅ **Add items to cart** (at least 1 item)
3. ✅ **Go to cart page**: `/cart`
4. ✅ **Hard refresh**: `Ctrl+Shift+R` or `Cmd+Shift+R`
5. ✅ **Look for the widget** on the page

### What You Should See:

```
┌─────────────────────────────────────────┐
│ Shopping Cart                           │
├─────────────────────────────────────────┤
│ Product 1             $50.00            │
│ Product 2             $30.00            │
├─────────────────────────────────────────┤
│ Subtotal:             $80.00            │
├─────────────────────────────────────────┤
│ 🪙 DKG Token Holder Discounts          │← Widget appears here
│ Connect your wallet to unlock           │
│ exclusive discounts                     │
│ ┌─────────────────────────────────────┐│
│ │      Connect Wallet                 ││
│ └─────────────────────────────────────┘│
├─────────────────────────────────────────┤
│ [   Proceed to Checkout   ]             │
└─────────────────────────────────────────┘
```

---

## Alternative: Use Liquid Section

If nothing works, create a custom section:

### Step 1: Create New Section

1. **In theme editor, click "Add a new section"**
2. **Name it:** `dkg-widget.liquid`
3. **Add this code:**

```liquid
<div class="dkg-widget-section">
  {%- if cart.item_count > 0 -%}
    <div class="container">
      <h3>🪙 Token Holder Exclusive Discounts</h3>
      <p>Connect your wallet to unlock special discounts!</p>
      
      <script src="https://group.deakee.com/storefront/dkg-widget.js" defer></script>
      <div id="dkg-token-widget" data-shop="{{ shop.permanent_domain }}"></div>
    </div>
  {%- endif -%}
</div>

<style>
  .dkg-widget-section {
    margin: 40px 0;
    padding: 30px 20px;
    background: #f9f9f9;
    border-radius: 8px;
  }
  
  .dkg-widget-section h3 {
    margin: 0 0 10px 0;
    font-size: 24px;
  }
  
  .dkg-widget-section p {
    margin: 0 0 20px 0;
    color: #666;
  }
</style>

{% schema %}
{
  "name": "DKG Token Widget",
  "settings": []
}
{% endschema %}
```

### Step 2: Add Section to Cart Template

1. **Go to:** `templates/cart.json` or `templates/cart.liquid`
2. **If `.json`:** Add section reference
3. **If `.liquid`:** Add: `{% section 'dkg-widget' %}`

---

## Quick Verification Checklist

- [ ] Cart file saved after adding code
- [ ] Code placed **inside** a visible section (not inside `{% schema %}`)
- [ ] Cart has at least 1 item
- [ ] Hard refreshed browser
- [ ] Checked in incognito mode
- [ ] Searched page source for `dkg-widget`

---

## Still Not Working?

**Send me the relevant section of your `main-cart.liquid` file** (around 20-30 lines) where you added the widget code, and I'll help you find the exact right place!

**What to share:**
```liquid
<!-- A few lines before your widget code -->
<div class="cart__footer">
  {{ cart.total_price | money }}
  
  <!-- YOUR WIDGET CODE HERE -->
  <script src="..."></script>
  <div id="dkg-token-widget"></div>
  
  <!-- Checkout button -->
  <button>Checkout</button>
</div>
<!-- A few lines after -->
```

