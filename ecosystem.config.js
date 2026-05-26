module.exports = {
  apps: [
    {
      name: "kdp-press",
      script: "./node_modules/next/dist/bin/next", // Or "npm", depending on your setup
      args: "start",
      env: {
        PORT: 3004,
        NODE_ENV: "production"
      }
    }
  ]
};