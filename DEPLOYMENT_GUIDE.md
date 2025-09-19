# 🚀 WebSocket Server Deployment Guide

## Option 1: Railway (Recommended - Free)

### Steps:
1. **Go to [Railway.app](https://railway.app)**
2. **Sign up with GitHub**
3. **Click "New Project"**
4. **Select "Deploy from GitHub repo"**
5. **Connect your GitHub account**
6. **Select this repository**
7. **Railway will automatically deploy**

### After Deployment:
- Railway will give you a URL like: `https://your-app-name.railway.app`
- Use this URL in your n8n WebSocket node: `wss://your-app-name.railway.app/ws`

## Option 2: Heroku

### Steps:
1. **Install Heroku CLI**
2. **Login to Heroku**
3. **Create a new app**
4. **Deploy using Git**

```bash
heroku create your-app-name
git add .
git commit -m "Deploy WebSocket server"
git push heroku main
```

## Option 3: Render

### Steps:
1. **Go to [Render.com](https://render.com)**
2. **Sign up**
3. **Create a new Web Service**
4. **Connect your GitHub repo**
5. **Deploy**

## Option 4: Vercel

### Steps:
1. **Go to [Vercel.com](https://vercel.com)**
2. **Import your project**
3. **Deploy**

## 🔧 Quick Fix for Current Issue

If you want to test immediately, you can:

1. **Use a free cloud service** (Railway, Render, etc.)
2. **Deploy your server there**
3. **Get a public URL**
4. **Use that URL in your n8n WebSocket node**

## 📋 Files Needed for Deployment

- `deploy-railway.js` - Main server file
- `package.json` - Dependencies
- `railway.json` - Railway configuration
- `public/index.html` - Web interface

## 🎯 After Deployment

Your n8n WebSocket node should use:
```
wss://your-deployed-url.com/ws
```

Instead of:
```
ws://localhost:3000/ws
```
