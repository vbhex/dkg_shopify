module.exports = {
  apps: [{
    name: 'dkg-shopify',
    script: './server/index.js',
    cwd: '/deakee/dkg_shopify',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 6100
    },
    env_file: '/deakee/dkg_shopify/.env',
    error_file: '/home/ubuntu/.pm2/logs/dkg-shopify-error.log',
    out_file: '/home/ubuntu/.pm2/logs/dkg-shopify-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    watch: false,
    max_memory_restart: '500M'
  }]
};

