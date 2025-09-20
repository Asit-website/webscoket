const WebSocket = require('ws');

console.log('Testing n8n WebSocket connection...');

const ws = new WebSocket('ws://localhost:3000/ws');

ws.on('open', () => {
  console.log('✅ WebSocket connected');
  console.log('📝 Note: n8n will automatically trigger on "open" event');
  
  // Send a test message
  setTimeout(() => {
    console.log('📤 Sending test message...');
    ws.send(JSON.stringify({
      type: 'test',
      message: 'Hello from test client',
      timestamp: new Date().toISOString()
    }));
  }, 2000);
});

ws.on('message', (data) => {
  console.log('📥 Received message:', data.toString());
});

ws.on('close', () => {
  console.log('❌ WebSocket disconnected');
});

ws.on('error', (error) => {
  console.error('❌ WebSocket error:', error);
});

// Close after 5 seconds
setTimeout(() => {
  console.log('🔚 Closing connection...');
  ws.close();
}, 5000);
