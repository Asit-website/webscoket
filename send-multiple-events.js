// Send multiple different events to test all Switch node paths
const WebSocket = require('ws');

const LOCAL_IP = '47.31.85.225';
const PORT = 3000;
const WS_URL = `ws://${LOCAL_IP}:${PORT}/ws`;

console.log(`🚀 Sending multiple events to test Switch node paths...`);

function sendEvent(eventType, data) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(WS_URL);
    
    ws.on('open', () => {
      console.log(`📤 Sending ${eventType} event...`);
      ws.send(JSON.stringify({
        type: eventType,
        event: eventType,
        content: data.content,
        data: data.data,
        timestamp: new Date().toISOString()
      }));
      
      setTimeout(() => {
        ws.close();
        resolve();
      }, 500);
    });
    
    ws.on('message', (data) => {
      console.log(`📨 ${eventType} response:`, JSON.parse(data.toString()).type);
    });
    
    ws.on('error', reject);
  });
}

async function sendAllEvents() {
  try {
    // Send "open" event - should trigger "Open" path
    await sendEvent('open', {
      content: 'Connection opened',
      data: { action: 'connection_opened' }
    });
    
    // Wait 1 second
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Send "message" event - should trigger "Message" path
    await sendEvent('message', {
      content: 'Hello from WebSocket!',
      data: { action: 'user_message', userId: 'test-user' }
    });
    
    // Wait 1 second
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Send "close" event - should trigger "Close" path
    await sendEvent('close', {
      content: 'Connection closing',
      data: { action: 'connection_closing' }
    });
    
    // Wait 1 second
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Send custom event - should trigger "Fallback" path
    await sendEvent('custom_event', {
      content: 'Custom event triggered',
      data: { action: 'custom_action', customData: 'test' }
    });
    
    console.log('\n✅ All events sent! Check your n8n executions for new workflow runs.');
    
  } catch (error) {
    console.error('❌ Error sending events:', error.message);
  }
}

sendAllEvents();
