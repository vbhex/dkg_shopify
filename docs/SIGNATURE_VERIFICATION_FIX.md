# Signature Verification Fix

## Issue

After successfully implementing the disconnect wallet feature and fixing CORS, users could reconnect their wallet and MetaMask would prompt for signature. However, after signing the message, the verification failed with:

```
POST https://group.deakee.com/api/verify/signature 400 (Bad Request)
Error: Invalid signature
```

## Root Cause

The verification process has two steps:

### Step 1: Initialize Session (`/api/verify/init`)
1. Generate a random `sessionToken` (64-character hex)
2. Generate a random `nonce` (32-character hex)
3. Create verification session in database
4. Generate message to sign: `"Sign this message... Nonce: {nonce}..."`
5. Return `sessionToken` and `message` to client

### Step 2: Verify Signature (`/api/verify/signature`)
1. Receive `sessionToken` and `signature` from client
2. Look up session in database
3. **❌ Problem**: Reconstruct the original message to verify signature
4. Verify that the signature matches the message

### The Bug

In the original code, the `nonce` was **not stored** in the database:

```javascript
// Step 1: /api/verify/init
const nonce = crypto.randomBytes(16).toString('hex');
await prisma.verificationSession.create({
  data: {
    sessionToken,
    walletAddress: walletAddress.toLowerCase(),
    // ❌ nonce was NOT stored!
    chainId: chainId || 1,
    // ...
  },
});
const message = generateVerificationMessage(shop, nonce);
```

Then in step 2, the code tried to reconstruct the nonce:

```javascript
// Step 2: /api/verify/signature
const session = await prisma.verificationSession.findUnique({
  where: { sessionToken },
});

// ❌ WRONG: Tried to extract nonce from sessionToken
const nonce = sessionToken.substring(0, 32);
const message = generateVerificationMessage(session.shopDomain, nonce);

// This message doesn't match the original, so signature verification fails!
```

The `sessionToken` and `nonce` are **two separate random values**. You can't extract one from the other. This caused the reconstructed message to be different from the original, making signature verification fail.

## Solution

### 1. Add `nonce` Field to Database Schema

Updated `prisma/schema.prisma`:

```prisma
model VerificationSession {
  id                String   @id @default(uuid())
  shopDomain        String
  sessionToken      String   @unique
  walletAddress     String?
  nonce             String   // ✅ Store the nonce!
  chainId           Int?
  status            String   @default("pending")
  expiresAt         DateTime
  createdAt         DateTime @default(now())
  
  @@index([sessionToken])
  @@index([shopDomain])
}
```

### 2. Store Nonce During Initialization

Updated `/api/verify/init`:

```javascript
const sessionToken = crypto.randomBytes(32).toString('hex');
const nonce = crypto.randomBytes(16).toString('hex');

await prisma.verificationSession.create({
  data: {
    shopDomain: shop,
    sessionToken,
    walletAddress: walletAddress.toLowerCase(),
    nonce, // ✅ Store the nonce for later
    chainId: chainId || 1,
    status: 'pending',
    expiresAt,
  },
});
```

### 3. Use Stored Nonce During Verification

Updated `/api/verify/signature`:

```javascript
const session = await prisma.verificationSession.findUnique({
  where: { sessionToken },
});

// ✅ Use the stored nonce from the database
const message = blockchainService.generateVerificationMessage(
  session.shopDomain, 
  session.nonce  // ✅ Correct!
);

const isValid = blockchainService.verifySignature(
  message,
  signature,
  session.walletAddress
);
```

## Verification Flow (Fixed)

```
┌─────────────────────────────────────────────────────────────────┐
│ Step 1: Initialize (/api/verify/init)                          │
├─────────────────────────────────────────────────────────────────┤
│ Client sends:                                                    │
│   - shop: "test.myshopify.com"                                  │
│   - walletAddress: "0x1234..."                                  │
│   - chainId: 11155111                                           │
│                                                                  │
│ Server generates:                                               │
│   - sessionToken: "d6c484cb..." (random 64 chars)              │
│   - nonce: "68395668..." (random 32 chars)                     │
│                                                                  │
│ Server stores in DB:                                            │
│   ✅ sessionToken                                               │
│   ✅ walletAddress                                              │
│   ✅ nonce (IMPORTANT!)                                         │
│   ✅ shopDomain                                                 │
│   ✅ status: "pending"                                          │
│   ✅ expiresAt: now + 15 min                                    │
│                                                                  │
│ Server returns to client:                                       │
│   - sessionToken                                                │
│   - message: "Sign this message... Nonce: 68395668..."         │
│   - expiresAt                                                   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ Client signs message with MetaMask                              │
│   - User approves signature in MetaMask popup                   │
│   - MetaMask returns signature                                  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ Step 2: Verify Signature (/api/verify/signature)               │
├─────────────────────────────────────────────────────────────────┤
│ Client sends:                                                    │
│   - sessionToken: "d6c484cb..."                                 │
│   - signature: "0xabc123..."                                    │
│                                                                  │
│ Server looks up session:                                        │
│   - Find session by sessionToken                                │
│   - Get walletAddress: "0x1234..."                             │
│   - Get nonce: "68395668..." ✅ From database!                 │
│   - Get shopDomain: "test.myshopify.com"                       │
│                                                                  │
│ Server reconstructs message:                                    │
│   - message = "Sign this message... Nonce: 68395668..."        │
│   - ✅ This matches the original message!                      │
│                                                                  │
│ Server verifies signature:                                      │
│   - recoveredAddress = ethers.verifyMessage(message, signature) │
│   - if (recoveredAddress === walletAddress) ✅ Valid!          │
│                                                                  │
│ Server updates session:                                         │
│   - status: "verified"                                          │
│                                                                  │
│ Server returns:                                                 │
│   - success: true                                               │
│   - walletAddress: "0x1234..."                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Database Changes

### Migration Applied

```sql
-- Migration: 20251112081432_add_nonce_to_verification_session
ALTER TABLE `VerificationSession` ADD COLUMN `nonce` VARCHAR(191) NOT NULL;
```

### Before Fix
```
VerificationSession
├─ id
├─ sessionToken
├─ walletAddress
├─ shopDomain
├─ chainId
├─ status
├─ expiresAt
└─ createdAt
```

### After Fix
```
VerificationSession
├─ id
├─ sessionToken
├─ walletAddress
├─ nonce          ← ✅ Added!
├─ shopDomain
├─ chainId
├─ status
├─ expiresAt
└─ createdAt
```

## Files Modified

1. **`prisma/schema.prisma`**
   - Added `nonce String` field to `VerificationSession` model

2. **`server/routes/verify.js`**
   - Updated `/api/verify/init` to store `nonce` in database
   - Updated `/api/verify/signature` to use stored `nonce` instead of trying to extract it from `sessionToken`

## Testing

### Test 1: Initialize Session
```bash
curl -X POST https://group.deakee.com/api/verify/init \
  -H "Content-Type: application/json" \
  -d '{"shop":"test.myshopify.com","walletAddress":"0x123...","chainId":11155111}'
```

**Expected Response:**
```json
{
  "sessionToken": "d6c484cb4f600ccf...",
  "message": "Sign this message to verify your wallet ownership for test.myshopify.com.\n\nNonce: 683956681ba228f6...\n\nThis will not trigger any blockchain transaction or cost any gas fees.",
  "expiresAt": "2025-11-12T08:32:04.405Z"
}
```

### Test 2: Verify Signature (in browser)

1. Connect wallet in widget
2. MetaMask prompts for signature
3. Sign message
4. Verification succeeds ✅
5. Token balance is checked
6. Eligible discounts are displayed

## Impact

### Before Fix
- ❌ Signature verification always failed
- ❌ Users couldn't complete wallet verification
- ❌ No discounts could be applied

### After Fix
- ✅ Signature verification works correctly
- ✅ Users can complete wallet verification
- ✅ Token balance is checked
- ✅ Eligible discounts are displayed
- ✅ Discount codes can be generated

## Security Notes

### Why This is Secure

1. **Random Nonces**: Each verification session gets a unique nonce
2. **Session Expiry**: Sessions expire after 15 minutes
3. **One-time Use**: Sessions can only be verified once (status changes to "verified")
4. **Cryptographic Verification**: Uses Ethereum's ECDSA signature verification
5. **Address Binding**: Signature must come from the wallet address that initiated the session

### What's Protected

- **Replay Attacks**: Each nonce is unique and used only once
- **Session Hijacking**: SessionToken is random and stored server-side
- **Impersonation**: Must have private key to sign the message correctly
- **Timing Attacks**: Sessions expire automatically

## Future Enhancements

Potential improvements:

1. **Cleanup Old Sessions**: Delete expired sessions periodically
2. **Rate Limiting**: Limit verification attempts per wallet/shop
3. **Logging**: Track failed verification attempts for security monitoring
4. **Multi-chain Support**: Already prepared with `chainId` field

## Summary

The signature verification fix resolves a critical bug where the nonce wasn't being stored in the database, causing message reconstruction to fail during signature verification. By storing the nonce during initialization and retrieving it during verification, the system can now correctly verify wallet signatures and complete the authentication flow.

