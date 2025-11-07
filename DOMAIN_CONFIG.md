# Domain Configuration Guide

## Your Domain Setup

Based on your infrastructure:
- **Frontend**: `deakee.com`
- **Backend API**: `api.deakee.com`
- **Admin Panel**: `adminjames.deakee.com`
- **DKG Shopify App**: `group.deakee.com` ✅

## Environment Configuration

### Development (.env for local testing)

```env
SHOPIFY_APP_URL=https://your-ngrok-url.ngrok.io
# or
SHOPIFY_APP_URL=http://localhost:8080
```

### Production (.env for group.deakee.com)

```env
SHOPIFY_APP_URL=https://group.deakee.com
PORT=6100
NODE_ENV=production
```

## DNS Configuration

You mentioned you added an A record for `group.deakee.com`. Here's what you need:

### DNS Records at Your Provider

```
Type    Host/Name    Value/Target              TTL
A       group        YOUR_SERVER_IP            3600
```

Or if using a CDN/proxy like Cloudflare:
```
Type    Host/Name    Value/Target              TTL     Proxy
A       group        YOUR_SERVER_IP            Auto    Proxied (orange cloud)
```

### Verify DNS Propagation

```bash
# Check if DNS is resolving
dig group.deakee.com

# Or use nslookup
nslookup group.deakee.com

# Or simple ping
ping group.deakee.com
```

## SSL Certificate Setup

### Option 1: Using Certbot (Let's Encrypt) - Recommended

```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate for group.deakee.com
sudo certbot --nginx -d group.deakee.com

# Certbot will auto-configure Nginx and renew certificates
```

### Option 2: Using Cloudflare

If you're using Cloudflare:
1. Set DNS to "Proxied" (orange cloud)
2. Go to SSL/TLS → Overview
3. Set to "Full (strict)"
4. Certificate will be automatically provided

## Nginx Configuration

Create `/etc/nginx/sites-available/dkg-shopify`:

```nginx
server {
    listen 80;
    server_name group.deakee.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name group.deakee.com;

    # SSL certificates (auto-configured by certbot)
    ssl_certificate /etc/letsencrypt/live/group.deakee.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/group.deakee.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Proxy to Node.js app
    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Storefront widget (optional separate location)
    location /storefront/ {
        proxy_pass http://localhost:8080/storefront/;
        # Add CORS headers for cross-origin requests
        add_header Access-Control-Allow-Origin *;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/dkg-shopify /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Shopify App Configuration

Update your Shopify app settings in the Partner Dashboard:

1. **App URL**: `https://group.deakee.com`
2. **Allowed redirection URL(s)**:
   ```
   https://group.deakee.com/api/auth/callback
   ```

## Environment Variables for Production

Create `/deakee/dkg_shopify/.env`:

```env
# Shopify Configuration
SHOPIFY_API_KEY=your_actual_api_key
SHOPIFY_API_SECRET=your_actual_secret
SHOPIFY_API_SCOPES=write_products,write_customers,write_discounts,read_orders
SHOPIFY_APP_URL=https://group.deakee.com
SHOPIFY_API_VERSION=2024-01

# Server
PORT=6100
NODE_ENV=production
HOST=localhost

# Database (use PostgreSQL for production)
DATABASE_URL=postgresql://user:password@localhost:5432/dkg_shopify

# Blockchain
DKG_TOKEN_CONTRACT_ADDRESS=0xYourActualDKGTokenAddress
ETHEREUM_RPC_URL=https://mainnet.infura.io/v3/your-project-id
POLYGON_RPC_URL=https://polygon-rpc.com
BSC_RPC_URL=https://bsc-dataseed1.binance.org

# Session Secret (generate new one)
SESSION_SECRET=$(openssl rand -base64 32)
```

## Deployment Steps

1. **Setup DNS** (Already done ✅)
   ```bash
   # Verify
   ping group.deakee.com
   ```

2. **Deploy Application**
   ```bash
   cd /deakee/dkg_shopify
   
   # Install dependencies
   npm install
   cd client && npm install && cd ..
   
   # Create production .env
   cp .env.example .env
   nano .env  # Edit with production values
   
   # Build frontend
   npm run client:build
   
   # Setup database
   npm run prisma:generate
   npm run prisma:migrate deploy
   
   # Start with PM2
   pm2 start server/index.js --name dkg-shopify
   pm2 save
   ```

3. **Setup SSL**
   ```bash
   sudo certbot --nginx -d group.deakee.com
   ```

4. **Update Shopify App URLs**
   - Go to Shopify Partner Dashboard
   - Update app URLs to `https://group.deakee.com`

5. **Test Installation**
   ```bash
   # Health check
   curl https://group.deakee.com/api/health
   
   # Should return:
   {"status":"ok","timestamp":"..."}
   ```

## Widget Integration in Your Shopify Stores

Add to theme files:

```html
<!-- Load widget script -->
<script src="https://group.deakee.com/storefront/dkg-widget.js"></script>

<!-- Widget container -->
<div id="dkg-token-widget" data-shop="{{ shop.permanent_domain }}"></div>
```

## Firewall Configuration

```bash
# Allow HTTP, HTTPS, and SSH
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

## Monitoring

Check if app is running:
```bash
# Check PM2 status
pm2 status

# View logs
pm2 logs dkg-shopify

# Check Nginx
sudo systemctl status nginx
```

## Troubleshooting

### DNS not resolving
```bash
# Check DNS
dig group.deakee.com +short

# If empty, wait for DNS propagation (up to 48 hours, usually 10-30 minutes)
```

### SSL certificate issues
```bash
# Renew certificate manually
sudo certbot renew

# Check certificate
sudo certbot certificates
```

### App not accessible
```bash
# Check if app is running
pm2 status

# Check Nginx
sudo nginx -t
sudo systemctl status nginx

# Check port 8080
sudo netstat -tlnp | grep 8080
```

## Summary for Your Setup

| Component | Domain | Configuration |
|-----------|--------|---------------|
| Main site | deakee.com | Existing |
| Backend API | api.deakee.com | Existing |
| Admin | adminjames.deakee.com | Existing |
| **DKG Shopify** | **group.deakee.com** | **New** |

**Environment Variable**:
```env
SHOPIFY_APP_URL=https://group.deakee.com
```

**Shopify Partner Dashboard**:
- App URL: `https://group.deakee.com`
- Redirect URL: `https://group.deakee.com/api/auth/callback`

---

**Ready to Deploy?** Follow the deployment steps above! 🚀

