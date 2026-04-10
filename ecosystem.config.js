module.exports = {
  apps: [
    {
      name: 'cv-run',
      script: 'server-with-env.js',
      cwd: '/var/www/cv-run',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3002,
      },
    },
  ],
};
