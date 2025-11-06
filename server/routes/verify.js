import express from 'express';
import blockchainService from '../services/blockchain.js';
import prisma from '../db.js';
import crypto from 'crypto';

const router = express.Router();

/**
 * Initialize verification session
 * POST /api/verify/init
 */
router.post('/init', async (req, res) => {
  try {
    const { shop, walletAddress, chainId } = req.body;

    if (!shop || !walletAddress) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    if (!blockchainService.isValidAddress(walletAddress)) {
      return res.status(400).json({ error: 'Invalid wallet address' });
    }

    // Generate session token and nonce
    const sessionToken = crypto.randomBytes(32).toString('hex');
    const nonce = crypto.randomBytes(16).toString('hex');

    // Create verification session
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
    
    await prisma.verificationSession.create({
      data: {
        shopDomain: shop,
        sessionToken,
        walletAddress: walletAddress.toLowerCase(),
        chainId: chainId || 1,
        status: 'pending',
        expiresAt,
      },
    });

    // Generate message for signing
    const message = blockchainService.generateVerificationMessage(shop, nonce);

    res.json({
      sessionToken,
      message,
      expiresAt,
    });
  } catch (error) {
    console.error('Error initializing verification:', error);
    res.status(500).json({ error: 'Failed to initialize verification' });
  }
});

/**
 * Verify wallet signature
 * POST /api/verify/signature
 */
router.post('/signature', async (req, res) => {
  try {
    const { sessionToken, signature } = req.body;

    if (!sessionToken || !signature) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Get verification session
    const session = await prisma.verificationSession.findUnique({
      where: { sessionToken },
    });

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    if (session.status !== 'pending') {
      return res.status(400).json({ error: 'Session already processed' });
    }

    if (new Date() > session.expiresAt) {
      await prisma.verificationSession.update({
        where: { id: session.id },
        data: { status: 'expired' },
      });
      return res.status(400).json({ error: 'Session expired' });
    }

    // Reconstruct the message
    const nonce = sessionToken.substring(0, 32);
    const message = blockchainService.generateVerificationMessage(session.shopDomain, nonce);

    // Verify signature
    const isValid = blockchainService.verifySignature(
      message,
      signature,
      session.walletAddress
    );

    if (!isValid) {
      await prisma.verificationSession.update({
        where: { id: session.id },
        data: { status: 'failed' },
      });
      return res.status(400).json({ error: 'Invalid signature' });
    }

    // Update session status
    await prisma.verificationSession.update({
      where: { id: session.id },
      data: { status: 'verified' },
    });

    res.json({
      success: true,
      walletAddress: session.walletAddress,
    });
  } catch (error) {
    console.error('Error verifying signature:', error);
    res.status(500).json({ error: 'Failed to verify signature' });
  }
});

/**
 * Check token balance and eligibility
 * POST /api/verify/token-balance
 */
router.post('/token-balance', async (req, res) => {
  try {
    const { shop, walletAddress, sessionToken } = req.body;

    if (!shop || !walletAddress || !sessionToken) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Verify session
    const session = await prisma.verificationSession.findUnique({
      where: { sessionToken },
    });

    if (!session || session.status !== 'verified') {
      return res.status(401).json({ error: 'Invalid or unverified session' });
    }

    // Get shop data
    const shopData = await prisma.shop.findUnique({
      where: { shopDomain: shop },
      include: {
        discountRules: {
          where: { isActive: true },
        },
      },
    });

    if (!shopData) {
      return res.status(404).json({ error: 'Shop not found' });
    }

    // Check token balance for each active discount rule
    const eligibleDiscounts = [];

    for (const rule of shopData.discountRules) {
      try {
        const verification = await blockchainService.verifyTokenOwnership(
          walletAddress,
          rule.tokenContractAddress,
          rule.minTokenAmount,
          rule.chainId
        );

        if (verification.hasEnoughTokens) {
          // Check usage limits
          const usageCount = await prisma.customerDiscountUsage.count({
            where: {
              discountRuleId: rule.id,
              verifiedCustomer: {
                walletAddress: walletAddress.toLowerCase(),
              },
            },
          });

          const canUse = !rule.perCustomerLimit || usageCount < rule.perCustomerLimit;

          if (canUse) {
            eligibleDiscounts.push({
              id: rule.id,
              name: rule.name,
              description: rule.description,
              discountType: rule.discountType,
              discountValue: rule.discountValue,
              maxDiscountAmount: rule.maxDiscountAmount,
              tokenBalance: verification.balance,
              requiredTokens: verification.required,
            });
          }
        }
      } catch (error) {
        console.error(`Error checking rule ${rule.id}:`, error);
        // Continue with other rules
      }
    }

    // Store or update verified customer
    await prisma.verifiedCustomer.upsert({
      where: {
        shopId_walletAddress: {
          shopId: shopData.id,
          walletAddress: walletAddress.toLowerCase(),
        },
      },
      update: {
        lastVerifiedAt: new Date(),
        chainId: session.chainId,
      },
      create: {
        shopId: shopData.id,
        walletAddress: walletAddress.toLowerCase(),
        chainId: session.chainId,
        tokenBalance: '0', // Will be updated with actual balance
      },
    });

    res.json({
      eligibleDiscounts,
      walletAddress,
    });
  } catch (error) {
    console.error('Error checking token balance:', error);
    res.status(500).json({ error: 'Failed to check token balance' });
  }
});

export default router;

