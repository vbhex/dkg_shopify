# Customer Experience Flow

## What Customers See

### Step 1: Widget Appears on Store
```
┌────────────────────────────────────────┐
│  🪙 DKG Token Holder Discounts         │
│  Connect your wallet to unlock         │
│  exclusive discounts                   │
│                                        │
│  ┌──────────────────────────────────┐ │
│  │      Connect Wallet              │ │
│  └──────────────────────────────────┘ │
└────────────────────────────────────────┘
```
- **Location:** Appears on any page where you added the widget code
- **Size:** Compact card (max 400px wide), centered
- **Design:** Purple gradient background, white text

---

### Step 2: Customer Clicks "Connect Wallet"
```
┌────────────────────────────────────────┐
│  🪙 DKG Token Holder Discounts         │
│  Connect your wallet to unlock         │
│  exclusive discounts                   │
│                                        │
│  ┌──────────────────────────────────┐ │
│  │      Connecting...               │ │
│  └──────────────────────────────────┘ │
└────────────────────────────────────────┘
```
**MetaMask popup appears:**
- Requests permission to connect
- Shows store website URL
- Customer clicks "Connect"

---

### Step 3: Signature Request
```
┌────────────────────────────────────────┐
│  🪙 DKG Token Holder Discounts         │
│  Connect your wallet to unlock         │
│  exclusive discounts                   │
│                                        │
│  ┌──────────────────────────────────┐ │
│  │  Please sign message...          │ │
│  └──────────────────────────────────┘ │
└────────────────────────────────────────┘
```
**MetaMask popup appears again:**
- Requests signature to verify wallet ownership
- Message: "Verify wallet ownership for DKG Token Holder discounts"
- **NO gas fees** (it's just a signature, not a transaction)
- Customer clicks "Sign"

---

### Step 4A: Eligible for Discounts ✅
```
┌────────────────────────────────────────┐
│  🪙 DKG Token Holder Discounts         │
│  Connect your wallet to unlock         │
│  exclusive discounts                   │
│                                        │
│  ┌──────────────────────────────────┐ │
│  │      Verified ✓                  │ │
│  └──────────────────────────────────┘ │
│                                        │
│  ┌──────────────────────────────────┐ │
│  │ ✓ Verification Successful!       │ │
│  │ Your wallet has been verified    │ │
│  │ and you have 2 discount(s)       │ │
│  │ available.                       │ │
│  └──────────────────────────────────┘ │
│                                        │
│  🎉 You're eligible for these          │
│  discounts:                            │
│                                        │
│  ┌──────────────────────────────────┐ │
│  │ Gold Member Discount             │ │
│  │ 20% OFF                          │ │
│  │ For holders of 100+ DKG tokens   │ │
│  │ ┌──────────────────────────────┐ │ │
│  │ │  Apply This Discount         │ │ │
│  │ └──────────────────────────────┘ │ │
│  └──────────────────────────────────┘ │
│                                        │
│  ┌──────────────────────────────────┐ │
│  │ Silver Member Discount           │ │
│  │ 10% OFF                          │ │
│  │ For holders of 50+ DKG tokens    │ │
│  │ ┌──────────────────────────────┐ │ │
│  │ │  Apply This Discount         │ │ │
│  │ └──────────────────────────────┘ │ │
│  └──────────────────────────────────┘ │
│                                        │
│  Connected: 0x1234...5678              │
└────────────────────────────────────────┘
```

---

### Step 4B: Not Eligible ❌
```
┌────────────────────────────────────────┐
│  🪙 DKG Token Holder Discounts         │
│  Connect your wallet to unlock         │
│  exclusive discounts                   │
│                                        │
│  ┌──────────────────────────────────┐ │
│  │      Verified ✓                  │ │
│  └──────────────────────────────────┘ │
│                                        │
│  ┌──────────────────────────────────┐ │
│  │ ✓ Wallet Verified                │ │
│  │ Unfortunately, you don't have    │ │
│  │ enough DKG tokens for any        │ │
│  │ discounts.                       │ │
│  └──────────────────────────────────┘ │
│                                        │
│  Connected: 0x1234...5678              │
└────────────────────────────────────────┘
```

---

### Step 5: Customer Applies Discount
**Customer clicks "Apply This Discount" button**

```
┌────────────────────────────────────────┐
│  🪙 DKG Token Holder Discounts         │
│  Connect your wallet to unlock         │
│  exclusive discounts                   │
│                                        │
│  ┌──────────────────────────────────┐ │
│  │      Verified ✓                  │ │
│  └──────────────────────────────────┘ │
│                                        │
│  ┌──────────────────────────────────┐ │
│  │ 🎉 Discount Applied!             │ │
│  │ Use this code at checkout:       │ │
│  │ ┌──────────────────────────────┐ │ │
│  │ │      DKG-A7X9K               │ │ │
│  │ └──────────────────────────────┘ │ │
│  │ ┌──────────────────────────────┐ │ │
│  │ │       Copy Code              │ │ │
│  │ └──────────────────────────────┘ │ │
│  └──────────────────────────────────┘ │
│                                        │
│  Discount: 20% OFF                     │
└────────────────────────────────────────┘
```

---

### Step 6: Use at Checkout
**Customer proceeds to checkout:**

1. **Copy the discount code** (clicks "Copy Code" button)
2. **Go to cart/checkout page**
3. **Paste code** in the "Discount code" field
4. **Apply discount**
5. **See price reduction** immediately

```
Shopify Checkout Page
─────────────────────────
Subtotal:        $100.00
Discount (DKG-A7X9K): -$20.00  ← 20% off applied!
─────────────────────────
Total:           $80.00
```

---

## Technical Flow Behind the Scenes

```
┌─────────────┐
│  Customer   │
│   Browser   │
└──────┬──────┘
       │
       │ 1. Load widget
       ↓
┌──────────────────┐
│  dkg-widget.js   │ (from https://group.deakee.com/storefront/)
│  • Renders UI    │
│  • Handles clicks│
└────────┬─────────┘
         │
         │ 2. Connect wallet
         ↓
┌──────────────────┐
│    MetaMask      │
│  • Request perm. │
│  • Sign message  │
└────────┬─────────┘
         │
         │ 3. API calls
         ↓
┌─────────────────────────────────┐
│  DKG Shopify App Server         │
│  (https://group.deakee.com)     │
│                                 │
│  POST /api/verify/init          │
│  ← Create session, get message  │
│                                 │
│  POST /api/verify/signature     │
│  ← Verify signature             │
│                                 │
│  POST /api/verify/token-balance │
│  ← Check balance on blockchain  │
│  ← Return eligible discounts    │
│                                 │
│  POST /api/apply-discount       │
│  ← Create Shopify discount code │
│  ← Return code to customer      │
└──────────┬──────────────────────┘
           │
           │ 4. Blockchain check
           ↓
┌────────────────────────┐
│  Ethereum Sepolia      │
│  • Read token balance  │
│  • No transactions     │
│  • No gas fees         │
└────────────────────────┘
```

---

## Key Points for Store Owners

### ✅ What Works Automatically
- Widget appearance on pages where code is added
- Wallet connection and verification
- Token balance checking on Ethereum Sepolia
- Discount code generation
- Discount application at checkout

### 🔧 What You Control
- **Discount rules**: Min token amount, discount %, validity period
- **Widget placement**: Which pages to show the widget on
- **Token requirements**: Set different tiers (50 tokens = 10%, 100 tokens = 20%, etc.)
- **Usage limits**: How many times each discount can be used

### 📊 What You Can Track
- Number of verified customers (visit `https://group.deakee.com/analytics`)
- Total discounts applied
- Discount usage per rule
- Active discount rules

---

## Common Customer Questions

**Q: Why do I need to sign a message?**
A: This proves you own the wallet without revealing your private key. It's completely safe and free (no gas fees).

**Q: Can I use the same wallet on different devices?**
A: Yes! As long as you have MetaMask with the same wallet on both devices.

**Q: How long does the discount code last?**
A: Depends on the store's settings. Some discounts have expiration dates, others don't.

**Q: Can I share my discount code with friends?**
A: The code works for anyone, but it's tied to your wallet verification. If there's a per-customer limit, only you can use it.

**Q: Do I need ETH in my wallet?**
A: You need ETH for the blockchain network fee only during the verification signature (usually very small). The DKG tokens themselves are what qualify you for discounts.

**Q: What if I don't have enough DKG tokens?**
A: The widget will tell you clearly. You can purchase more DKG tokens to become eligible.

---

## Success Metrics

After implementation, you should see:

1. **Increased conversions** from DKG token holders
2. **Higher average order value** due to discount redemption
3. **Community engagement** as token holders share their discounts
4. **Data in admin panel**: Track verified customers and discount usage

All accessible at: `https://group.deakee.com` (for store owners with app installed)

