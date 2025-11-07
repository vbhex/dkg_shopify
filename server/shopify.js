import { shopifyApp } from '@shopify/shopify-app-express';
import { SQLiteSessionStorage } from '@shopify/shopify-app-session-storage-sqlite';
import { LATEST_API_VERSION } from '@shopify/shopify-api';
import { config } from 'dotenv';

// Load environment variables
config({ path: '/deakee/dkg_shopify/.env' });

const sessionStorage = new SQLiteSessionStorage('./shopify-sessions.db');

// Configure Shopify app
export const shopify = shopifyApp({
  api: {
    apiKey: process.env.SHOPIFY_API_KEY,
    apiSecretKey: process.env.SHOPIFY_API_SECRET,
    scopes: process.env.SHOPIFY_API_SCOPES?.split(',') || [],
    hostName: process.env.SHOPIFY_APP_URL?.replace(/https?:\/\//, '') || '',
    apiVersion: LATEST_API_VERSION,
    isEmbeddedApp: true,
    billing: undefined, // Add billing configuration if needed
  },
  auth: {
    path: '/api/auth',
    callbackPath: '/api/auth/callback',
  },
  webhooks: {
    path: '/api/webhooks',
  },
  sessionStorage,
});
