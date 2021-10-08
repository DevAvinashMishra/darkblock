module.exports = {
  apps : [{
    name: 'beatific',
    script: 'index.js',
    args: '',
    autorestart: true,
    log_date_format: 'HH:mm:ss',
    watch: true,
    ignore_watch : ["db", "tmp", ".git", "node_modules"],
    max_memory_restart: '2G',
  }]
};

