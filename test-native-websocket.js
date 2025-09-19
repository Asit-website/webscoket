// Test native WebSocket connection (for n8n compatibility)
const WebSocket = require('ws');

console.log('🚀 Testing native WebSocket connection...');

// Connect to the native WebSocket endpoint
const ws = new WebSocket('ws://localhost:3000/ws');

ws.on('open', () => {
  console.log('✅ Connected to native WebSocket server');
  
  // Send a test message
  ws.send(JSON.stringify({
    type: 'test',
    message: 'Hello from test client!',
    timestamp: new Date().toISOString()
  }));
  
  // Send a ping (like n8n does)
  ws.send(JSON.stringify({ op: 1 }));
  
  // Send another test message
  setTimeout(() => {
    ws.send(JSON.stringify({
      type: 'n8n_test',
      data: { workflowId: 'test-workflow' }
    }));
  }, 1000);
});

ws.on('message', (data) => {
  console.log('📨 Message received:', data.toString());
});

ws.on('close', (code, reason) => {
  console.log(`❌ Connection closed: ${code} - ${reason}`);
});

ws.on('error', (error) => {
  console.log('🚫 Connection error:', error.message);
});

// Keep the client running for a few seconds
setTimeout(() => {
  console.log('🔚 Closing connection...');
  ws.close();
  process.exit(0);
}, 5000);
