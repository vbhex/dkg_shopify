## ✅ Database Setup Complete!

Your MySQL database is ready:
- Database: `dkg_shopify`
- User: `jamesmonft`
- Tables created: Shop, DiscountRule, VerifiedCustomer, CustomerDiscountUsage, VerificationSession

## 📝 Next: Update .env with Your Credentials

Edit the .env file:
```bash
nano /deakee/dkg_shopify/.env
```

You need to update these values:

### 1. Shopify Credentials (from Partner Dashboard)
```env
SHOPIFY_API_KEY=your_actual_api_key_from_shopify
SHOPIFY_API_SECRET=your_actual_secret_from_shopify
```

### 2. DKG Token Contract Address
```env
DKG_TOKEN_CONTRACT_ADDRESS=0xYourActualDKGTokenContractAddress
```

### 3. Ethereum RPC URL (Get from Infura or Alchemy)
```env
ETHEREUM_RPC_URL=https://mainnet.infura.io/v3/your-actual-project-id
```

### 4. Generate Session Secret (keep the auto-generated one or create new)
```bash
openssl rand -base64 32
```

## Current .env Status:
✅ PORT=6100  
✅ DATABASE_URL (MySQL configured)  
✅ SHOPIFY_APP_URL=https://group.deakee.com  
⏳ SHOPIFY_API_KEY (needs your key)  
⏳ SHOPIFY_API_SECRET (needs your secret)  
⏳ DKG_TOKEN_CONTRACT_ADDRESS (needs token address)  
⏳ ETHEREUM_RPC_URL (needs your RPC URL)  

## After Updating .env:

1. **Install dependencies** (if not done):
   ```bash
   cd /deakee/dkg_shopify
   npm install
   cd client && npm install && cd ..
   ```

2. **Build frontend**:
   ```bash
   npm run client:build
   ```

3. **Start with PM2**:
   ```bash
   pm2 start server/index.js --name dkg-shopify
   pm2 save
   ```

4. **Check logs**:
   ```bash
   pm2 logs dkg-shopify
   ```

5. **Test**:
   ```bash
   curl https://group.deakee.com/api/health
   ```

