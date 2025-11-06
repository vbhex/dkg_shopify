# Quick Start Guide

Get your DKG Shopify App up and running in 10 minutes!

## Prerequisites
- Node.js 18+
- Shopify Partner account
- DKG token contract address
- Ethereum RPC URL (get from Infura/Alchemy)

## 1. Setup (2 minutes)

```bash
cd /deakee/dkg_shopify

# Install dependencies
npm install && cd client && npm install && cd ..

# Setup environment
cp .env.example .env
```

Edit `.env`:
```env
SHOPIFY_API_KEY=your_key
SHOPIFY_API_SECRET=your_secret
SHOPIFY_APP_URL=https://your-ngrok-url.ngrok.io
DKG_TOKEN_CONTRACT_ADDRESS=0xYourTokenAddress
ETHEREUM_RPC_URL=https://mainnet.infura.io/v3/YOUR_PROJECT_ID
DATABASE_URL=file:./dev.db
SESSION_SECRET=$(openssl rand -base64 32)
```

## 2. Database (1 minute)

```bash
npm run prisma:generate
npm run prisma:migrate
```

## 3. ngrok for Development (2 minutes)

```bash
# Install ngrok
npm install -g ngrok

# Start tunnel
ngrok http 8080

# Copy the HTTPS URL and update .env
# SHOPIFY_APP_URL=https://abc123.ngrok.io
```

## 4. Create Shopify App (3 minutes)

1. Go to [Shopify Partners](https://partners.shopify.com/)
2. Apps → Create app → Create manually
3. Fill in:
   - Name: DKG Token Discounts
   - App URL: `https://abc123.ngrok.io`
   - Redirect: `https://abc123.ngrok.io/api/auth/callback`
4. Copy API Key and Secret to `.env`

## 5. Start Development (2 minutes)

```bash
# Terminal 1: Backend
npm run dev

# Terminal 2: Frontend  
npm run client:dev
```

## 6. Install & Test

1. In Shopify Partners, click "Test your app"
2. Select your development store
3. Click "Install app"
4. Create your first discount rule!

## Common Commands

```bash
# Development
npm run dev                  # Start backend
npm run client:dev          # Start frontend

# Database
npm run prisma:generate     # Generate Prisma client
npm run prisma:migrate      # Run migrations
npx prisma studio           # View database

# Production
npm run client:build        # Build frontend
NODE_ENV=production npm start  # Start production server
```

## Widget Integration

Add to your Shopify theme:

```html
<script src="https://your-domain.com/storefront/dkg-widget.js"></script>
<div id="dkg-token-widget" data-shop="{{ shop.permanent_domain }}"></div>
```

## Troubleshooting

### "OAuth redirect failed"
→ Check ngrok is running and URL matches in `.env` and Shopify

### "Database error"
→ Run `npm run prisma:migrate`

### "Token balance returns 0"
→ Verify token contract address and RPC URL

## Next Steps

1. ✅ App installed and working
2. 📝 Read [SETUP.md](SETUP.md) for detailed guide
3. 🚀 Read [DEPLOYMENT.md](DEPLOYMENT.md) for production
4. 📖 Check [API.md](docs/API.md) for API details

## Need Help?

- 📚 Full docs in [README.md](README.md)
- 🐛 Issues: Open on GitHub
- 💬 Contact: support@deakeegroup.com

---

**Estimated Time**: 10-15 minutes for complete setup

