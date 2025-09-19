// Test WebSocket connection to localhost
const WebSocket = require('ws');

const WS_URL = 'ws://localhost:3000/ws';

console.log(`🧪 Testing WebSocket connection to: ${WS_URL}`);

const ws = new WebSocket(WS_URL);

ws.on('open', () => {
  console.log('✅ Successfully connected to WebSocket server!');
  console.log('🎯 Server is working correctly!');
  
  // Send a test message
  ws.send(JSON.stringify({
    type: 'test',
    message: 'Localhost connection test',
    timestamp: new Date().toISOString()
  }));
  
  // Close after 2 seconds
  setTimeout(() => {
    ws.close();
  }, 2000);
});

ws.on('message', (data) => {
  console.log('📨 Server response:', data.toString());
});

ws.on('close', (code, reason) => {
  console.log(`🔚 Connection closed: ${code} - ${reason}`);
  console.log('\n✅ Server is working! You can use:');
  console.log('   - Web interface: http://localhost:3000');
  console.log('   - n8n WebSocket URL: ws://localhost:3000/ws');
  process.exit(0);
});

ws.on('error', (error) => {
  console.log('❌ Connection error:', error.message);
  process.exit(1);
});
