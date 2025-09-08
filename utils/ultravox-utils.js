import 'dotenv/config';
import https from 'node:https';
import {
  // ULTRAVOX_API_KEY,
  ULTRAVOX_API_URL,
  TOOLS_BASE_URL 
} from '../config/config.js';
import { logMessage } from './logger.js';
 
export async function createUltravoxCall(callConfig,UVdate) {
  const ultravoxConfig = {
    ...callConfig,
    experimentalSettings: {
      webhooks: [{
        url: `${TOOLS_BASE_URL}/cal/saveTranscript`,
        events: ['call.ended']
      }]
    }
  };

  logMessage('Creating Ultravox call...');
  logMessage('Payload:', JSON.stringify(ultravoxConfig, null, 2));
  logMessage('API URL:', `${ULTRAVOX_API_URL}/calls`);

  return new Promise((resolve) => {
    try {
      const req = https.request(`${ULTRAVOX_API_URL}/calls`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',          
          'X-API-Key': UVdate
          // 'X-API-Key': ULTRAVOX_API_KEY
        }
      });

      let data = '';

      req.on('response', (res) => {
        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          if (res.statusCode >= 400) {
            console.error(`Ultravox API Error ${res.statusCode}:`, data);
            resolve(null);
          } else {
            try {
              const parsed = JSON.parse(data);
              resolve(parsed);
            } catch (err) {
              console.error('Failed to parse Ultravox response:', err.message);
              resolve(null);
            }
          }
        });
      });

      req.on('error', (err) => {
        logMessage('Failed to create Ultravox call:', err.message);
        resolve(null);
      });

      req.write(JSON.stringify(ultravoxConfig));
      req.end();

    } catch (err) {
      logMessage('Unexpected error during Ultravox call:', err.message);
      resolve(null);
    }
  });
}


