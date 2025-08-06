module.exports = {
  apps: [
    {
      name: 'frontend',
      script: 'server.js',
      exec_mode: 'cluster',
      autorestart: true,
      instances: 'max'
    }
  ]
}
