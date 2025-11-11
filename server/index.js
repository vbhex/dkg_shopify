import '@shopify/shopify-api/adapters/node';
import express from 'express';
import { config } from 'dotenv';

// Load environment variables FIRST
config({ path: '/deakee/dkg_shopify/.env' });

import { shopify } from './shopify.js';
import prisma from './db.js';
import verifyRoutes from './routes/verify.js';
import discountRoutes from './routes/discounts.js';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(compression());
app.use(cookieParser());
app.use(express.json());

// CORS configuration
app.use(
  cors({
    origin: process.env.NODE_ENV === 'production' 
      ? [process.env.SHOPIFY_APP_URL] 
      : ['http://localhost:3000', 'http://localhost:8080'],
    credentials: true,
  })
);

// Request logging in development
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// Shopify webhook handling
app.post(
  shopify.config.webhooks.path,
  express.text({ type: '*/*' }),
  async (req, res) => {
    try {
      await shopify.webhooks.process({
        rawBody: req.body,
        rawRequest: req,
        rawResponse: res,
      });
    } catch (error) {
      console.error('Error processing webhook:', error);
    }
  }
);

// OAuth routes
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  async (req, res) => {
    // Store shop information after successful OAuth
    const session = res.locals.shopify.session;
    
    await prisma.shop.upsert({
      where: { shopDomain: session.shop },
      update: {
        accessToken: session.accessToken,
        scope: session.scope,
        isActive: true,
      },
      create: {
        shopDomain: session.shop,
        accessToken: session.accessToken,
        scope: session.scope,
        isActive: true,
      },
    });

    // Redirect to app
    res.redirect(`/?shop=${session.shop}&host=${req.query.host}`);
  }
);

// Public API routes (no authentication required)
app.use('/api/verify', verifyRoutes);

// Protected API routes (require Shopify authentication)
app.use('/api/discounts', discountRoutes);

// Shop info endpoint
app.get('/api/shop', async (req, res) => {
  try {
    const session = res.locals.shopify.session;
    const shop = await prisma.shop.findUnique({
      where: { shopDomain: session.shop },
    });

    if (!shop) {
      return res.status(404).json({ error: 'Shop not found' });
    }

    res.json({
      shop: {
        domain: shop.shopDomain,
        installedAt: shop.installedAt,
      },
    });
  } catch (error) {
    console.error('Error fetching shop info:', error);
    res.status(500).json({ error: 'Failed to fetch shop info' });
  }
});

// Apply discount code endpoint (called from storefront)
app.post('/api/apply-discount', async (req, res) => {
  try {
    const { shop, discountRuleId, walletAddress, sessionToken } = req.body;

    if (!shop || !discountRuleId || !walletAddress || !sessionToken) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Verify session
    const session = await prisma.verificationSession.findUnique({
      where: { sessionToken },
    });

    if (!session || session.status !== 'verified') {
      return res.status(401).json({ error: 'Invalid or unverified session' });
    }

    // Get shop and discount rule
    const shopData = await prisma.shop.findUnique({
      where: { shopDomain: shop },
    });

    if (!shopData) {
      return res.status(404).json({ error: 'Shop not found' });
    }

    const discountRule = await prisma.discountRule.findFirst({
      where: {
        id: discountRuleId,
        shopId: shopData.id,
        isActive: true,
      },
    });

    if (!discountRule) {
      return res.status(404).json({ error: 'Discount rule not found or inactive' });
    }

    // Check if discount is valid (time-based)
    const now = new Date();
    if (discountRule.startsAt && now < discountRule.startsAt) {
      return res.status(400).json({ error: 'Discount not yet active' });
    }
    if (discountRule.endsAt && now > discountRule.endsAt) {
      return res.status(400).json({ error: 'Discount has expired' });
    }

    // Check usage limits
    if (discountRule.usageLimit && discountRule.usageCount >= discountRule.usageLimit) {
      return res.status(400).json({ error: 'Discount usage limit reached' });
    }

    // Get or create verified customer
    const verifiedCustomer = await prisma.verifiedCustomer.upsert({
      where: {
        shopId_walletAddress: {
          shopId: shopData.id,
          walletAddress: walletAddress.toLowerCase(),
        },
      },
      update: {
        lastVerifiedAt: now,
      },
      create: {
        shopId: shopData.id,
        walletAddress: walletAddress.toLowerCase(),
        chainId: session.chainId,
        tokenBalance: '0',
      },
    });

    // Check per-customer usage limit
    if (discountRule.perCustomerLimit) {
      const customerUsageCount = await prisma.customerDiscountUsage.count({
        where: {
          discountRuleId: discountRule.id,
          verifiedCustomerId: verifiedCustomer.id,
        },
      });

      if (customerUsageCount >= discountRule.perCustomerLimit) {
        return res.status(400).json({ error: 'Customer usage limit reached' });
      }
    }

    // Generate a unique discount code for this customer
    const discountCode = `DKG-${discountRule.id.substring(0, 8)}-${Date.now()}`;

    res.json({
      discountCode,
      discountRule: {
        id: discountRule.id,
        name: discountRule.name,
        discountType: discountRule.discountType,
        discountValue: discountRule.discountValue,
        maxDiscountAmount: discountRule.maxDiscountAmount,
      },
    });
  } catch (error) {
    console.error('Error applying discount:', error);
    res.status(500).json({ error: 'Failed to apply discount' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve storefront widget files (MUST be before client build catch-all)
const storefrontPath = path.join(__dirname, '../storefront');
app.use('/storefront', express.static(storefrontPath, {
  maxAge: '1h',
  immutable: true,
}));

// Serve static files from client build in production
if (process.env.NODE_ENV === 'production') {
  const clientBuildPath = path.join(__dirname, '../client/dist');
  app.use(express.static(clientBuildPath));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error' 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📦 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🏪 Shopify App URL: ${process.env.SHOPIFY_APP_URL}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing HTTP server');
  await prisma.$disconnect();
  process.exit(0);
});

