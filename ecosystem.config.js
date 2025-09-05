module.exports = {
  apps: [{
    name: "neoagent-api",
    script: "index.js",
    interpreter: "node",
    interpreter_args: "--experimental-specifier-resolution=node",
    env: {
      NODE_ENV: "production",
      // Add other environment variables from your .env/config.js:
      PORT: 3005, // Match your config.js PORT
    //   TWILIO_ACCOUNT_SID: "your_twilio_sid",
    //   TWILIO_AUTH_TOKEN: "your_twilio_token",
      // ... other variables ...
    },
    instances: "max", // For multi-core utilization
    exec_mode: "cluster",
    watch: false,
    autorestart: true
  }]
};