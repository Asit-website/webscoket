// Send a specific event to test n8n workflow execution
const WebSocket = require('ws');

const LOCAL_IP = '47.31.85.225';
const PORT = 3000;
const WS_URL = `ws://${LOCAL_IP}:${PORT}/ws`;

console.log(`🚀 Sending specific event to trigger n8n execution...`);

const ws = new WebSocket(WS_URL);

ws.on('open', () => {
  console.log('✅ Connected! Sending test message...');
  
  // Send a message that should trigger the "message" path in your Switch node
  ws.send(JSON.stringify({
    type: 'message',
    content: 'Test message for n8n workflow',
    data: {
      workflowId: 'My workflow 4',
      userId: 'test-user',
      action: 'test-execution',
      timestamp: new Date().toISOString()
    },
    event: 'message'
  }));
  
  console.log('📤 Message sent! Check your n8n executions.');
  
  // Close connection after sending
  setTimeout(() => {
    ws.close();
  }, 1000);
});

ws.on('message', (data) => {
  console.log('📨 Server response:', data.toString());
});

ws.on('close', () => {
  console.log('🔚 Connection closed. Check n8n for new execution.');
  process.exit(0);
});

ws.on('error', (error) => {
  console.log('🚫 Error:', error.message);
});
