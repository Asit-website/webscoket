// Test WebSocket connection to your machine's IP
const WebSocket = require('ws');

const MACHINE_IP = '47.31.85.225';
const PORT = 3000;
const WS_URL = `ws://${MACHINE_IP}:${PORT}/ws`;

console.log(`🧪 Testing WebSocket connection to: ${WS_URL}`);

const ws = new WebSocket(WS_URL);

ws.on('open', () => {
  console.log('✅ Successfully connected to WebSocket server!');
  console.log('🎯 This means n8n should be able to connect too.');
  
  // Send a test message
  ws.send(JSON.stringify({
    type: 'test',
    message: 'Connection test from your machine',
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
  process.exit(0);
});

ws.on('error', (error) => {
  console.log('❌ Connection error:', error.message);
  console.log('\n🔧 Troubleshooting tips:');
  console.log('1. Check Windows Firewall settings');
  console.log('2. Make sure port 3000 is not blocked');
  console.log('3. Try using localhost instead: ws://localhost:3000/ws');
  console.log('4. Check if your IP address is correct');
  process.exit(1);
});

// Timeout after 10 seconds
setTimeout(() => {
  console.log('⏰ Connection timeout');
  process.exit(1);
}, 10000);
