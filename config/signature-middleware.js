import crypto from 'crypto';
import { logMessage } from '../utils/logger.js';
import { IBOB_SERVER_KEY } from '../config/config.js';
import { log } from 'console';

function verifyUltravoxSignature(req, res, next) {
  const secret = IBOB_SERVER_KEY;
  const signatureHeader = req.headers['x-ultravox-webhook-signature'];
  const timestamp = req.headers['x-ultravox-webhook-timestamp'];
  const rawBody = req.rawBody;

  logMessage('signatureHeader',signatureHeader);
  logMessage('timestamp',timestamp);
  logMessage('rawBody',rawBody);

  if (!secret || !signatureHeader) {
    logMessage('Missing webhook secret or signature'); 
    return res.status(403).json({ success: false, message: 'Forbidden: Missing signature' });
  }

  const signatures = signatureHeader.split(',').map(s => s.trim());
  logMessage('signatures',signatures);

  const baseString = rawBody + timestamp;
  logMessage('baseString',baseString);
  const computedHash = crypto
    .createHmac('sha256', secret)
    .update(baseString, 'utf8')
    .digest('hex');

  // Replay protection: ensure timestamp is recent (within 60 seconds)
  const receivedTs = new Date(timestamp);
  logMessage('receivedTs',receivedTs);

  if (isNaN(receivedTs)) {
    logMessage('Invalid timestamp format');
    return res.status(403).json({ success: false, message: 'Forbidden: Invalid timestamp' });
  }
  if (Math.abs(Date.now() - receivedTs.getTime()) > 60 * 1000) {
    logMessage('Expired timestamp');
    return res.status(403).json({ success: false, message: 'Forbidden: Expired timestamp' });
  }

  // Validate against all signatures (supports rotation)
  const isValid = signatures.some(sig => crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(computedHash)));
  logMessage('isValid',isValid);

  if (isValid) {
    logMessage('Webhook signature verified');
    return next();
  } else {
    logMessage('Invalid webhook signature');
    return res.status(403).json({ success: false, message: 'Forbidden: Invalid signature' });
  }
}

export default verifyUltravoxSignature;