// Test client to verify WebSocket server functionality
const io = require('socket.io-client');

// Connect to the WebSocket server
const socket = io('http://localhost:3000');

socket.on('connect', () => {
  console.log('✅ Connected to WebSocket server');
  console.log('Socket ID:', socket.id);
  
  // Send a test message
  socket.emit('message', {
    type: 'test',
    message: 'Hello from test client!',
    timestamp: new Date().toISOString()
  });
  
  // Send a ping
  socket.emit('ping', { test: 'ping data' });
  
  // Send n8n trigger
  socket.emit('n8n_trigger', {
    workflowId: 'test-workflow',
    data: { test: 'n8n trigger data' }
  });
});

socket.on('welcome', (data) => {
  console.log('🎉 Welcome message:', data);
});

socket.on('message', (data) => {
  console.log('📨 Message received:', data);
});

socket.on('pong', (data) => {
  console.log('🏓 Pong received:', data);
});

socket.on('n8n_response', (data) => {
  console.log('🔄 n8n response:', data);
});

socket.on('n8n_broadcast', (data) => {
  console.log('📢 Broadcast received:', data);
});

socket.on('n8n_message', (data) => {
  console.log('💬 Direct message:', data);
});

socket.on('disconnect', (reason) => {
  console.log('❌ Disconnected:', reason);
});

socket.on('connect_error', (error) => {
  console.log('🚫 Connection error:', error.message);
});

// Keep the client running
console.log('🚀 Test client started. Press Ctrl+C to exit.');
