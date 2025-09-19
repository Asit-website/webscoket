// Configuration file for the WebSocket server
module.exports = {
  // Server configuration
  port: process.env.PORT || 3000,
  host: process.env.HOST || 'localhost',
  
  // WebSocket configuration
  cors: {
    origin: "*", // Change this to your n8n domain in production
    methods: ["GET", "POST"],
    credentials: true
  },
  
  // n8n integration settings
  n8n: {
    webhookSecret: process.env.N8N_WEBHOOK_SECRET || 'default_secret',
    allowedOrigins: [
      'http://localhost:5678', // n8n default port
      'https://bots.torisedigital.com'
    ]
  },
  
  // Connection settings
  connection: {
    pingTimeout: 60000,
    pingInterval: 25000,
    maxReconnectAttempts: 5
  }
};
