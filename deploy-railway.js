// Railway deployment configuration
// This will help you deploy your WebSocket server to Railway (free tier available)

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const WebSocket = require('ws');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// Configure CORS for n8n integration
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Create native WebSocket server for n8n compatibility
const wss = new WebSocket.Server({ 
  server,
  path: '/ws'
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Store connected clients
const connectedClients = new Map();
const nativeWebSocketClients = new Map();

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);
  
  connectedClients.set(socket.id, {
    socket: socket,
    connectedAt: new Date(),
    lastActivity: new Date()
  });

  socket.on('message', (data) => {
    console.log('Received message from client:', data);
    
    if (connectedClients.has(socket.id)) {
      connectedClients.get(socket.id).lastActivity = new Date();
    }

    socket.emit('message', {
      type: 'echo',
      originalData: data,
      timestamp: new Date().toISOString(),
      clientId: socket.id
    });
  });

  socket.on('disconnect', (reason) => {
    console.log(`Client disconnected: ${socket.id}, reason: ${reason}`);
    connectedClients.delete(socket.id);
  });

  socket.emit('welcome', {
    message: 'Connected to n8n WebSocket server',
    clientId: socket.id,
    timestamp: new Date().toISOString(),
    serverVersion: '1.0.0'
  });
});

// Native WebSocket server for n8n compatibility
wss.on('connection', (ws, req) => {
  const clientId = `native_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  console.log(`Native WebSocket client connected: ${clientId}`);
  
  nativeWebSocketClients.set(clientId, {
    ws: ws,
    connectedAt: new Date(),
    lastActivity: new Date()
  });

  ws.send(JSON.stringify({
    type: 'welcome',
    message: 'Connected to n8n WebSocket server',
    clientId: clientId,
    timestamp: new Date().toISOString(),
    serverVersion: '1.0.0'
  }));

  ws.on('message', (data) => {
    console.log(`Native WebSocket message from ${clientId}:`, data.toString());
    
    if (nativeWebSocketClients.has(clientId)) {
      nativeWebSocketClients.get(clientId).lastActivity = new Date();
    }

    try {
      const message = JSON.parse(data.toString());
      
      if (message.op === 1) {
        ws.send(JSON.stringify({
          op: 2,
          timestamp: new Date().toISOString()
        }));
        return;
      }

      ws.send(JSON.stringify({
        type: 'echo',
        originalData: message,
        timestamp: new Date().toISOString(),
        clientId: clientId
      }));

    } catch (error) {
      ws.send(JSON.stringify({
        type: 'echo',
        originalData: data.toString(),
        timestamp: new Date().toISOString(),
        clientId: clientId
      }));
    }
  });

  ws.on('close', (code, reason) => {
    console.log(`Native WebSocket client disconnected: ${clientId}, code: ${code}, reason: ${reason}`);
    nativeWebSocketClients.delete(clientId);
  });

  ws.on('error', (error) => {
    console.error(`Native WebSocket error for ${clientId}:`, error);
    nativeWebSocketClients.delete(clientId);
  });
});

// REST API endpoints
app.post('/webhook/n8n', (req, res) => {
  console.log('n8n webhook received:', req.body);
  
  const { action, data, targetClient } = req.body;
  
  try {
    if (action === 'broadcast') {
      io.emit('n8n_broadcast', {
        type: 'broadcast',
        data: data,
        timestamp: new Date().toISOString()
      });
      
      nativeWebSocketClients.forEach((client, clientId) => {
        if (client.ws.readyState === WebSocket.OPEN) {
          client.ws.send(JSON.stringify({
            type: 'n8n_broadcast',
            data: data,
            timestamp: new Date().toISOString()
          }));
        }
      });
      
      res.json({
        success: true,
        message: 'Message broadcasted to all clients',
        socketioClients: connectedClients.size,
        nativeWebSocketClients: nativeWebSocketClients.size
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid action. Use "broadcast"'
      });
    }
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    socketioClients: connectedClients.size,
    nativeWebSocketClients: nativeWebSocketClients.size,
    totalClients: connectedClients.size + nativeWebSocketClients.size,
    timestamp: new Date().toISOString()
  });
});

app.get('/', (req, res) => {
  res.json({
    message: 'n8n WebSocket Server - Deployed',
    version: '1.0.0',
    endpoints: {
      webhook: 'POST /webhook/n8n',
      health: 'GET /health'
    },
    websocketEndpoints: {
      socketio: '/socket.io/',
      native: '/ws'
    },
    connectedClients: {
      socketio: connectedClients.size,
      native: nativeWebSocketClients.size,
      total: connectedClients.size + nativeWebSocketClients.size
    }
  });
});

// Start server
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

server.listen(PORT, HOST, () => {
  console.log(`🚀 WebSocket server running on ${HOST}:${PORT}`);
  console.log(`📡 Socket.io endpoint: /socket.io/`);
  console.log(`🔌 Native WebSocket endpoint: /ws`);
  console.log(`🔗 HTTP endpoint: http://localhost:${PORT}`);
  console.log(`📋 Webhook endpoint: /webhook/n8n`);
  console.log(`\n🎯 For n8n WebSocket node, use: wss://your-render-app.onrender.com/ws`);
  console.log(`\n🌐 Web interface: https://your-render-app.onrender.com`);
});
