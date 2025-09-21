# ERPNext Tools, Forms & Order Tracking System
## Complete Integration with Dynamic Form Storage & Staff Management

## Table of Contents
1. [Necessary Tools Architecture](#necessary-tools-architecture)
2. [ERPNext Dynamic Form Storage](#erpnext-dynamic-form-storage)
3. [Restaurant Staff Interface](#restaurant-staff-interface)
4. [Order Tracking & Customer Inquiry System](#order-tracking--customer-inquiry-system)
5. [MCP vs Ultravox Tool Distribution](#mcp-vs-ultravox-tool-distribution)
6. [Complete Workflow Integration](#complete-workflow-integration)

---

## Necessary Tools Architecture

### 🔧 Required Tools for Complete System

```mermaid
graph TB
    subgraph "Voice Processing Tools"
        A[Speech Recognition Tool]
        B[Intent Detection Tool]
        C[Entity Extraction Tool]
        D[Voice Response Generator]
    end

    subgraph "Form Management Tools"
        E[Dynamic Form Creator]
        F[Form Validator Tool]
        G[Form Storage Tool]
        H[Form Retrieval Tool]
    end

    subgraph "Business Logic Tools"
        I[Order Management Tool]
        J[Customer Lookup Tool]
        K[Menu Query Tool]
        L[Availability Check Tool]
    end

    subgraph "Staff Interface Tools"
        M[Order Display Tool]
        N[Status Update Tool]
        O[Kitchen Management Tool]
        P[Delivery Tracker Tool]
    end

    subgraph "Customer Service Tools"
        Q[Order Status Tool]
        R[Customer History Tool]
        S[Complaint Handler Tool]
        T[Refund Processor Tool]
    end

    A --> E
    B --> F
    C --> G
    D --> H
    E --> I
    F --> J
    G --> K
    H --> L
    I --> M
    J --> N
    K --> O
    L --> P
    M --> Q
    N --> R
    O --> S
    P --> T
```

### 📋 Tool Categories & Implementation

#### 1. **MCP Server Tools (Voice Processing & UI)**
```javascript
// mcp-server/tools/voice-processing-tools.js
class VoiceProcessingTools {
  constructor() {
    this.tools = new Map();
    this.initializeTools();
  }

  initializeTools() {
    // Speech to structured data tool
    this.tools.set('speechToStructuredData', {
      name: 'speechToStructuredData',
      description: 'Convert speech transcript to structured form data',
      parameters: {
        transcript: { type: 'string', required: true },
        businessType: { type: 'string', required: true },
        context: { type: 'object', required: false }
      },
      handler: this.speechToStructuredData.bind(this)
    });

    // Dynamic form generator tool
    this.tools.set('generateDynamicForm', {
      name: 'generateDynamicForm',
      description: 'Generate form fields based on conversation context',
      parameters: {
        intent: { type: 'string', required: true },
        extractedData: { type: 'object', required: true },
        businessType: { type: 'string', required: true }
      },
      handler: this.generateDynamicForm.bind(this)
    });

    // Form validation tool
    this.tools.set('validateFormData', {
      name: 'validateFormData',
      description: 'Validate extracted form data before submission',
      parameters: {
        formData: { type: 'object', required: true },
        formSchema: { type: 'object', required: true }
      },
      handler: this.validateFormData.bind(this)
    });

    // UI update generator tool
    this.tools.set('generateUIUpdates', {
      name: 'generateUIUpdates',
      description: 'Generate real-time UI updates based on conversation',
      parameters: {
        intent: { type: 'string', required: true },
        confidence: { type: 'number', required: true },
        extractedData: { type: 'object', required: true }
      },
      handler: this.generateUIUpdates.bind(this)
    });
  }

  async speechToStructuredData(params) {
    const { transcript, businessType, context } = params;

    try {
      // Extract entities using NLP
      const entities = await this.extractEntities(transcript);

      // Business-specific data extraction
      const structuredData = await this.processBusinessSpecificData(
        entities,
        businessType,
        context
      );

      // Confidence scoring
      const confidence = this.calculateConfidence(entities, structuredData);

      return {
        success: true,
        structuredData,
        confidence,
        extractedEntities: entities,
        suggestions: this.generateSuggestions(structuredData)
      };

    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async extractEntities(transcript) {
    const entities = {};

    // Name extraction
    const namePatterns = [
      /(?:my name is|i'm|this is)\s+([a-zA-Z\s]+)/i,
      /(?:name|called)\s+([a-zA-Z\s]+)/i
    ];

    for (const pattern of namePatterns) {
      const match = transcript.match(pattern);
      if (match) {
        entities.customer_name = match[1].trim();
        break;
      }
    }

    // Phone number extraction
    const phonePattern = /(\+?1?[-.\s]?(?:\(\d{3}\)|\d{3})[-.\s]?\d{3}[-.\s]?\d{4})/;
    const phoneMatch = transcript.match(phonePattern);
    if (phoneMatch) {
      entities.phone_number = phoneMatch[1].replace(/[^\d+]/g, '');
    }

    // Email extraction
    const emailPattern = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/;
    const emailMatch = transcript.match(emailPattern);
    if (emailMatch) {
      entities.email = emailMatch[1];
    }

    // Address extraction
    const addressPatterns = [
      /(?:address|live at|deliver to)\s+(.+?)(?:\.|,|$)/i,
      /(\d+\s+[a-zA-Z\s]+(?:street|st|avenue|ave|road|rd|lane|ln|drive|dr|boulevard|blvd))/i
    ];

    for (const pattern of addressPatterns) {
      const match = transcript.match(pattern);
      if (match) {
        entities.address = match[1].trim();
        break;
      }
    }

    return entities;
  }

  async processBusinessSpecificData(entities, businessType, context) {
    const structuredData = { ...entities };

    switch (businessType) {
      case 'restaurant':
        structuredData.order_items = await this.extractOrderItems(context.transcript);
        structuredData.delivery_type = this.extractDeliveryType(context.transcript);
        structuredData.special_instructions = this.extractSpecialInstructions(context.transcript);
        break;

      case 'support':
        structuredData.issue_description = context.transcript;
        structuredData.priority = this.assessIssuePriority(context.transcript);
        structuredData.category = this.categorizeIssue(context.transcript);
        break;

      case 'appointment':
        structuredData.service_type = this.extractServiceType(context.transcript);
        structuredData.preferred_date = this.extractDate(context.transcript);
        structuredData.preferred_time = this.extractTime(context.transcript);
        break;
    }

    return structuredData;
  }

  async extractOrderItems(transcript) {
    const items = [];
    const foodDatabase = {
      pizza: {
        keywords: ['pizza', 'pie'],
        sizes: ['small', 'medium', 'large', 'extra large'],
        toppings: ['pepperoni', 'mushrooms', 'olives', 'cheese', 'sausage']
      },
      burger: {
        keywords: ['burger', 'hamburger', 'cheeseburger'],
        sizes: ['regular', 'large'],
        additions: ['cheese', 'bacon', 'lettuce', 'tomato']
      },
      drink: {
        keywords: ['coke', 'pepsi', 'water', 'juice', 'soda', 'beer'],
        sizes: ['small', 'medium', 'large']
      }
    };

    // Extract quantity
    const quantityRegex = /(\d+|one|two|three|four|five|six|seven|eight|nine|ten)\s+/gi;
    const quantityMatches = transcript.match(quantityRegex) || [];

    // Extract items
    for (const [itemType, itemData] of Object.entries(foodDatabase)) {
      for (const keyword of itemData.keywords) {
        if (transcript.toLowerCase().includes(keyword)) {
          const item = {
            name: itemType,
            quantity: this.extractQuantityForItem(transcript, keyword),
            size: this.extractSizeForItem(transcript, keyword, itemData.sizes),
            modifications: this.extractModificationsForItem(transcript, keyword, itemData)
          };
          items.push(item);
        }
      }
    }

    return items;
  }

  calculateConfidence(entities, structuredData) {
    let score = 0;
    let maxScore = 0;

    // Check completeness of required fields
    const requiredFields = ['customer_name', 'phone_number'];
    for (const field of requiredFields) {
      maxScore += 25;
      if (structuredData[field]) {
        score += 25;
      }
    }

    // Check data quality
    if (structuredData.phone_number && this.isValidPhoneNumber(structuredData.phone_number)) {
      score += 20;
    }
    maxScore += 20;

    if (structuredData.email && this.isValidEmail(structuredData.email)) {
      score += 15;
    }
    maxScore += 15;

    // Business-specific confidence
    if (structuredData.order_items && structuredData.order_items.length > 0) {
      score += 15;
    }
    maxScore += 15;

    return Math.min(100, (score / maxScore) * 100);
  }
}
```

#### 2. **Ultravox Integration Tools (Business Actions)**
```javascript
// ultravox-tools/business-action-tools.js
class UltravoxBusinessTools {
  constructor() {
    this.erpnextBaseUrl = process.env.ERPNEXT_URL;
    this.erpnextApiKey = process.env.ERPNEXT_API_KEY;
    this.erpnextSecret = process.env.ERPNEXT_API_SECRET;
  }

  // Tool for placing restaurant orders
  getRestaurantOrderTool() {
    return {
      temporaryTool: {
        modelToolName: "placeRestaurantOrder",
        description: "Place a restaurant order with customer details and items",
        dynamicParameters: [
          {
            name: "customer_name",
            location: "PARAMETER_LOCATION_BODY",
            schema: { type: "string" },
            required: true
          },
          {
            name: "phone_number",
            location: "PARAMETER_LOCATION_BODY",
            schema: { type: "string" },
            required: true
          },
          {
            name: "order_items",
            location: "PARAMETER_LOCATION_BODY",
            schema: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  item_name: { type: "string" },
                  quantity: { type: "integer" },
                  size: { type: "string" },
                  special_instructions: { type: "string" }
                }
              }
            },
            required: true
          },
          {
            name: "delivery_address",
            location: "PARAMETER_LOCATION_BODY",
            schema: { type: "string" },
            required: false
          },
          {
            name: "delivery_type",
            location: "PARAMETER_LOCATION_BODY",
            schema: { type: "string", enum: ["delivery", "pickup"] },
            required: true
          }
        ],
        http: {
          baseUrlPattern: `${this.erpnextBaseUrl}/api/method/voice_agent.api.restaurant.place_order`,
          httpMethod: "POST"
        }
      }
    };
  }

  // Tool for checking order status
  getOrderStatusTool() {
    return {
      temporaryTool: {
        modelToolName: "checkOrderStatus",
        description: "Check the status of a customer's order",
        dynamicParameters: [
          {
            name: "order_reference",
            location: "PARAMETER_LOCATION_BODY",
            schema: { type: "string" },
            required: false
          },
          {
            name: "customer_phone",
            location: "PARAMETER_LOCATION_BODY",
            schema: { type: "string" },
            required: false
          },
          {
            name: "customer_name",
            location: "PARAMETER_LOCATION_BODY",
            schema: { type: "string" },
            required: false
          }
        ],
        http: {
          baseUrlPattern: `${this.erpnextBaseUrl}/api/method/voice_agent.api.restaurant.check_order_status`,
          httpMethod: "POST"
        }
      }
    };
  }

  // Tool for getting menu information
  getMenuQueryTool() {
    return {
      temporaryTool: {
        modelToolName: "queryMenu",
        description: "Get menu items, prices, and availability",
        dynamicParameters: [
          {
            name: "category",
            location: "PARAMETER_LOCATION_BODY",
            schema: { type: "string" },
            required: false
          },
          {
            name: "search_term",
            location: "PARAMETER_LOCATION_BODY",
            schema: { type: "string" },
            required: false
          }
        ],
        http: {
          baseUrlPattern: `${this.erpnextBaseUrl}/api/method/voice_agent.api.restaurant.get_menu`,
          httpMethod: "GET"
        }
      }
    };
  }

  // Tool for modifying orders
  getOrderModificationTool() {
    return {
      temporaryTool: {
        modelToolName: "modifyOrder",
        description: "Modify an existing order (add/remove items, change address)",
        dynamicParameters: [
          {
            name: "order_id",
            location: "PARAMETER_LOCATION_BODY",
            schema: { type: "string" },
            required: true
          },
          {
            name: "modification_type",
            location: "PARAMETER_LOCATION_BODY",
            schema: { type: "string", enum: ["add_item", "remove_item", "change_address", "change_time"] },
            required: true
          },
          {
            name: "modification_details",
            location: "PARAMETER_LOCATION_BODY",
            schema: { type: "object" },
            required: true
          }
        ],
        http: {
          baseUrlPattern: `${this.erpnextBaseUrl}/api/method/voice_agent.api.restaurant.modify_order`,
          httpMethod: "PUT"
        }
      }
    };
  }
}
```

---

## ERPNext Dynamic Form Storage

### 🗄️ ERPNext Custom Doctypes for Voice Agent

#### 1. **Voice Session Form Storage**
```python
# voice_agent/doctype/voice_session_form/voice_session_form.py
import frappe
from frappe.model.document import Document
import json
from datetime import datetime

class VoiceSessionForm(Document):
    def before_insert(self):
        self.form_id = frappe.generate_hash(length=10)
        self.created_timestamp = datetime.now()

    def validate(self):
        # Validate form data against schema
        if self.form_schema:
            schema = json.loads(self.form_schema)
            form_data = json.loads(self.form_data)
            self.validate_against_schema(form_data, schema)

    def validate_against_schema(self, data, schema):
        """Validate form data against defined schema"""
        for field in schema.get('required_fields', []):
            if field not in data or not data[field]:
                frappe.throw(f"Required field '{field}' is missing")

    def get_formatted_data(self):
        """Get form data in a formatted structure"""
        if not self.form_data:
            return {}

        data = json.loads(self.form_data)
        formatted = {}

        # Format based on business type
        if self.business_type == 'restaurant':
            formatted = self.format_restaurant_data(data)
        elif self.business_type == 'support':
            formatted = self.format_support_data(data)
        elif self.business_type == 'appointment':
            formatted = self.format_appointment_data(data)

        return formatted

    def format_restaurant_data(self, data):
        """Format restaurant order data"""
        return {
            'customer_info': {
                'name': data.get('customer_name'),
                'phone': data.get('phone_number'),
                'email': data.get('email'),
                'address': data.get('delivery_address')
            },
            'order_details': {
                'items': data.get('order_items', []),
                'delivery_type': data.get('delivery_type'),
                'special_instructions': data.get('special_instructions'),
                'estimated_total': self.calculate_order_total(data.get('order_items', []))
            },
            'voice_metadata': {
                'confidence_score': data.get('confidence_score'),
                'session_duration': data.get('session_duration'),
                'transcript_length': len(data.get('transcript', ''))
            }
        }

    def format_support_data(self, data):
        """Format support ticket data"""
        return {
            'customer_info': {
                'name': data.get('customer_name'),
                'phone': data.get('phone_number'),
                'email': data.get('email')
            },
            'issue_details': {
                'description': data.get('issue_description'),
                'category': data.get('issue_category'),
                'priority': data.get('priority'),
                'urgency': self.assess_urgency(data.get('issue_description', ''))
            },
            'voice_metadata': {
                'confidence_score': data.get('confidence_score'),
                'sentiment': data.get('sentiment'),
                'keywords': self.extract_keywords(data.get('issue_description', ''))
            }
        }

    def calculate_order_total(self, items):
        """Calculate estimated order total"""
        total = 0
        for item in items:
            # Get item price from ERPNext
            item_doc = frappe.get_all("Item",
                filters={"item_name": item.get('item_name')},
                fields=["standard_rate"],
                limit=1)

            if item_doc:
                price = float(item_doc[0].standard_rate)
                quantity = int(item.get('quantity', 1))
                total += price * quantity

        return total

@frappe.whitelist()
def store_voice_form_data(**kwargs):
    """API endpoint to store voice form data"""
    try:
        # Create voice session form record
        voice_form = frappe.get_doc({
            "doctype": "Voice Session Form",
            "session_id": kwargs.get('session_id'),
            "business_type": kwargs.get('business_type'),
            "form_data": json.dumps(kwargs.get('form_data', {})),
            "form_schema": json.dumps(kwargs.get('form_schema', {})),
            "confidence_score": kwargs.get('confidence_score', 0),
            "user_agent": kwargs.get('user_agent', ''),
            "source_page": kwargs.get('source_page', ''),
            "status": "draft"
        })

        voice_form.insert(ignore_permissions=True)

        # Create business-specific record
        business_record = create_business_record(voice_form)

        return {
            "status": "success",
            "form_id": voice_form.form_id,
            "business_record_id": business_record.name if business_record else None,
            "message": "Form data stored successfully"
        }

    except Exception as e:
        frappe.log_error(f"Voice form storage error: {str(e)}")
        return {
            "status": "error",
            "message": str(e)
        }

def create_business_record(voice_form):
    """Create business-specific record based on form data"""
    formatted_data = voice_form.get_formatted_data()

    if voice_form.business_type == 'restaurant':
        return create_restaurant_order(formatted_data, voice_form)
    elif voice_form.business_type == 'support':
        return create_support_ticket(formatted_data, voice_form)
    elif voice_form.business_type == 'appointment':
        return create_appointment(formatted_data, voice_form)

def create_restaurant_order(data, voice_form):
    """Create restaurant order from voice form data"""
    try:
        # Create or get customer
        customer = get_or_create_customer(data['customer_info'])

        # Create sales order
        sales_order = frappe.get_doc({
            "doctype": "Sales Order",
            "customer": customer.name,
            "order_type": "Sales",
            "company": frappe.defaults.get_user_default("Company"),
            "delivery_date": frappe.utils.add_days(frappe.utils.nowdate(), 1),
            "source": "Voice Agent",
            "voice_session_form": voice_form.name,
            "items": []
        })

        # Add order items
        for item_data in data['order_details']['items']:
            # Get item from ERPNext
            item = frappe.get_all("Item",
                filters={"item_name": item_data.get('item_name')},
                fields=["name", "standard_rate"],
                limit=1)

            if item:
                sales_order.append("items", {
                    "item_code": item[0].name,
                    "qty": item_data.get('quantity', 1),
                    "rate": item[0].standard_rate,
                    "description": f"Size: {item_data.get('size', 'Regular')}, Instructions: {item_data.get('special_instructions', '')}"
                })

        sales_order.insert(ignore_permissions=True)
        sales_order.submit()

        # Update voice form with business record reference
        voice_form.business_record_type = "Sales Order"
        voice_form.business_record_id = sales_order.name
        voice_form.status = "processed"
        voice_form.save(ignore_permissions=True)

        return sales_order

    except Exception as e:
        frappe.log_error(f"Restaurant order creation error: {str(e)}")
        return None
```

#### 2. **Restaurant Order Management Interface**
```python
# voice_agent/doctype/restaurant_order_dashboard/restaurant_order_dashboard.py
import frappe
from frappe.model.document import Document

class RestaurantOrderDashboard(Document):
    pass

@frappe.whitelist()
def get_active_orders():
    """Get all active restaurant orders for staff dashboard"""
    try:
        orders = frappe.db.sql("""
            SELECT
                so.name as order_id,
                so.customer_name,
                so.creation,
                so.delivery_date,
                so.grand_total,
                so.status,
                vsf.form_data,
                vsf.confidence_score,
                c.mobile_no,
                c.email_id
            FROM `tabSales Order` so
            LEFT JOIN `tabVoice Session Form` vsf ON so.voice_session_form = vsf.name
            LEFT JOIN `tabCustomer` c ON so.customer = c.name
            WHERE so.source = 'Voice Agent'
            AND so.status IN ('Draft', 'To Deliver and Bill', 'To Bill')
            ORDER BY so.creation DESC
            LIMIT 50
        """, as_dict=True)

        # Parse form data for each order
        for order in orders:
            if order.form_data:
                form_data = frappe.parse_json(order.form_data)
                order.delivery_address = form_data.get('delivery_address', '')
                order.special_instructions = form_data.get('special_instructions', '')
                order.delivery_type = form_data.get('delivery_type', 'pickup')
                order.order_items = form_data.get('order_items', [])

        return {
            "status": "success",
            "orders": orders,
            "total_count": len(orders)
        }

    except Exception as e:
        frappe.log_error(f"Get active orders error: {str(e)}")
        return {
            "status": "error",
            "message": str(e)
        }

@frappe.whitelist()
def update_order_status(order_id, new_status, notes=""):
    """Update order status from staff interface"""
    try:
        sales_order = frappe.get_doc("Sales Order", order_id)

        # Update status based on workflow
        if new_status == "preparing":
            sales_order.status = "To Deliver and Bill"
            sales_order.add_comment("Comment", f"Order being prepared. Notes: {notes}")
        elif new_status == "ready":
            sales_order.status = "To Deliver and Bill"
            sales_order.add_comment("Comment", f"Order ready for pickup/delivery. Notes: {notes}")
        elif new_status == "out_for_delivery":
            sales_order.status = "To Deliver and Bill"
            sales_order.add_comment("Comment", f"Order out for delivery. Notes: {notes}")
        elif new_status == "delivered":
            sales_order.status = "Completed"
            sales_order.add_comment("Comment", f"Order delivered successfully. Notes: {notes}")

        sales_order.save(ignore_permissions=True)

        # Send customer notification
        send_order_update_notification(sales_order, new_status, notes)

        return {
            "status": "success",
            "message": f"Order {order_id} updated to {new_status}"
        }

    except Exception as e:
        frappe.log_error(f"Update order status error: {str(e)}")
        return {
            "status": "error",
            "message": str(e)
        }

def send_order_update_notification(sales_order, status, notes):
    """Send SMS/Email notification to customer"""
    try:
        customer = frappe.get_doc("Customer", sales_order.customer)

        # Get customer phone from voice form data
        voice_form = frappe.get_all("Voice Session Form",
            filters={"name": sales_order.voice_session_form},
            fields=["form_data"],
            limit=1)

        if voice_form and voice_form[0].form_data:
            form_data = frappe.parse_json(voice_form[0].form_data)
            phone = form_data.get('phone_number')

            if phone:
                message = get_status_message(status, sales_order.name, notes)

                # Send SMS (implement SMS gateway)
                send_sms_notification(phone, message)

                # Send email if available
                if customer.email_id:
                    send_email_notification(customer.email_id, sales_order, status, notes)

    except Exception as e:
        frappe.log_error(f"Notification error: {str(e)}")

def get_status_message(status, order_id, notes):
    """Generate status message for customer"""
    messages = {
        "preparing": f"Your order {order_id} is being prepared. {notes}",
        "ready": f"Your order {order_id} is ready for pickup! {notes}",
        "out_for_delivery": f"Your order {order_id} is out for delivery. {notes}",
        "delivered": f"Your order {order_id} has been delivered. Thank you! {notes}"
    }

    return messages.get(status, f"Your order {order_id} status has been updated. {notes}")
```

---

## Restaurant Staff Interface

### 🍽️ ERPNext Dashboard for Restaurant Staff

#### 1. **Kitchen Display System**
```html
<!-- voice_agent/www/restaurant-dashboard.html -->
<!DOCTYPE html>
<html>
<head>
    <title>Restaurant Voice Orders Dashboard</title>
    <style>
        .dashboard-container {
            display: grid;
            grid-template-columns: 2fr 1fr;
            gap: 20px;
            padding: 20px;
            background: #f5f5f5;
            min-height: 100vh;
        }

        .orders-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
            gap: 15px;
        }

        .order-card {
            background: white;
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            border-left: 5px solid #4CAF50;
        }

        .order-card.preparing { border-left-color: #FF9800; }
        .order-card.ready { border-left-color: #2196F3; }
        .order-card.delivered { border-left-color: #4CAF50; }

        .order-header {
            display: flex;
            justify-content: between;
            align-items: center;
            margin-bottom: 15px;
        }

        .order-id {
            font-size: 18px;
            font-weight: bold;
            color: #333;
        }

        .order-time {
            color: #666;
            font-size: 14px;
        }

        .customer-info {
            background: #f9f9f9;
            padding: 10px;
            border-radius: 5px;
            margin-bottom: 15px;
        }

        .voice-confidence {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: bold;
        }

        .confidence-high { background: #e8f5e9; color: #2e7d32; }
        .confidence-medium { background: #fff3e0; color: #f57c00; }
        .confidence-low { background: #ffebee; color: #c62828; }

        .order-items {
            margin: 15px 0;
        }

        .order-item {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #eee;
        }

        .item-details {
            flex: 1;
        }

        .item-name {
            font-weight: bold;
            color: #333;
        }

        .item-modifications {
            font-size: 12px;
            color: #666;
            font-style: italic;
        }

        .item-quantity {
            background: #e3f2fd;
            color: #1565c0;
            padding: 2px 8px;
            border-radius: 12px;
            font-weight: bold;
        }

        .status-buttons {
            display: flex;
            gap: 10px;
            margin-top: 15px;
        }

        .status-btn {
            flex: 1;
            padding: 8px 12px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.3s;
        }

        .btn-preparing { background: #ff9800; color: white; }
        .btn-ready { background: #2196f3; color: white; }
        .btn-delivered { background: #4caf50; color: white; }

        .sidebar {
            background: white;
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            height: fit-content;
        }

        .stats-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-bottom: 20px;
        }

        .stat-card {
            text-align: center;
            padding: 15px;
            background: #f5f5f5;
            border-radius: 8px;
        }

        .stat-number {
            font-size: 24px;
            font-weight: bold;
            color: #2196f3;
        }

        .stat-label {
            font-size: 12px;
            color: #666;
            text-transform: uppercase;
        }

        .audio-indicator {
            display: inline-block;
            width: 12px;
            height: 12px;
            background: #4caf50;
            border-radius: 50%;
            margin-right: 5px;
            animation: pulse 2s infinite;
        }

        @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
        }
    </style>
</head>
<body>
    <div class="dashboard-container">
        <div class="orders-section">
            <h2>🍽️ Active Voice Orders</h2>
            <div class="orders-grid" id="ordersGrid">
                <!-- Orders will be loaded here -->
            </div>
        </div>

        <div class="sidebar">
            <h3>📊 Dashboard Stats</h3>
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-number" id="activeOrders">0</div>
                    <div class="stat-label">Active Orders</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number" id="avgConfidence">0%</div>
                    <div class="stat-label">Avg Confidence</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number" id="todayOrders">0</div>
                    <div class="stat-label">Today's Orders</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number" id="revenue">$0</div>
                    <div class="stat-label">Today's Revenue</div>
                </div>
            </div>

            <h4>🎤 Live Voice Sessions</h4>
            <div id="liveSessions">
                <!-- Live sessions will appear here -->
            </div>

            <h4>⚠️ Low Confidence Orders</h4>
            <div id="lowConfidenceOrders">
                <!-- Low confidence orders needing review -->
            </div>
        </div>
    </div>

    <script>
        class RestaurantDashboard {
            constructor() {
                this.orders = new Map();
                this.liveSessions = new Set();
                this.init();
            }

            init() {
                this.loadOrders();
                this.setupRealTimeUpdates();
                this.setupEventListeners();

                // Refresh every 30 seconds
                setInterval(() => this.loadOrders(), 30000);
            }

            async loadOrders() {
                try {
                    const response = await fetch('/api/method/voice_agent.api.restaurant.get_active_orders');
                    const data = await response.json();

                    if (data.message.status === 'success') {
                        this.renderOrders(data.message.orders);
                        this.updateStats(data.message.orders);
                    }
                } catch (error) {
                    console.error('Failed to load orders:', error);
                }
            }

            renderOrders(orders) {
                const grid = document.getElementById('ordersGrid');
                grid.innerHTML = '';

                orders.forEach(order => {
                    const orderCard = this.createOrderCard(order);
                    grid.appendChild(orderCard);
                });
            }

            createOrderCard(order) {
                const div = document.createElement('div');
                div.className = `order-card ${order.status.toLowerCase().replace(' ', '_')}`;

                const confidenceClass = order.confidence_score > 80 ? 'high' :
                                       order.confidence_score > 60 ? 'medium' : 'low';

                div.innerHTML = `
                    <div class="order-header">
                        <div class="order-id">#${order.order_id}</div>
                        <div class="order-time">${this.formatTime(order.creation)}</div>
                    </div>

                    <div class="customer-info">
                        <strong>${order.customer_name}</strong>
                        <br>📱 ${order.mobile_no || 'N/A'}
                        <br>📍 ${order.delivery_address || 'Pickup'}
                        <br><span class="voice-confidence confidence-${confidenceClass}">
                            <span class="audio-indicator"></span>
                            Voice Confidence: ${order.confidence_score}%
                        </span>
                    </div>

                    <div class="order-items">
                        ${order.order_items ? order.order_items.map(item => `
                            <div class="order-item">
                                <div class="item-details">
                                    <div class="item-name">${item.item_name}</div>
                                    ${item.size ? `<div class="item-modifications">Size: ${item.size}</div>` : ''}
                                    ${item.special_instructions ? `<div class="item-modifications">${item.special_instructions}</div>` : ''}
                                </div>
                                <div class="item-quantity">${item.quantity}</div>
                            </div>
                        `).join('') : ''}
                    </div>

                    <div class="status-buttons">
                        <button class="status-btn btn-preparing" onclick="dashboard.updateOrderStatus('${order.order_id}', 'preparing')">
                            👨‍🍳 Preparing
                        </button>
                        <button class="status-btn btn-ready" onclick="dashboard.updateOrderStatus('${order.order_id}', 'ready')">
                            ✅ Ready
                        </button>
                        <button class="status-btn btn-delivered" onclick="dashboard.updateOrderStatus('${order.order_id}', 'delivered')">
                            🚚 Delivered
                        </button>
                    </div>

                    ${order.special_instructions ? `
                        <div style="margin-top: 10px; padding: 10px; background: #fff3cd; border-radius: 5px;">
                            <strong>📝 Special Instructions:</strong><br>
                            ${order.special_instructions}
                        </div>
                    ` : ''}
                `;

                return div;
            }

            async updateOrderStatus(orderId, status) {
                try {
                    const notes = prompt(`Add notes for ${status} status (optional):`);

                    const response = await fetch('/api/method/voice_agent.api.restaurant.update_order_status', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            order_id: orderId,
                            new_status: status,
                            notes: notes || ''
                        })
                    });

                    const data = await response.json();

                    if (data.message.status === 'success') {
                        this.showNotification(`Order ${orderId} updated to ${status}`, 'success');
                        this.loadOrders(); // Refresh orders
                    } else {
                        this.showNotification('Failed to update order status', 'error');
                    }
                } catch (error) {
                    console.error('Status update error:', error);
                    this.showNotification('Error updating order status', 'error');
                }
            }

            updateStats(orders) {
                const activeCount = orders.length;
                const avgConfidence = orders.reduce((sum, order) => sum + (order.confidence_score || 0), 0) / orders.length;
                const totalRevenue = orders.reduce((sum, order) => sum + (order.grand_total || 0), 0);

                document.getElementById('activeOrders').textContent = activeCount;
                document.getElementById('avgConfidence').textContent = Math.round(avgConfidence) + '%';
                document.getElementById('revenue').textContent = '$' + totalRevenue.toFixed(2);
            }

            setupRealTimeUpdates() {
                // WebSocket connection for real-time updates
                const ws = new WebSocket(`wss://${window.location.host}/voice-updates`);

                ws.onmessage = (event) => {
                    const data = JSON.parse(event.data);

                    if (data.type === 'new_order') {
                        this.showNotification(`New voice order received: #${data.order_id}`, 'info');
                        this.loadOrders();
                    } else if (data.type === 'live_session') {
                        this.updateLiveSessions(data.session);
                    }
                };
            }

            updateLiveSessions(session) {
                const liveSessionsDiv = document.getElementById('liveSessions');

                if (session.status === 'active') {
                    this.liveSessions.add(session.id);
                } else {
                    this.liveSessions.delete(session.id);
                }

                liveSessionsDiv.innerHTML = Array.from(this.liveSessions).map(sessionId => `
                    <div style="padding: 8px; background: #e8f5e9; margin: 5px 0; border-radius: 5px;">
                        <span class="audio-indicator"></span>
                        Session ${sessionId.substr(-6)}
                    </div>
                `).join('') || '<div style="color: #666;">No active sessions</div>';
            }

            formatTime(timestamp) {
                return new Date(timestamp).toLocaleTimeString();
            }

            showNotification(message, type) {
                // Create and show notification
                const notification = document.createElement('div');
                notification.style.cssText = `
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 15px 20px;
                    background: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196f3'};
                    color: white;
                    border-radius: 5px;
                    z-index: 1000;
                `;
                notification.textContent = message;
                document.body.appendChild(notification);

                setTimeout(() => {
                    document.body.removeChild(notification);
                }, 3000);
            }

            setupEventListeners() {
                // Add keyboard shortcuts
                document.addEventListener('keydown', (e) => {
                    if (e.ctrlKey && e.key === 'r') {
                        e.preventDefault();
                        this.loadOrders();
                    }
                });
            }
        }

        // Initialize dashboard
        const dashboard = new RestaurantDashboard();
    </script>
</body>
</html>
```

---

## Order Tracking & Customer Inquiry System

### 🔍 Customer Order Status Inquiry Tools

#### 1. **Ultravox Order Status Tool**
```python
# voice_agent/api/restaurant.py - Order Status Checking
import frappe
from frappe import _
import json
from datetime import datetime, timedelta

@frappe.whitelist(allow_guest=True)
def check_order_status(**kwargs):
    """Handle customer order status inquiries from voice agent"""
    try:
        # Extract customer information from voice input
        order_reference = kwargs.get('order_reference', '').strip()
        customer_phone = kwargs.get('customer_phone', '').strip()
        customer_name = kwargs.get('customer_name', '').strip()

        # Try to find order by different methods
        order = None

        # Method 1: Direct order reference
        if order_reference:
            order = find_order_by_reference(order_reference)

        # Method 2: Phone number lookup (most recent order)
        if not order and customer_phone:
            order = find_order_by_phone(customer_phone)

        # Method 3: Customer name lookup (most recent order)
        if not order and customer_name:
            order = find_order_by_name(customer_name)

        if not order:
            return {
                "status": "not_found",
                "message": "I couldn't find your order. Could you please provide your order number or the phone number used for the order?",
                "suggested_actions": [
                    "Provide order number",
                    "Confirm phone number",
                    "Speak with customer service"
                ]
            }

        # Get detailed order information
        order_details = get_detailed_order_info(order)

        # Generate status message
        status_message = generate_status_message(order_details)

        return {
            "status": "found",
            "order_details": order_details,
            "message": status_message,
            "estimated_time": calculate_estimated_time(order_details),
            "can_modify": can_modify_order(order_details),
            "tracking_info": get_tracking_info(order_details)
        }

    except Exception as e:
        frappe.log_error(f"Order status check error: {str(e)}")
        return {
            "status": "error",
            "message": "I'm having trouble checking your order status right now. Please try again in a moment."
        }

def find_order_by_reference(order_ref):
    """Find order by order number/reference"""
    # Clean up order reference (remove common prefixes)
    clean_ref = order_ref.replace('#', '').replace('order', '').replace('Order', '').strip()

    # Try exact match first
    orders = frappe.get_all("Sales Order",
        filters={"name": clean_ref, "source": "Voice Agent"},
        fields=["name", "customer", "status", "creation"],
        limit=1)

    if orders:
        return orders[0]

    # Try partial match (last 6 characters)
    if len(clean_ref) >= 6:
        orders = frappe.get_all("Sales Order",
            filters={
                "name": ["like", f"%{clean_ref[-6:]}"],
                "source": "Voice Agent"
            },
            fields=["name", "customer", "status", "creation"],
            limit=1)

        if orders:
            return orders[0]

    return None

def find_order_by_phone(phone):
    """Find most recent order by phone number"""
    # Clean phone number
    clean_phone = ''.join(filter(str.isdigit, phone))

    # Get orders from last 7 days with this phone
    since_date = frappe.utils.add_days(frappe.utils.nowdate(), -7)

    orders = frappe.db.sql("""
        SELECT so.name, so.customer, so.status, so.creation, so.grand_total
        FROM `tabSales Order` so
        LEFT JOIN `tabVoice Session Form` vsf ON so.voice_session_form = vsf.name
        WHERE so.source = 'Voice Agent'
        AND so.creation >= %s
        AND (
            JSON_EXTRACT(vsf.form_data, '$.phone_number') LIKE %s
            OR JSON_EXTRACT(vsf.form_data, '$.phone_number') LIKE %s
        )
        ORDER BY so.creation DESC
        LIMIT 1
    """, (since_date, f"%{clean_phone}", f"%{clean_phone[-10:]}"), as_dict=True)

    return orders[0] if orders else None

def find_order_by_name(customer_name):
    """Find most recent order by customer name"""
    since_date = frappe.utils.add_days(frappe.utils.nowdate(), -3)

    orders = frappe.get_all("Sales Order",
        filters={
            "customer_name": ["like", f"%{customer_name}%"],
            "source": "Voice Agent",
            "creation": [">=", since_date]
        },
        fields=["name", "customer", "status", "creation"],
        order_by="creation desc",
        limit=1)

    return orders[0] if orders else None

def get_detailed_order_info(order):
    """Get comprehensive order information"""
    # Get sales order details
    sales_order = frappe.get_doc("Sales Order", order.name)

    # Get voice form data
    voice_form_data = {}
    if hasattr(sales_order, 'voice_session_form') and sales_order.voice_session_form:
        voice_form = frappe.get_doc("Voice Session Form", sales_order.voice_session_form)
        if voice_form.form_data:
            voice_form_data = json.loads(voice_form.form_data)

    # Get order items
    items = []
    for item in sales_order.items:
        items.append({
            "name": item.item_name,
            "quantity": item.qty,
            "rate": item.rate,
            "amount": item.amount,
            "description": item.description
        })

    # Get delivery information
    delivery_info = {
        "type": voice_form_data.get("delivery_type", "pickup"),
        "address": voice_form_data.get("delivery_address", ""),
        "instructions": voice_form_data.get("special_instructions", "")
    }

    # Get status timeline
    status_timeline = get_order_status_timeline(sales_order)

    return {
        "order_id": sales_order.name,
        "customer_name": sales_order.customer_name,
        "status": sales_order.status,
        "creation": sales_order.creation,
        "total_amount": sales_order.grand_total,
        "items": items,
        "delivery_info": delivery_info,
        "status_timeline": status_timeline,
        "phone": voice_form_data.get("phone_number", ""),
        "confidence_score": voice_form_data.get("confidence_score", 0)
    }

def generate_status_message(order_details):
    """Generate human-friendly status message"""
    order_id = order_details["order_id"]
    status = order_details["status"]
    customer_name = order_details["customer_name"]

    status_messages = {
        "Draft": f"Hi {customer_name}! Your order {order_id} has been received and is being reviewed by our kitchen staff.",
        "To Deliver and Bill": f"Great news {customer_name}! Your order {order_id} is being prepared in our kitchen.",
        "To Bill": f"Your order {order_id} is ready for pickup! Please come to the restaurant when convenient.",
        "Completed": f"Your order {order_id} has been completed. Thank you for choosing us!",
        "Cancelled": f"I see that order {order_id} was cancelled. Would you like to place a new order?"
    }

    base_message = status_messages.get(status, f"Your order {order_id} status is: {status}")

    # Add delivery information
    if order_details["delivery_info"]["type"] == "delivery":
        if status == "To Deliver and Bill":
            base_message += " It will be out for delivery soon."
        elif status == "To Bill":
            base_message += " Our delivery driver is on the way!"

    # Add estimated time
    estimated_time = calculate_estimated_time(order_details)
    if estimated_time:
        base_message += f" Estimated time: {estimated_time}."

    return base_message

def calculate_estimated_time(order_details):
    """Calculate estimated completion/delivery time"""
    status = order_details["status"]
    creation_time = order_details["creation"]
    delivery_type = order_details["delivery_info"]["type"]

    if status == "Completed":
        return None

    # Calculate time since order
    time_elapsed = datetime.now() - creation_time
    minutes_elapsed = int(time_elapsed.total_seconds() / 60)

    if status == "Draft":
        # Order just received
        prep_time = 25 if delivery_type == "pickup" else 35
        return f"{prep_time - min(minutes_elapsed, 5)} minutes"

    elif status == "To Deliver and Bill":
        # Being prepared
        remaining_prep = max(0, 20 - minutes_elapsed)
        if delivery_type == "delivery":
            return f"{remaining_prep + 15} minutes (including delivery)"
        else:
            return f"{remaining_prep} minutes"

    elif status == "To Bill":
        # Ready for pickup or out for delivery
        if delivery_type == "pickup":
            return "Ready now!"
        else:
            return "10-15 minutes (delivery in progress)"

    return None

def can_modify_order(order_details):
    """Check if order can still be modified"""
    status = order_details["status"]
    creation_time = order_details["creation"]

    # Can't modify completed or cancelled orders
    if status in ["Completed", "Cancelled"]:
        return False

    # Can modify within 5 minutes of placing order
    time_elapsed = datetime.now() - creation_time
    return time_elapsed.total_seconds() < 300  # 5 minutes

def get_order_status_timeline(sales_order):
    """Get chronological status updates"""
    timeline = []

    # Creation
    timeline.append({
        "timestamp": sales_order.creation,
        "status": "Order Placed",
        "description": "Order received via voice agent"
    })

    # Get comments for status updates
    comments = frappe.get_all("Comment",
        filters={
            "reference_doctype": "Sales Order",
            "reference_name": sales_order.name,
            "comment_type": "Comment"
        },
        fields=["creation", "content"],
        order_by="creation")

    for comment in comments:
        timeline.append({
            "timestamp": comment.creation,
            "status": "Status Update",
            "description": comment.content
        })

    return sorted(timeline, key=lambda x: x["timestamp"])

def get_tracking_info(order_details):
    """Get tracking information for delivery orders"""
    if order_details["delivery_info"]["type"] != "delivery":
        return None

    # This would integrate with delivery tracking system
    # For now, return mock tracking info
    return {
        "driver_name": "John Doe",
        "driver_phone": "+1234567890",
        "estimated_arrival": "15 minutes",
        "current_location": "En route to your address"
    }
```

#### 2. **Voice Response Generator for Order Status**
```python
# voice_agent/utils/voice_responses.py
import frappe
from datetime import datetime

class VoiceResponseGenerator:
    def __init__(self):
        self.response_templates = self.load_response_templates()

    def generate_order_status_response(self, order_details, inquiry_context):
        """Generate natural voice response for order status"""
        status = order_details["status"]
        customer_name = order_details["customer_name"]
        order_id = order_details["order_id"]

        # Base response based on status
        if status == "Draft":
            response = f"Hi {customer_name}! I found your order {order_id}. Good news - we've received it and our kitchen team is reviewing it now. "

        elif status == "To Deliver and Bill":
            response = f"Perfect! Your order {order_id} is currently being prepared in our kitchen. "

        elif status == "To Bill" and order_details["delivery_info"]["type"] == "pickup":
            response = f"Excellent news! Your order {order_id} is ready for pickup. You can come to the restaurant anytime. "

        elif status == "To Bill" and order_details["delivery_info"]["type"] == "delivery":
            response = f"Great! Your order {order_id} is ready and our delivery driver is on the way to you. "

        elif status == "Completed":
            response = f"Your order {order_id} has been completed. "
            if order_details["delivery_info"]["type"] == "delivery":
                response += "It should have been delivered. "
            else:
                response += "It was ready for pickup. "

        # Add estimated time
        estimated_time = calculate_estimated_time(order_details)
        if estimated_time and status != "Completed":
            response += f"The estimated time is {estimated_time}. "

        # Add items reminder if customer asks
        if inquiry_context.get("wants_items_reminder"):
            response += self.generate_items_summary(order_details["items"])

        # Add modification option
        if can_modify_order(order_details):
            response += "If you need to make any changes, please let me know within the next few minutes. "

        # Add contact information for issues
        if inquiry_context.get("has_concern"):
            response += "If you have any concerns, you can also call our restaurant directly. "

        return response.strip()

    def generate_items_summary(self, items):
        """Generate summary of order items"""
        if not items:
            return ""

        if len(items) == 1:
            item = items[0]
            return f"That was {item['quantity']} {item['name']}. "

        summary = "Your order includes: "
        for i, item in enumerate(items):
            if i == len(items) - 1:
                summary += f"and {item['quantity']} {item['name']}. "
            else:
                summary += f"{item['quantity']} {item['name']}, "

        return summary

    def generate_order_not_found_response(self, inquiry_details):
        """Generate response when order is not found"""
        attempted_search = []

        if inquiry_details.get("order_reference"):
            attempted_search.append("order number")

        if inquiry_details.get("customer_phone"):
            attempted_search.append("phone number")

        if inquiry_details.get("customer_name"):
            attempted_search.append("name")

        if attempted_search:
            search_methods = " and ".join(attempted_search)
            response = f"I searched using your {search_methods}, but I couldn't find a recent order. "
        else:
            response = "I need a bit more information to find your order. "

        response += "Could you please provide your order number? It usually starts with 'SO' followed by numbers. "
        response += "Or you can give me the phone number you used when placing the order. "
        response += "I can check orders from the last week."

        return response

    def generate_modification_response(self, order_details, modification_request):
        """Generate response for order modification requests"""
        if not can_modify_order(order_details):
            time_since_order = datetime.now() - order_details["creation"]
            minutes_passed = int(time_since_order.total_seconds() / 60)

            response = f"I understand you'd like to modify your order, but it's been {minutes_passed} minutes since you placed it and our kitchen has likely started preparing it. "
            response += "Let me transfer you to our restaurant staff who can check if any changes are still possible. "

            return response

        # Order can be modified
        response = "I can help you modify your order! Since it was placed recently, changes are still possible. "
        response += "What would you like to change? You can add items, remove items, or update your delivery address. "

        return response

# Voice Agent Integration with Order Status Tool
@frappe.whitelist(allow_guest=True)
def handle_order_inquiry_voice(**kwargs):
    """Handle voice-based order inquiries with natural responses"""
    try:
        # Get order status information
        order_response = check_order_status(**kwargs)

        # Generate natural voice response
        response_generator = VoiceResponseGenerator()

        if order_response["status"] == "found":
            # Generate detailed voice response
            inquiry_context = {
                "wants_items_reminder": "what did I order" in kwargs.get("transcript", "").lower(),
                "has_concern": any(word in kwargs.get("transcript", "").lower()
                                 for word in ["problem", "issue", "wrong", "mistake"]),
                "wants_modification": any(word in kwargs.get("transcript", "").lower()
                                       for word in ["change", "modify", "add", "remove"])
            }

            voice_response = response_generator.generate_order_status_response(
                order_response["order_details"],
                inquiry_context
            )

            # Check if customer wants to modify order
            if inquiry_context["wants_modification"]:
                modification_response = response_generator.generate_modification_response(
                    order_response["order_details"],
                    kwargs.get("transcript", "")
                )
                voice_response += " " + modification_response

        else:
            # Order not found - generate helpful response
            voice_response = response_generator.generate_order_not_found_response(kwargs)

        return {
            "status": "success",
            "voice_response": voice_response,
            "order_details": order_response.get("order_details"),
            "suggested_actions": order_response.get("suggested_actions", []),
            "can_modify": order_response.get("can_modify", False)
        }

    except Exception as e:
        frappe.log_error(f"Voice order inquiry error: {str(e)}")
        return {
            "status": "error",
            "voice_response": "I'm having trouble checking your order right now. Please try again in a moment or speak with our restaurant staff."
        }
```

---

## MCP vs Ultravox Tool Distribution

### ⚖️ Strategic Tool Placement for Optimal Performance

#### **MCP Server Tools (Voice Processing & UI Generation)**
```javascript
// Tools that should be handled by MCP Server
const MCPServerTools = {
  // Voice Processing Tools
  "speechToText": {
    reason: "Real-time processing with UI feedback",
    performance: "Low latency for UI updates",
    benefits: ["Live transcription display", "Confidence indicators", "Error correction UI"]
  },

  "intentRecognition": {
    reason: "Dynamic UI generation based on intent",
    performance: "Immediate UI response",
    benefits: ["Context-aware forms", "Real-time validation", "Smart suggestions"]
  },

  "formGeneration": {
    reason: "Dynamic form creation from voice context",
    performance: "Instant form rendering",
    benefits: ["Auto-populated fields", "Confidence-based styling", "Voice-driven validation"]
  },

  "entityExtraction": {
    reason: "Real-time data extraction with visual feedback",
    performance: "Live form population",
    benefits: ["Progressive form filling", "Visual confidence scores", "Immediate error highlighting"]
  },

  "uiStateManagement": {
    reason: "Complex UI state based on conversation flow",
    performance: "Seamless UI transitions",
    benefits: ["Step indicators", "Progress tracking", "Context preservation"]
  }
};

// Ultravox Tools (Business Logic & ERPNext Integration)
const UltravoxTools = {
  // Business Action Tools
  "placeOrder": {
    reason: "Direct ERPNext integration with business validation",
    performance: "Reliable business logic execution",
    benefits: ["Data integrity", "Business rule enforcement", "Transaction safety"]
  },

  "checkOrderStatus": {
    reason: "Database queries and business logic",
    performance: "Optimized database access",
    benefits: ["Real-time order tracking", "Customer verification", "Status accuracy"]
  },

  "modifyOrder": {
    reason: "Complex business logic with validation",
    performance: "Transactional safety",
    benefits: ["Business rule compliance", "Inventory updates", "Customer notifications"]
  },

  "customerLookup": {
    reason: "Database operations and privacy compliance",
    performance: "Secure data access",
    benefits: ["Customer verification", "Order history", "Preference tracking"]
  },

  "menuQuery": {
    reason: "Real-time inventory and pricing",
    performance: "Accurate availability data",
    benefits: ["Current pricing", "Stock availability", "Special offers"]
  }
};
```

#### **Tool Distribution Strategy**
```mermaid
graph TB
    subgraph "Browser (React MCP Client)"
        A[User Voice Input]
        B[Real-time Transcription UI]
        C[Dynamic Form Generation]
        D[Confidence Indicators]
        E[Progress Tracking]
    end

    subgraph "MCP Server Layer"
        F[Speech Processing]
        G[Intent Recognition]
        H[Entity Extraction]
        I[Form Generator]
        J[UI State Manager]
    end

    subgraph "Ultravox Platform"
        K[Business Logic Tools]
        L[ERPNext Integration]
        M[Order Management]
        N[Customer Verification]
        O[Data Validation]
    end

    subgraph "ERPNext Database"
        P[Customer Records]
        Q[Order Data]
        R[Inventory]
        S[Business Rules]
    end

    A --> F
    F --> B
    F --> G
    G --> H
    H --> I
    I --> C
    G --> J
    J --> D
    J --> E

    I --> K
    K --> L
    L --> M
    M --> N
    N --> O

    O --> P
    M --> Q
    L --> R
    N --> S

    class A,B,C,D,E browser
    class F,G,H,I,J mcp
    class K,L,M,N,O ultravox
    class P,Q,R,S erpnext
```

#### **Performance Optimization Strategy**
| Tool Category | MCP Server | Ultravox Platform |
|---------------|------------|-------------------|
| **Voice Processing** | ✅ Real-time UI updates | ❌ Adds latency |
| **Form Generation** | ✅ Instant rendering | ❌ Network delay |
| **Entity Extraction** | ✅ Live feedback | ❌ Delayed validation |
| **Business Logic** | ❌ Database overhead | ✅ Direct ERPNext access |
| **Order Management** | ❌ Complex transactions | ✅ Business rule enforcement |
| **Customer Lookup** | ❌ Security concerns | ✅ Secure data access |

---

## Complete Workflow Integration

### 🔄 ERPNext Custom Forms and Workflow Integration

#### 1. **Voice Session Form JSON Schema**
```json
{
  "name": "Voice Session Form Schema",
  "version": "1.0",
  "business_types": {
    "restaurant": {
      "required_fields": ["customer_name", "phone_number", "order_items"],
      "optional_fields": ["email", "delivery_address", "special_instructions"],
      "validation_rules": {
        "phone_number": {
          "pattern": "^[+]?[1-9]?[0-9]{7,15}$",
          "error_message": "Please provide a valid phone number"
        },
        "order_items": {
          "min_items": 1,
          "error_message": "At least one item must be ordered"
        }
      },
      "business_rules": {
        "minimum_order_amount": 10.00,
        "delivery_radius": 25,
        "operating_hours": {
          "monday": "09:00-22:00",
          "tuesday": "09:00-22:00",
          "wednesday": "09:00-22:00",
          "thursday": "09:00-22:00",
          "friday": "09:00-23:00",
          "saturday": "09:00-23:00",
          "sunday": "11:00-21:00"
        }
      }
    },
    "support": {
      "required_fields": ["customer_name", "issue_description"],
      "optional_fields": ["phone_number", "email", "priority"],
      "validation_rules": {
        "issue_description": {
          "min_length": 10,
          "error_message": "Please provide more details about the issue"
        }
      },
      "business_rules": {
        "auto_escalation_keywords": ["urgent", "critical", "down", "not working"],
        "priority_mapping": {
          "critical": ["server down", "cannot access", "system crash"],
          "high": ["slow performance", "error messages", "login issues"],
          "medium": ["feature request", "how to", "training"],
          "low": ["general question", "feedback"]
        }
      }
    },
    "appointment": {
      "required_fields": ["customer_name", "service_type", "preferred_date"],
      "optional_fields": ["phone_number", "email", "preferred_time", "special_requirements"],
      "validation_rules": {
        "preferred_date": {
          "min_date": "today",
          "max_date": "+30days",
          "error_message": "Appointments can be booked up to 30 days in advance"
        }
      },
      "business_rules": {
        "available_services": ["consultation", "cleaning", "repair", "maintenance"],
        "time_slots": ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
        "buffer_time": 30,
        "advance_booking": 24
      }
    }
  }
}
```

#### 2. **ERPNext Custom Workflow Implementation**
```python
# voice_agent/workflow/voice_order_workflow.py
import frappe
from frappe.model.workflow import apply_workflow
from frappe.workflow.doctype.workflow_action.workflow_action import WorkflowAction

class VoiceOrderWorkflow:
    def __init__(self):
        self.workflow_name = "Voice Agent Order Workflow"
        self.states = self.define_workflow_states()
        self.transitions = self.define_workflow_transitions()

    def define_workflow_states(self):
        """Define workflow states for voice orders"""
        return {
            "Voice Input": {
                "doc_status": 0,
                "allow_edit": ["System Manager", "Voice Agent User"],
                "style": "info"
            },
            "Form Generated": {
                "doc_status": 0,
                "allow_edit": ["System Manager", "Voice Agent User"],
                "style": "warning"
            },
            "Customer Confirmed": {
                "doc_status": 0,
                "allow_edit": ["System Manager", "Voice Agent User", "Restaurant Staff"],
                "style": "primary"
            },
            "Order Placed": {
                "doc_status": 1,
                "allow_edit": ["System Manager", "Restaurant Staff"],
                "style": "success"
            },
            "Kitchen Preparing": {
                "doc_status": 1,
                "allow_edit": ["System Manager", "Kitchen Staff"],
                "style": "warning"
            },
            "Ready for Pickup": {
                "doc_status": 1,
                "allow_edit": ["System Manager", "Restaurant Staff"],
                "style": "info"
            },
            "Out for Delivery": {
                "doc_status": 1,
                "allow_edit": ["System Manager", "Delivery Staff"],
                "style": "primary"
            },
            "Completed": {
                "doc_status": 1,
                "allow_edit": ["System Manager"],
                "style": "success"
            },
            "Cancelled": {
                "doc_status": 2,
                "allow_edit": ["System Manager"],
                "style": "danger"
            }
        }

    def define_workflow_transitions(self):
        """Define allowed transitions between states"""
        return {
            "Generate Form": {
                "from_state": "Voice Input",
                "to_state": "Form Generated",
                "action": "generate_form_from_voice",
                "allowed_roles": ["System Manager", "Voice Agent User"],
                "condition": "validate_voice_confidence"
            },
            "Customer Confirms": {
                "from_state": "Form Generated",
                "to_state": "Customer Confirmed",
                "action": "process_customer_confirmation",
                "allowed_roles": ["System Manager", "Voice Agent User"],
                "condition": "validate_form_completeness"
            },
            "Place Order": {
                "from_state": "Customer Confirmed",
                "to_state": "Order Placed",
                "action": "create_sales_order",
                "allowed_roles": ["System Manager", "Voice Agent User"],
                "condition": "validate_business_rules"
            },
            "Start Preparation": {
                "from_state": "Order Placed",
                "to_state": "Kitchen Preparing",
                "action": "notify_kitchen",
                "allowed_roles": ["System Manager", "Restaurant Staff", "Kitchen Staff"],
                "condition": "check_kitchen_capacity"
            },
            "Mark Ready": {
                "from_state": "Kitchen Preparing",
                "to_state": "Ready for Pickup",
                "action": "notify_customer_ready",
                "allowed_roles": ["System Manager", "Kitchen Staff"],
                "condition": "order_preparation_complete"
            },
            "Start Delivery": {
                "from_state": "Ready for Pickup",
                "to_state": "Out for Delivery",
                "action": "assign_delivery_driver",
                "allowed_roles": ["System Manager", "Restaurant Staff"],
                "condition": "delivery_type_is_delivery"
            },
            "Complete Order": {
                "from_state": ["Ready for Pickup", "Out for Delivery"],
                "to_state": "Completed",
                "action": "finalize_order",
                "allowed_roles": ["System Manager", "Restaurant Staff", "Delivery Staff"],
                "condition": "customer_received_order"
            },
            "Cancel Order": {
                "from_state": ["Voice Input", "Form Generated", "Customer Confirmed", "Order Placed"],
                "to_state": "Cancelled",
                "action": "process_cancellation",
                "allowed_roles": ["System Manager", "Restaurant Staff"],
                "condition": "cancellation_allowed"
            }
        }

    def setup_workflow(self):
        """Create or update the workflow in ERPNext"""
        try:
            # Create workflow document
            workflow = frappe.get_doc({
                "doctype": "Workflow",
                "workflow_name": self.workflow_name,
                "document_type": "Voice Session Form",
                "is_active": 1,
                "states": [],
                "transitions": []
            })

            # Add states
            for state_name, state_config in self.states.items():
                workflow.append("states", {
                    "state": state_name,
                    "doc_status": state_config["doc_status"],
                    "allow_edit": ", ".join(state_config["allow_edit"]),
                    "style": state_config["style"]
                })

            # Add transitions
            for transition_name, transition_config in self.transitions.items():
                workflow.append("transitions", {
                    "state": transition_config["from_state"],
                    "action": transition_name,
                    "next_state": transition_config["to_state"],
                    "allowed": ", ".join(transition_config["allowed_roles"]),
                    "condition": transition_config.get("condition", "")
                })

            workflow.insert(ignore_permissions=True)
            frappe.db.commit()

            return True

        except Exception as e:
            frappe.log_error(f"Workflow setup error: {str(e)}")
            return False

# Workflow Action Handlers
@frappe.whitelist()
def generate_form_from_voice(doc, action):
    """Generate form from voice input"""
    try:
        if not doc.form_data:
            frappe.throw("No voice data available to generate form")

        # Parse voice data
        voice_data = frappe.parse_json(doc.form_data)

        # Validate confidence score
        if voice_data.get("confidence_score", 0) < 60:
            frappe.throw("Voice confidence too low. Manual review required.")

        # Generate form schema
        form_schema = generate_dynamic_form_schema(doc.business_type, voice_data)
        doc.form_schema = frappe.as_json(form_schema)

        # Set workflow state
        doc.workflow_state = "Form Generated"
        doc.save(ignore_permissions=True)

        return True

    except Exception as e:
        frappe.log_error(f"Form generation error: {str(e)}")
        frappe.throw(f"Failed to generate form: {str(e)}")

@frappe.whitelist()
def process_customer_confirmation(doc, action):
    """Process customer confirmation"""
    try:
        # Validate form completeness
        form_data = frappe.parse_json(doc.form_data)
        required_fields = get_required_fields(doc.business_type)

        missing_fields = []
        for field in required_fields:
            if not form_data.get(field):
                missing_fields.append(field)

        if missing_fields:
            frappe.throw(f"Missing required fields: {', '.join(missing_fields)}")

        # Update workflow state
        doc.workflow_state = "Customer Confirmed"
        doc.confirmation_timestamp = frappe.utils.now()
        doc.save(ignore_permissions=True)

        return True

    except Exception as e:
        frappe.log_error(f"Customer confirmation error: {str(e)}")
        frappe.throw(f"Failed to process confirmation: {str(e)}")

@frappe.whitelist()
def create_sales_order(doc, action):
    """Create sales order from confirmed voice form"""
    try:
        # Get form data
        form_data = frappe.parse_json(doc.form_data)

        # Validate business rules
        validate_business_rules(doc.business_type, form_data)

        # Create sales order
        sales_order = create_business_record(doc)

        if sales_order:
            doc.business_record_type = "Sales Order"
            doc.business_record_id = sales_order.name
            doc.workflow_state = "Order Placed"
            doc.save(ignore_permissions=True)

            # Send confirmation to customer
            send_order_confirmation(doc, sales_order)

            return True
        else:
            frappe.throw("Failed to create sales order")

    except Exception as e:
        frappe.log_error(f"Sales order creation error: {str(e)}")
        frappe.throw(f"Failed to create order: {str(e)}")

def validate_business_rules(business_type, form_data):
    """Validate business-specific rules"""
    if business_type == "restaurant":
        # Check minimum order amount
        items = form_data.get("order_items", [])
        total_amount = calculate_order_total(items)

        if total_amount < 10.00:
            frappe.throw("Minimum order amount is $10.00")

        # Check operating hours
        if not is_within_operating_hours():
            frappe.throw("Restaurant is currently closed")

        # Check delivery radius
        if form_data.get("delivery_type") == "delivery":
            address = form_data.get("delivery_address")
            if not is_within_delivery_radius(address):
                frappe.throw("Address is outside our delivery area")

def send_order_confirmation(voice_form, sales_order):
    """Send order confirmation to customer"""
    try:
        form_data = frappe.parse_json(voice_form.form_data)
        phone = form_data.get("phone_number")
        email = form_data.get("email")

        message = f"Order confirmed! Your order {sales_order.name} has been placed. "
        message += f"Total: ${sales_order.grand_total:.2f}. "

        if form_data.get("delivery_type") == "delivery":
            message += "Estimated delivery: 30-45 minutes."
        else:
            message += "Ready for pickup in 25-30 minutes."

        # Send SMS
        if phone:
            send_sms_notification(phone, message)

        # Send Email
        if email:
            send_email_notification(email, sales_order, voice_form)

    except Exception as e:
        frappe.log_error(f"Confirmation sending error: {str(e)}")

# Helper functions
def generate_dynamic_form_schema(business_type, voice_data):
    """Generate form schema based on voice data and business type"""
    schema = {
        "business_type": business_type,
        "fields": [],
        "validation_rules": {}
    }

    # Get base schema for business type
    base_schemas = {
        "restaurant": {
            "required_fields": ["customer_name", "phone_number", "order_items"],
            "optional_fields": ["email", "delivery_address", "special_instructions"]
        },
        "support": {
            "required_fields": ["customer_name", "issue_description"],
            "optional_fields": ["phone_number", "email", "priority"]
        },
        "appointment": {
            "required_fields": ["customer_name", "service_type", "preferred_date"],
            "optional_fields": ["phone_number", "email", "preferred_time"]
        }
    }

    base_schema = base_schemas.get(business_type, base_schemas["restaurant"])

    # Generate fields based on voice data
    for field in base_schema["required_fields"] + base_schema["optional_fields"]:
        field_config = {
            "name": field,
            "label": field.replace("_", " ").title(),
            "type": get_field_type(field),
            "required": field in base_schema["required_fields"],
            "value": voice_data.get(field, ""),
            "confidence": get_field_confidence(field, voice_data)
        }

        schema["fields"].append(field_config)

    return schema

def get_field_type(field_name):
    """Get HTML input type for field"""
    type_mapping = {
        "email": "email",
        "phone_number": "tel",
        "preferred_date": "date",
        "preferred_time": "time",
        "delivery_address": "textarea",
        "special_instructions": "textarea",
        "issue_description": "textarea"
    }

    return type_mapping.get(field_name, "text")

def get_field_confidence(field_name, voice_data):
    """Get confidence score for specific field"""
    # This would use NLP confidence scores
    return voice_data.get(f"{field_name}_confidence", 75)
```

#### 3. **Integration Summary Dashboard**
```python
# voice_agent/page/voice_agent_dashboard/voice_agent_dashboard.py
import frappe
from frappe import _

@frappe.whitelist()
def get_dashboard_data():
    """Get comprehensive dashboard data"""
    try:
        today = frappe.utils.nowdate()
        week_ago = frappe.utils.add_days(today, -7)

        # Voice session statistics
        session_stats = frappe.db.sql("""
            SELECT
                COUNT(*) as total_sessions,
                SUM(CASE WHEN workflow_state = 'Completed' THEN 1 ELSE 0 END) as completed_sessions,
                AVG(confidence_score) as avg_confidence,
                COUNT(DISTINCT customer_name) as unique_customers
            FROM `tabVoice Session Form`
            WHERE date(creation) >= %s
        """, (week_ago,), as_dict=True)[0]

        # Business type breakdown
        business_breakdown = frappe.db.sql("""
            SELECT
                business_type,
                COUNT(*) as count,
                AVG(confidence_score) as avg_confidence
            FROM `tabVoice Session Form`
            WHERE date(creation) >= %s
            GROUP BY business_type
        """, (week_ago,), as_dict=True)

        # Workflow state distribution
        workflow_stats = frappe.db.sql("""
            SELECT
                workflow_state,
                COUNT(*) as count
            FROM `tabVoice Session Form`
            WHERE date(creation) >= %s
            GROUP BY workflow_state
        """, (week_ago,), as_dict=True)

        # Revenue from voice orders
        revenue_stats = frappe.db.sql("""
            SELECT
                SUM(so.grand_total) as total_revenue,
                COUNT(so.name) as order_count,
                AVG(so.grand_total) as avg_order_value
            FROM `tabSales Order` so
            JOIN `tabVoice Session Form` vsf ON so.voice_session_form = vsf.name
            WHERE date(so.creation) >= %s
            AND so.docstatus = 1
        """, (week_ago,), as_dict=True)

        # Top performing tools
        tool_usage = frappe.db.sql("""
            SELECT
                tool_name,
                COUNT(*) as usage_count,
                AVG(success_rate) as avg_success_rate
            FROM `tabVoice Tool Usage`
            WHERE date(creation) >= %s
            GROUP BY tool_name
            ORDER BY usage_count DESC
            LIMIT 10
        """, (week_ago,), as_dict=True)

        return {
            "status": "success",
            "session_stats": session_stats,
            "business_breakdown": business_breakdown,
            "workflow_stats": workflow_stats,
            "revenue_stats": revenue_stats[0] if revenue_stats else {},
            "tool_usage": tool_usage,
            "summary": {
                "total_sessions": session_stats.get("total_sessions", 0),
                "success_rate": (session_stats.get("completed_sessions", 0) / max(session_stats.get("total_sessions", 1), 1)) * 100,
                "avg_confidence": session_stats.get("avg_confidence", 0),
                "total_revenue": revenue_stats[0].get("total_revenue", 0) if revenue_stats else 0
            }
        }

    except Exception as e:
        frappe.log_error(f"Dashboard data error: {str(e)}")
        return {
            "status": "error",
            "message": str(e)
        }
```

---

## Conclusion

### 🎯 **Complete System Overview**

This comprehensive system provides:

#### **1. Necessary Tools Architecture**
- **25+ specialized tools** distributed between MCP Server and Ultravox
- **Real-time voice processing** with instant UI feedback
- **Business logic integration** with ERPNext validation
- **Customer service tools** for order tracking and support

#### **2. ERPNext Dynamic Form Storage**
- **Custom Voice Session Form doctype** with JSON schema validation
- **Automatic business record creation** (Sales Orders, Support Tickets, Appointments)
- **Complete audit trail** with confidence scores and voice metadata
- **Workflow integration** with state management

#### **3. Restaurant Staff Interface**
- **Real-time dashboard** showing active voice orders
- **Kitchen display system** with order management
- **Status update tools** with customer notifications
- **Performance analytics** and confidence monitoring

#### **4. Order Tracking & Customer Inquiry**
- **Multiple lookup methods** (order number, phone, name)
- **Natural voice responses** with estimated times
- **Order modification capability** within time limits
- **Comprehensive status timeline** with delivery tracking

#### **5. Strategic Tool Distribution**
- **MCP Server**: Voice processing, UI generation, real-time feedback
- **Ultravox Platform**: Business logic, ERPNext integration, order management
- **Optimized performance** with minimal latency

### 🚀 **Key Benefits**

✅ **Seamless Integration**: Dynamic forms automatically create ERPNext records
✅ **Staff Efficiency**: Real-time dashboard for order management
✅ **Customer Service**: Intelligent order tracking with natural responses
✅ **Data Integrity**: Confidence scores and validation at every step
✅ **Scalability**: Tool distribution optimized for performance
✅ **Business Logic**: All ERPNext workflows and rules enforced

**Ready to implement this complete voice agent ecosystem with ERPNext integration!** 🎤📊🚀

<function_calls>
<invoke name="TodoWrite">
<parameter name="todos">[{"content": "Create ERPNext integration tools and form storage documentation", "status": "completed", "activeForm": "Creating ERPNext integration tools and form storage documentation"}, {"content": "Design restaurant staff interface for order management", "status": "completed", "activeForm": "Designing restaurant staff interface for order management"}, {"content": "Document order tracking and customer inquiry tools", "status": "completed", "activeForm": "Documenting order tracking and customer inquiry tools"}, {"content": "Create MCP vs Ultravox tool distribution strategy", "status": "completed", "activeForm": "Creating MCP vs Ultravox tool distribution strategy"}, {"content": "Design ERPNext custom forms and workflow integration", "status": "completed", "activeForm": "Designing ERPNext custom forms and workflow integration"}]

<function_calls>
<invoke name="TodoWrite">
<parameter name="todos">[{"content": "Create ERPNext integration tools and form storage documentation", "status": "completed", "activeForm": "Creating ERPNext integration tools and form storage documentation"}, {"content": "Design restaurant staff interface for order management", "status": "completed", "activeForm": "Designing restaurant staff interface for order management"}, {"content": "Document order tracking and customer inquiry tools", "status": "completed", "activeForm": "Documenting order tracking and customer inquiry tools"}, {"content": "Create MCP vs Ultravox tool distribution strategy", "status": "completed", "activeForm": "Creating MCP vs Ultravox tool distribution strategy"}, {"content": "Design ERPNext custom forms and workflow integration", "status": "in_progress", "activeForm": "Designing ERPNext custom forms and workflow integration"}]

<function_calls>
<invoke name="TodoWrite">
<parameter name="todos">[{"content": "Create ERPNext integration tools and form storage documentation", "status": "completed", "activeForm": "Creating ERPNext integration tools and form storage documentation"}, {"content": "Design restaurant staff interface for order management", "status": "completed", "activeForm": "Designing restaurant staff interface for order management"}, {"content": "Document order tracking and customer inquiry tools", "status": "in_progress", "activeForm": "Documenting order tracking and customer inquiry tools"}, {"content": "Create MCP vs Ultravox tool distribution strategy", "status": "pending", "activeForm": "Creating MCP vs Ultravox tool distribution strategy"}, {"content": "Design ERPNext custom forms and workflow integration", "status": "pending", "activeForm": "Designing ERPNext custom forms and workflow integration"}]