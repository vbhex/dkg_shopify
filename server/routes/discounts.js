import express from 'express';
import prisma from '../db.js';
import { shopify } from '../shopify.js';

const router = express.Router();

/**
 * Get all discount rules for a shop
 * GET /api/discounts?shop=example.myshopify.com
 */
router.get('/', async (req, res) => {
  try {
    // Get shop from query parameter or session
    const shopDomain = req.query.shop || res.locals.shopify?.session?.shop;
    
    if (!shopDomain) {
      return res.status(400).json({ error: 'Shop parameter is required' });
    }

    const shop = await prisma.shop.findUnique({
      where: { shopDomain },
      include: {
        discountRules: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!shop) {
      // Return empty array if shop doesn't exist yet
      return res.json({ discountRules: [] });
    }

    res.json({ discountRules: shop.discountRules });
  } catch (error) {
    console.error('Error fetching discount rules:', error);
    res.status(500).json({ error: 'Failed to fetch discount rules' });
  }
});

/**
 * Create a new discount rule
 * POST /api/discounts?shop=example.myshopify.com
 */
router.post('/', async (req, res) => {
  try {
    const shopDomain = req.query.shop || res.locals.shopify?.session?.shop;
    
    if (!shopDomain) {
      return res.status(400).json({ error: 'Shop parameter is required' });
    }

    let shop = await prisma.shop.findUnique({
      where: { shopDomain },
    });

    if (!shop) {
      // Create shop if it doesn't exist
      shop = await prisma.shop.create({
        data: { shopDomain },
      });
    }

    const {
      name,
      description,
      minTokenAmount,
      chainId,
      discountType,
      discountValue,
      maxDiscountAmount,
      appliesToProducts,
      appliesToCollections,
      usageLimit,
      perCustomerLimit,
      startsAt,
      endsAt,
    } = req.body;

    // Use token contract address from environment variable
    const tokenContractAddress = process.env.DKG_TOKEN_CONTRACT_ADDRESS;

    // Validation
    if (!name || !minTokenAmount || !discountType || !discountValue) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!tokenContractAddress) {
      return res.status(500).json({ error: 'Token contract address not configured' });
    }

    if (discountType !== 'percentage' && discountType !== 'fixed') {
      return res.status(400).json({ error: 'Invalid discount type' });
    }

    if (discountType === 'percentage' && (discountValue < 0 || discountValue > 100)) {
      return res.status(400).json({ error: 'Percentage must be between 0 and 100' });
    }

    const discountRule = await prisma.discountRule.create({
      data: {
        shopId: shop.id,
        name,
        description,
        minTokenAmount: minTokenAmount.toString(),
        tokenContractAddress: tokenContractAddress.toLowerCase(),
        chainId: chainId || 11155111, // Default to Ethereum Sepolia
        discountType,
        discountValue: parseFloat(discountValue),
        maxDiscountAmount: maxDiscountAmount ? parseFloat(maxDiscountAmount) : null,
        appliesToProducts: appliesToProducts ? JSON.stringify(appliesToProducts) : null,
        appliesToCollections: appliesToCollections ? JSON.stringify(appliesToCollections) : null,
        usageLimit: usageLimit ? parseInt(usageLimit) : null,
        perCustomerLimit: perCustomerLimit ? parseInt(perCustomerLimit) : null,
        startsAt: startsAt ? new Date(startsAt) : null,
        endsAt: endsAt ? new Date(endsAt) : null,
      },
    });

    res.json({ discountRule });
  } catch (error) {
    console.error('Error creating discount rule:', error);
    res.status(500).json({ error: 'Failed to create discount rule' });
  }
});

/**
 * Update a discount rule
 * PUT /api/discounts/:id?shop=example.myshopify.com
 */
router.put('/:id', async (req, res) => {
  try {
    const shopDomain = req.query.shop || res.locals.shopify?.session?.shop;
    const { id } = req.params;

    if (!shopDomain) {
      return res.status(400).json({ error: 'Shop parameter is required' });
    }

    const shop = await prisma.shop.findUnique({
      where: { shopDomain },
    });

    if (!shop) {
      return res.status(404).json({ error: 'Shop not found' });
    }

    // Verify the rule belongs to this shop
    const existingRule = await prisma.discountRule.findFirst({
      where: { id, shopId: shop.id },
    });

    if (!existingRule) {
      return res.status(404).json({ error: 'Discount rule not found' });
    }

    const updateData = {};
    const allowedFields = [
      'name',
      'description',
      'isActive',
      'minTokenAmount',
      'discountType',
      'discountValue',
      'maxDiscountAmount',
      'appliesToProducts',
      'appliesToCollections',
      'usageLimit',
      'perCustomerLimit',
      'startsAt',
      'endsAt',
    ];

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        if (field === 'minTokenAmount') {
          updateData[field] = req.body[field].toString();
        } else if (field === 'appliesToProducts' || field === 'appliesToCollections') {
          updateData[field] = req.body[field] ? JSON.stringify(req.body[field]) : null;
        } else if (field === 'startsAt' || field === 'endsAt') {
          updateData[field] = req.body[field] ? new Date(req.body[field]) : null;
        } else if (field === 'discountValue' || field === 'maxDiscountAmount') {
          updateData[field] = req.body[field] ? parseFloat(req.body[field]) : null;
        } else if (field === 'usageLimit' || field === 'perCustomerLimit') {
          updateData[field] = req.body[field] ? parseInt(req.body[field]) : null;
        } else {
          updateData[field] = req.body[field];
        }
      }
    }

    const discountRule = await prisma.discountRule.update({
      where: { id },
      data: updateData,
    });

    res.json({ discountRule });
  } catch (error) {
    console.error('Error updating discount rule:', error);
    res.status(500).json({ error: 'Failed to update discount rule' });
  }
});

/**
 * Delete a discount rule
 * DELETE /api/discounts/:id?shop=example.myshopify.com
 */
router.delete('/:id', async (req, res) => {
  try {
    const shopDomain = req.query.shop || res.locals.shopify?.session?.shop;
    const { id } = req.params;

    if (!shopDomain) {
      return res.status(400).json({ error: 'Shop parameter is required' });
    }

    const shop = await prisma.shop.findUnique({
      where: { shopDomain },
    });

    if (!shop) {
      return res.status(404).json({ error: 'Shop not found' });
    }

    // Verify the rule belongs to this shop
    const existingRule = await prisma.discountRule.findFirst({
      where: { id, shopId: shop.id },
    });

    if (!existingRule) {
      return res.status(404).json({ error: 'Discount rule not found' });
    }

    await prisma.discountRule.delete({
      where: { id },
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting discount rule:', error);
    res.status(500).json({ error: 'Failed to delete discount rule' });
  }
});

/**
 * Get discount statistics
 * GET /api/discounts/stats
 */
router.get('/stats', async (req, res) => {
  try {
    // For now, get shop from query parameter since we removed auth middleware
    const shopDomain = req.query.shop;
    
    if (!shopDomain) {
      return res.json({
        stats: {
          totalRules: 0,
          activeRules: 0,
          totalVerifiedCustomers: 0,
          totalDiscountsUsed: 0,
          totalDiscountAmount: 0,
        },
      });
    }

    const shop = await prisma.shop.findUnique({
      where: { shopDomain },
      include: {
        discountRules: {
          include: {
            customerUsage: true,
          },
        },
        verifiedCustomers: true,
      },
    });

    if (!shop) {
      // Return empty stats if shop doesn't exist yet
      return res.json({
        stats: {
          totalRules: 0,
          activeRules: 0,
          totalVerifiedCustomers: 0,
          totalDiscountsUsed: 0,
          totalDiscountAmount: 0,
        },
      });
    }

    const stats = {
      totalRules: shop.discountRules.length,
      activeRules: shop.discountRules.filter((r) => r.isActive).length,
      totalVerifiedCustomers: shop.verifiedCustomers.length,
      totalDiscountsUsed: shop.discountRules.reduce(
        (sum, rule) => sum + rule.customerUsage.length,
        0
      ),
      totalDiscountAmount: shop.discountRules.reduce(
        (sum, rule) =>
          sum +
          rule.customerUsage.reduce((s, usage) => s + usage.discountAmount, 0),
        0
      ),
    };

    res.json({ stats });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

export default router;

