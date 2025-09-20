# 🎯 N8N SWITCH NODE CONFIGURATION

## 🚨 **CRITICAL: Configure Your Switch Node Like This**

### **Step 1: Open Switch Node**
1. Click on your Switch node in n8n
2. Go to "Parameters" tab

### **Step 2: Configure Routing Rules**

**Rule 1:**
- **Field:** `$json.event`
- **Operation:** `Equal`
- **Value:** `connection_ready`
- **Output:** `Open` (or create a new output called "Connection")

**Rule 2:**
- **Field:** `$json.event`
- **Operation:** `Equal`
- **Value:** `message`
- **Output:** `message`

**Rule 3:**
- **Field:** `$json.event`
- **Operation:** `Equal`
- **Value:** `message_received`
- **Output:** `message`

**Rule 4:**
- **Field:** `$json.event`
- **Operation:** `Equal`
- **Value:** `close`
- **Output:** `close`

**Default:**
- **Output:** `Fallback`

### **Step 3: Configure Output Paths**

**Connection/Open Path:**
- Add a "Set" node
- Set a variable like `connection_status = "connected"`
- This path will handle the automatic connection event

**Message Path:**
- Put your actual workflow logic here
- This is where your main workflow will execute

**Close Path:**
- Handle disconnection if needed

**Fallback Path:**
- Handle any unexpected events

### **Step 4: Test the Configuration**

1. **Connect n8n to WebSocket:** `wss://webscoket-o4xf.onrender.com/ws`
2. **Expected behavior:**
   - Connection → Goes to "Connection" path (no workflow execution)
   - Manual trigger → Goes to "Message" path (workflow executes)

### **Step 5: Test Manual Trigger**

1. Go to: `https://webscoket-o4xf.onrender.com`
2. Click "Send Message Event"
3. Check if n8n workflow executes on "Message" path

## 🎉 **Expected Result:**

- ✅ **Connection event** → No workflow execution (just logs)
- ✅ **Manual trigger** → Workflow executes with proper data
- ✅ **Message data** available in `$json.data`

## 🔧 **Alternative: Use HTTP Webhook**

If WebSocket still doesn't work:

1. **Delete WebSocket Trigger node**
2. **Add HTTP Request Trigger node**
3. **Set URL:** `https://webscoket-o4xf.onrender.com/trigger-n8n`
4. **Method:** POST
5. **Body:**
```json
{
  "message": "Test message",
  "eventType": "message"
}
```

This will give you complete control over when the workflow executes.
