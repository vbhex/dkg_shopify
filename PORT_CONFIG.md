## Port Configuration Summary

### Your Server Ports:
- `deakee.com` → Port 3100 (Frontend)
- `api.deakee.com` → Port 4100 (Backend API)
- `adminjames.deakee.com` → Port 2100 (Admin Panel)
- **`group.deakee.com` → Port 6100 (DKG Shopify App)** ✅

### Updated Files:
✅ `/deakee/dkg_shopify/.env.example` → PORT=6100
✅ `/deakee/dkg_shopify/nginx/add-to-deakee-config.conf` → proxy_pass http://localhost:6100
✅ All documentation updated to use port 6100

### Configuration to Add to Nginx:

The nginx configuration in `nginx/add-to-deakee-config.conf` is ready to use with port 6100.

Just follow the steps in the previous message, and the app will run on port 6100! 🎯


