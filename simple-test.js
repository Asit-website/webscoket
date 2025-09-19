// Simple test to verify WebSocket connection
const WebSocket = require('ws');

const LOCAL_IP = '10.162.15.234';
const PORT = 3000;
const WS_URL = `ws://${LOCAL_IP}:${PORT}/ws`;

console.log(`🧪 Simple WebSocket test...`);

const ws = new WebSocket(WS_URL);

ws.on('open', () => {
  console.log('✅ Connected successfully!');
  
  // Send a simple test message
  ws.send(JSON.stringify({
    type: 'test',
    event: 'test',
    message: 'Simple test message',
    timestamp: new Date().toISOString()
  }));
  
  console.log('📤 Test message sent!');
  
  // Close after 2 seconds
  setTimeout(() => {
    ws.close();
  }, 2000);
});

ws.on('message', (data) => {
  console.log('📨 Received:', JSON.parse(data.toString()).type);
});

ws.on('close', () => {
  console.log('🔚 Connection closed. Check n8n for execution.');
  process.exit(0);
});

ws.on('error', (error) => {
  console.log('❌ Error:', error.message);
});
