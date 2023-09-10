module.exports = {
  apps: [
    {
      name: 'my-moleculer-app',
      script: 'path/to/your/app.js', // Replace with the correct path to your Moleculer.js script
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