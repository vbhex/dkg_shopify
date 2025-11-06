import { DeliveryMethod } from '@shopify/shopify-api';

/**
 * Register webhooks for the app
 */
export const registerWebhooks = async (shopify) => {
  // App uninstalled webhook
  await shopify.webhooks.addHandlers({
    APP_UNINSTALLED: {
      deliveryMethod: DeliveryMethod.Http,
      callbackUrl: '/api/webhooks/app-uninstalled',
      callback: async (topic, shop, body, webhookId) => {
        console.log(`App uninstalled from shop: ${shop}`);
        
        // Deactivate shop
        const prisma = (await import('./db.js')).default;
        await prisma.shop.update({
          where: { shopDomain: shop },
          data: { isActive: false },
        });
      },
    },
    
    // Order creation webhook (to track discount usage)
    ORDERS_CREATE: {
      deliveryMethod: DeliveryMethod.Http,
      callbackUrl: '/api/webhooks/orders-create',
      callback: async (topic, shop, body, webhookId) => {
        const order = JSON.parse(body);
        console.log(`New order created: ${order.id}`);
        
        // Check if order has DKG discount applied
        // This would be implemented based on your discount code format
        // You can track usage here if needed
      },
    },
  });
};

