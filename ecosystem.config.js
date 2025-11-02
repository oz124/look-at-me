module.exports = {
  apps: [{
    name: 'lookatme',
    script: 'server.js',
    instances: 1, // Changed from 'max' for better control in Ocean Digital
    exec_mode: 'fork', // Changed from 'cluster' for simpler deployment
    watch: false,
    max_memory_restart: '800M', // Adjusted for Ocean Digital $12 Droplet (2GB RAM)
    env: {
      NODE_ENV: 'development',
      PORT: 3002,
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3002,
    },
    // Logging configuration
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    
    // Auto-restart settings
    min_uptime: '10s',
    max_restarts: 10,
    restart_delay: 4000,
    
    // Process management
    kill_timeout: 5000,
    listen_timeout: 3000,
    
    // Auto-restart on crashes
    autorestart: true,
    
    // Graceful shutdown
    shutdown_with_message: true,
    
    // Node.js memory optimization for Ocean Digital
    node_args: [
      '--max-old-space-size=768', // 768MB for Node.js heap (fits in 2GB RAM droplet)
      '--max-semi-space-size=64'
    ],
    
    // Environment file loading
    env_file: '.env.local',
    
    // Monitoring
    pmx: false, // Disable PMX if not using Keymetrics
    
    // Cron restart (optional - restart daily at 3 AM to clear memory)
    cron_restart: '0 3 * * *',
    
    // Source map support for better error tracking
    source_map_support: true,
  }],

  // PM2 Deploy configuration for Git-based deployment
  deploy: {
    production: {
      user: 'root',
      host: ['YOUR_OCEAN_DIGITAL_IP'],
      ref: 'origin/main',
      repo: 'git@github.com:yourusername/look-at-me.git',
      path: '/var/www/lookatme',
      'pre-deploy-local': 'echo "🚀 Starting deployment..."',
      'post-deploy': 'npm install --production && pm2 reload ecosystem.config.js --env production && pm2 save',
      'pre-setup': 'mkdir -p /var/www/lookatme/logs',
      'ssh_options': 'StrictHostKeyChecking=no',
    }
  }
};
