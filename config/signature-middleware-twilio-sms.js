// index.js
import twilio from 'twilio';
import 'dotenv/config';
import { getTwToken } from '../api/erpcall.js';
import { logMessage } from '../utils/logger.js';

// Safe logger fallback
// let logMessage;
// try {
//   const loggerModule = await import('../utils/logger.js');
//   logMessage = loggerModule.logMessage || console.log;
// } catch (err) {
//   logMessage = (...args) => console.log('[LOGGER]', ...args);
//   console.warn('⚠️ Logger not found, using console.log instead');
// }

// Twilio Request Validation Middleware for SMS
const verifyTwilioSignatureSMS = async (req, res, next) => {
  try {
    const protocol = req.protocol; // will now be https if Twilio called https
    const host = req.get('host');
    const twilioUrl = `${protocol}://${host}${req.originalUrl}`;

    logMessage('➡️ Incoming request for Twilio validation');
    logMessage('Request URL:', twilioUrl);

    const twilioSignature = req.header('X-Twilio-Signature');
    const body = req.body || {};
    const requestBody = req.rawBody || '';
    const paramsToCheck = req.is('application/x-www-form-urlencoded') ? body : requestBody;

    const calledNumber = body.To;;
    const authToken = calledNumber ? await getTwToken(calledNumber) : null;
    if (!authToken) {
      return res.status(403).send('Unauthorized: Missing Twilio Auth Token');
    }

    const isValid = twilio.validateRequest(authToken, twilioSignature, twilioUrl, paramsToCheck);

    if (!isValid) {
      logMessage('❌ Twilio signature validation failed');
      return res.status(403).send('Twilio signature validation failed');
    }

    logMessage('✅ Twilio request validated successfully');
    return next();

  } catch (error) {
    console.error('❌ Error in verifyTwilioSignature middleware:', error);
    return res.status(500).send('Internal Server Error');
  }
};

const verifyTwilioSignatureSMS1 = async (req, res, next) => {
  try {
    logMessage('➡️ Incoming request for Twilio SMS validation');

    const twilioSignature = req.header('X-Twilio-Signature');
    const twilioUrl = req.originalUrl;
    const requestBody = req.rawBody || '';
    const body = req.body || {};

    logMessage('Request body:', body);
    logMessage('Twilio signature header:', twilioSignature);
    logMessage('Request URL:', twilioUrl);

    const companySMSNumber = body.To;
    const authToken = companySMSNumber ? await getTwToken(companySMSNumber) : null;

    if (!authToken) {
      logMessage('❌ No Auth Token found for SMS number:', companySMSNumber);
      return res.status(403).send('Unauthorized: Missing Twilio Auth Token');
    }

    const isValid = twilio.validateRequest(
      authToken,
      twilioSignature,
      twilioUrl,
      requestBody
    );

    if (isValid) {
      logMessage('✅ Twilio SMS request validated successfully');
      return next();
    } else {
      logMessage('❌ Twilio SMS signature validation failed');
      logMessage('Request body on failure:', body);
      return res.status(403).send('Twilio SMS signature validation failed');
    }
  } catch (error) {
    console.error('❌ Error in verifyTwilioSignatureSMS middleware:', error);
    logMessage('Error in SMS middleware:', error.message);
    return res.status(500).send('Internal Server Error');
  }
};

export default verifyTwilioSignatureSMS;
