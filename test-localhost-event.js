// Test localhost WebSocket connection for n8n
const WebSocket = require('ws');

const WS_URL = 'ws://localhost:3000/ws';

console.log(`🚀 Sending test event to localhost WebSocket...`);

const ws = new WebSocket(WS_URL);

ws.on('open', () => {
  console.log('✅ Connected to WebSocket server!');
  
  // Send a message event that should trigger n8n
  ws.send(JSON.stringify({
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
  }));
  
  console.log('📤 Message event sent! Check your n8n executions.');
  
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
  console.log('❌ Error:', error.message);
});
