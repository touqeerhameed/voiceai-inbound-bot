// WhatsApp signature verification middleware for Twilio
import twilio from 'twilio';
import 'dotenv/config';
import { getTwToken } from '../api/erpcall.js';
import { logMessage } from '../utils/logger.js';

// Twilio Request Validation Middleware for WhatsApp
const verifyTwilioSignatureWhatsApp = async (req, res, next) => {
  try {
    const protocol = req.protocol; // will be https if Twilio called https
    const host = req.get('host');
    const twilioUrl = `${protocol}://${host}${req.originalUrl}`;

    logMessage('➡️ Incoming WhatsApp request for Twilio validation');
    logMessage('WhatsApp Request URL:', twilioUrl);

    const twilioSignature = req.header('X-Twilio-Signature');
    const body = req.body || {};
    const requestBody = req.rawBody || '';
    const paramsToCheck = req.is('application/x-www-form-urlencoded') ? body : requestBody;

    // For WhatsApp, the 'To' field contains the WhatsApp number (e.g., whatsapp:+447367184030)
    let calledNumber = body.To;
    logMessage('Original', calledNumber)

    calledNumber= calledNumber.replace("whatsapp:","");
    logMessage('After', calledNumber)

    logMessage('WhatsApp called number:', calledNumber);
    logMessage('WhatsApp from number:', body.From);
    logMessage('WhatsApp message body:', body.Body);
    logMessage('WhatsApp ProfileName:', body.ProfileName);
    logMessage('WhatsApp WaId:', body.WaId);

    // Get auth token based on the WhatsApp number
    const authToken = calledNumber ? await getTwToken(calledNumber) : null;

    logMessage('WhatsApp authToken retrieved:', authToken ? 'Found' : 'Not found');

    if (!authToken) {
      logMessage('❌ No Auth Token found for WhatsApp number:', calledNumber);
      return res.status(403).send('Unauthorized: Missing Twilio Auth Token for WhatsApp');
    }

    // Validate the Twilio signature
    const isValid = twilio.validateRequest(authToken, twilioSignature, twilioUrl, paramsToCheck);

    if (!isValid) {
      logMessage('❌ Twilio WhatsApp signature validation failed');
      logMessage('Failed validation details:', {
        authToken: authToken ? 'Present' : 'Missing',
        signature: twilioSignature ? 'Present' : 'Missing',
        url: twilioUrl,
        bodyType: typeof paramsToCheck
      });
      return res.status(403).send('Twilio WhatsApp signature validation failed');
    }

    logMessage('✅ Twilio WhatsApp request validated successfully');
    return next();

  } catch (error) {
    console.error('❌ Error in verifyTwilioSignatureWhatsApp middleware:', error);
    logMessage('Error in WhatsApp validation middleware:', error.message);
    return res.status(500).send('Internal Server Error in WhatsApp validation');
  }
};

// Alternative validation function for development/testing (less strict)
const verifyTwilioSignatureWhatsAppDev = async (req, res, next) => {
  try {
    logMessage('🧪 DEV MODE: WhatsApp webhook validation (less strict)');

    const body = req.body || {};
    logMessage('WhatsApp DEV - Request body:', JSON.stringify(body, null, 2));

    // Basic validation - just check if it looks like a WhatsApp message
    if (body.MessageType && body.From && body.From.startsWith('whatsapp:')) {
      logMessage('✅ DEV: WhatsApp message format validated');
      return next();
    } else {
      logMessage('❌ DEV: Invalid WhatsApp message format');
      return res.status(400).send('Invalid WhatsApp message format');
    }

  } catch (error) {
    console.error('❌ Error in WhatsApp DEV validation:', error);
    return res.status(500).send('Internal Server Error in WhatsApp DEV validation');
  }
};

export default verifyTwilioSignatureWhatsApp;
export { verifyTwilioSignatureWhatsAppDev };