// Test script to trigger n8n workflow
const WebSocket = require('ws');

const MACHINE_IP = '47.31.85.225';
const PORT = 3000;
const WS_URL = `ws://${MACHINE_IP}:${PORT}/ws`;

console.log(`🚀 Testing n8n workflow trigger...`);
console.log(`📡 Connecting to: ${WS_URL}`);

const ws = new WebSocket(WS_URL);

ws.on('open', () => {
  console.log('✅ Connected to WebSocket server!');
  
  // Send a message event that should trigger n8n
  const eventData = {
    type: 'message',
    event: 'message',
    content: 'Test message for n8n workflow',
    data: {
      action: 'test-message',
      userId: 'test-user',
      workflowId: 'My workflow 4',
      timestamp: new Date().toISOString()
    },
    timestamp: new Date().toISOString()
  };
  
  console.log('📤 Sending message event:', JSON.stringify(eventData, null, 2));
  ws.send(JSON.stringify(eventData));
  
  // Wait a bit then close
  setTimeout(() => {
    ws.close();
  }, 3000);
});

ws.on('message', (data) => {
  console.log('📨 Server response:', data.toString());
});

ws.on('close', (code, reason) => {
  console.log(`🔚 Connection closed: ${code} - ${reason}`);
  console.log('\n✅ Event sent! Check your n8n workflow executions.');
  process.exit(0);
});

ws.on('error', (error) => {
  console.log('❌ Connection error:', error.message);
  process.exit(1);
});

// Timeout after 10 seconds
setTimeout(() => {
  console.log('⏰ Connection timeout');
  process.exit(1);
}, 10000);
