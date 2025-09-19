# n8n WebSocket Server

A Node.js WebSocket server designed to work seamlessly with n8n workflows. This server provides real-time communication capabilities and webhook integration for your n8n automation workflows.

## Features

- 🔌 WebSocket server with Socket.io
- 🎯 n8n webhook integration
- 📡 Real-time bidirectional communication
- 🔄 Connection health monitoring
- 📊 Client management and statistics
- 🛡️ CORS support for cross-origin requests

## Installation

1. Clone or download this project
2. Install dependencies:
```bash
npm install
```

## Usage

### Start the server

```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3000` by default.

### WebSocket Connection

The server supports two types of WebSocket connections:

**1. Native WebSocket (for n8n):**
```
ws://localhost:3000/ws
```

**2. Socket.io (for web applications):**
```
ws://localhost:3000/socket.io/
```

For production with SSL:
```
wss://your-domain.com/ws          # Native WebSocket
wss://your-domain.com/socket.io/  # Socket.io
```

## n8n Integration

### 1. WebSocket Node Configuration

In your n8n workflow, configure the WebSocket node with:

- **Websocket URL**: `ws://localhost:3000/ws` (or your production URL)
- **Return Data Type**: `string`
- **Ping Data**: `{{ JSON.stringify({"op":1}) }}`
- **Ping Timer(s)**: `45`
- **ReConnect Times**: `5`

**Important**: Use the `/ws` endpoint for n8n WebSocket nodes, not `/socket.io/`

### 2. Webhook Integration

Use the webhook endpoint to trigger WebSocket messages from n8n:

**Endpoint**: `POST http://localhost:3000/webhook/n8n`

#### Broadcast to all clients:
```json
{
  "action": "broadcast",
  "data": {
    "message": "Hello from n8n!",
    "workflowId": "your-workflow-id"
  }
}
```

#### Send to specific client:
```json
{
  "action": "send_to_client",
  "targetClient": "client-socket-id",
  "data": {
    "message": "Private message from n8n"
  }
}
```

### 3. WebSocket Events

The server handles these events:

#### Client to Server:
- `message` - General message handling
- `ping` - Connection health check
- `n8n_trigger` - Custom n8n trigger event

#### Server to Client:
- `welcome` - Connection confirmation
- `message` - Echo response
- `pong` - Ping response
- `n8n_response` - Response to n8n triggers
- `n8n_broadcast` - Broadcast messages
- `n8n_message` - Direct messages

## API Endpoints

### GET /
Server information and status

### GET /health
Health check endpoint

### GET /clients
Get list of connected clients

### POST /webhook/n8n
n8n webhook integration endpoint

## Example n8n Workflow

1. **WebSocket Node**: Connect to the server
2. **Switch Node**: Route different message types
3. **Webhook Node**: Send data to the server
4. **WebSocket Send Node**: Send responses back to clients

## Configuration

Edit `config.js` to customize:
- Server port and host
- CORS settings
- n8n integration settings
- Connection timeouts

## Production Deployment

1. Set environment variables:
```bash
export PORT=3000
export NODE_ENV=production
export N8N_WEBHOOK_SECRET=your_secret_key
```

2. Use a process manager like PM2:
```bash
npm install -g pm2
pm2 start server.js --name "n8n-websocket"
```

3. Set up reverse proxy with Nginx for SSL termination

## Troubleshooting

### Connection Issues
- Check firewall settings
- Verify CORS configuration
- Ensure WebSocket URL is correct

### n8n Integration Issues
- Verify webhook endpoint URL
- Check request payload format
- Monitor server logs for errors

## License

MIT License - feel free to use and modify as needed.
