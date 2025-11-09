# DKG Shopify App - Token-Gated Discounts

A **multi-tenant** Shopify app that enables store owners to offer exclusive discounts to DeakeeGroup Token (DKG) holders. Each merchant who installs the app can create and manage their own independent discount rules. Customers can verify their wallet ownership and automatically receive discounts based on their token balance.

## 🎯 Multi-Tenant Architecture

**Important:** This app is designed for multiple independent Shopify stores:
- ✅ Each merchant manages their own discount rules
- ✅ Complete data isolation between stores
- ✅ Shared DKG token contract (configured by app owner)
- ✅ Will be embedded in each merchant's Shopify Admin (production)

👉 **[Read Architecture Documentation](docs/ARCHITECTURE.md)** for full details on multi-tenant design  
👉 **[Read Embedded App Guide](docs/EMBEDDED_APP.md)** to understand production deployment

## 🌟 Features

- **Token-Gated Discounts**: Create discount rules based on DKG token ownership
- **Multi-Tenant**: Each Shopify store manages independent discount rules
- **Ethereum Sepolia Network**: Currently deployed on Ethereum testnet
- **Flexible Discount Types**: Percentage or fixed amount discounts
- **Usage Limits**: Set total and per-customer usage limits
- **Wallet Verification**: Secure Web3 wallet verification using MetaMask
- **Beautiful Storefront Widget**: Embeddable widget for customer-facing token verification
- **Admin Dashboard**: Easy-to-use interface for managing discount rules (per store)
- **Analytics**: Track discount usage and customer engagement (per store)

## 🏗️ Current Setup

**Demo Mode:** `https://group.deakee.com`
- Testing and demonstration interface
- Manual shop parameter: `?shop=your-store.myshopify.com`
- All features functional for testing

**Production Mode:** (To be implemented)
- Embedded in Shopify Admin
- Automatic OAuth authentication
- Available in Shopify App Store
- See [Embedded App Guide](docs/EMBEDDED_APP.md)

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Development](#development)
- [Deployment](#deployment)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Troubleshooting](#troubleshooting)

## 🔧 Prerequisites

Before installing the app, ensure you have:

- Node.js (v18 or higher)
- npm or yarn
- A Shopify Partner account
- A Shopify test store
- Ethereum RPC access (Infura, Alchemy, or your own node)
- DKG token contract address

## 📦 Installation

### 1. Clone and Setup

```bash
# Navigate to the project directory
cd dkg_shopify

# Install backend dependencies
npm install

# Install frontend dependencies
cd client && npm install && cd ..

# Copy environment template
cp .env.example .env
```

### 2. Configure Environment Variables

Edit `.env` file with your configuration:

```env
# Shopify App Credentials (from Shopify Partner Dashboard)
SHOPIFY_API_KEY=your_shopify_api_key
SHOPIFY_API_SECRET=your_shopify_api_secret
SHOPIFY_API_SCOPES=write_products,write_customers,write_discounts,read_orders
SHOPIFY_APP_URL=https://your-app-url.com
SHOPIFY_API_VERSION=2024-01

# Server Configuration
PORT=8080
NODE_ENV=development
HOST=localhost

# Database
DATABASE_URL=file:./dev.db

# Blockchain Configuration
DKG_TOKEN_CONTRACT_ADDRESS=0xYourDKGTokenContractAddress
ETHEREUM_RPC_URL=https://mainnet.infura.io/v3/your-project-id
POLYGON_RPC_URL=https://polygon-rpc.com
BSC_RPC_URL=https://bsc-dataseed1.binance.org

# Session Configuration
SESSION_SECRET=your_random_session_secret_here
```

### 3. Initialize Database

```bash
# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate
```

### 4. Create Shopify App

1. Go to [Shopify Partner Dashboard](https://partners.shopify.com/)
2. Click "Apps" → "Create app"
3. Choose "Create app manually"
4. Fill in app details:
   - **App name**: DKG Token Discounts
   - **App URL**: `https://your-domain.com`
   - **Allowed redirection URL(s)**: `https://your-domain.com/api/auth/callback`

5. Copy the API key and API secret to your `.env` file

6. Configure OAuth scopes:
   - `write_products`
   - `write_customers`
   - `write_discounts`
   - `read_orders`

## 🚀 Development

### Start Development Server

```bash
# Terminal 1: Start backend server
npm run dev

# Terminal 2: Start frontend dev server
npm run client:dev
```

The app will be available at:
- Backend: `http://localhost:8080`
- Frontend: `http://localhost:3000`

### Test with Shopify Test Store

1. In Shopify Partner Dashboard, go to your app
2. Click "Select store" and choose your test store
3. Click "Install app"
4. The OAuth flow will begin

## 📦 Deployment

### Production Build

```bash
# Build frontend
npm run client:build

# Start production server
NODE_ENV=production npm start
```

### Deployment Options

#### Option 1: Deploy to Railway

1. Create account at [Railway](https://railway.app/)
2. Create new project from GitHub repo
3. Add environment variables
4. Railway will auto-deploy

#### Option 2: Deploy to Heroku

```bash
# Install Heroku CLI
# Login to Heroku
heroku login

# Create app
heroku create your-app-name

# Add environment variables
heroku config:set SHOPIFY_API_KEY=your_key
heroku config:set SHOPIFY_API_SECRET=your_secret
# ... add all other env vars

# Deploy
git push heroku main
```

#### Option 3: Deploy to VPS (DigitalOcean, AWS, etc.)

```bash
# SSH into your server
ssh user@your-server-ip

# Clone repository
git clone your-repo-url
cd dkg_shopify

# Install dependencies
npm install
cd client && npm install && cd ..

# Build frontend
npm run client:build

# Setup PM2 for process management
npm install -g pm2
pm2 start server/index.js --name dkg-shopify
pm2 save
pm2 startup

# Setup Nginx reverse proxy
# Configure SSL with Let's Encrypt
```

## 💡 Usage

### For Store Owners

#### 1. Install the App

1. Navigate to your Shopify admin
2. Install the DKG Token Discounts app
3. Complete OAuth authorization

#### 2. Create Discount Rules

1. Go to "Discount Rules" in the app
2. Click "Create Rule"
3. Configure:
   - **Name**: Discount rule name
   - **Token Contract Address**: DKG token address
   - **Blockchain Network**: Select chain (Ethereum, Polygon, BSC)
   - **Minimum Token Amount**: Required tokens for eligibility
   - **Discount Type**: Percentage or fixed amount
   - **Discount Value**: Amount/percentage off
   - **Usage Limits**: Optional total and per-customer limits
   - **Validity Period**: Optional start/end dates

#### 3. Add Widget to Storefront

Add this code to your theme (e.g., in `product.liquid` or `cart.liquid`):

```html
<script src="https://your-app-url.com/storefront/dkg-widget.js"></script>
<div id="dkg-token-widget" data-shop="{{ shop.permanent_domain }}"></div>
```

### For Customers

#### 1. Connect Wallet

1. Visit store with DKG widget
2. Click "Connect Wallet"
3. Approve MetaMask connection
4. Sign verification message (no gas fees)

#### 2. Receive Discount

1. App checks token balance automatically
2. If eligible, discount codes are displayed
3. Click "Apply This Discount"
4. Copy discount code
5. Use at checkout

## 📚 API Documentation

### Public Endpoints

#### Initialize Verification
```http
POST /api/verify/init
Content-Type: application/json

{
  "shop": "store.myshopify.com",
  "walletAddress": "0x...",
  "chainId": 1
}
```

#### Verify Signature
```http
POST /api/verify/signature
Content-Type: application/json

{
  "sessionToken": "token...",
  "signature": "0x..."
}
```

#### Check Token Balance
```http
POST /api/verify/token-balance
Content-Type: application/json

{
  "shop": "store.myshopify.com",
  "walletAddress": "0x...",
  "sessionToken": "token..."
}
```

### Protected Endpoints (Require Shopify Auth)

#### Get Discount Rules
```http
GET /api/discounts
Authorization: Bearer {shopifyToken}
```

#### Create Discount Rule
```http
POST /api/discounts
Authorization: Bearer {shopifyToken}
Content-Type: application/json

{
  "name": "DKG Holder Discount",
  "minTokenAmount": "100",
  "tokenContractAddress": "0x...",
  "chainId": 1,
  "discountType": "percentage",
  "discountValue": 10
}
```

## 🔍 Troubleshooting

### Common Issues

#### "MetaMask not found"
- Ensure MetaMask extension is installed
- Try refreshing the page

#### "Invalid token contract address"
- Verify the contract address is correct
- Check you're on the right blockchain network

#### "Insufficient tokens"
- Customer doesn't have enough DKG tokens
- Check minimum token requirement in discount rule

#### "Session expired"
- Verification session is valid for 15 minutes
- Customer needs to reconnect wallet

### Database Issues

```bash
# Reset database
rm prisma/dev.db
npm run prisma:migrate

# View database
npx prisma studio
```

### Debugging

Enable debug mode:
```env
NODE_ENV=development
```

Check logs:
```bash
# Backend logs
npm run dev

# View specific log file (if using PM2)
pm2 logs dkg-shopify
```

## 🏗️ Architecture

```
dkg_shopify/
├── server/                 # Backend application
│   ├── index.js           # Main server file
│   ├── shopify.js         # Shopify app configuration
│   ├── db.js              # Database client
│   ├── webhooks.js        # Webhook handlers
│   ├── routes/            # API routes
│   │   ├── verify.js      # Token verification endpoints
│   │   └── discounts.js   # Discount management endpoints
│   └── services/          # Business logic
│       └── blockchain.js  # Blockchain interaction service
├── client/                # Frontend React app
│   ├── src/
│   │   ├── App.jsx        # Main app component
│   │   ├── main.jsx       # Entry point
│   │   └── pages/         # Page components
│   │       ├── Dashboard.jsx
│   │       ├── DiscountRules.jsx
│   │       └── Analytics.jsx
│   └── package.json
├── storefront/            # Customer-facing widget
│   ├── dkg-widget.js      # Widget JavaScript
│   └── index.html         # Demo page
├── prisma/                # Database schema
│   └── schema.prisma      # Database models
└── package.json           # Backend dependencies
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support, please:
- Open an issue on GitHub
- Contact: support@deakeegroup.com
- Documentation: [Full docs](https://docs.deakeegroup.com)

## 🎉 Acknowledgments

- Shopify for their excellent app development platform
- Ethers.js for blockchain interactions
- The DKG token community

---

**Made with ❤️ by DeakeeGroup**

