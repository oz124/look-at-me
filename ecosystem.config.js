module.exports = {
  apps: [{
    name: 'look-at-me-backend',
    script: 'server.js',
    instances: 'max',
    exec_mode: 'cluster',
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development',
      PORT: 3002,
      // Security will be loaded from .env files
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3002,
      // Production environment variables
      // These should be set in your production environment
      // or loaded from secure environment variable files
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    // Security settings
    min_uptime: '10s',
    max_restarts: 10,
    restart_delay: 4000,
    // Process management
    kill_timeout: 5000,
    listen_timeout: 3000,
    // Health monitoring
    health_check_grace_period: 3000,
    // Security logging
    log_type: 'json',
    // Environment-specific settings
    node_args: [
      '--max-old-space-size=1024',
      '--max-semi-space-size=128'
    ]
  }],

  // Deployment configuration
  deploy: {
    production: {
      user: 'deploy',
      host: 'yourdomain.com',
      ref: 'origin/main',
      repo: 'git@github.com:yourusername/look-at-me.git',
      path: '/var/www/look-at-me',
      'pre-deploy-local': '',
      'post-deploy': 'npm install --production && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
