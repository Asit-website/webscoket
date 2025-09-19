// Script to trigger n8n workflow events
const WebSocket = require('ws');

const LOCAL_IP = '47.31.85.225';
const PORT = 3000;
const WS_URL = `ws://${LOCAL_IP}:${PORT}/ws`;

console.log(`🚀 Connecting to WebSocket server to trigger n8n workflow...`);
console.log(`📡 URL: ${WS_URL}`);

const ws = new WebSocket(WS_URL);

let messageCount = 0;

ws.on('open', () => {
  console.log('✅ Connected to WebSocket server!');
  console.log('🎯 Sending messages to trigger n8n workflow...\n');
  
  // Send different types of messages to trigger different workflow paths
  setTimeout(() => {
    console.log('📤 Sending "Open" event...');
    ws.send(JSON.stringify({
      type: 'open',
      message: 'Connection opened',
      timestamp: new Date().toISOString(),
      event: 'open'
    }));
  }, 1000);

  setTimeout(() => {
    console.log('📤 Sending "Message" event...');
    ws.send(JSON.stringify({
      type: 'message',
      content: 'Hello from WebSocket client!',
      data: {
        workflowId: 'test-workflow',
        userId: 'test-user',
        action: 'test-message'
      },
      timestamp: new Date().toISOString(),
      event: 'message'
    }));
  }, 2000);

  setTimeout(() => {
    console.log('📤 Sending custom event...');
    ws.send(JSON.stringify({
      type: 'custom_event',
      event: 'user_action',
      payload: {
        action: 'button_click',
        data: { buttonId: 'submit', formData: { name: 'Test User' } }
      },
      timestamp: new Date().toISOString()
    }));
  }, 3000);

  setTimeout(() => {
    console.log('📤 Sending ping message...');
    ws.send(JSON.stringify({ op: 1 }));
  }, 4000);

  setTimeout(() => {
    console.log('📤 Sending "Close" event...');
    ws.send(JSON.stringify({
      type: 'close',
      message: 'Connection closing',
      timestamp: new Date().toISOString(),
      event: 'close'
    }));
  }, 5000);
});

ws.on('message', (data) => {
  messageCount++;
  console.log(`📨 Response ${messageCount}:`, data.toString());
});

ws.on('close', (code, reason) => {
  console.log(`\n❌ Connection closed: ${code} - ${reason}`);
  console.log(`📊 Total messages received: ${messageCount}`);
});

ws.on('error', (error) => {
  console.log('🚫 Connection error:', error.message);
});

// Keep connection open for 8 seconds to receive all responses
setTimeout(() => {
  console.log('\n🔚 Closing connection...');
  ws.close();
  process.exit(0);
}, 8000);
