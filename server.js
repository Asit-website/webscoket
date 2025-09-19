const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const WebSocket = require('ws');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// Configure CORS for n8n integration
const io = socketIo(server, {
  cors: {
    origin: "*", // Allow all origins for development
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Create native WebSocket server for n8n compatibility
const wss = new WebSocket.Server({ 
  server,
  path: '/ws' // This will be accessible at ws://localhost:3000/ws
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
  
  // Store client information
  connectedClients.set(socket.id, {
    socket: socket,
    connectedAt: new Date(),
    lastActivity: new Date()
  });

  // Handle initial connection message (from n8n websocket node)
  socket.on('message', (data) => {
    console.log('Received message from client:', data);
    
    // Update last activity
    if (connectedClients.has(socket.id)) {
      connectedClients.get(socket.id).lastActivity = new Date();
    }

    // Echo back the message or process it
    socket.emit('message', {
      type: 'echo',
      originalData: data,
      timestamp: new Date().toISOString(),
      clientId: socket.id
    });
  });

  // Handle ping/pong for connection health
  socket.on('ping', (data) => {
    console.log('Ping received from client:', data);
    socket.emit('pong', {
      timestamp: new Date().toISOString(),
      originalPing: data
    });
  });

  // Handle custom events from n8n
  socket.on('n8n_trigger', (data) => {
    console.log('n8n trigger received:', data);
    
    // Process the trigger data
    const response = {
      type: 'n8n_response',
      status: 'success',
      data: data,
      timestamp: new Date().toISOString(),
      clientId: socket.id
    };
    
    socket.emit('n8n_response', response);
  });

  // Handle disconnection
  socket.on('disconnect', (reason) => {
    console.log(`Client disconnected: ${socket.id}, reason: ${reason}`);
    connectedClients.delete(socket.id);
  });

  // Send welcome message
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
  
  // Store native WebSocket client
  nativeWebSocketClients.set(clientId, {
    ws: ws,
    connectedAt: new Date(),
    lastActivity: new Date()
  });

  // Send welcome message
  ws.send(JSON.stringify({
    type: 'welcome',
    message: 'Connected to n8n WebSocket server',
    clientId: clientId,
    timestamp: new Date().toISOString(),
    serverVersion: '1.0.0'
  }));

  // Handle messages from native WebSocket clients
  ws.on('message', (data) => {
    console.log(`Native WebSocket message from ${clientId}:`, data.toString());
    
    // Update last activity
    if (nativeWebSocketClients.has(clientId)) {
      nativeWebSocketClients.get(clientId).lastActivity = new Date();
    }

    try {
      const message = JSON.parse(data.toString());
      
      // Handle ping messages
      if (message.op === 1) {
        ws.send(JSON.stringify({
          op: 2, // pong
          timestamp: new Date().toISOString()
        }));
        return;
      }

      // Send n8n-compatible message format
      const n8nMessage = {
        type: 'message',
        data: message,
        timestamp: new Date().toISOString(),
        clientId: clientId,
        source: 'websocket_server'
      };

      // Echo back the message in n8n format
      ws.send(JSON.stringify(n8nMessage));

    } catch (error) {
      // Handle non-JSON messages - send as string data
      const n8nMessage = {
        type: 'message',
        data: data.toString(),
        timestamp: new Date().toISOString(),
        clientId: clientId,
        source: 'websocket_server'
      };
      
      ws.send(JSON.stringify(n8nMessage));
    }
  });

  // Handle disconnection
  ws.on('close', (code, reason) => {
    console.log(`Native WebSocket client disconnected: ${clientId}, code: ${code}, reason: ${reason}`);
    nativeWebSocketClients.delete(clientId);
  });

  // Handle errors
  ws.on('error', (error) => {
    console.error(`Native WebSocket error for ${clientId}:`, error);
    nativeWebSocketClients.delete(clientId);
  });
});

// REST API endpoints for n8n webhook integration
app.post('/webhook/n8n', (req, res) => {
  console.log('n8n webhook received:', req.body);
  
  const { action, data, targetClient } = req.body;
  
  try {
    if (action === 'broadcast') {
      // Broadcast to all Socket.io clients
      io.emit('n8n_broadcast', {
        type: 'broadcast',
        data: data,
        timestamp: new Date().toISOString()
      });
      
      // Broadcast to all native WebSocket clients
      nativeWebSocketClients.forEach((client, clientId) => {
        if (client.ws.readyState === WebSocket.OPEN) {
          client.ws.send(JSON.stringify({
            type: 'message',
            data: data,
            timestamp: new Date().toISOString(),
            source: 'webhook'
          }));
        }
      });
      
      res.json({
        success: true,
        message: 'Message broadcasted to all clients',
        socketioClients: connectedClients.size,
        nativeWebSocketClients: nativeWebSocketClients.size
      });
    } else if (action === 'send_to_client' && targetClient) {
      // Try Socket.io client first
      const socketioClient = connectedClients.get(targetClient);
      if (socketioClient) {
        socketioClient.socket.emit('n8n_message', {
          type: 'direct_message',
          data: data,
          timestamp: new Date().toISOString()
        });
        
        res.json({
          success: true,
          message: `Message sent to Socket.io client ${targetClient}`
        });
        return;
      }
      
      // Try native WebSocket client
      const nativeClient = nativeWebSocketClients.get(targetClient);
      if (nativeClient && nativeClient.ws.readyState === WebSocket.OPEN) {
        nativeClient.ws.send(JSON.stringify({
          type: 'message',
          data: data,
          timestamp: new Date().toISOString(),
          source: 'webhook'
        }));
        
        res.json({
          success: true,
          message: `Message sent to native WebSocket client ${targetClient}`
        });
        return;
      }
      
      res.status(404).json({
        success: false,
        message: `Client ${targetClient} not found`
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid action. Use "broadcast" or "send_to_client"'
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

// Get connected clients info
app.get('/clients', (req, res) => {
  const socketioClients = Array.from(connectedClients.entries()).map(([id, info]) => ({
    id,
    type: 'socketio',
    connectedAt: info.connectedAt,
    lastActivity: info.lastActivity
  }));
  
  const nativeClients = Array.from(nativeWebSocketClients.entries()).map(([id, info]) => ({
    id,
    type: 'native_websocket',
    connectedAt: info.connectedAt,
    lastActivity: info.lastActivity
  }));
  
  res.json({
    totalClients: connectedClients.size + nativeWebSocketClients.size,
    socketioClients: connectedClients.size,
    nativeWebSocketClients: nativeWebSocketClients.size,
    clients: [...socketioClients, ...nativeClients]
  });
});

// Health check endpoint
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

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'n8n WebSocket Server',
    version: '1.0.0',
    endpoints: {
      webhook: 'POST /webhook/n8n',
      clients: 'GET /clients',
      health: 'GET /health'
    },
    websocketEndpoints: {
      socketio: 'ws://localhost:3000/socket.io/',
      native: 'ws://localhost:3000/ws'
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
const HOST = process.env.HOST || '0.0.0.0'; // Listen on all interfaces
const MACHINE_IP = '47.31.85.225'; // Your machine's IP address

server.listen(PORT, HOST, () => {
  console.log(`🚀 WebSocket server running on ${HOST}:${PORT}`);
  console.log(`📡 Socket.io endpoint: ws://${MACHINE_IP}:${PORT}/socket.io/`);
  console.log(`🔌 Native WebSocket endpoint: ws://${MACHINE_IP}:${PORT}/ws`);
  console.log(`🔗 HTTP endpoint: http://${MACHINE_IP}:${PORT}`);
  console.log(`📋 Webhook endpoint: http://${MACHINE_IP}:${PORT}/webhook/n8n`);
  console.log(`\n🎯 For n8n WebSocket node, use: ws://${MACHINE_IP}:${PORT}/ws`);
  console.log(`\n🌐 Web interface available at: http://${MACHINE_IP}:${PORT}`);
  console.log(`\n💡 Server is listening on all interfaces (0.0.0.0) but accessible via your IP: ${MACHINE_IP}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});
