# Deployment Guide

This guide covers deploying the DKG Shopify App to production.

## Pre-Deployment Checklist

- [ ] All features tested in development
- [ ] Environment variables documented
- [ ] Database backup strategy planned
- [ ] SSL certificates ready
- [ ] Domain name configured
- [ ] Error monitoring set up
- [ ] Production RPC endpoints secured

## Deployment Options

### Option 1: Railway (Recommended for Quick Deploy)

**Pros**: Easy setup, auto-scaling, built-in SSL
**Cons**: Can be more expensive for high traffic

#### Steps:

1. **Create Railway Account**
   - Go to https://railway.app/
   - Sign up with GitHub

2. **Create New Project**
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli
   
   # Login
   railway login
   
   # Initialize project
   railway init
   ```

3. **Configure Environment**
   - In Railway dashboard, go to Variables
   - Add all environment variables from `.env`
   - Important variables:
     ```
     NODE_ENV=production
     SHOPIFY_API_KEY=your_key
     SHOPIFY_API_SECRET=your_secret
     SHOPIFY_APP_URL=https://your-app.up.railway.app
     DATABASE_URL=postgresql://...
     ETHEREUM_RPC_URL=your_production_rpc
     ```

4. **Add PostgreSQL**
   - In Railway dashboard, click "New"
   - Select "Database" → "PostgreSQL"
   - Railway will auto-generate DATABASE_URL

5. **Update Prisma for PostgreSQL**
   
   Edit `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"  // Changed from sqlite
     url      = env("DATABASE_URL")
   }
   ```

6. **Deploy**
   ```bash
   railway up
   ```

7. **Run Migrations**
   ```bash
   railway run npm run prisma:migrate deploy
   ```

8. **Update Shopify App URLs**
   - Go to Shopify Partner Dashboard
   - Update App URL and Redirect URL to Railway URL

---

### Option 2: Heroku

**Pros**: Well-documented, reliable
**Cons**: Paid dynos required for production

#### Steps:

1. **Install Heroku CLI**
   ```bash
   # macOS
   brew tap heroku/brew && brew install heroku
   
   # Ubuntu
   curl https://cli-assets.heroku.com/install.sh | sh
   ```

2. **Create Heroku App**
   ```bash
   heroku login
   heroku create dkg-shopify-app
   ```

3. **Add PostgreSQL**
   ```bash
   heroku addons:create heroku-postgresql:mini
   ```

4. **Configure Environment Variables**
   ```bash
   heroku config:set SHOPIFY_API_KEY=your_key
   heroku config:set SHOPIFY_API_SECRET=your_secret
   heroku config:set SHOPIFY_APP_URL=https://dkg-shopify-app.herokuapp.com
   heroku config:set NODE_ENV=production
   heroku config:set SESSION_SECRET=$(openssl rand -base64 32)
   heroku config:set ETHEREUM_RPC_URL=your_rpc_url
   heroku config:set DKG_TOKEN_CONTRACT_ADDRESS=0x...
   # Add all other variables
   ```

5. **Create Procfile**
   ```bash
   echo "web: npm start" > Procfile
   echo "release: npm run prisma:migrate deploy" >> Procfile
   ```

6. **Update package.json**
   Add to scripts:
   ```json
   {
     "scripts": {
       "heroku-postbuild": "npm run prisma:generate && npm run client:build"
     }
   }
   ```

7. **Deploy**
   ```bash
   git add .
   git commit -m "Prepare for Heroku deployment"
   git push heroku main
   ```

8. **Verify Deployment**
   ```bash
   heroku logs --tail
   heroku open
   ```

---

### Option 3: DigitalOcean Droplet (VPS)

**Pros**: Full control, cost-effective
**Cons**: More manual configuration

#### Steps:

1. **Create Droplet**
   - Go to DigitalOcean
   - Create Ubuntu 22.04 LTS droplet
   - Choose size based on expected traffic (minimum 2GB RAM)

2. **SSH into Server**
   ```bash
   ssh root@your-server-ip
   ```

3. **Install Dependencies**
   ```bash
   # Update system
   apt update && apt upgrade -y
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   apt install -y nodejs
   
   # Install PostgreSQL
   apt install -y postgresql postgresql-contrib
   
   # Install Nginx
   apt install -y nginx
   
   # Install PM2
   npm install -g pm2
   
   # Install certbot for SSL
   apt install -y certbot python3-certbot-nginx
   ```

4. **Setup PostgreSQL**
   ```bash
   sudo -u postgres psql
   
   CREATE DATABASE dkg_shopify;
   CREATE USER dkg_user WITH PASSWORD 'secure_password';
   GRANT ALL PRIVILEGES ON DATABASE dkg_shopify TO dkg_user;
   \q
   ```

5. **Clone and Setup App**
   ```bash
   # Create app directory
   mkdir -p /var/www/dkg-shopify
   cd /var/www/dkg-shopify
   
   # Clone repository
   git clone your-repo-url .
   
   # Install dependencies
   npm install
   cd client && npm install && cd ..
   
   # Build frontend
   npm run client:build
   ```

6. **Configure Environment**
   ```bash
   nano .env
   ```
   
   Add production variables:
   ```env
   NODE_ENV=production
   PORT=8080
   SHOPIFY_API_KEY=your_key
   SHOPIFY_API_SECRET=your_secret
   SHOPIFY_APP_URL=https://yourdomain.com
   DATABASE_URL=postgresql://dkg_user:secure_password@localhost:5432/dkg_shopify
   # ... other variables
   ```

7. **Run Migrations**
   ```bash
   npm run prisma:migrate deploy
   ```

8. **Setup PM2**
   ```bash
   # Start app
   pm2 start server/index.js --name dkg-shopify
   
   # Save PM2 configuration
   pm2 save
   
   # Setup startup script
   pm2 startup
   # Follow the instructions printed
   ```

9. **Configure Nginx**
   ```bash
   nano /etc/nginx/sites-available/dkg-shopify
   ```
   
   Add configuration:
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
   
       location / {
           proxy_pass http://localhost:8080;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```
   
   Enable site:
   ```bash
   ln -s /etc/nginx/sites-available/dkg-shopify /etc/nginx/sites-enabled/
   nginx -t
   systemctl restart nginx
   ```

10. **Setup SSL with Let's Encrypt**
    ```bash
    certbot --nginx -d yourdomain.com
    ```

11. **Setup Firewall**
    ```bash
    ufw allow 22
    ufw allow 80
    ufw allow 443
    ufw enable
    ```

---

### Option 4: AWS (Elastic Beanstalk)

**Pros**: Highly scalable, AWS ecosystem integration
**Cons**: More complex setup, potentially higher cost

#### Quick Steps:

1. Install EB CLI:
   ```bash
   pip install awsebcli
   ```

2. Initialize:
   ```bash
   eb init -p node.js dkg-shopify
   ```

3. Create environment:
   ```bash
   eb create dkg-shopify-env
   ```

4. Set environment variables:
   ```bash
   eb setenv SHOPIFY_API_KEY=your_key SHOPIFY_API_SECRET=your_secret
   ```

5. Deploy:
   ```bash
   eb deploy
   ```

Full AWS guide: See AWS documentation for detailed steps.

---

## Post-Deployment Steps

### 1. Verify Deployment

```bash
# Check health endpoint
curl https://yourdomain.com/api/health

# Should return:
{"status":"ok","timestamp":"..."}
```

### 2. Update Shopify App Configuration

1. Go to Shopify Partner Dashboard
2. Navigate to your app settings
3. Update:
   - **App URL**: `https://yourdomain.com`
   - **Allowed redirection URL(s)**: `https://yourdomain.com/api/auth/callback`

### 3. Test Installation Flow

1. Go to a test store
2. Install the app
3. Create a discount rule
4. Test the storefront widget
5. Verify token verification works
6. Test discount application

### 4. Setup Monitoring

#### Option A: Free Tier Monitoring

**Uptime Monitoring**:
- Use UptimeRobot (free)
- Monitor: `https://yourdomain.com/api/health`

**Error Tracking**:
```bash
npm install @sentry/node
```

Add to `server/index.js`:
```javascript
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: process.env.NODE_ENV,
});
```

**Logging**:
```bash
npm install winston
```

#### Option B: Premium Monitoring

- Datadog
- New Relic
- LogRocket (for frontend)

### 5. Setup Backups

#### Database Backups (PostgreSQL):

**Daily automated backup**:
```bash
# Create backup script
nano /usr/local/bin/backup-db.sh
```

```bash
#!/bin/bash
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/postgres"
mkdir -p $BACKUP_DIR

pg_dump -U dkg_user dkg_shopify | gzip > $BACKUP_DIR/dkg_shopify_$TIMESTAMP.sql.gz

# Keep only last 7 days
find $BACKUP_DIR -name "*.sql.gz" -mtime +7 -delete
```

```bash
chmod +x /usr/local/bin/backup-db.sh

# Add to crontab
crontab -e
# Add: 0 2 * * * /usr/local/bin/backup-db.sh
```

### 6. Setup CI/CD (Optional)

**GitHub Actions**:

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Deploy to Railway
        run: |
          npm install -g @railway/cli
          railway up
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
```

### 7. Performance Optimization

#### Enable Compression
Already included in the app via the `compression` middleware.

#### Setup CDN
If serving static assets, use:
- Cloudflare (free tier available)
- AWS CloudFront
- DigitalOcean Spaces

#### Database Optimization
```sql
-- Add indexes for common queries
CREATE INDEX idx_shop_domain ON "Shop"("shopDomain");
CREATE INDEX idx_verified_customer_wallet ON "VerifiedCustomer"("walletAddress");
CREATE INDEX idx_discount_rule_shop ON "DiscountRule"("shopId", "isActive");
```

### 8. Security Hardening

1. **Rate Limiting**:
   ```bash
   npm install express-rate-limit
   ```

2. **Helmet for Security Headers**:
   ```bash
   npm install helmet
   ```

3. **CORS Configuration**: Already configured in `server/index.js`

4. **Environment Variables**: Never commit `.env` to git

5. **API Keys**: Rotate regularly

### 9. Scaling Considerations

**Horizontal Scaling**:
- Use load balancer (Nginx, AWS ALB)
- Session storage: Move to Redis
- Database: Use connection pooling

**Vertical Scaling**:
- Monitor resource usage
- Upgrade server/dyno size as needed

**Caching**:
```bash
npm install redis
```

Add Redis for caching token balances:
```javascript
// Cache token balance for 5 minutes
const cacheKey = `balance:${walletAddress}:${chainId}`;
const cached = await redis.get(cacheKey);
if (cached) return JSON.parse(cached);

const balance = await getTokenBalance(walletAddress);
await redis.setex(cacheKey, 300, JSON.stringify(balance));
```

## Troubleshooting Production Issues

### App Not Loading
1. Check server logs
2. Verify environment variables
3. Check database connectivity
4. Verify SSL certificate is valid

### OAuth Failing
1. Verify redirect URLs match exactly
2. Check SHOPIFY_APP_URL is correct
3. Ensure HTTPS is working

### Slow Performance
1. Check database queries (use Prisma query logging)
2. Monitor RPC endpoint response times
3. Check server resource usage
4. Enable caching

### Database Connection Errors
1. Verify DATABASE_URL is correct
2. Check database server is running
3. Verify firewall rules allow connection
4. Check connection pool limits

## Maintenance

### Regular Tasks

**Weekly**:
- Review error logs
- Check uptime statistics
- Review performance metrics

**Monthly**:
- Update dependencies: `npm update`
- Review and rotate API keys
- Check disk space usage
- Review backup integrity

**Quarterly**:
- Security audit
- Performance optimization review
- Update Node.js version if needed

## Rollback Procedure

If deployment fails:

```bash
# Railway
railway rollback

# Heroku
heroku releases
heroku rollback v123

# VPS with PM2
cd /var/www/dkg-shopify
git checkout previous-stable-commit
npm install
npm run client:build
pm2 restart dkg-shopify
```

## Support Resources

- Shopify Partner Docs: https://shopify.dev/
- Railway Docs: https://docs.railway.app/
- Heroku Docs: https://devcenter.heroku.com/
- DigitalOcean Tutorials: https://www.digitalocean.com/community/tutorials

---

**Estimated Deployment Time**: 1-3 hours depending on platform choice

