# 🚀 Render Deployment Guide

## Step-by-Step Deployment to Render

### 1. Create GitHub Repository
1. **Go to [GitHub.com](https://github.com)**
2. **Create a new repository** named `n8n-websocket-server`
3. **Upload all your files** to the repository:
   - `deploy-railway.js`
   - `package.json`
   - `render.yaml`
   - `public/index.html`
   - `README.md`

### 2. Deploy to Render
1. **Go to [Render.com](https://render.com)**
2. **Sign up** with your GitHub account
3. **Click "New +"** → **"Web Service"**
4. **Connect your GitHub repository**
5. **Select your repository** (`n8n-websocket-server`)
6. **Configure the service:**
   - **Name**: `n8n-websocket-server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node deploy-railway.js`
   - **Plan**: `Free`

### 3. Environment Variables (Optional)
- **NODE_ENV**: `production`
- **PORT**: `10000` (Render automatically sets this)

### 4. Deploy
1. **Click "Create Web Service"**
2. **Wait for deployment** (5-10 minutes)
3. **Get your URL** (e.g., `https://n8n-websocket-server.onrender.com`)

### 5. Update n8n Configuration
After deployment, update your n8n WebSocket node:
- **Websocket URL**: `wss://your-app-name.onrender.com/ws`
- **Return Data Type**: `string`
- **Ping Data**: `{{ JSON.stringify({"op":1}) }}`
- **Ping Timer(s)**: `45`
- **ReConnect Times**: `5`

## 📋 Files Required for Deployment

### Required Files:
- ✅ `deploy-railway.js` - Main server file
- ✅ `package.json` - Dependencies
- ✅ `render.yaml` - Render configuration
- ✅ `public/index.html` - Web interface

### Optional Files:
- `README.md` - Documentation
- `config.js` - Configuration

## 🎯 After Deployment

### Your URLs will be:
- **WebSocket Endpoint**: `wss://your-app-name.onrender.com/ws`
- **Web Interface**: `https://your-app-name.onrender.com`
- **Health Check**: `https://your-app-name.onrender.com/health`
- **Webhook**: `https://your-app-name.onrender.com/webhook/n8n`

### Test the Deployment:
1. **Visit your web interface** URL
2. **Test WebSocket connection**
3. **Send test events**
4. **Check n8n workflow executions**

## 🔧 Troubleshooting

### Common Issues:
1. **Build fails**: Check `package.json` dependencies
2. **WebSocket not working**: Ensure Render supports WebSockets
3. **Connection timeout**: Check firewall settings

### Render Free Tier Limitations:
- **Sleeps after 15 minutes** of inactivity
- **Takes 30 seconds** to wake up
- **Limited to 750 hours** per month

## 🚀 Quick Start

1. **Upload files to GitHub**
2. **Deploy to Render**
3. **Get your URL**
4. **Update n8n WebSocket node**
5. **Test the connection**

Your WebSocket server will be accessible from anywhere on the internet!
