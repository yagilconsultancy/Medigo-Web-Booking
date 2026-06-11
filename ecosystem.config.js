module.exports = {
  apps: [
    {
      name: 'medigo-booking',
      script: 'node_modules/.bin/next',
      args: 'start',
      cwd: '/home/ubuntu/medigo-booking',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
};
