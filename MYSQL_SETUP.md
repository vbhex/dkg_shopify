# MySQL Configuration for DKG Shopify App

## Create the Database

First, create a database in MySQL:

```bash
# Connect to MySQL
mysql -u root -p

# Or if you have a specific user
mysql -u your_mysql_user -p
```

```sql
-- Create database
CREATE DATABASE dkg_shopify CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create user (optional, if you want a dedicated user)
CREATE USER 'dkg_user'@'localhost' IDENTIFIED BY 'your_secure_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON dkg_shopify.* TO 'dkg_user'@'localhost';
FLUSH PRIVILEGES;

-- Exit
EXIT;
```

## Update .env File

Your DATABASE_URL format for MySQL:

```env
# Option 1: Using root user
DATABASE_URL="mysql://root:your_root_password@localhost:3306/dkg_shopify"

# Option 2: Using dedicated user (recommended)
DATABASE_URL="mysql://dkg_user:your_secure_password@localhost:3306/dkg_shopify"

# Option 3: Using existing backend database user (if applicable)
DATABASE_URL="mysql://your_backend_user:password@localhost:3306/dkg_shopify"
```

## Complete .env Example

```env
# Shopify Configuration
SHOPIFY_API_KEY=your_api_key
SHOPIFY_API_SECRET=your_secret
SHOPIFY_API_SCOPES=write_products,write_customers,write_discounts,read_orders
SHOPIFY_APP_URL=https://group.deakee.com
SHOPIFY_API_VERSION=2024-01

# Server
PORT=6100
NODE_ENV=production
HOST=localhost

# Database - MySQL
DATABASE_URL="mysql://root:your_password@localhost:3306/dkg_shopify"

# Blockchain
DKG_TOKEN_CONTRACT_ADDRESS=0xYourDKGTokenAddress
ETHEREUM_RPC_URL=https://mainnet.infura.io/v3/your_project_id
POLYGON_RPC_URL=https://polygon-rpc.com
BSC_RPC_URL=https://bsc-dataseed1.binance.org

# Session Secret
SESSION_SECRET=your_random_session_secret
```

## Run Migrations

After updating the .env file:

```bash
cd /deakee/dkg_shopify

# Remove SQLite files if they exist
rm -f dev.db prisma/dev.db

# Delete old Prisma client
rm -rf node_modules/.prisma

# Generate Prisma client for MySQL
npm run prisma:generate

# Run migrations
npm run prisma:migrate deploy

# Or create a new migration
npm run prisma:migrate dev --name init
```

## Verify

Check the database:

```bash
mysql -u root -p

USE dkg_shopify;
SHOW TABLES;
DESCRIBE Shop;
EXIT;
```

You should see all the tables created:
- Shop
- DiscountRule
- VerifiedCustomer
- CustomerDiscountUsage
- VerificationSession
- _prisma_migrations

