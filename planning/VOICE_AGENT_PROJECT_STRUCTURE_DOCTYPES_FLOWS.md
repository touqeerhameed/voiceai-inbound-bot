# Voice Agent Project Structure - Complete Documentation

## Project Overview

This document outlines the complete project structure for the Voice AI Agent system with ERPNext direct integration, including all required projects, doctypes, and workflow flows.

## **5 Core Projects Required**

### **Project 1: `voice_agent` (Core Engine)**
**ERPNext App Name**: `voice_agent`
**Purpose**: Core voice processing and Ultravox integration
**Technology**: Python, Frappe Framework, Ultravox SDK

### **Project 2: `business_workflows` (Business Logic)**
**ERPNext App Name**: `business_workflows`
**Purpose**: Business-specific modules and workflows
**Technology**: Python, Frappe Framework, Custom Doctypes

### **Project 3: `voice-ui-client` (Frontend Interface)**
**Technology**: React.js, Ultravox JavaScript SDK
**Purpose**: Real-time voice agent interface
**Deployment**: Standalone React app or ERPNext web pages

### **Project 4: `wp-voice-widget` (WordPress Integration)**
**Technology**: WordPress Plugin (PHP/JavaScript)
**Purpose**: Popup integration on neoron.co.uk
**Features**: Direct ERPNext API connection

### **Project 5: `voice-infrastructure` (Deployment)**
**Technology**: Docker, Nginx, Redis, Load Balancers
**Purpose**: Production deployment and scaling
**Features**: Multi-instance support, session management

---

## **ERPNext App Structures & Doctypes**

### **App 1: `voice_agent` - Core Engine**

```
/apps/voice_agent/
├── voice_agent/
│   ├── hooks.py
│   ├── modules.txt
│   ├── config/
│   │   ├── desktop.py
│   │   └── docs.py
│   ├── doctype/
│   │   ├── voice_session/
│   │   ├── voice_interaction/
│   │   ├── ultravox_config/
│   │   ├── voice_analytics/
│   │   ├── voice_tool_usage/
│   │   └── voice_quality_metrics/
│   ├── api/
│   │   ├── ultravox_handler.py
│   │   ├── voice_processor.py
│   │   ├── webhook_handlers.py
│   │   └── session_manager.py
│   ├── utils/
│   │   ├── ultravox_client.py
│   │   ├── voice_tools.py
│   │   └── quality_analyzer.py
│   └── public/
│       ├── js/
│       │   ├── ultravox_integration.js
│       │   └── voice_controls.js
│       └── css/
│           └── voice_agent.css
└── setup.py
```

#### **Core Doctypes for `voice_agent` App**

##### **1. Voice Session**
```json
{
  "doctype": "Voice Session",
  "module": "Voice Agent",
  "fields": [
    {"fieldname": "session_id", "fieldtype": "Data", "unique": 1, "reqd": 1},
    {"fieldname": "ultravox_call_id", "fieldtype": "Data", "unique": 1},
    {"fieldname": "customer_name", "fieldtype": "Data"},
    {"fieldname": "customer_phone", "fieldtype": "Data"},
    {"fieldname": "session_type", "fieldtype": "Select", "options": "General\nRestaurant\nAppointment\nSupport"},
    {"fieldname": "status", "fieldtype": "Select", "options": "Pending\nActive\nCompleted\nFailed"},
    {"fieldname": "start_time", "fieldtype": "Datetime"},
    {"fieldname": "end_time", "fieldtype": "Datetime"},
    {"fieldname": "duration", "fieldtype": "Int"},
    {"fieldname": "join_url", "fieldtype": "Data"},
    {"fieldname": "recording_url", "fieldtype": "Data"},
    {"fieldname": "transcript", "fieldtype": "Long Text"},
    {"fieldname": "conversation_summary", "fieldtype": "Long Text"},
    {"fieldname": "language", "fieldtype": "Data", "default": "en-US"},
    {"fieldname": "voice_model", "fieldtype": "Data", "default": "professional"},
    {"fieldname": "confidence_score", "fieldtype": "Float"},
    {"fieldname": "satisfaction_rating", "fieldtype": "Int"},
    {"fieldname": "business_outcome", "fieldtype": "Data"},
    {"fieldname": "reference_document", "fieldtype": "Dynamic Link"},
    {"fieldname": "reference_doctype", "fieldtype": "Link", "options": "DocType"}
  ]
}
```

##### **2. Voice Interaction**
```json
{
  "doctype": "Voice Interaction",
  "module": "Voice Agent",
  "fields": [
    {"fieldname": "session", "fieldtype": "Link", "options": "Voice Session", "reqd": 1},
    {"fieldname": "interaction_type", "fieldtype": "Select", "options": "customer_message\nai_response\ntool_call\nsystem_event"},
    {"fieldname": "timestamp", "fieldtype": "Datetime", "reqd": 1},
    {"fieldname": "speaker", "fieldtype": "Select", "options": "Customer\nAI Agent\nSystem"},
    {"fieldname": "message_text", "fieldtype": "Long Text"},
    {"fieldname": "audio_url", "fieldtype": "Data"},
    {"fieldname": "confidence_score", "fieldtype": "Float"},
    {"fieldname": "intent_detected", "fieldtype": "Data"},
    {"fieldname": "entities_extracted", "fieldtype": "JSON"},
    {"fieldname": "tool_called", "fieldtype": "Data"},
    {"fieldname": "tool_parameters", "fieldtype": "JSON"},
    {"fieldname": "tool_response", "fieldtype": "JSON"},
    {"fieldname": "processing_time_ms", "fieldtype": "Int"},
    {"fieldname": "error_message", "fieldtype": "Data"}
  ]
}
```

##### **3. Ultravox Config**
```json
{
  "doctype": "Ultravox Config",
  "module": "Voice Agent",
  "fields": [
    {"fieldname": "config_name", "fieldtype": "Data", "reqd": 1, "unique": 1},
    {"fieldname": "business_type", "fieldtype": "Select", "options": "Restaurant\nAppointment\nSupport\nGeneral"},
    {"fieldname": "system_prompt", "fieldtype": "Long Text", "reqd": 1},
    {"fieldname": "voice_model", "fieldtype": "Select", "options": "professional\ncasual\nfriendly\nauthoritative"},
    {"fieldname": "language", "fieldtype": "Select", "options": "en-US\nes-ES\nfr-FR\nde-DE"},
    {"fieldname": "temperature", "fieldtype": "Float", "default": 0.7},
    {"fieldname": "max_duration", "fieldtype": "Int", "default": 600},
    {"fieldname": "recording_enabled", "fieldtype": "Check", "default": 1},
    {"fieldname": "transcript_enabled", "fieldtype": "Check", "default": 1},
    {"fieldname": "tools_config", "fieldtype": "JSON"},
    {"fieldname": "webhook_url", "fieldtype": "Data"},
    {"fieldname": "business_hours", "fieldtype": "JSON"},
    {"fieldname": "fallback_message", "fieldtype": "Long Text"},
    {"fieldname": "is_active", "fieldtype": "Check", "default": 1}
  ]
}
```

##### **4. Voice Analytics**
```json
{
  "doctype": "Voice Analytics",
  "module": "Voice Agent",
  "fields": [
    {"fieldname": "date", "fieldtype": "Date", "reqd": 1},
    {"fieldname": "business_type", "fieldtype": "Select", "options": "Restaurant\nAppointment\nSupport\nGeneral"},
    {"fieldname": "total_sessions", "fieldtype": "Int", "default": 0},
    {"fieldname": "successful_sessions", "fieldtype": "Int", "default": 0},
    {"fieldname": "failed_sessions", "fieldtype": "Int", "default": 0},
    {"fieldname": "avg_duration", "fieldtype": "Float"},
    {"fieldname": "avg_confidence", "fieldtype": "Float"},
    {"fieldname": "avg_satisfaction", "fieldtype": "Float"},
    {"fieldname": "total_revenue", "fieldtype": "Currency", "default": 0},
    {"fieldname": "conversion_rate", "fieldtype": "Percent"},
    {"fieldname": "popular_intents", "fieldtype": "JSON"},
    {"fieldname": "peak_hours", "fieldtype": "JSON"},
    {"fieldname": "error_patterns", "fieldtype": "JSON"}
  ]
}
```

##### **5. Voice Tool Usage**
```json
{
  "doctype": "Voice Tool Usage",
  "module": "Voice Agent",
  "fields": [
    {"fieldname": "session", "fieldtype": "Link", "options": "Voice Session"},
    {"fieldname": "tool_name", "fieldtype": "Data", "reqd": 1},
    {"fieldname": "timestamp", "fieldtype": "Datetime", "reqd": 1},
    {"fieldname": "parameters", "fieldtype": "JSON"},
    {"fieldname": "response", "fieldtype": "JSON"},
    {"fieldname": "execution_time_ms", "fieldtype": "Int"},
    {"fieldname": "success", "fieldtype": "Check"},
    {"fieldname": "error_message", "fieldtype": "Data"},
    {"fieldname": "business_impact", "fieldtype": "Data"}
  ]
}
```

##### **6. Voice Quality Metrics**
```json
{
  "doctype": "Voice Quality Metrics",
  "module": "Voice Agent",
  "fields": [
    {"fieldname": "session", "fieldtype": "Link", "options": "Voice Session", "reqd": 1},
    {"fieldname": "audio_quality_score", "fieldtype": "Float"},
    {"fieldname": "speech_clarity", "fieldtype": "Float"},
    {"fieldname": "background_noise_level", "fieldtype": "Float"},
    {"fieldname": "response_accuracy", "fieldtype": "Float"},
    {"fieldname": "intent_recognition_accuracy", "fieldtype": "Float"},
    {"fieldname": "conversation_flow_score", "fieldtype": "Float"},
    {"fieldname": "customer_satisfaction", "fieldtype": "Float"},
    {"fieldname": "ai_response_appropriateness", "fieldtype": "Float"},
    {"fieldname": "task_completion_rate", "fieldtype": "Float"},
    {"fieldname": "escalation_needed", "fieldtype": "Check"},
    {"fieldname": "quality_issues", "fieldtype": "JSON"}
  ]
}
```

---

### **App 2: `business_workflows` - Business Logic**

```
/apps/business_workflows/
├── business_workflows/
│   ├── hooks.py
│   ├── modules.txt
│   ├── config/
│   │   ├── desktop.py
│   │   └── docs.py
│   ├── doctype/
│   │   ├── voice_restaurant_order/
│   │   ├── voice_appointment/
│   │   ├── voice_support_ticket/
│   │   ├── voice_customer_profile/
│   │   ├── restaurant_menu_item/
│   │   ├── appointment_service/
│   │   └── support_category/
│   ├── api/
│   │   ├── restaurant_logic.py
│   │   ├── appointment_logic.py
│   │   ├── support_logic.py
│   │   └── customer_logic.py
│   ├── dashboard/
│   │   ├── restaurant_dashboard/
│   │   ├── appointment_dashboard/
│   │   └── support_dashboard/
│   └── public/
│       ├── js/
│       │   ├── restaurant_interface.js
│       │   ├── appointment_interface.js
│       │   └── support_interface.js
│       └── css/
│           └── business_workflows.css
└── setup.py
```

#### **Business Doctypes for `business_workflows` App**

##### **7. Voice Restaurant Order**
```json
{
  "doctype": "Voice Restaurant Order",
  "module": "Business Workflows",
  "fields": [
    {"fieldname": "voice_session", "fieldtype": "Link", "options": "Voice Session", "reqd": 1},
    {"fieldname": "order_id", "fieldtype": "Data", "unique": 1, "reqd": 1},
    {"fieldname": "customer_name", "fieldtype": "Data", "reqd": 1},
    {"fieldname": "customer_phone", "fieldtype": "Data"},
    {"fieldname": "order_type", "fieldtype": "Select", "options": "Dine In\nTakeaway\nDelivery"},
    {"fieldname": "delivery_address", "fieldtype": "Long Text"},
    {"fieldname": "order_status", "fieldtype": "Select", "options": "Pending\nConfirmed\nPreparing\nReady\nDelivered\nCancelled"},
    {"fieldname": "estimated_time", "fieldtype": "Int"},
    {"fieldname": "special_instructions", "fieldtype": "Long Text"},
    {"fieldname": "total_amount", "fieldtype": "Currency"},
    {"fieldname": "payment_status", "fieldtype": "Select", "options": "Pending\nPaid\nFailed"},
    {"fieldname": "order_items", "fieldtype": "Table", "options": "Voice Order Item"},
    {"fieldname": "kitchen_notes", "fieldtype": "Long Text"},
    {"fieldname": "staff_assigned", "fieldtype": "Link", "options": "Employee"},
    {"fieldname": "preparation_started", "fieldtype": "Datetime"},
    {"fieldname": "ready_time", "fieldtype": "Datetime"},
    {"fieldname": "delivery_time", "fieldtype": "Datetime"}
  ]
}
```

##### **8. Voice Order Item (Child Table)**
```json
{
  "doctype": "Voice Order Item",
  "module": "Business Workflows",
  "istable": 1,
  "fields": [
    {"fieldname": "menu_item", "fieldtype": "Link", "options": "Restaurant Menu Item", "reqd": 1},
    {"fieldname": "item_name", "fieldtype": "Data", "reqd": 1},
    {"fieldname": "quantity", "fieldtype": "Int", "reqd": 1, "default": 1},
    {"fieldname": "unit_price", "fieldtype": "Currency"},
    {"fieldname": "total_price", "fieldtype": "Currency"},
    {"fieldname": "special_instructions", "fieldtype": "Data"},
    {"fieldname": "modifications", "fieldtype": "JSON"},
    {"fieldname": "preparation_status", "fieldtype": "Select", "options": "Pending\nPreparing\nReady"}
  ]
}
```

##### **9. Voice Appointment**
```json
{
  "doctype": "Voice Appointment",
  "module": "Business Workflows",
  "fields": [
    {"fieldname": "voice_session", "fieldtype": "Link", "options": "Voice Session", "reqd": 1},
    {"fieldname": "appointment_id", "fieldtype": "Data", "unique": 1, "reqd": 1},
    {"fieldname": "customer_name", "fieldtype": "Data", "reqd": 1},
    {"fieldname": "customer_phone", "fieldtype": "Data"},
    {"fieldname": "customer_email", "fieldtype": "Data"},
    {"fieldname": "service_type", "fieldtype": "Link", "options": "Appointment Service", "reqd": 1},
    {"fieldname": "appointment_date", "fieldtype": "Date", "reqd": 1},
    {"fieldname": "appointment_time", "fieldtype": "Time", "reqd": 1},
    {"fieldname": "duration", "fieldtype": "Int", "default": 60},
    {"fieldname": "status", "fieldtype": "Select", "options": "Scheduled\nConfirmed\nIn Progress\nCompleted\nCancelled\nNo Show"},
    {"fieldname": "staff_assigned", "fieldtype": "Link", "options": "Employee"},
    {"fieldname": "notes", "fieldtype": "Long Text"},
    {"fieldname": "customer_preferences", "fieldtype": "JSON"},
    {"fieldname": "reminder_sent", "fieldtype": "Check"},
    {"fieldname": "confirmation_sent", "fieldtype": "Check"},
    {"fieldname": "follow_up_required", "fieldtype": "Check"},
    {"fieldname": "estimated_cost", "fieldtype": "Currency"},
    {"fieldname": "actual_cost", "fieldtype": "Currency"}
  ]
}
```

##### **10. Voice Support Ticket**
```json
{
  "doctype": "Voice Support Ticket",
  "module": "Business Workflows",
  "fields": [
    {"fieldname": "voice_session", "fieldtype": "Link", "options": "Voice Session", "reqd": 1},
    {"fieldname": "ticket_id", "fieldtype": "Data", "unique": 1, "reqd": 1},
    {"fieldname": "customer_name", "fieldtype": "Data", "reqd": 1},
    {"fieldname": "customer_phone", "fieldtype": "Data"},
    {"fieldname": "customer_email", "fieldtype": "Data"},
    {"fieldname": "issue_category", "fieldtype": "Link", "options": "Support Category", "reqd": 1},
    {"fieldname": "priority", "fieldtype": "Select", "options": "Low\nMedium\nHigh\nUrgent"},
    {"fieldname": "status", "fieldtype": "Select", "options": "Open\nIn Progress\nPending Customer\nResolved\nClosed"},
    {"fieldname": "subject", "fieldtype": "Data", "reqd": 1},
    {"fieldname": "description", "fieldtype": "Long Text", "reqd": 1},
    {"fieldname": "resolution", "fieldtype": "Long Text"},
    {"fieldname": "assigned_to", "fieldtype": "Link", "options": "Employee"},
    {"fieldname": "escalated", "fieldtype": "Check"},
    {"fieldname": "escalated_to", "fieldtype": "Link", "options": "Employee"},
    {"fieldname": "customer_satisfaction", "fieldtype": "Select", "options": "Very Satisfied\nSatisfied\nNeutral\nDissatisfied\nVery Dissatisfied"},
    {"fieldname": "resolution_time", "fieldtype": "Int"},
    {"fieldname": "first_response_time", "fieldtype": "Int"},
    {"fieldname": "follow_up_required", "fieldtype": "Check"}
  ]
}
```

##### **11. Voice Customer Profile**
```json
{
  "doctype": "Voice Customer Profile",
  "module": "Business Workflows",
  "fields": [
    {"fieldname": "customer_name", "fieldtype": "Data", "reqd": 1},
    {"fieldname": "phone_number", "fieldtype": "Data", "unique": 1, "reqd": 1},
    {"fieldname": "email", "fieldtype": "Data"},
    {"fieldname": "preferred_language", "fieldtype": "Select", "options": "en-US\nes-ES\nfr-FR\nde-DE"},
    {"fieldname": "customer_segment", "fieldtype": "Select", "options": "New\nRegular\nVIP\nInactive"},
    {"fieldname": "total_interactions", "fieldtype": "Int", "default": 0},
    {"fieldname": "successful_interactions", "fieldtype": "Int", "default": 0},
    {"fieldname": "avg_satisfaction", "fieldtype": "Float"},
    {"fieldname": "total_spent", "fieldtype": "Currency", "default": 0},
    {"fieldname": "last_interaction", "fieldtype": "Datetime"},
    {"fieldname": "preferences", "fieldtype": "JSON"},
    {"fieldname": "interaction_history", "fieldtype": "Table", "options": "Customer Interaction History"},
    {"fieldname": "special_notes", "fieldtype": "Long Text"},
    {"fieldname": "is_blacklisted", "fieldtype": "Check"},
    {"fieldname": "preferred_contact_time", "fieldtype": "Data"}
  ]
}
```

##### **12. Restaurant Menu Item**
```json
{
  "doctype": "Restaurant Menu Item",
  "module": "Business Workflows",
  "fields": [
    {"fieldname": "item_name", "fieldtype": "Data", "reqd": 1, "unique": 1},
    {"fieldname": "item_code", "fieldtype": "Data", "unique": 1},
    {"fieldname": "category", "fieldtype": "Select", "options": "Appetizer\nMain Course\nDessert\nBeverage\nSpecial"},
    {"fieldname": "description", "fieldtype": "Long Text"},
    {"fieldname": "price", "fieldtype": "Currency", "reqd": 1},
    {"fieldname": "preparation_time", "fieldtype": "Int", "default": 15},
    {"fieldname": "ingredients", "fieldtype": "JSON"},
    {"fieldname": "allergens", "fieldtype": "JSON"},
    {"fieldname": "dietary_info", "fieldtype": "Select", "options": "Vegetarian\nVegan\nGluten-Free\nDairy-Free\nNone"},
    {"fieldname": "availability", "fieldtype": "Check", "default": 1},
    {"fieldname": "voice_keywords", "fieldtype": "JSON"},
    {"fieldname": "popularity_score", "fieldtype": "Float"},
    {"fieldname": "customizable", "fieldtype": "Check"},
    {"fieldname": "customization_options", "fieldtype": "JSON"}
  ]
}
```

##### **13. Appointment Service**
```json
{
  "doctype": "Appointment Service",
  "module": "Business Workflows",
  "fields": [
    {"fieldname": "service_name", "fieldtype": "Data", "reqd": 1, "unique": 1},
    {"fieldname": "service_code", "fieldtype": "Data", "unique": 1},
    {"fieldname": "category", "fieldtype": "Data"},
    {"fieldname": "description", "fieldtype": "Long Text"},
    {"fieldname": "duration", "fieldtype": "Int", "reqd": 1},
    {"fieldname": "price", "fieldtype": "Currency"},
    {"fieldname": "staff_required", "fieldtype": "Link", "options": "Employee"},
    {"fieldname": "availability_schedule", "fieldtype": "JSON"},
    {"fieldname": "preparation_required", "fieldtype": "Check"},
    {"fieldname": "follow_up_required", "fieldtype": "Check"},
    {"fieldname": "voice_keywords", "fieldtype": "JSON"},
    {"fieldname": "booking_lead_time", "fieldtype": "Int", "default": 24},
    {"fieldname": "cancellation_policy", "fieldtype": "Long Text"},
    {"fieldname": "is_active", "fieldtype": "Check", "default": 1}
  ]
}
```

##### **14. Support Category**
```json
{
  "doctype": "Support Category",
  "module": "Business Workflows",
  "fields": [
    {"fieldname": "category_name", "fieldtype": "Data", "reqd": 1, "unique": 1},
    {"fieldname": "category_code", "fieldtype": "Data", "unique": 1},
    {"fieldname": "description", "fieldtype": "Long Text"},
    {"fieldname": "default_priority", "fieldtype": "Select", "options": "Low\nMedium\nHigh\nUrgent"},
    {"fieldname": "expected_resolution_time", "fieldtype": "Int"},
    {"fieldname": "auto_assign_to", "fieldtype": "Link", "options": "Employee"},
    {"fieldname": "escalation_rules", "fieldtype": "JSON"},
    {"fieldname": "voice_keywords", "fieldtype": "JSON"},
    {"fieldname": "automated_responses", "fieldtype": "JSON"},
    {"fieldname": "requires_followup", "fieldtype": "Check"},
    {"fieldname": "is_active", "fieldtype": "Check", "default": 1}
  ]
}
```

---

## **Complete Workflow Flows**

<function_calls>
<invoke name="TodoWrite">
<parameter name="todos">[{"content": "Create comprehensive project structure documentation with doctypes and flows", "status": "completed", "activeForm": "Creating comprehensive project structure documentation with doctypes and flows"}, {"content": "Define all required doctypes for voice agent system", "status": "completed", "activeForm": "Defining all required doctypes for voice agent system"}, {"content": "Document complete workflow flows", "status": "in_progress", "activeForm": "Documenting complete workflow flows"}]