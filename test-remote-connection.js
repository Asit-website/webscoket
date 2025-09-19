// Test script to verify remote WebSocket connection
const WebSocket = require('ws');

// Your local IP address (update this if needed)
const LOCAL_IP = '47.31.85.225';
const PORT = 3000;
const WS_URL = `ws://${LOCAL_IP}:${PORT}/ws`;

console.log(`🚀 Testing remote WebSocket connection to: ${WS_URL}`);

const ws = new WebSocket(WS_URL);

ws.on('open', () => {
  console.log('✅ Successfully connected to remote WebSocket server!');
  console.log('🎯 This means n8n should be able to connect too.');
  
  // Send a test message
  ws.send(JSON.stringify({
    type: 'test',
    message: 'Testing remote connection',
    timestamp: new Date().toISOString()
  }));
  
  // Send ping like n8n does
  ws.send(JSON.stringify({ op: 1 }));
});

ws.on('message', (data) => {
  console.log('📨 Message received:', data.toString());
});

ws.on('close', (code, reason) => {
  console.log(`❌ Connection closed: ${code} - ${reason}`);
});

ws.on('error', (error) => {
  console.log('🚫 Connection error:', error.message);
  console.log('\n🔧 Troubleshooting tips:');
  console.log('1. Make sure the server is running: npm start');
  console.log('2. Check Windows Firewall settings');
  console.log('3. Verify the IP address is correct');
  console.log('4. Try using localhost instead: ws://localhost:3000/ws');
});

// Keep connection open for a few seconds
setTimeout(() => {
  console.log('🔚 Closing test connection...');
  ws.close();
  process.exit(0);
}, 3000);
