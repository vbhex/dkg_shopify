# ⚠️ IMPORTANT: Avoiding Duplicate Widgets

## 🎯 The Problem

If you add the DKG widget to **multiple files**, customers will see **multiple widgets** on the same page:

```
❌ BAD - Widget appears twice:
┌─────────────────────┐
│ 🪙 Widget 1         │ ← From cart-drawer.liquid
├─────────────────────┤
│ Subtotal: $50       │
├─────────────────────┤
│ 🪙 Widget 2         │ ← From cart-summary.liquid
├─────────────────────┤
│ [Checkout]          │
└─────────────────────┘
```

---

## ✅ The Solution: Choose ONE Location

### Where to Add the Widget:

You have **two main options**:

| Location | File | Shows In | Recommendation |
|----------|------|----------|----------------|
| **Option 1** | `snippets/cart-drawer.liquid` | Cart drawer popup only | ⭐ **Best for most stores** |
| **Option 2** | `snippets/cart-summary.liquid` | Both drawer AND `/cart` page | Good if you want it everywhere |

---

## 🎯 Recommended Setup: Option 1 Only

### Add widget ONLY to: `snippets/cart-drawer.liquid`

**Why?**
- ✅ Most customers use the cart drawer (popup)
- ✅ Fewer customers visit the full `/cart` page
- ✅ Cleaner - only one place to maintain
- ✅ No risk of duplicate widgets

### Do NOT add to:
- ❌ `snippets/cart-summary.liquid` (would show in both places)
- ❌ `sections/main-cart.liquid` (would show on full cart page too)
- ❌ `sections/main-cart-footer.liquid`
- ❌ `sections/main-cart-items.liquid`

---

## 🔍 How to Check for Duplicates

### Step 1: Search Your Theme Files

In Shopify theme editor:

1. **Click the search icon** (magnifying glass) at the top
2. **Search for:** `dkg-widget`
3. **Look for all files** that contain this text
4. **You should only see it in ONE file**

### Step 2: Visual Check

1. Add items to cart
2. Open cart drawer
3. Count how many times you see "🪙 Token Holder" widget
4. **Should only appear ONCE**

---

## 🧹 How to Remove Duplicate Widgets

If you accidentally added the widget to multiple files:

### Find All Instances:

1. **Shopify Admin → Online Store → Themes → Edit code**
2. **Search** (magnifying glass icon) → `dkg-widget`
3. **Note which files** contain the widget code

### Remove from Extra Files:

For each file that has the widget (except your chosen one):

1. **Open the file**
2. **Find and DELETE this entire section:**
   ```liquid
   {%- if cart.item_count > 0 -%}
     <!-- DKG Token Holder Widget -->
     <div class="cart-drawer__dkg-widget" style="...">
       ...
     </div>
   {%- endif -%}
   ```
3. **Save the file**

---

## 📋 Common Duplicate Scenarios

### Scenario 1: Widget in Both Files

**Files with widget:**
- ✅ `snippets/cart-drawer.liquid`
- ❌ `snippets/cart-summary.liquid` ← Remove from here

**Result:** Widget appears twice in drawer popup

**Fix:** Remove from `cart-summary.liquid`

---

### Scenario 2: Widget in All Cart Files

**Files with widget:**
- ✅ `snippets/cart-drawer.liquid`
- ❌ `snippets/cart-summary.liquid`
- ❌ `sections/main-cart.liquid`
- ❌ `sections/main-cart-footer.liquid`

**Result:** Widget appears 3-4 times in various places

**Fix:** Remove from all files except `cart-drawer.liquid`

---

### Scenario 3: Widget Only in cart-summary.liquid

**Files with widget:**
- ❌ `snippets/cart-summary.liquid` only

**Result:** Widget appears in BOTH drawer AND full cart page

**This is actually OK if intentional!** But the widget will initialize twice.

**Better Fix:** Move to `cart-drawer.liquid` for drawer only

---

## 🎯 Final Recommendation

### For Your Store:

**Add widget to:** `snippets/cart-drawer.liquid` ONLY

**Code:**
```liquid
<div class="cart-drawer__summary">
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

**Do NOT add to any other files!**

---

## 🧪 Testing for Duplicates

After adding the widget:

1. **Open cart drawer** (click cart icon)
   - Count widgets: Should be **1**

2. **Visit full cart page** (go to `/cart`)
   - Count widgets: Should be **0** or **1**

3. **If you see multiple widgets:**
   - Search for `dkg-widget` in theme files
   - Remove from extra files
   - Keep in `cart-drawer.liquid` only

---

## ⚠️ What Happens with Duplicates?

### Technical Issues:
- ❌ Widget script loads multiple times
- ❌ Multiple MetaMask popups
- ❌ Confusing user experience
- ❌ Potential conflicts with discount application

### Visual Issues:
- ❌ Looks unprofessional
- ❌ Takes up too much space
- ❌ Customers get confused

---

## ✅ Checklist

Before you're done:

- [ ] Widget added to `snippets/cart-drawer.liquid`
- [ ] Widget NOT in `snippets/cart-summary.liquid`
- [ ] Widget NOT in `sections/main-cart.liquid`
- [ ] Widget NOT in any other cart-related files
- [ ] Tested cart drawer - widget appears once
- [ ] Searched theme for `dkg-widget` - only 1 file found

---

## 🎉 Summary

**Add the widget to ONE file only:**
- ⭐ **Recommended:** `snippets/cart-drawer.liquid`

**This gives you:**
- Widget in cart drawer popup ✅
- No duplicates ✅
- Easy to maintain ✅
- Clean user experience ✅

**If you previously added it to other files, remove it!** 🧹

