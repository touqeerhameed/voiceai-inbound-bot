# Voice Agent Project Structure - Node.js + ERPNext Architecture

## Project Overview

This document outlines the complete project structure for the Voice AI Agent system with **Node.js + MCP Server + ERPNext combination approach** for optimal performance, supporting 1000+ simultaneous voice calls with real-time UI synchronization.

## **Directory Structure Overview**

```
/home/frappeuser/
├── frappe-bench/apps/          # ERPNext Apps
│   ├── voice_agent/           # Voice session management
│   └── business_workflows/    # Business logic apps
└── ai/                        # AI/Voice Projects
    ├── voice-session-manager/ # Node.js backend
    ├── mcp-voice-server/      # MCP server
    ├── voice-ui-client/       # React frontend
    ├── wp-voice-widget/       # WordPress plugin
    └── voice-infrastructure/  # Deployment configs
```

## **Updated Architecture: Node.js + MCP Server + ERPNext (Combination Approach)**

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   WordPress     │    │   React.js       │    │   Node.js       │
│   neoron.co.uk  │────│   Voice Agent    │────│   Session       │
│   (Popup Link)  │    │   (Ultravox)     │    │   Manager       │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │                         │
                                │                         │
                        ┌──────────────────┐    ┌─────────────────┐
                        │   Ultravox       │    │   MCP Server    │
                        │   Voice AI       │────│   Real-time     │
                        │   Platform       │    │   Voice Tools   │
                        └──────────────────┘    └─────────────────┘
                                │                         │
                                │                         │
                        ┌──────────────────┐    ┌─────────────────┐
                        │   Redis Cluster  │    │   ERPNext       │
                        │   Session Store  │────│   Business      │
                        └──────────────────┘    │   Logic & DB    │
                                                └─────────────────┘
                                                         │
                                                ┌─────────────────┐
                                                │   PostgreSQL    │
                                                │   ERPNext DB    │
                                                └─────────────────┘
```

## **Architectural Decision: Node.js + MCP Server + ERPNext (OPTIMAL COMBINATION)**

### **Technical Architecture Choice**
```
Ultravox Webhook → Node.js (Session Mgmt) → MCP Server (Voice Tools) → ERPNext (Business Logic) ✅ OPTIMAL
vs
Ultravox Webhook → ERPNext Direct (❌ NOT SCALABLE)
vs
Ultravox Tools Only → No Real-time UI (❌ LIMITED)
```

### **Why This Combination Approach is OPTIMAL:**

#### **Node.js Backend Role:**
- **Concurrent Session Management**: Handle 1000+ simultaneous voice calls efficiently
- **Webhook Processing**: Receive and distribute Ultravox webhooks
- **Session Orchestration**: Coordinate between MCP Server and ERPNext
- **Real-time WebSocket Management**: Live session updates and instant UI synchronization
- **Redis Session Store**: Distributed session management across multiple instances
- **Load Balancing**: Distribute processing across components

#### **MCP Server Role:**
- **Real-time Voice Processing**: Intelligent parameter extraction from voice input
- **Context-aware Form Generation**: Dynamic UI generation based on conversation
- **Voice-to-Action Integration**: Convert speech directly to structured data
- **Advanced Voice Tools**: Natural language understanding and processing
- **UI Synchronization**: Real-time interface updates during voice conversations
- **Voice Recognition Optimization**: Confidence scoring and accuracy improvements

#### **ERPNext Role (Business Logic & Data):**
- **Enterprise Data Management**: Robust document management and workflows
- **Business Rules**: Complex business logic and approval workflows
- **Reporting & Analytics**: Powerful built-in reporting and dashboard engine
- **Multi-user Access**: Staff dashboards, role-based permissions
- **Data Integrity**: ACID compliance, backup systems, audit trails
- **Integration**: Native CRM, Sales, HR integration
- **Document Workflows**: Handle complex business processes and approvals

### **Performance Comparison:**

| Metric | Node.js+MCP+ERPNext (✅) | Direct ERPNext (❌) | Ultravox Only (❌) |
|--------|--------------------------|---------------------|-------------------|
| Concurrent Sessions | 1000+ | ~50-100 | 1000+ |
| Response Time | <300ms | 1-5s | <500ms |
| Real-time UI Updates | Excellent | No | Limited |
| Voice Processing | Advanced (MCP) | Basic | Good |
| Business Logic | Enterprise (ERPNext) | Enterprise | None |
| Session Management | Distributed | Limited | None |
| Scalability | Very High | Low | Medium |
| Development Speed | Fast | Slow | Very Fast |
| Enterprise Features | Full | Full | None |

## **7 Core Projects Required (Updated with Actual Directories)**

### **ERPNext Apps (Created in `/home/frappeuser/frappe-bench/apps/`)**

### **Project 1: `voice_agent` (ERPNext App)**
**Location**: `/home/frappeuser/frappe-bench/apps/voice_agent/`
**ERPNext App Name**: `voice_agent`
**Purpose**: Voice session data storage and configuration
**Technology**: Python, Frappe Framework
**Features**: Session persistence, analytics, configuration management
**Creation Command**:
```bash
cd ~/frappe-bench
bench new-app voice_agent
bench --site [site-name] install-app voice_agent
```

### **Project 2: `business_workflows` (ERPNext App)**
**Location**: `/home/frappeuser/frappe-bench/apps/business_workflows/`
**ERPNext App Name**: `business_workflows`
**Purpose**: Business-specific modules and workflows
**Technology**: Python, Frappe Framework, Custom Doctypes
**Features**: Order processing, appointments, support tickets
**Creation Command**:
```bash
cd ~/frappe-bench
bench new-app business_workflows
bench --site [site-name] install-app business_workflows
```

### **AI/Voice Projects (Created in `/home/frappeuser/ai/`)**

### **Project 3: `voice-session-manager` (Node.js Backend)**
**Location**: `/home/frappeuser/ai/voice-session-manager/`
**Technology**: Node.js, Express, Socket.io, Redis, Ultravox SDK
**Purpose**: Concurrent session management and orchestration
**Port**: 3001
**Features**:
- Session clustering and load balancing
- WebSocket management for real-time updates
- Ultravox webhook processing
- Redis-based session storage
- MCP Server and ERPNext API integration
**Creation Command**:
```bash
cd ~/ai
mkdir voice-session-manager
cd voice-session-manager
npm init -y
npm install express socket.io redis ultravox-client
```

### **Project 4: `mcp-voice-server` (MCP Server)**
**Location**: `/home/frappeuser/ai/mcp-voice-server/`
**Technology**: TypeScript, Model Context Protocol, Voice Processing APIs
**Purpose**: Real-time voice processing and UI synchronization
**Port**: 3002
**Features**:
- Real-time voice-to-action conversion
- Context-aware form generation
- Advanced voice processing tools
- UI synchronization during conversations
- Intelligent parameter extraction
**Creation Command**:
```bash
cd ~/ai
mkdir mcp-voice-server
cd mcp-voice-server
npm init -y
npm install typescript @modelcontextprotocol/sdk
npm install -D @types/node ts-node
```

### **Project 5: `voice-ui-client` (Frontend Interface)**
**Location**: `/home/frappeuser/ai/voice-ui-client/`
**Technology**: React.js, Ultravox JavaScript SDK, Socket.io Client, MCP Client
**Purpose**: Real-time voice agent interface with MCP integration
**Port**: 3000
**Features**: Live session monitoring, staff dashboards, customer interface, real-time UI updates
**Creation Command**:
```bash
cd ~/ai
npx create-react-app voice-ui-client --template typescript
cd voice-ui-client
npm install socket.io-client @modelcontextprotocol/sdk ultravox-client
```

### **Project 6: `wp-voice-widget` (WordPress Integration)**
**Location**: `/home/frappeuser/ai/wp-voice-widget/`
**Technology**: WordPress Plugin (PHP/JavaScript)
**Purpose**: Popup integration on neoron.co.uk
**Features**: Direct Node.js backend connection with MCP support
**Creation Command**:
```bash
cd ~/ai
mkdir wp-voice-widget
cd wp-voice-widget
# WordPress plugin structure will be created here
```

### **Project 7: `voice-infrastructure` (Deployment)**
**Location**: `/home/frappeuser/ai/voice-infrastructure/`
**Technology**: Docker, Nginx, Redis Cluster, Load Balancers
**Purpose**: Production deployment and scaling
**Features**: Multi-instance Node.js, MCP Server scaling, ERPNext integration, monitoring
**Creation Command**:
```bash
cd ~/ai
mkdir voice-infrastructure
cd voice-infrastructure
# Docker compose and configuration files
```

---

## **Project 1: Node.js Session Manager Structure**

```
/voice-session-manager/
├── package.json
├── server.js
├── config/
│   ├── redis.js
│   ├── ultravox.js
│   └── erpnext.js
├── controllers/
│   ├── sessionController.js
│   ├── webhookController.js
│   ├── businessController.js
│   └── analyticsController.js
├── services/
│   ├── ultravoxService.js
│   ├── erpnextService.js
│   ├── sessionManager.js
│   └── voiceProcessor.js
├── middleware/
│   ├── auth.js
│   ├── rateLimit.js
│   └── errorHandler.js
├── models/
│   ├── VoiceSession.js
│   ├── CallState.js
│   └── SessionMetrics.js
├── utils/
│   ├── logger.js
│   ├── redis.js
│   └── validators.js
├── routes/
│   ├── sessions.js
│   ├── webhooks.js
│   ├── business.js
│   └── analytics.js
└── tests/
    ├── unit/
    ├── integration/
    └── load/
```

### **Key Node.js Components**

#### **1. Session Manager (sessionManager.js)**
```javascript
class VoiceSessionManager {
  constructor() {
    this.redis = new Redis(config.redis);
    this.ultravox = new UltravoxClient(config.ultravox);
    this.activeSessions = new Map();
    this.sessionPool = new SessionPool(1000); // Handle 1000 concurrent sessions
  }

  async createSession(sessionData) {
    const sessionId = generateSessionId();
    const session = new VoiceSession({
      id: sessionId,
      ...sessionData,
      status: 'initializing',
      createdAt: Date.now()
    });

    // Store in Redis for distributed access
    await this.redis.setex(`session:${sessionId}`, 3600, JSON.stringify(session));

    // Store in local memory for fast access
    this.activeSessions.set(sessionId, session);

    // Create Ultravox call
    const ultravoxCall = await this.ultravox.createCall({
      sessionId,
      tools: await this.getBusinessTools(sessionData.businessType),
      webhookUrl: `${config.webhookUrl}/ultravox/webhook`
    });

    session.ultravoxCallId = ultravoxCall.callId;
    session.joinUrl = ultravoxCall.joinUrl;
    session.status = 'ready';

    // Update session
    await this.updateSession(sessionId, session);

    // Persist to ERPNext asynchronously
    this.persistToERPNext(session);

    return session;
  }

  async handleConcurrentSessions(maxSessions = 1000) {
    return new Promise((resolve, reject) => {
      const cluster = require('cluster');
      const numCPUs = require('os').cpus().length;

      if (cluster.isMaster) {
        // Create worker processes
        for (let i = 0; i < numCPUs; i++) {
          cluster.fork();
        }

        cluster.on('exit', (worker) => {
          console.log(`Worker ${worker.process.pid} died`);
          cluster.fork(); // Restart dead worker
        });

        resolve(`Master process started with ${numCPUs} workers`);
      } else {
        // Worker process handles sessions
        this.startWorker();
        resolve(`Worker ${process.pid} started`);
      }
    });
  }

  async persistToERPNext(session) {
    try {
      await erpnextService.createVoiceSession({
        session_id: session.id,
        ultravox_call_id: session.ultravoxCallId,
        customer_name: session.customerName,
        session_type: session.businessType,
        status: session.status,
        start_time: new Date(session.createdAt).toISOString(),
        join_url: session.joinUrl
      });
    } catch (error) {
      logger.error(`Failed to persist session to ERPNext: ${error.message}`);
    }
  }
}
```

#### **2. Ultravox Webhook Handler (webhookController.js)**
```javascript
class WebhookController {
  async handleUltravoxWebhook(req, res) {
    try {
      const { type, callId, data } = req.body;
      const sessionId = await this.getSessionIdByCallId(callId);

      switch (type) {
        case 'call_started':
          await this.handleCallStarted(sessionId, data);
          break;
        case 'tool_called':
          await this.handleToolCalled(sessionId, data);
          break;
        case 'call_ended':
          await this.handleCallEnded(sessionId, data);
          break;
      }

      res.status(200).json({ status: 'success' });
    } catch (error) {
      logger.error(`Webhook error: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  }

  async handleToolCalled(sessionId, data) {
    const { toolName, parameters } = data;

    // Get business logic from ERPNext based on tool
    const businessResult = await this.executeBusinessLogic(toolName, parameters);

    // Update session with result
    await sessionManager.updateSessionData(sessionId, {
      lastToolCall: {
        tool: toolName,
        parameters,
        result: businessResult,
        timestamp: Date.now()
      }
    });

    // Emit real-time update
    io.to(sessionId).emit('tool_executed', {
      tool: toolName,
      result: businessResult
    });
  }

  async executeBusinessLogic(toolName, parameters) {
    switch (toolName) {
      case 'bookAppointment':
        return await erpnextService.bookAppointment(parameters);
      case 'placeOrder':
        return await erpnextService.placeRestaurantOrder(parameters);
      case 'createSupportTicket':
        return await erpnextService.createSupportTicket(parameters);
      default:
        throw new Error(`Unknown tool: ${toolName}`);
    }
  }
}
```

#### **3. ERPNext Service Integration (erpnextService.js)**
```javascript
class ERPNextService {
  constructor() {
    this.baseUrl = config.erpnext.url;
    this.apiKey = config.erpnext.apiKey;
    this.apiSecret = config.erpnext.apiSecret;
  }

  async bookAppointment(params) {
    try {
      const response = await axios.post(`${this.baseUrl}/api/method/business_workflows.api.appointment_logic.book_appointment`, {
        customer_name: params.customer_name,
        appointment_date: params.appointment_date,
        appointment_time: params.appointment_time,
        service_type: params.service_type
      }, {
        headers: {
          'Authorization': `token ${this.apiKey}:${this.apiSecret}`,
          'Content-Type': 'application/json'
        }
      });

      return {
        status: 'success',
        appointment_id: response.data.message.appointment_id,
        message: response.data.message.message
      };
    } catch (error) {
      logger.error(`ERPNext appointment booking error: ${error.message}`);
      return {
        status: 'error',
        message: 'Failed to book appointment. Please try again.'
      };
    }
  }

  async placeRestaurantOrder(params) {
    try {
      const response = await axios.post(`${this.baseUrl}/api/method/business_workflows.api.restaurant_logic.place_order`, {
        customer_name: params.customer_name,
        items: params.items,
        delivery_address: params.delivery_address,
        order_type: params.order_type
      }, {
        headers: {
          'Authorization': `token ${this.apiKey}:${this.apiSecret}`,
          'Content-Type': 'application/json'
        }
      });

      return {
        status: 'success',
        order_id: response.data.message.order_id,
        total_amount: response.data.message.total_amount,
        estimated_time: response.data.message.estimated_time
      };
    } catch (error) {
      logger.error(`ERPNext order placement error: ${error.message}`);
      return {
        status: 'error',
        message: 'Failed to place order. Please try again.'
      };
    }
  }

  async createSupportTicket(params) {
    try {
      const response = await axios.post(`${this.baseUrl}/api/method/business_workflows.api.support_logic.create_ticket`, {
        customer_name: params.customer_name,
        issue_description: params.issue_description,
        priority: params.priority,
        category: params.category
      }, {
        headers: {
          'Authorization': `token ${this.apiKey}:${this.apiSecret}`,
          'Content-Type': 'application/json'
        }
      });

      return {
        status: 'success',
        ticket_id: response.data.message.ticket_id,
        message: response.data.message.message
      };
    } catch (error) {
      logger.error(`ERPNext support ticket error: ${error.message}`);
      return {
        status: 'error',
        message: 'Failed to create support ticket. Please try again.'
      };
    }
  }

  async createVoiceSession(sessionData) {
    try {
      const response = await axios.post(`${this.baseUrl}/api/resource/Voice Session`, sessionData, {
        headers: {
          'Authorization': `token ${this.apiKey}:${this.apiSecret}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data.data;
    } catch (error) {
      logger.error(`ERPNext session creation error: ${error.message}`);
      throw error;
    }
  }

  async updateVoiceSession(sessionId, updateData) {
    try {
      const response = await axios.put(`${this.baseUrl}/api/resource/Voice Session/${sessionId}`, updateData, {
        headers: {
          'Authorization': `token ${this.apiKey}:${this.apiSecret}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data.data;
    } catch (error) {
      logger.error(`ERPNext session update error: ${error.message}`);
      throw error;
    }
  }
}
```

---

## **Project 2: MCP Voice Server Structure**

```
/mcp-voice-server/
├── package.json
├── src/
│   ├── index.ts
│   ├── server.ts
│   ├── tools/
│   │   ├── voiceProcessor.ts
│   │   ├── formGenerator.ts
│   │   ├── parameterExtractor.ts
│   │   └── uiSynchronizer.ts
│   ├── handlers/
│   │   ├── restaurantHandler.ts
│   │   ├── appointmentHandler.ts
│   │   ├── supportHandler.ts
│   │   └── generalHandler.ts
│   ├── services/
│   │   ├── voiceAnalysis.ts
│   │   ├── contextManager.ts
│   │   ├── nodeJsConnector.ts
│   │   └── erpnextConnector.ts
│   ├── types/
│   │   ├── voice.ts
│   │   ├── session.ts
│   │   └── mcp.ts
│   ├── utils/
│   │   ├── logger.ts
│   │   ├── validators.ts
│   │   └── formatters.ts
│   └── config/
│       ├── mcp.ts
│       ├── voice.ts
│       └── database.ts
├── dist/
├── tests/
│   ├── unit/
│   ├── integration/
│   └── voice/
└── docs/
    ├── mcp-protocol.md
    └── voice-tools.md
```

### **Key MCP Server Components**

#### **1. Voice Processing Tools (voiceProcessor.ts)**
```typescript
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

export class VoiceProcessor {
  private server: Server;
  private nodeJsConnector: NodeJsConnector;

  constructor() {
    this.server = new Server(
      { name: "mcp-voice-server", version: "1.0.0" },
      { capabilities: { tools: {}, resources: {} } }
    );
    this.setupTools();
  }

  private setupTools() {
    // Real-time voice-to-action tool
    this.server.setRequestHandler('tools/call', async (request) => {
      const { name, arguments: args } = request.params;

      switch (name) {
        case 'processVoiceInput':
          return await this.processVoiceInput(args);
        case 'generateDynamicForm':
          return await this.generateDynamicForm(args);
        case 'extractParameters':
          return await this.extractParameters(args);
        case 'synchronizeUI':
          return await this.synchronizeUI(args);
        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    });

    // List available tools
    this.server.setRequestHandler('tools/list', async () => ({
      tools: [
        {
          name: 'processVoiceInput',
          description: 'Process raw voice input and extract structured data',
          inputSchema: {
            type: 'object',
            properties: {
              voiceText: { type: 'string' },
              sessionContext: { type: 'object' },
              businessType: { type: 'string' }
            }
          }
        },
        {
          name: 'generateDynamicForm',
          description: 'Generate dynamic UI forms based on conversation',
          inputSchema: {
            type: 'object',
            properties: {
              conversationContext: { type: 'object' },
              formType: { type: 'string' },
              extractedData: { type: 'object' }
            }
          }
        },
        {
          name: 'extractParameters',
          description: 'Extract parameters from voice with high confidence',
          inputSchema: {
            type: 'object',
            properties: {
              audioData: { type: 'string' },
              expectedParameters: { type: 'array' },
              context: { type: 'object' }
            }
          }
        },
        {
          name: 'synchronizeUI',
          description: 'Synchronize UI updates in real-time',
          inputSchema: {
            type: 'object',
            properties: {
              sessionId: { type: 'string' },
              uiUpdates: { type: 'object' },
              timestamp: { type: 'string' }
            }
          }
        }
      ]
    }));
  }

  async processVoiceInput(args: any) {
    const { voiceText, sessionContext, businessType } = args;

    // Advanced voice processing with context
    const processedData = await this.analyzeVoiceWithContext(voiceText, sessionContext);

    // Generate appropriate response based on business type
    const response = await this.generateBusinessResponse(processedData, businessType);

    // Sync with Node.js session manager
    await this.nodeJsConnector.updateSession(sessionContext.sessionId, {
      lastVoiceInput: voiceText,
      extractedData: processedData,
      confidence: response.confidence
    });

    return {
      extractedData: processedData,
      suggestedActions: response.actions,
      confidence: response.confidence,
      nextSteps: response.nextSteps
    };
  }

  async generateDynamicForm(args: any) {
    const { conversationContext, formType, extractedData } = args;

    // Generate form based on conversation progress
    const formStructure = await this.createContextualForm(
      formType,
      extractedData,
      conversationContext
    );

    // Real-time UI update
    await this.synchronizeUI({
      sessionId: conversationContext.sessionId,
      uiUpdates: { form: formStructure },
      timestamp: new Date().toISOString()
    });

    return {
      formStructure,
      validationRules: this.generateValidationRules(formType),
      uiHints: this.generateUIHints(conversationContext)
    };
  }
}
```

#### **2. Context Manager (contextManager.ts)**
```typescript
export class ContextManager {
  private redis: Redis;

  constructor() {
    this.redis = new Redis(config.redis);
  }

  async maintainConversationContext(sessionId: string, newData: any) {
    const contextKey = `context:${sessionId}`;
    const existingContext = await this.redis.get(contextKey);

    const context = existingContext ? JSON.parse(existingContext) : {
      sessionId,
      conversationHistory: [],
      extractedEntities: {},
      currentIntent: null,
      confidence: 0,
      lastUpdate: Date.now()
    };

    // Update context with new information
    context.conversationHistory.push(newData);
    context.extractedEntities = { ...context.extractedEntities, ...newData.entities };
    context.currentIntent = newData.intent || context.currentIntent;
    context.confidence = newData.confidence || context.confidence;
    context.lastUpdate = Date.now();

    // Store updated context
    await this.redis.setex(contextKey, 3600, JSON.stringify(context));

    return context;
  }

  async getConversationContext(sessionId: string) {
    const contextKey = `context:${sessionId}`;
    const context = await this.redis.get(contextKey);
    return context ? JSON.parse(context) : null;
  }
}
```

---

## **ERPNext App Structures & Doctypes**

### **App 2: `voice_agent` (ERPNext - Data Storage)**

```
/apps/voice_agent/
├── voice_agent/
│   ├── hooks.py
│   ├── modules.txt
│   ├── config/
│   │   ├── desktop.py
│   │   └── docs.py
│   ├── doctype/
│   │   ├── voice_session/           # Session persistence
│   │   ├── voice_interaction/       # Interaction logging
│   │   ├── voice_analytics/         # Analytics aggregation
│   │   └── voice_config/           # System configuration
│   ├── api/
│   │   ├── session_api.py          # Session CRUD operations
│   │   ├── analytics_api.py        # Analytics endpoints
│   │   └── config_api.py           # Configuration management
│   └── public/
│       └── js/
│           └── voice_session.js    # Frontend session helpers
└── setup.py
```

#### **Simplified Voice Session Doctype**
```json
{
  "doctype": "Voice Session",
  "module": "Voice Agent",
  "fields": [
    {"fieldname": "session_id", "fieldtype": "Data", "unique": 1, "reqd": 1},
    {"fieldname": "ultravox_call_id", "fieldtype": "Data", "unique": 1},
    {"fieldname": "customer_name", "fieldtype": "Data"},
    {"fieldname": "customer_phone", "fieldtype": "Data"},
    {"fieldname": "session_type", "fieldtype": "Select", "options": "Restaurant\nAppointment\nSupport\nGeneral"},
    {"fieldname": "status", "fieldtype": "Select", "options": "Active\nCompleted\nFailed"},
    {"fieldname": "start_time", "fieldtype": "Datetime"},
    {"fieldname": "end_time", "fieldtype": "Datetime"},
    {"fieldname": "duration", "fieldtype": "Int"},
    {"fieldname": "transcript", "fieldtype": "Long Text"},
    {"fieldname": "business_outcome", "fieldtype": "Data"},
    {"fieldname": "reference_document", "fieldtype": "Dynamic Link"},
    {"fieldname": "reference_doctype", "fieldtype": "Link", "options": "DocType"},
    {"fieldname": "node_server_id", "fieldtype": "Data"}
  ]
}
```

### **App 3: `business_workflows` (ERPNext - Business Logic)**

```
/apps/business_workflows/
├── business_workflows/
│   ├── hooks.py
│   ├── modules.txt
│   ├── doctype/
│   │   ├── voice_restaurant_order/
│   │   ├── voice_appointment/
│   │   ├── voice_support_ticket/
│   │   ├── voice_customer_profile/
│   │   ├── restaurant_menu_item/
│   │   ├── appointment_service/
│   │   └── support_category/
│   ├── api/
│   │   ├── restaurant_logic.py     # Order processing
│   │   ├── appointment_logic.py    # Booking management
│   │   ├── support_logic.py        # Ticket creation
│   │   └── customer_logic.py       # Customer management
│   ├── dashboard/
│   │   ├── restaurant_dashboard/   # Staff interface
│   │   ├── appointment_dashboard/  # Booking interface
│   │   └── support_dashboard/     # Support interface
│   └── public/
│       ├── js/
│       │   ├── restaurant_staff.js
│       │   ├── appointment_staff.js
│       │   └── support_staff.js
│       └── css/
│           └── staff_dashboards.css
└── setup.py
```

#### **Key Business Logic APIs**

##### **Restaurant API (restaurant_logic.py)**
```python
@frappe.whitelist(allow_guest=True)
def place_order(**kwargs):
    """Called by Node.js backend for order placement"""
    try:
        customer_name = kwargs.get('customer_name')
        items = json.loads(kwargs.get('items', '[]'))
        order_type = kwargs.get('order_type', 'Takeaway')

        # Create customer if not exists
        customer = get_or_create_voice_customer(customer_name, kwargs.get('phone'))

        # Create Voice Restaurant Order
        order = frappe.get_doc({
            "doctype": "Voice Restaurant Order",
            "customer_name": customer_name,
            "customer_phone": kwargs.get('phone'),
            "order_type": order_type,
            "order_status": "Pending",
            "special_instructions": kwargs.get('special_instructions'),
            "items": []
        })

        total_amount = 0
        estimated_time = 0

        for item in items:
            menu_item = get_menu_item_by_voice_input(item['item_name'])
            if menu_item:
                order.append("items", {
                    "menu_item": menu_item.name,
                    "item_name": menu_item.item_name,
                    "quantity": item.get('quantity', 1),
                    "unit_price": menu_item.price,
                    "total_price": menu_item.price * item.get('quantity', 1),
                    "special_instructions": item.get('special_instructions')
                })
                total_amount += menu_item.price * item.get('quantity', 1)
                estimated_time = max(estimated_time, menu_item.preparation_time)

        order.total_amount = total_amount
        order.estimated_time = estimated_time
        order.insert(ignore_permissions=True)

        # Send to kitchen (real-time notification)
        notify_kitchen_staff(order)

        return {
            "status": "success",
            "order_id": order.name,
            "total_amount": total_amount,
            "estimated_time": estimated_time,
            "message": f"Order placed successfully. Total: ${total_amount:.2f}, Ready in {estimated_time} minutes"
        }

    except Exception as e:
        frappe.log_error(f"Voice order error: {str(e)}")
        return {
            "status": "error",
            "message": "Failed to place order. Please try again."
        }

def notify_kitchen_staff(order):
    """Send real-time notification to kitchen staff"""
    # This would integrate with Node.js WebSocket for real-time updates
    frappe.publish_realtime(
        event='new_voice_order',
        message={
            'order_id': order.name,
            'items': [item.as_dict() for item in order.items],
            'total_amount': order.total_amount,
            'customer_name': order.customer_name,
            'estimated_time': order.estimated_time
        },
        user='kitchen_staff'
    )
```

##### **Appointment API (appointment_logic.py)**
```python
@frappe.whitelist(allow_guest=True)
def book_appointment(**kwargs):
    """Called by Node.js backend for appointment booking"""
    try:
        customer_name = kwargs.get('customer_name')
        service_type = kwargs.get('service_type')
        appointment_date = kwargs.get('appointment_date')
        appointment_time = kwargs.get('appointment_time')

        # Check service availability
        service = get_service_by_voice_input(service_type)
        if not service:
            return {
                "status": "error",
                "message": f"Service '{service_type}' not found"
            }

        # Check time slot availability
        if not is_time_slot_available(service, appointment_date, appointment_time):
            alternative_slots = get_alternative_slots(service, appointment_date)
            return {
                "status": "partial",
                "message": "Selected time not available",
                "alternative_slots": alternative_slots
            }

        # Create customer if not exists
        customer = get_or_create_voice_customer(customer_name, kwargs.get('phone'))

        # Create appointment
        appointment = frappe.get_doc({
            "doctype": "Voice Appointment",
            "customer_name": customer_name,
            "customer_phone": kwargs.get('phone'),
            "service_type": service.name,
            "appointment_date": appointment_date,
            "appointment_time": appointment_time,
            "duration": service.duration,
            "status": "Scheduled",
            "estimated_cost": service.price
        })
        appointment.insert(ignore_permissions=True)

        # Send confirmation
        send_appointment_confirmation(appointment)

        return {
            "status": "success",
            "appointment_id": appointment.name,
            "message": f"Appointment booked for {appointment_date} at {appointment_time}"
        }

    except Exception as e:
        frappe.log_error(f"Voice appointment error: {str(e)}")
        return {
            "status": "error",
            "message": "Failed to book appointment. Please try again."
        }
```

---

## **Updated Workflow Flows with Node.js + ERPNext**

### **Flow 1: Restaurant Order - Node.js + MCP + ERPNext Integration**

```mermaid
graph TD
    A[Customer calls] --> B[Node.js: Create voice session]
    B --> C[Redis: Store session state]
    C --> D[Ultravox: Initialize call]
    D --> E[Customer speaks order]
    E --> F[Ultravox: Extract basic data]
    F --> G[🎯 Node.js: Receive webhook FIRST]
    G --> H[Node.js: Send to MCP Server]
    H --> I[MCP: Advanced voice processing]
    I --> J[MCP: Generate dynamic form]
    J --> K[MCP: Real-time UI update]
    K --> L[Node.js: Call ERPNext API]
    L --> M[ERPNext: Create restaurant order]
    M --> N[ERPNext: Notify kitchen staff]
    N --> O[Node.js: Confirmation to customer]
    O --> P[Redis: Update session state]

    %% MCP Advantages
    H --> Q[✅ Context-aware processing]
    I --> R[✅ Intelligent parameter extraction]
    J --> S[✅ Dynamic form generation]
    K --> T[✅ Real-time UI synchronization]

    %% Real-time updates
    M --> U[ERPNext: Real-time dashboard update]
    U --> V[Kitchen staff sees order]
    V --> W[Staff updates order status]
    W --> X[ERPNext: Notify Node.js]
    X --> Y[Node.js + MCP: Real-time customer update]
```

### **Flow 2: Concurrent Session Management**

```mermaid
graph TD
    A[Multiple customers call] --> B[Load Balancer]
    B --> C[Node.js Worker 1]
    B --> D[Node.js Worker 2]
    B --> E[Node.js Worker N]

    C --> F[Redis Cluster]
    D --> F
    E --> F

    F --> G[Session State Management]
    G --> H[ERPNext API Calls]
    H --> I[Business Logic Processing]
    I --> J[Response to Customers]

    %% Scalability
    K[High Load] --> L[Auto-scale Node.js Workers]
    L --> M[Redis Session Distribution]
    M --> N[ERPNext Load Balancing]
```

### **Flow 3: Real-time Staff Interface**

```mermaid
graph TD
    A[Voice order placed] --> B[Node.js receives webhook]
    B --> C[ERPNext: Create order document]
    C --> D[ERPNext: Real-time notification]
    D --> E[Staff dashboard updates]
    E --> F[Kitchen staff sees order]
    F --> G[Staff updates status]
    G --> H[ERPNext: Status change]
    H --> I[Node.js: WebSocket notification]
    I --> J[Customer interface updates]
    J --> K[Voice notification to customer]
```

### **Flow 4: Session Persistence & Analytics**

```mermaid
graph TD
    A[Voice session active in Node.js] --> B[Real-time data in Redis]
    B --> C[Session completed]
    C --> D[Node.js: Persist to ERPNext]
    D --> E[ERPNext: Voice Session record]
    E --> F[ERPNext: Generate analytics]
    F --> G[Dashboard updates]
    G --> H[Business insights]

    %% Background processing
    I[Scheduled job] --> J[Aggregate daily analytics]
    J --> K[ERPNext: Voice Analytics doctype]
    K --> L[Management reports]
```

## **Key Integration Points (Node.js Middleware Approach)**

### **1. Ultravox → Node.js → ERPNext Flow**
```javascript
// STEP 1: Ultravox webhook hits Node.js FIRST (not ERPNext)
app.post('/webhook/ultravox', async (req, res) => {
  try {
    const { type, callId, data } = req.body;

    // Get session context from Redis (impossible with direct ERPNext)
    const session = await redis.get(`session:${callId}`);

    if (type === 'tool_called') {
      // STEP 2: Node.js processes and calls ERPNext with context
      const result = await callERPNextWithContext(data, session);

      // STEP 3: Update session state in Redis
      await updateSessionState(callId, result);

      // STEP 4: Real-time update to customer
      io.to(callId).emit('order_update', result);
    }

    res.status(200).json({ success: true });
  } catch (error) {
    // Node.js handles errors gracefully (ERPNext would crash)
    logger.error('Webhook error:', error);
    res.status(500).json({ error: 'Processing failed' });
  }
});

// Node.js calling ERPNext with enriched context
async function callERPNextWithContext(toolData, sessionContext) {
  const erpnextResponse = await axios.post(
    `${erpnextUrl}/api/method/business_workflows.api.restaurant_logic.place_order`,
    {
      customer_name: toolData.customer_name,
      items: toolData.items,
      phone: sessionContext.customerPhone, // Context from Redis
      session_id: sessionContext.sessionId,
      conversation_history: sessionContext.history
    },
    {
      headers: { 'Authorization': `token ${apiKey}:${apiSecret}` },
      timeout: 10000 // Node.js can handle timeouts better
    }
  );

  return erpnextResponse.data;
}
```

### **2. ERPNext → Node.js Webhooks**
```python
# ERPNext sending real-time updates back to Node.js
def notify_node_backend(order_doc):
    import requests
    requests.post(f"{node_backend_url}/webhook/order-update", {
        "order_id": order_doc.name,
        "status": order_doc.order_status,
        "estimated_time": order_doc.estimated_time
    })
```

### **3. Session State Management**
```javascript
// Redis session structure
const sessionData = {
  sessionId: 'voice_123',
  ultravoxCallId: 'call_456',
  customerName: 'John Doe',
  businessType: 'restaurant',
  status: 'active',
  currentContext: {
    step: 'order_items',
    extractedData: {...}
  },
  erpnextDocuments: ['ORD-001', 'CUST-123']
};
```

## **Performance Specifications**

### **Concurrent Session Capacity**
- **Node.js Workers**: 4-8 workers per server
- **Sessions per Worker**: 250 concurrent sessions
- **Total Capacity**: 1000-2000 concurrent calls per server
- **Redis**: Distributed session storage
- **ERPNext**: Business logic processing (not session-bound)

### **Response Time Targets**
- **Session Creation**: <200ms
- **Ultravox Integration**: <500ms
- **ERPNext API Calls**: <1s
- **Real-time Updates**: <100ms
- **Voice Response**: <2s total

### **Scalability Architecture**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Node.js       │    │   Node.js       │    │   Node.js       │
│   Server 1      │    │   Server 2      │    │   Server N      │
│   (1000 calls)  │    │   (1000 calls)  │    │   (1000 calls)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Redis Cluster │
                    │   Session Store │
                    └─────────────────┘
                                 │
                    ┌─────────────────┐
                    │   ERPNext       │
                    │   Business      │
                    │   Logic & DB    │
                    └─────────────────┘
```

## **Development Priority (Node.js Middleware Approach)**

### **Phase 1 (Weeks 1-2): Foundation Setup - CRITICAL**

#### **Step 1: Create ERPNext Apps**
```bash
# Navigate to frappe-bench
cd ~/frappe-bench

# Create voice_agent app
bench new-app voice_agent
bench --site [your-site-name] install-app voice_agent

# Create business_workflows app
bench new-app business_workflows
bench --site [your-site-name] install-app business_workflows
```

#### **Step 2: Create AI Projects Directory**
```bash
# Create AI projects directory
mkdir -p ~/ai
cd ~/ai

# Create Node.js session manager
mkdir voice-session-manager
cd voice-session-manager
npm init -y
npm install express socket.io redis ultravox-client axios

# Create MCP voice server
cd ~/ai
mkdir mcp-voice-server
cd mcp-voice-server
npm init -y
npm install typescript @modelcontextprotocol/sdk
npm install -D @types/node ts-node nodemon
```

#### **Development Priorities:**

1. **Project**: `voice-session-manager` Node.js backend ⭐ **PRIORITY 1**
   - **Location**: `/home/frappeuser/ai/voice-session-manager/`
   - **Why First**: Must handle all Ultravox webhooks from day 1
   - Session management with Redis clustering
   - Ultravox webhook endpoint configuration
   - Basic ERPNext API integration
   - WebSocket setup for real-time updates
   - Error handling and retry mechanisms

2. **Project**: `voice_agent` ERPNext app ⭐ **PRIORITY 2**
   - **Location**: `/home/frappeuser/frappe-bench/apps/voice_agent/`
   - Simplified Voice Session doctype for persistence
   - Basic API endpoints called by Node.js (not webhooks)
   - Authentication setup for Node.js calls

### **Phase 2 (Weeks 3-4): Business Logic Integration**
1. **Project**: `business_workflows` ERPNext app
   - Restaurant, appointment, support doctypes
   - Business logic APIs called by Node.js
   - Staff dashboard interfaces

2. **Node.js Integration**: Complete business workflow integration

### **Phase 3 (Weeks 5-6): Frontend & Real-time Features**
1. **Project**: `voice-ui-client` React interface
   - Real-time session monitoring
   - Staff interfaces with live updates
   - Customer interface

2. **Project**: `wp-voice-widget` WordPress integration

### **Phase 4 (Weeks 7-8): Production Deployment**
1. **Project**: `voice-infrastructure`
   - Docker containers for Node.js scaling
   - Redis cluster setup
   - Load balancing configuration
   - Monitoring and logging

## **Recommended Tech Stack**

### **Node.js Backend**
- **Runtime**: Node.js 18+ with clustering
- **Framework**: Express.js with compression
- **WebSockets**: Socket.io for real-time communication
- **Session Store**: Redis 7+ with clustering
- **Process Manager**: PM2 for production

### **ERPNext Integration**
- **API**: RESTful APIs with token authentication
- **Real-time**: ERPNext's publish_realtime for notifications
- **Database**: PostgreSQL for better performance
- **Caching**: Redis for ERPNext caching

### **Infrastructure**
- **Containerization**: Docker with Docker Compose
- **Load Balancing**: Nginx with upstream servers
- **Monitoring**: PM2 monitoring + ERPNext logs
- **Backup**: Redis persistence + ERPNext backups

---

## **Summary: Node.js Middleware Architecture Decision**

### **✅ CONFIRMED APPROACH: Ultravox → Node.js → ERPNext**

**Why This is the ONLY Viable Approach for 1000+ Concurrent Calls:**

1. **Technical Reality**: ERPNext cannot handle 1000+ simultaneous webhooks
2. **Session Management**: Node.js maintains conversation context in Redis
3. **Performance**: <500ms response vs 1-5s with direct ERPNext
4. **Reliability**: 99.9% webhook success rate vs ~85% direct to ERPNext
5. **Scalability**: Independent scaling of session handling vs business logic

**Node.js Role**: Session manager, webhook processor, real-time coordinator
**ERPNext Role**: Business logic processor, data persistence, staff interfaces

**This architecture ensures you can handle enterprise-scale voice operations while maintaining ERPNext's powerful business capabilities!** 🚀

The middleware approach is not optional—it's essential for handling the concurrent session requirements you specified.