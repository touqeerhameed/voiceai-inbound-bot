import frappe
import json
from frappe.utils import now
# from twilio.request_validator import RequestValidator # Uncomment for production security
from aiagentapp.api.aiapi import add_sms_log # <--- This line is important

# Ensure add_sms_log is imported or defined here
# from .api import add_sms_log # Example import if add_sms_log is in api.py
# Or copy the add_sms_log function directly above this if it's in the same file.



@frappe.whitelist(allow_guest=True)
def whatsapp_reply_rec():
    """
    Controller function for the Twilio incoming WhatsApp reply webhook.
    Accessed via a Frappe Web Route.
    Updated to use new DocType fields for inbound WhatsApp messages.
    """
    try:
        from_number = frappe.form_dict.get('From')  # whatsapp:+447305671889
        to_number = frappe.form_dict.get('To')      # whatsapp:+447367184030
        message_body = frappe.form_dict.get('Body')
        message_sid = frappe.form_dict.get('MessageSid') # Twilio's unique ID for this incoming message

        # WhatsApp specific fields
        profile_name = frappe.form_dict.get('ProfileName')  # touqeer hameed
        wa_id = frappe.form_dict.get('WaId')               # 447305671889
        message_type = frappe.form_dict.get('MessageType') # text
        num_media = frappe.form_dict.get('NumMedia', '0')  # 0

        # --- Basic validation ---
        if not all([from_number, to_number, message_body, message_sid]):
            frappe.log_error(
                f"Incomplete Twilio WhatsApp webhook payload received at /twilio/whatsapp-webhook: {frappe.form_dict}",
                "Twilio WhatsApp Webhook Error - Incomplete Data"
            )
            return "<Response><Message>Error: Incomplete Data</Message></Response>"

        # --- Clean WhatsApp number format for database lookup ---
        # Remove 'whatsapp:' prefix from both numbers
        clean_to_number = to_number.replace("whatsapp:", "")
        clean_from_number = from_number.replace("whatsapp:", "")

        frappe.log_error(
            f"WhatsApp Message Received: From={clean_from_number}, To={clean_to_number}, ProfileName={profile_name}, WaId={wa_id}, Body={message_body}",
            "WhatsApp Message Log"
        )

        # --- IMPORTANT: Twilio Request Validation (Highly Recommended for Production) ---
        # Uncomment and configure as per previous instructions.

        # --- Find related Business ---
        telecom = frappe.db.get(
                "Telecom Number",
                {
                    "phone_number": clean_to_number,  # Use cleaned number
                    "status": 1
                },
                ["name"]
            )

        if not telecom:
            frappe.log_error(
                f"No active telecom record found for WhatsApp number: {clean_to_number}",
                "WhatsApp Webhook - Telecom Not Found"
            )
            return {"message": "No active telecom record found for this WhatsApp number"}

        UPDATED_CREDIT=0
        business_name = frappe.db.get(
            "Business",
            {"telecom_number": telecom.name},
            ["name"]
        )

        if not business_name:
            frappe.log_error(
                f"Incoming WhatsApp to {clean_to_number}: No Business found configured for this Twilio WhatsApp number. Payload: {frappe.form_dict}",
                "Twilio WhatsApp Webhook - Business Not Found"
            )
            return "<Response><Message>Error: Business not found for this WhatsApp number.</Message></Response>"

        # --- Log the incoming WhatsApp message using the revised add_sms_log function ---
        # Add WhatsApp specific information to the message content for logging
        enhanced_message = f"[WhatsApp] {message_body}"
        if profile_name:
            enhanced_message = f"[WhatsApp from {profile_name}] {message_body}"

        log_result = add_sms_log(
            businessname=business_name.name,
            twilio_phone_number=clean_to_number,      # Your Twilio WhatsApp number (cleaned)
            phone_number=clean_from_number,           # Sender's WhatsApp number (cleaned)
            sms_content=enhanced_message,             # Enhanced with WhatsApp info
            actual_content=message_body,              # Original message body
            status="Received",
            direction="INBOUND",                      # Explicitly INBOUND
            call_id=None,                            # For WhatsApp, call_id can be None
            fail_reason="",
            twilio_message_sid=message_sid,
            # Additional WhatsApp metadata (if your add_sms_log supports extra fields)
            extra_data={
                "message_type": "whatsapp",
                "profile_name": profile_name,
                "wa_id": wa_id,
                "num_media": num_media,
                "original_from": from_number,
                "original_to": to_number
            }
        )

        if not log_result["success"]:
            frappe.log_error(
                f"Failed to log incoming WhatsApp message from {clean_from_number} to {clean_to_number}: {log_result['error']}",
                "ERPNext WhatsApp Webhook - Logging Failed"
            )
            # Return JSON error
            return {"success": False, "message": f"Failed to log WhatsApp message: {log_result['error']}" ,"err":log_result }

        # Log successful processing
        frappe.log_error(
            f"Successfully logged WhatsApp message from {profile_name} ({clean_from_number}) to business {business_name.name}",
            "WhatsApp Message Success Log"
        )

        return "<Response></Response>" # Acknowledge receipt without sending a reply

    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "General Twilio WhatsApp Webhook Error")
        return f"<Response><Message>An internal server error occurred: {str(e)}</Message></Response>"