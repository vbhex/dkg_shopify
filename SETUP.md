# Setup Guide

This guide will walk you through setting up the DKG Shopify App from scratch.

## Step 1: System Requirements

Ensure your system has:
- Node.js v18+ and npm
- Git
- A text editor (VS Code recommended)
- MetaMask browser extension (for testing)

## Step 2: Get Required Credentials

### Shopify Partner Account

1. Go to https://partners.shopify.com/
2. Sign up or log in
3. Create a new development store for testing

### Create Shopify App

1. In Partner Dashboard, click **Apps** → **Create app**
2. Choose **Create app manually**
3. Fill in:
   - App name: `DKG Token Discounts`
   - App URL: `https://localhost:8080` (for development)
4. Save the **API Key** and **API Secret Key**

### Configure App URLs

In your app settings, add:
- **App URL**: `https://your-ngrok-url.ngrok.io` or production URL
- **Allowed redirection URL(s)**: `https://your-ngrok-url.ngrok.io/api/auth/callback`

### Blockchain RPC Provider

Choose one:

#### Option 1: Infura (Recommended)
1. Go to https://infura.io/
2. Sign up and create a new project
3. Copy the Ethereum Mainnet endpoint
4. Format: `https://mainnet.infura.io/v3/YOUR_PROJECT_ID`

#### Option 2: Alchemy
1. Go to https://www.alchemy.com/
2. Sign up and create a new app
3. Select Ethereum Mainnet
4. Copy the HTTPS endpoint

#### Option 3: Public RPC (Not recommended for production)
- Ethereum: `https://eth.llamarpc.com`
- Polygon: `https://polygon-rpc.com`
- BSC: `https://bsc-dataseed1.binance.org`

### DKG Token Contract

Get the official DKG token contract address:
- Ethereum: `0xYourDKGTokenAddress`
- Polygon: `0xYourDKGTokenAddress` (if deployed)
- BSC: `0xYourDKGTokenAddress` (if deployed)

## Step 3: Project Setup

### Clone or Create Project

```bash
# If not already created
cd /deakee/dkg_shopify

# Install dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
```

### Configure Environment

```bash
# Copy example env file
cp .env.example .env

# Edit .env file
nano .env  # or use your preferred editor
```

Fill in your `.env` file:

```env
# From Shopify Partner Dashboard
SHOPIFY_API_KEY=your_api_key_here
SHOPIFY_API_SECRET=your_api_secret_here
SHOPIFY_API_SCOPES=write_products,write_customers,write_discounts,read_orders
SHOPIFY_APP_URL=https://your-ngrok-url.ngrok.io
SHOPIFY_API_VERSION=2024-01

# Server
PORT=8080
NODE_ENV=development
HOST=localhost

# Database (SQLite for development)
DATABASE_URL=file:./dev.db

# Blockchain
DKG_TOKEN_CONTRACT_ADDRESS=0xYourActualTokenAddress
ETHEREUM_RPC_URL=https://mainnet.infura.io/v3/YOUR_PROJECT_ID
POLYGON_RPC_URL=https://polygon-rpc.com
BSC_RPC_URL=https://bsc-dataseed1.binance.org

# Generate a random string for session secret
SESSION_SECRET=$(openssl rand -base64 32)
```

## Step 4: Database Setup

```bash
# Generate Prisma client
npm run prisma:generate

# Create and run migrations
npm run prisma:migrate

# Verify database
npx prisma studio  # Opens database browser at localhost:5555
```

## Step 5: Development with ngrok (Required for Shopify)

Shopify requires HTTPS for OAuth. Use ngrok for local development:

```bash
# Install ngrok
# Download from https://ngrok.com/download or use:
npm install -g ngrok

# Start ngrok tunnel
ngrok http 8080

# Copy the HTTPS URL (e.g., https://abc123.ngrok.io)
```

Update your `.env`:
```env
SHOPIFY_APP_URL=https://abc123.ngrok.io
```

Update Shopify app settings with the same URL:
- App URL: `https://abc123.ngrok.io`
- Redirect URL: `https://abc123.ngrok.io/api/auth/callback`

## Step 6: Start Development Servers

Open two terminal windows:

### Terminal 1: Backend
```bash
npm run dev
```

Should see:
```
🚀 Server running on port 8080
📦 Environment: development
🏪 Shopify App URL: https://abc123.ngrok.io
```

### Terminal 2: Frontend
```bash
npm run client:dev
```

Should see:
```
VITE v4.5.0  ready in 500 ms
➜  Local:   http://localhost:3000/
```

## Step 7: Install App in Test Store

1. In Shopify Partner Dashboard, go to your app
2. Click **Test your app**
3. Select your development store
4. Click **Install app**
5. Approve permissions
6. You should be redirected to the app dashboard

## Step 8: Verify Installation

### Check Backend
```bash
# Health check
curl http://localhost:8080/api/health

# Should return:
{"status":"ok","timestamp":"..."}
```

### Check Database
```bash
# Open Prisma Studio
npx prisma studio

# Verify "Shop" table has your store entry
```

### Check Frontend
1. Navigate to the app in your Shopify admin
2. Should see the DKG Token Discounts dashboard
3. Try creating a discount rule

## Step 9: Test Token Verification

### Setup Test Environment

1. Install MetaMask in your browser
2. Switch to test network (Goerli or Sepolia)
3. Get test tokens from faucet
4. Deploy test ERC-20 token or use existing test token

### Test Widget

1. Create a test discount rule in admin
2. Open `storefront/index.html` in browser
3. Update the shop parameter to your test store
4. Click "Connect Wallet"
5. Should see MetaMask popup
6. Sign message
7. Check if discounts appear

## Step 10: Troubleshooting Setup

### Issue: OAuth redirect fails
**Solution**: 
- Verify ngrok is running
- Check SHOPIFY_APP_URL matches ngrok URL
- Update redirect URLs in Shopify Partner Dashboard

### Issue: Database connection fails
**Solution**:
```bash
# Delete database and recreate
rm prisma/dev.db
npm run prisma:migrate
```

### Issue: MetaMask not connecting
**Solution**:
- Check browser console for errors
- Verify MetaMask is unlocked
- Try refreshing page

### Issue: Token balance returns 0
**Solution**:
- Verify token contract address is correct
- Check you're on the right network
- Confirm wallet actually has tokens
- Check RPC URL is working: `curl $ETHEREUM_RPC_URL`

### Issue: "Module not found" errors
**Solution**:
```bash
# Reinstall dependencies
rm -rf node_modules
rm package-lock.json
npm install

# Reinstall client dependencies
cd client
rm -rf node_modules
rm package-lock.json
npm install
```

## Step 11: Production Checklist

Before deploying to production:

- [ ] Update all environment variables for production
- [ ] Use production RPC endpoints (not free tier)
- [ ] Set up proper database (PostgreSQL recommended)
- [ ] Configure proper SSL certificate
- [ ] Set up error monitoring (Sentry, LogRocket)
- [ ] Test all discount flows thoroughly
- [ ] Set up automated backups
- [ ] Configure rate limiting
- [ ] Review security best practices
- [ ] Test with real DKG token contract
- [ ] Submit app for Shopify review (if public)

## Next Steps

1. Read the [README.md](README.md) for usage documentation
2. Check [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment
3. Review the API documentation
4. Customize the widget styling
5. Add additional features as needed

## Getting Help

If you encounter issues:
1. Check the console logs (backend and frontend)
2. Verify all environment variables are set correctly
3. Test each component individually
4. Check the Troubleshooting section in README.md
5. Open an issue on GitHub with detailed logs

---

**Setup Time Estimate**: 30-60 minutes for first-time setup

