#!/bin/bash

# Script to add group.deakee.com configuration to Nginx

echo "🔧 Adding group.deakee.com configuration to Nginx..."

# Backup existing configuration
echo "📦 Creating backup..."
sudo cp /etc/nginx/sites-available/deakee /etc/nginx/sites-available/deakee.backup.$(date +%Y%m%d_%H%M%S)

# Add the configuration
echo "✏️  Adding group.deakee.com configuration..."

# Note: You need to manually add the configuration from add-to-deakee-config.conf
# to your /etc/nginx/sites-available/deakee file

cat << 'EOF'

Please manually add the following to /etc/nginx/sites-available/deakee:

1. Add the HTTPS server block (after your adminjames.deakee.com block)
2. Add the HTTP redirect block (at the bottom with other redirects)

Then run:
  sudo nginx -t
  sudo systemctl reload nginx
  sudo certbot --nginx -d group.deakee.com

EOF

echo ""
echo "Configuration file created at: /deakee/dkg_shopify/nginx/add-to-deakee-config.conf"
echo ""
echo "Manual steps:"
echo "1. sudo nano /etc/nginx/sites-available/deakee"
echo "2. Copy content from add-to-deakee-config.conf"
echo "3. sudo nginx -t"
echo "4. sudo systemctl reload nginx"
echo "5. sudo certbot --nginx -d group.deakee.com"


