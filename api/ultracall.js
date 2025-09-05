 import axios from 'axios';
import dotenv from 'dotenv';
import {
  ERP_API_BASE_URL ,CREATE_LOG_CALL_REQUEST_LOGGER,E_ADMIN_API_KEY ,E_ADMIN_API_SECRET,ULTRAVOX_API_URL,UV
} from '../config/config.js';
import { getCallSessionDocname,log_incoming_call_request,uploadRecordingViaCustomAPI } from './erpcall.js';
import { logMessage } from '../utils/logger.js';

dotenv.config();

 


export async function getCallTranscript_Ultra(callId,UVdate) {
  let allMessages = [];
    logMessage('getCallTranscript_Ultra called with callId:', callId);
  try {
    if (!callId) {
      logMessage('Missing callId in getCallTranscript_Ultra');
      return null;
    }

    const url = `${ULTRAVOX_API_URL}/calls/${callId}/messages`;
    logMessage('Fetching messages from URL:', url);

    const response = await fetch(url, {
      headers: {
        // 'X-API-Key': ULTRAVOX_API_KEY,
        'X-API-Key': UVdate,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      await log_incoming_call_request('Ultravox API responded with status getCallTranscript_Ultra():',  response.message, response.status);
      logMessage(`Ultravox API responded with status ${response.status}`);
      return null;
    }

    const data = await response.json();
    logMessage('Fetched call data from Ultravox:', data);

    allMessages = allMessages.concat(data.results || []);

    return {
      callId,
      messages: allMessages
    };

  } catch (error) {
    logMessage('Error fetching Ultravox messages:', error.message);
    return null;
  }
}

export async function deleteCall_U(callId,UVdate) {
    logMessage(`Attempting to delete Ultravox call with ID: ${callId}`);

    try {
        // Step 1: Validate the callId. A callId is required for the API request.
        if (!callId) {
            logMessage('Error: Missing callId. Deletion request aborted.');
            // Log the error to your ERP system for tracking
            await log_incoming_call_request('Ultravox Deletion Error', 'Missing callId', 'Client Error');
            return false;
        }

        // Step 2: Construct the API URL.
        // This URL matches the structure from the Ultravox documentation.
        const urlToDelete = `${ULTRAVOX_API_URL}/calls/${callId}`;

        // Step 3: Make the DELETE request to the Ultravox API.
        const response = await fetch(urlToDelete, {
            method: 'DELETE',
            headers: {
                'X-API-Key': UVdate,
                // 'X-API-Key': ULTRAVOX_API_KEY,
                'Accept': 'application/json'
            }
        });

        // Step 4: Handle the API response.
        if (response.ok) {
            // The API returns a successful status (e.g., 200, 204)
            logMessage(`Successfully deleted Ultravox call with ID: ${callId}`);
            return true;
        } else {
            // The API returned an error status code.
            const errorBody = await response.text();
            logMessage(`Failed to delete Ultravox call ${callId}. Status: ${response.status}, Body: ${errorBody}`);
            // Log the failure to your ERP system
            await log_incoming_call_request(
                'Ultravox Deletion Failed',
                { callId, status: response.status, errorBody },
                'API Error'
            );
            return false;
        }

    } catch (error) {
        // Step 5: Handle network or other unexpected errors.
        logMessage(`Unexpected error during Ultravox call deletion for ID ${callId}: ${error.message}`);
        console.error('Stack trace:', error.stack);
        await log_incoming_call_request(
            'Ultravox Deletion Unexpected Error',
            { callId, error: error.message },
            'System Error'
        );
        return false;
    }
}

export async function getCallRecording_Ultra(callId,UVdate) { 
  
  try {
    if (!callId) {
      logMessage('Missing callId in getCallRecording_Ultra');
      return null;
    }
    
    // 1. Fetch recording from Ultravox
    const recordingUrl = `${ULTRAVOX_API_URL}/calls/${callId}/recording`;   

    const response = await fetch(recordingUrl, {
      headers: {
        // 'X-API-Key': ULTRAVOX_API_KEY,
        'X-API-Key': UVdate,
        
        //'Accept': 'audio/mpeg' // Typically recordings are in MP3 format
      }
    });
    

    if (!response.ok) {
      logMessage(`Ultravox recording API error: ${response.status}`);
      await log_incoming_call_request(
        'Ultravox Recording API Error', 
        { status: response.status, callId },
        null
      );
      return null;
    }
     

    // 2. Get recording as Blob
    const recordingBlob = await response.blob();  
    if (!recordingBlob || recordingBlob.size === 0) {
      logMessage('**Recording blob is empty or undefined.');
      return null;
    }

   
    const doctname= await getCallSessionDocname(callId);    

    const docnameValue = doctname?.message?.name;
    if (!docnameValue) {
     logMessage('Docname missing or undefined. Cannot upload recording.');
    return null;
    }
    logMessage('**File will be uploaded to Docname:', docnameValue);
    // 3. Upload fiel t0 ERPNext
   const uploadResult = await uploadRecordingViaCustomAPI({
    fileBlob: recordingBlob,
    filename: `${callId}.mp3`,
    doctype: 'Call Session Log',
    docname: docnameValue,    
    apiKey: E_ADMIN_API_KEY,
    apiSecret: E_ADMIN_API_SECRET,
    baseUrl: ERP_API_BASE_URL
  });

  if (!uploadResult.success) {
    logMessage('File upload failed:', uploadResult.error);
    await log_incoming_call_request(
      'Recording Upload Failed',
      { callId, error: uploadResult.error },
      null
    );
    return null;
  }

  } catch (error) {
    logMessage('Error in getCallRecording_Ultra:', error);
    await log_incoming_call_request(
      'Recording Attachment Error', 
      { error: error.message, callId },
      null
    );
    return null;
  }
}

 