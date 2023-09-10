module.exports = {
  apps: [
    {
      name: 'moleculer_app',
      script: 'moleculer.config.js', // Replace with the correct path to your Moleculer.js script
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};