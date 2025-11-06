# API Reference

Complete API documentation for the DKG Shopify App.

## Base URL

```
Development: http://localhost:8080
Production: https://your-domain.com
```

## Authentication

### Public Endpoints
No authentication required. Used by storefront widget.

### Protected Endpoints
Require Shopify session authentication. Used by admin panel.

**Header**: `Authorization: Bearer {shopifyToken}`

---

## Public API Endpoints

### 1. Initialize Verification

Start the wallet verification process.

**Endpoint**: `POST /api/verify/init`

**Request Body**:
```json
{
  "shop": "example-store.myshopify.com",
  "walletAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb2",
  "chainId": 1
}
```

**Parameters**:
- `shop` (string, required): Shopify store domain
- `walletAddress` (string, required): Ethereum wallet address
- `chainId` (number, optional): Blockchain network ID (default: 1)
  - `1` = Ethereum Mainnet
  - `137` = Polygon
  - `56` = Binance Smart Chain

**Response** (200 OK):
```json
{
  "sessionToken": "abc123...",
  "message": "Sign this message to verify...",
  "expiresAt": "2024-01-15T12:30:00Z"
}
```

**Error Responses**:
- `400`: Invalid parameters
- `500`: Server error

---

### 2. Verify Signature

Verify wallet ownership through signature.

**Endpoint**: `POST /api/verify/signature`

**Request Body**:
```json
{
  "sessionToken": "abc123...",
  "signature": "0x1234..."
}
```

**Parameters**:
- `sessionToken` (string, required): Token from init endpoint
- `signature` (string, required): Signed message from wallet

**Response** (200 OK):
```json
{
  "success": true,
  "walletAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb2"
}
```

**Error Responses**:
- `400`: Invalid signature or expired session
- `404`: Session not found
- `500`: Server error

---

### 3. Check Token Balance

Check token balance and get eligible discounts.

**Endpoint**: `POST /api/verify/token-balance`

**Request Body**:
```json
{
  "shop": "example-store.myshopify.com",
  "walletAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb2",
  "sessionToken": "abc123..."
}
```

**Parameters**:
- `shop` (string, required): Shopify store domain
- `walletAddress` (string, required): Verified wallet address
- `sessionToken` (string, required): Verified session token

**Response** (200 OK):
```json
{
  "eligibleDiscounts": [
    {
      "id": "discount-rule-id",
      "name": "DKG Holder 10% Off",
      "description": "Exclusive discount for DKG holders",
      "discountType": "percentage",
      "discountValue": 10,
      "maxDiscountAmount": 50,
      "tokenBalance": "1500.5",
      "requiredTokens": "100"
    }
  ],
  "walletAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb2"
}
```

**Error Responses**:
- `400`: Missing parameters
- `401`: Invalid or unverified session
- `404`: Shop not found
- `500`: Server error

---

### 4. Apply Discount

Generate a discount code for customer.

**Endpoint**: `POST /api/apply-discount`

**Request Body**:
```json
{
  "shop": "example-store.myshopify.com",
  "discountRuleId": "discount-rule-id",
  "walletAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb2",
  "sessionToken": "abc123..."
}
```

**Response** (200 OK):
```json
{
  "discountCode": "DKG-abc12345-1234567890",
  "discountRule": {
    "id": "discount-rule-id",
    "name": "DKG Holder 10% Off",
    "discountType": "percentage",
    "discountValue": 10,
    "maxDiscountAmount": 50
  }
}
```

**Error Responses**:
- `400`: Usage limit reached or discount expired
- `401`: Invalid session
- `404`: Shop or discount rule not found
- `500`: Server error

---

### 5. Health Check

Check if API is running.

**Endpoint**: `GET /api/health`

**Response** (200 OK):
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T12:00:00Z"
}
```

---

## Protected API Endpoints

All protected endpoints require Shopify authentication.

### 6. Get Shop Info

Get current shop information.

**Endpoint**: `GET /api/shop`

**Headers**: 
```
Authorization: Bearer {shopifyToken}
```

**Response** (200 OK):
```json
{
  "shop": {
    "domain": "example-store.myshopify.com",
    "installedAt": "2024-01-01T10:00:00Z"
  }
}
```

---

### 7. List Discount Rules

Get all discount rules for the shop.

**Endpoint**: `GET /api/discounts`

**Headers**: 
```
Authorization: Bearer {shopifyToken}
```

**Response** (200 OK):
```json
{
  "discountRules": [
    {
      "id": "rule-id-1",
      "name": "DKG Holder 10% Off",
      "description": "For holders with 100+ tokens",
      "isActive": true,
      "minTokenAmount": "100",
      "tokenContractAddress": "0x...",
      "chainId": 1,
      "discountType": "percentage",
      "discountValue": 10,
      "maxDiscountAmount": 50,
      "usageLimit": null,
      "usageCount": 5,
      "perCustomerLimit": 1,
      "startsAt": null,
      "endsAt": null,
      "createdAt": "2024-01-01T10:00:00Z",
      "updatedAt": "2024-01-10T15:30:00Z"
    }
  ]
}
```

---

### 8. Create Discount Rule

Create a new discount rule.

**Endpoint**: `POST /api/discounts`

**Headers**: 
```
Authorization: Bearer {shopifyToken}
Content-Type: application/json
```

**Request Body**:
```json
{
  "name": "VIP DKG Holder Discount",
  "description": "20% off for holders with 1000+ tokens",
  "minTokenAmount": "1000",
  "tokenContractAddress": "0x...",
  "chainId": 1,
  "discountType": "percentage",
  "discountValue": 20,
  "maxDiscountAmount": 100,
  "usageLimit": 1000,
  "perCustomerLimit": 1,
  "startsAt": "2024-01-15T00:00:00Z",
  "endsAt": "2024-12-31T23:59:59Z"
}
```

**Required Fields**:
- `name`: Rule name
- `minTokenAmount`: Minimum tokens required
- `tokenContractAddress`: Token contract address
- `discountType`: "percentage" or "fixed"
- `discountValue`: Discount amount (0-100 for percentage, or dollar amount)

**Optional Fields**:
- `description`: Rule description
- `chainId`: Chain ID (default: 1)
- `maxDiscountAmount`: Maximum discount cap for percentage discounts
- `usageLimit`: Total usage limit
- `perCustomerLimit`: Per customer usage limit
- `startsAt`: Start date/time
- `endsAt`: End date/time
- `appliesToProducts`: Array of product IDs
- `appliesToCollections`: Array of collection IDs

**Response** (200 OK):
```json
{
  "discountRule": {
    "id": "new-rule-id",
    "name": "VIP DKG Holder Discount",
    // ... all fields
  }
}
```

**Error Responses**:
- `400`: Missing required fields or invalid values
- `404`: Shop not found
- `500`: Server error

---

### 9. Update Discount Rule

Update an existing discount rule.

**Endpoint**: `PUT /api/discounts/:id`

**Headers**: 
```
Authorization: Bearer {shopifyToken}
Content-Type: application/json
```

**Request Body**: (any fields to update)
```json
{
  "isActive": false,
  "discountValue": 15
}
```

**Response** (200 OK):
```json
{
  "discountRule": {
    // Updated rule
  }
}
```

**Error Responses**:
- `404`: Rule not found or doesn't belong to shop
- `500`: Server error

---

### 10. Delete Discount Rule

Delete a discount rule.

**Endpoint**: `DELETE /api/discounts/:id`

**Headers**: 
```
Authorization: Bearer {shopifyToken}
```

**Response** (200 OK):
```json
{
  "success": true
}
```

**Error Responses**:
- `404`: Rule not found
- `500`: Server error

---

### 11. Get Statistics

Get discount usage statistics.

**Endpoint**: `GET /api/discounts/stats`

**Headers**: 
```
Authorization: Bearer {shopifyToken}
```

**Response** (200 OK):
```json
{
  "stats": {
    "totalRules": 5,
    "activeRules": 3,
    "totalVerifiedCustomers": 150,
    "totalDiscountsUsed": 450,
    "totalDiscountAmount": 2500.50
  }
}
```

---

## Webhook Endpoints

Shopify webhooks are automatically registered.

### APP_UNINSTALLED

**Endpoint**: `POST /api/webhooks/app-uninstalled`

**Action**: Deactivates shop in database

### ORDERS_CREATE

**Endpoint**: `POST /api/webhooks/orders-create`

**Action**: Tracks discount usage (future implementation)

---

## Error Response Format

All errors follow this format:

```json
{
  "error": "Human-readable error message"
}
```

**Common HTTP Status Codes**:
- `200`: Success
- `400`: Bad Request (invalid parameters)
- `401`: Unauthorized (invalid or missing auth)
- `404`: Not Found
- `500`: Internal Server Error

---

## Rate Limits

Current implementation has no rate limits, but it's recommended to implement them in production:

- **Public endpoints**: 100 requests per minute per IP
- **Protected endpoints**: 1000 requests per minute per shop

---

## CORS

CORS is configured to allow:
- Development: `http://localhost:3000`, `http://localhost:8080`
- Production: Your configured `SHOPIFY_APP_URL`

---

## SDKs and Libraries

### JavaScript/Node.js Example

```javascript
// Initialize verification
const initResponse = await fetch('https://your-app.com/api/verify/init', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    shop: 'example.myshopify.com',
    walletAddress: '0x...',
    chainId: 1
  })
});
const { sessionToken, message } = await initResponse.json();

// Sign message with wallet
const signature = await ethereum.request({
  method: 'personal_sign',
  params: [message, walletAddress]
});

// Verify signature
const verifyResponse = await fetch('https://your-app.com/api/verify/signature', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ sessionToken, signature })
});

// Check balance
const balanceResponse = await fetch('https://your-app.com/api/verify/token-balance', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ shop, walletAddress, sessionToken })
});
const { eligibleDiscounts } = await balanceResponse.json();
```

---

## Testing

### Using curl

```bash
# Health check
curl https://your-app.com/api/health

# Initialize verification
curl -X POST https://your-app.com/api/verify/init \
  -H "Content-Type: application/json" \
  -d '{"shop":"example.myshopify.com","walletAddress":"0x...","chainId":1}'
```

### Using Postman

Import the following collection URL:
```
https://your-app.com/api/postman-collection.json
```

---

**Need Help?**
- Check the troubleshooting section in README.md
- Review example code in the storefront widget
- Open an issue on GitHub

