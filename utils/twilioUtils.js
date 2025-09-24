// utils/twilioUtils.js
import twilio from 'twilio';
import { getbusinessbyPhoneNumber } from '../api/erpcall.js';
import { logMessage } from './logger.js';

export async function fetchCallDetails(callSid,From) {
  try {
    if (!callSid) throw new Error('Missing call SID');

    //GET COMPANY DETAIL
    logMessage('📞 Fetching call details for From:', From);
    const company = await getbusinessbyPhoneNumber(From);
    if (!company) {
      logMessage(`❌ No company found for phone number: ${From}`);
      return null;
    }
    logMessage('📞 Company details:', company);
    const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
    const call = await client.calls(callSid).fetch();

    return {
      duration: call.duration,
      startTime: call.startTime,
      endTime: call.endTime,
      from: call.from,
      to: call.to,
      status: call.status,
      sid: call.sid
    };
  } catch (err) {
    logMessage(`❌ fetchCallDetails failed for SID ${callSid}:`, err.message);
    return null;
  }
}

export async function sendWhatsAppMessage(to, message, credentials) {
  try {
    if (!to || !message) {
      throw new Error('Missing required parameters: to or message');
    }

    const client = twilio(credentials.twilio_account_sid, credentials.twilio_auth_token);

    // Format the phone number for WhatsApp (must include whatsapp: prefix)
    const formattedTo = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`;
    const whatsappFrom = process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+447367184030';

    logMessage('📱 Sending WhatsApp message:', {
      to: formattedTo,
      from: whatsappFrom,
      messageLength: message.length
    });

    const whatsappMessage = await client.messages.create({
      body: message,
      from: whatsappFrom,
      to: formattedTo
    });

    logMessage('✅ WhatsApp message sent successfully:', whatsappMessage.sid);

    return {
      success: true,
      messageSid: whatsappMessage.sid,
      status: whatsappMessage.status,
      to: formattedTo,
      from: whatsappFrom
    };

  } catch (error) {
    logMessage('❌ WhatsApp send error:', error.message);

    return {
      success: false,
      error: error.message,
      code: error.code || 'UNKNOWN_ERROR'
    };
  }
}

export async function sendSMS(to, message, credentials) {
  try {
    if (!to || !message) {
      throw new Error('Missing required parameters: to or message');
    }

    const client = twilio(credentials.twilio_account_sid, credentials.twilio_auth_token);

    logMessage('📱 Sending SMS:', { to, messageLength: message.length });

    const smsMessage = await client.messages.create({
      body: message,
      from: credentials.twilio_phone_number,
      to: to
    });

    logMessage('✅ SMS sent successfully:', smsMessage.sid);

    return {
      success: true,
      messageSid: smsMessage.sid,
      status: smsMessage.status,
      to: to,
      from: credentials.twilio_phone_number
    };

  } catch (error) {
    logMessage('❌ SMS send error:', error.message);

    return {
      success: false,
      error: error.message,
      code: error.code || 'UNKNOWN_ERROR'
    };
  }
}
