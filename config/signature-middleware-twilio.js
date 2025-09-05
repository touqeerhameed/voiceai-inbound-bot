// index.js
import twilio from 'twilio';
import 'dotenv/config';
import { getTwToken } from '../api/erpcall.js';
import { logMessage } from '../utils/logger.js';

// // Safe logger fallback
// let logMessage;
// try {
//   const loggerModule = await import('../utils/logger.js');
//   logMessage = loggerModule.logMessage || console.log;
// } catch (err) {
//   logMessage = (...args) => console.log('[LOGGER]', ...args);
//   console.warn('⚠️ Logger not found, using console.log instead');
// }

// Twilio Request Validation Middleware
const verifyTwilioSignature_1 = async (req, res, next) => {
  try {
    const protocol = req.protocol; // http or https
    const host = req.get('host');  // e.g., yourdomain.com
    const twilioUrl = `${protocol}://${host}${req.originalUrl}`;

    logMessage('➡️ Incoming request for Twilio validation');

    // Get the X-Twilio-Signature header
    const twilioSignature = req.header('X-Twilio-Signature');
    // const twilioUrl = req.originalUrl;

    // Body handling
    const body = req.body || {};
    const requestBody = req.rawBody || '';
    const paramsToCheck = req.is('application/x-www-form-urlencoded') ? body : requestBody;


    logMessage('Request body:', body);
    logMessage('Request URL:', twilioUrl);
    logMessage('twilioSignature:', twilioSignature);

    // Get company-specific token
    const calledNumber = body.Called;
    const authToken = calledNumber ? await getTwToken(calledNumber) : null;
    logMessage('authToken',authToken);

    if (!authToken) {
      logMessage('❌ No Auth Token found for number:', calledNumber);
      return res.status(403).send('Unauthorized: Missing Twilio Auth Token');
    }

    // Validate the request
    const isValid = twilio.validateRequest(
      authToken,
      twilioSignature,
      twilioUrl,
      paramsToCheck
    );

    if (isValid) {
      logMessage('✅ Twilio request validated successfully');
      return next();
    } else {
      logMessage('❌ Twilio signature validation failed');
      return res.status(403).send('Twilio signature validation failed');
    }
  } catch (error) {
    console.error('❌ Error in verifyTwilioSignature middleware:', error);
    logMessage('Error in Twilio middleware:', error.message);
    return res.status(500).send('Internal Server Error');
  }
};

const verifyTwilioSignature = async (req, res, next) => {
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

    const calledNumber = body.Called;
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

export default verifyTwilioSignature;
