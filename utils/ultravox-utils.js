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


export async function getCallTranscript_notused(callId) {
  if (!callId) {
    logMessage('Missing callId for transcript fetch.');
    return null;
  }

  let allMessages = [];
  let nextCursor = null;

  try {
    do {
      const url = `${ULTRAVOX_API_URL}/calls/${callId}/messages${nextCursor ? `?cursor=${nextCursor}` : ''}`;
      
      const response = await fetch(url, {
        headers: {
          'X-API-Key': UVdate,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        logMessage(`Ultravox API responded with status ${response.status}`);
        return null;
      }

      const data = await response.json();

      if (!data?.results) {
        logMessage('No transcript messages found in response.');
        break;
      }

      allMessages = allMessages.concat(data.results);
      nextCursor = data.next ? new URL(data.next).searchParams.get('cursor') : null;

    } while (nextCursor);

    return allMessages;

  } catch (error) {
    logMessage('Failed to fetch Ultravox messages:', error.message);
    return null;
  }
}
 
// ultravox-utils.js
export async function createUltravoxCall_old(callConfig) {
  // VALID configuration using experimentalSettings
  
  console.log('Creating Ultravox call with config:', JSON.stringify(callConfig, null, 2));
  const ultravoxConfig = {
    ...callConfig,
    experimentalSettings: {
      webhooks: [{
        url: `${TOOLS_BASE_URL}/cal/saveTranscript`,
        events: ["call.ended"]
      }]
    }
  };
  console.log('Creating Ultravox call with config:', JSON.stringify(ultravoxConfig, null, 2));
  console.log('API URL:', `${ULTRAVOX_API_URL}/calls`);

  const request = https.request(`${ULTRAVOX_API_URL}/calls`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': UVdate
    }
  });

  return new Promise((resolve, reject) => {
    let data = '';
    request.on('response', (response) => {
      response.on('data', chunk => data += chunk);
      response.on('end', () => {
        if (response.statusCode >= 400) {
          reject(new Error(`HTTP Error ${response.statusCode}: ${data}`));
        } else {
          resolve(JSON.parse(data));
        }
      });
    });
    request.on('error', reject);
    request.write(JSON.stringify(ultravoxConfig));
    request.end();
  });
}

export async function getCallTranscript_old(callId) {
  let allMessages = [];
  let nextCursor = null;

  try {
    // Keep fetching until we have all messages
    do {
      const url = `${ULTRAVOX_API_URL}/calls/${callId}/messages${nextCursor ? `?cursor=${nextCursor}` : ''}`;
      
      const response = await fetch(url, {
        headers: {
          'X-API-Key': UVdate,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Add the current page of results to our collection
      allMessages = allMessages.concat(data.results);

      // Update the cursor for the next iteration
      nextCursor = data.next ? new URL(data.next).searchParams.get('cursor') : null;

    } while (nextCursor);

    return allMessages;

  } catch (error) {
    console.error('Error fetching Ultravox messages:', error.message);
    throw error;
  }
}
