 import axios from 'axios';
import dotenv from 'dotenv';
// import { setBusinesses, setCompanyBusiness,setbusinessbyPhoneNumber} from '../utils/business-cache.js';
import {
  ERP_API_BASE_URL ,CREATE_LOG_CALL_REQUEST_LOGGER,E_ADMIN_API_KEY ,E_ADMIN_API_SECRET,ERP_SESSION_LOG_URL,UV
} from '../config/config.js';
import { logMessage } from '../utils/logger.js';
dotenv.config();


/*
export async function fetchGroupBusiness(businessgroupid) {
  if (!businessgroupid) {
    console.error('businessgroupid is required');
    return null;
  }

  try {
    const response = await axios.post(
      `${ERP_API_BASE_URL}aiagentapp.api.aiapi.getbusiness`,
      { businessgroupid },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `token ${E_ADMIN_API_KEY}:${E_ADMIN_API_SECRET}`
        }
      }
    );

    const businesses = response.data?.message;

    if (!Array.isArray(businesses) || businesses.length === 0) {
      console.warn('No business records found for group:', businessgroupid);
      return null;
    }

    setBusinesses(businesses);
    console.log(`Loaded ${businesses.length} businesses for group ${businessgroupid}`);

    return businesses;

  } catch (error) {
    if (error.response) {
      console.error(
        'ERP API error:',
        error.response.status,
        error.response.statusText,
        error.response.data
      );
    } else if (error.request) {
      console.error('No response from ERP API:', error.request);
    } else {
      console.error('Unexpected error:', error.message);
    }

    return null;
  }
}
*/

export async function GET_outboundSETTINGS() {
  try {    

   
     const response = await axios.post(
      `${ERP_API_BASE_URL}aiagentapp.api.outbound.get_outbound_settings`, 
      {}, // Empty body, as no parameters are passed
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `token ${E_ADMIN_API_KEY}:${E_ADMIN_API_SECRET}`
        }
      }
    );   
    const result = response.data;
    if (!result.message) {
      logMessage('Call log succeeded but no message returned');
      return null;
    }

    //console.log('Call session logged:', result.message);
    return result;

  } catch (error) {
    // Unified error handling
    const errorResponse = {
      status: 'error',
      message: 'Failed to log call session',
      details: null
    };

    if (error.response) {
      // Server responded with error status
      errorResponse.details = {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data
      };
      logMessage('API Error Response:', errorResponse.details);
    } else if (error.request) {
      // No response received
      errorResponse.details = 'No response from server';
      logMessage('No response received:', error.request);
    } else {
      // Setup error
      errorResponse.details = error.message;
      logMessage('GET_outboundSETTINGS Request setup error:', error.message);
    }

    // Return error object instead of throwing
    return errorResponse;

    // Optional: Throw in development
    // if (process.env.NODE_ENV === 'development') throw error;
    // return errorResponse;
  }
}

export async function getuv(phoneNumber) {
    // Log the start of the function call for debugging
    logMessage('getuv uv called with phone_number:', phoneNumber);

    try {
        if (!phoneNumber) {
            logMessage('getuv Missing phone_number in getUltravoxKey');
            return null;
        }
        
        // Construct the full API URL.
        const apiUrl = `${ERP_API_BASE_URL}aiagentapp.api.aiapi.getuvwith`;

        // logMessage('getuv Fetching uv key from URL:', apiUrl);

        // Make the GET request to the Frappe API using axios
        const response = await axios.get(apiUrl, {
            params: { 
                UV:UV ,
                ph_num: phoneNumber
                
            },
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `token ${E_ADMIN_API_KEY}:${E_ADMIN_API_SECRET}`
            }
        });

        const data = response.data;
        // logMessage('getuv Fetched data from Frappe API:', data);

        // Check the Frappe response structure for success and return the key
        if (data && data.message && data.message.success) {
            return data.message.uv_key;
        } else {
            logMessage('getuv API returned an error:', data?.message?.message || 'Unknown error');
            return null;
        }

    } catch (error) {
        if (error.response) {
            logMessage('getuv API error:', error.response.status, error.response.statusText, error.response.data);
        } else if (error.request) {
            logMessage('getuv No response from ERP API:', error.request);
        } else {
            logMessage('getuv Unexpected error:', error.message);
        }
        return null;
    }
}

export async function getTwToken(phoneNumber) {
    // Log the start of the function call for debugging
    logMessage('getTwToken uv called with phone_number:', phoneNumber);

    try {
        if (!phoneNumber) {
            logMessage('getTwToken Missing phone_number in getTwKey');
            return null;
        }
        
        // Construct the full API URL.
        const apiUrl = `${ERP_API_BASE_URL}aiagentapp.api.aiapi.getTwToken`;

        // logMessage('getuv Fetching uv key from URL:', apiUrl);

        // Make the GET request to the Frappe API using axios
        const response = await axios.get(apiUrl, {
            params: { 
                UV:UV ,
                ph_num: phoneNumber
                
            },
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `token ${E_ADMIN_API_KEY}:${E_ADMIN_API_SECRET}`
            }
        });

        const data = response.data;
        logMessage('getuv Fetched data from Frappe API:', data);

        // Check the Frappe response structure for success and return the key
        if (data && data.message && data.message.success) {
            return data.message.tw_key;
        } else {
            logMessage('getTwToken API returned an error:', data?.message?.message || 'Unknown error');
            return null;
        }

    } catch (error) {
        if (error.response) {
            logMessage('getTwToken API error:', error.response.status, error.response.statusText, error.response.data);
        } else if (error.request) {
            logMessage('getTwToken No response from ERP API:', error.request);
        } else {
            logMessage('getTwToken Unexpected error:', error.message);
        }
        return null;
    }
}


export async function fetchTelecomNumberByPhone(phoneNumber) {
  if (!phoneNumber) {
    console.error('phoneNumber is required');
    return null;
  }

  try {
    const response = await axios.get(
      `${ERP_API_BASE_URL}aiagentapp.api.aiapi.get_telecom_by_phone`,
      {
        params: { phone_number: phoneNumber },
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `token ${E_ADMIN_API_KEY}:${E_ADMIN_API_SECRET}`
        }
      }
    );
     
    const data = response.data;
    logMessage('data : ',data);

    if (!data?.message?.success || !data.message) {
      logMessage('No Telecom record found for phone number:', phoneNumber);
      return null;
    }

    logMessage('Telecom record found:', data.message);
    return data.message.data;

  } catch (error) {
    if (error.response) {
      logMessage('ERP API error:', error.response.status, error.response.statusText, error.response.data);
    } else if (error.request) {
      logMessage('No response from ERP API:', error.request);
    } else {
      logMessage('Unexpected error:', error.message);
    }

    return null;
  }
}

export async function hangupCall(callid, hangup_by,
    companyid,toNumber,fromNumber,direction,intent_from,ResponseAccuracy,
    KnowledgeLimitationHandling, ConfidenceandClarity,ToneandEmpathy,
    EscalationHandling,CustomerSatisfactionOutcome,CustomerBehavior,
    CustomerEffortLevel,ConversationCompletion,EmotionalShiftDuringConversation,
    BackgroundNoiseLevelCustomer,BackgroundNoiseLevelAI,CallDisruptionDueToNoiseOrAudioQuality,
    OverallConversationQuality,callIntent,CallerToneandEmpathy) {
  if (!callid || !hangup_by) {
    logMessage('callid and hangup_by are required');
    return null;
  }

  try {

    const request= {
      "callid": callid,
      "hangup_by": hangup_by,
      "companyid": companyid,
      "toNumber": toNumber,
      "fromNumber": fromNumber,
      "direction": direction,
      "intent_from":intent_from,
      "ResponseAccuracy": ResponseAccuracy,
      "KnowledgeLimitationHandling": KnowledgeLimitationHandling,
      "ConfidenceandClarity": ConfidenceandClarity,
      "ToneandEmpathy": ToneandEmpathy,
      "EscalationHandling": EscalationHandling,
      "CustomerSatisfactionOutcome": CustomerSatisfactionOutcome,
      "CustomerBehavior": CustomerBehavior,      
      "CustomerEffortLevel": CustomerEffortLevel,
      "ConversationCompletion": ConversationCompletion,
      "EmotionalShiftDuringConversation": EmotionalShiftDuringConversation,
      "BackgroundNoiseLevelCustomer": BackgroundNoiseLevelCustomer,
      "BackgroundNoiseLevelAI": BackgroundNoiseLevelAI,
      "CallDisruptionDueToNoiseOrAudioQuality": CallDisruptionDueToNoiseOrAudioQuality,
      "OverallConversationQuality": OverallConversationQuality,
      "callIntent": callIntent,
      "CallerToneandEmpathy": CallerToneandEmpathy
    };
      console.log('hangupCall request:', request);

    const response = await axios.post(      
      `${ERP_API_BASE_URL}aiagentapp.api.aiapi.hangup_call_api`,         
      request,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `token ${E_ADMIN_API_KEY}:${E_ADMIN_API_SECRET}`
        }
      }
    );

    const data = response.data;
    logMessage('Hangup API Response:', data);
    return data;

  } catch (error) {
    console.error('Error in hangupCall:', error);
    if (error.response) {
      console.error(
        'Frappe API error:',
        error.response.status,
        error.response.statusText,
        error.response.data
      );
    } else if (error.request) {
      logMessage('No response from Frappe API:', error.request);
    } else {
      logMessage('Unexpected error:', error.message);
    }
    return null;
  }
}

export async function fetchCompanyBusiness(businessid) {
  if (!businessid) {
    logMessage('businessid is required');
    return null;
  }

  try {
    const response = await axios.post(
      `${ERP_API_BASE_URL}aiagentapp.api.aiapi.getbusinessbyId`,
      { businessid },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `token ${E_ADMIN_API_KEY}:${E_ADMIN_API_SECRET}`
        }
      }
    );

    const business = response.data?.message;

    if (!business) {
      logMessage('No business record found for businessid:', businessid);
      return null;
    }

    logMessage('Business found:', business);
    setCompanyBusiness(business);

    return business;

  } catch (error) {
    if (error.response) {
      console.error(
        'ERP API error:',
        error.response.status,
        error.response.statusText,
        error.response.data
      );
    } else if (error.request) {
      clogMessage('No response from ERP API:', error.request);
    } else {
      logMessage('Unexpected error:', error.message);
    }

    return null;
  }
}
export async function create_call_active_log(active_call,pick_count,direction,no_of_job_pick_sett,max_active_call_count_sett) {
  
  try {
    const response = await axios.post(
      `${ERP_API_BASE_URL}aiagentapp.api.outbound.create_call_active_log_api`,
      { active_call,
        pick_count,
        direction,
        no_of_job_pick_sett,
        max_active_call_count_sett
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `token ${E_ADMIN_API_KEY}:${E_ADMIN_API_SECRET}`
        }
      }
    );

    const activelog = response.data?.message;
    logMessage('ACTIVELOG: ',activelog);

    if (!activelog) {
      logMessage('ACTIVELOG No result found :', activelog);
      return null;
    }   

    return activelog;

  } catch (error) {
    if (error.response) {
      console.error(
        'ACTIVELOG ERP API error:',
        error.response.status,
        error.response.statusText,
        error.response.data
      );
    } else if (error.request) {
      logMessage('ACTIVELOG No response from ERP API:', error.request);
    } else {
      logMessage(' ACTIVELOG Unexpected error:', error.message);
    }

    return null;
  }
}

export async function getbusinessbyPhoneNumber(phone_number) {
  if (!phone_number) {
    console.error('phone_number is required');
    return null;
  }

  try {
    const response = await axios.post(
      `${ERP_API_BASE_URL}aiagentapp.api.aiapi.getbusinessbyPhoneNumber`,
      { phone_number },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `token ${E_ADMIN_API_KEY}:${E_ADMIN_API_SECRET}`
        }
      }
    );

    const business = response.data?.message;

    if (!business) {
      logMessage('No business record found for phone number:', phone_number);
      return null;
    }

    logMessage('Business matched:', business);
    return business;

  } catch (error) {
    if (error.response) {
      // Server responded but returned error status (e.g. 404)
      console.error(
        'ERP API error:',
        error.response.status,
        error.response.statusText,
        error.response.data
      );
    } else if (error.request) {
      // Request sent but no response received
      logMessage('No response from ERP API:', error.request);
    } else {
      // Some other error occurred
      logMessage('Unexpected error:', error.message);
    }

    // Return null instead of throwing to keep app alive
    return null;
  }
}

export async function getCallSessionDocnameExistWComp(callId,COMPANYID) {
  if (!callId) {
    console.error('Missing callId in getCallSessionDocname');
    return { success: false, error: 'Missing callId' };
  }

  try {
    const response = await axios.post(
      `${ERP_API_BASE_URL}aiagentapp.api.aiapi.check_doc_existwcomp`,
      { callid: callId, companyid: COMPANYID }, // Include COMPANYID in the request
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `token ${E_ADMIN_API_KEY}:${E_ADMIN_API_SECRET}`
        }
      }
    );

    const result = response.data;
    // console.log('getCallSessionDocnameExist result:', result);

    // console.log('result.message', result.message);
    // console.log('result.message?.success', result.message?.success);
    // console.log('result.message?.message?.name', result.message?.message?.name);

    if (result.message?.success && result?.message?.message?.name) {    
      console.log('Found match');
      return {
        success: true,
        docname: result?.message?.message?.name,
        d_call: result?.message?.d_call || null // Include d_call if available
      };
    } else {
      return {
        success: false,
        info: result.info || 'No matching record found.',
        d_call: result?.message?.d_call || null // Include d_call if available
      };
    }
  } catch (error) {
    console.log('[getCallSessionDocname] Error:', error.message);
    return {
      success: false,
      error: error.response?.data || error.message
    };
  }
}

export async function getCallSessionDocnameExist(callId) {
  if (!callId) {
    logMessage('Missing callId in getCallSessionDocname');
    return { success: false, error: 'Missing callId' };
  }

  try {
    const response = await axios.post(
      `${ERP_API_BASE_URL}aiagentapp.api.aiapi.check_doc_exist`,
      { callid: callId },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `token ${E_ADMIN_API_KEY}:${E_ADMIN_API_SECRET}`
        }
      }
    );

    const result = response.data;
    logMessage('getCallSessionDocnameExist result:', result);

    logMessage('result.message', result.message);
    logMessage('result.message?.success', result.message?.success);
    logMessage('result.message?.message?.name', result.message?.message?.name);

    if (result.message?.success && result?.message?.message?.name) {    
      logMessage('Found match');
      return {
        success: true,
        docname: result?.message?.message?.name
      };
    } else {
      return {
        success: false,
        info: result.info || 'No matching record found.'
      };
    }
  } catch (error) {
    logMessage('[getCallSessionDocname] Error:', error.message);
    return {
      success: false,
      error: error.response?.data || error.message
    };
  }
}
export async function sms_reply_rec(twilioPayload) {
  try {
    
    const response = await axios.post(
      `${ERP_API_BASE_URL}aiagentapp.api.sms_reply_wh.sms_reply_rec`,
      twilioPayload,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `token ${E_ADMIN_API_KEY}:${E_ADMIN_API_SECRET}`
        }
      }
    );

    const log = response.data?.message;
    if (!log) {
      logMessage('Log request succeeded but no message returned');
      //console.log('Log request succeeded but no message returned');
      return null;
    }
    logMessage('Log saved:', log);
    //console.log('Log saved:', log);
    return log;

  } catch (error) {
    // Safe error handling (no crash)
    if (error.response) {
      // Server responded with status code outside 2xx
      console.log(
        'API responded with error:',
        error.response.status,
        error.response.statusText,
        error.response.data
      );
    } else if (error.request) {
      // Request made, but no response received
      logMessage('No response from server:', error.request);
      //console.log('No response from server:', error.request);
    } else {
      // Something else failed
      logMessage('Unexpected error:', error.message);
      //console.log('Unexpected error:', error.message);
    }

    // Optionally return null instead of throwing
    return null;

    // If you want to crash only in dev mode, you could:
    // if (process.env.NODE_ENV === 'development') throw error;
  }
}
 
export async function log_incoming_call_request(error_text, request_payload, company_found) {
  try {
    if(CREATE_LOG_CALL_REQUEST_LOGGER ===0)
      return null;
    
    const response = await axios.post(
      `${ERP_API_BASE_URL}aiagentapp.api.aiapi.log_incoming_call_request`,
      {
        error_text,
        request_payload: JSON.stringify(request_payload),
        company_found
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `token ${E_ADMIN_API_KEY}:${E_ADMIN_API_SECRET}`
        }
      }
    );

    const log = response.data?.message;
    if (!log) {
      logMessage('Log request succeeded but no message returned');
      //console.log('Log request succeeded but no message returned');
      return null;
    }
    logMessage('Log saved:', log);
    //console.log('Log saved:', log);
    return log;

  } catch (error) {
    // Safe error handling (no crash)
    if (error.response) {
      // Server responded with status code outside 2xx
      console.log(
        'API responded with error:',
        error.response.status,
        error.response.statusText,
        error.response.data
      );
    } else if (error.request) {
      // Request made, but no response received
      logMessage('No response from server:', error.request);
      //console.log('No response from server:', error.request);
    } else {
      // Something else failed
      logMessage('Unexpected error:', error.message);
      //console.log('Unexpected error:', error.message);
    }

    // Optionally return null instead of throwing
    return null;

    // If you want to crash only in dev mode, you could:
    // if (process.env.NODE_ENV === 'development') throw error;
  }
}


export async function log_TransferCall_status(tcallData) {
  try {  
    console.log('log_TransferCall_gc', JSON.stringify(tcallData));  

    const response = await axios.post(
      `${ERP_API_BASE_URL}aiagentapp.api.aiapi.log_TransferCall_status`,
       JSON.stringify(tcallData),  // Send complete body directly
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `token ${E_ADMIN_API_KEY}:${E_ADMIN_API_SECRET}`
        }
      }
    );

    const result = response.data;
    if (!result.message) {
      logMessage('log_TransferCall_status succeeded but no message returned');
      return null;
    }

    //console.log('Call session logged:', result.message);
    return result;

  } catch (error) {
    // Unified error handling
    const errorResponse = {
      status: 'error',
      message: 'Failed to log log_TransferCall_status',
      details: null
    };

    if (error.response) {
      // Server responded with error status
      errorResponse.details = {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data
      };
      logMessage('log_TransferCall_status API Error Response:', errorResponse.details);
    } else if (error.request) {
      // No response received
      errorResponse.details = 'No response from server';
      logMessage('log_TransferCall_status No response received:', error.request);
    } else {
      // Setup error
      errorResponse.details = error.message;
      logMessage(' log_TransferCall_status Request setup error:', error.message);
    }

    // Return error object instead of throwing
    return errorResponse;

    // Optional: Throw in development
    // if (process.env.NODE_ENV === 'development') throw error;
    // return errorResponse;
  }
}

export async function log_TransferCall_gc(tcallData) {
  try {  
    logMessage('log_TransferCall_gc', JSON.stringify(tcallData));  

    const response = await axios.post(
      `${ERP_API_BASE_URL}aiagentapp.api.aiapi.log_TransferCall_gc`,
       JSON.stringify(tcallData),  // Send complete body directly
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `token ${E_ADMIN_API_KEY}:${E_ADMIN_API_SECRET}`
        }
      }
    );

    const result = response.data;
    if (!result.message) {
      logMessage('TransferCall succeeded but no message returned');
      return null;
    }

    //console.log('Call session logged:', result.message);
    return result;

  } catch (error) {
    // Unified error handling
    const errorResponse = {
      status: 'error',
      message: 'Failed to log call session',
      details: null
    };

    if (error.response) {
      // Server responded with error status
      errorResponse.details = {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data
      };
      logMessage('API Error Response:', errorResponse.details);
    } else if (error.request) {
      // No response received
      errorResponse.details = 'No response from server';
      logMessage('No response received:', error.request);
    } else {
      // Setup error
      errorResponse.details = error.message;
      logMessage('Request setup error:', error.message);
    }

    // Return error object instead of throwing
    return errorResponse;

    // Optional: Throw in development
    // if (process.env.NODE_ENV === 'development') throw error;
    // return errorResponse;
  }
}

export async function log_CallSession(callData) {
  try {    

    const response = await axios.post(
      `${ERP_API_BASE_URL}aiagentapp.api.aiapi.log_CallSessionLog`,
       JSON.stringify(callData),  // Send complete body directly
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `token ${E_ADMIN_API_KEY}:${E_ADMIN_API_SECRET}`
        }
      }
    );

    const result = response.data;
    if (!result.message) {
      logMessage('Call log succeeded but no message returned');
      return null;
    }

    //console.log('Call session logged:', result.message);
    return result;

  } catch (error) {
    // Unified error handling
    const errorResponse = {
      status: 'error',
      message: 'Failed to log call session',
      details: null
    };

    if (error.response) {
      // Server responded with error status
      errorResponse.details = {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data
      };
      logMessage('API Error Response:', errorResponse.details);
    } else if (error.request) {
      // No response received
      errorResponse.details = 'No response from server';
      logMessage('No response received:', error.request);
    } else {
      // Setup error
      errorResponse.details = error.message;
      logMessage('Request setup error:', error.message);
    }

    // Return error object instead of throwing
    return errorResponse;

    // Optional: Throw in development
    // if (process.env.NODE_ENV === 'development') throw error;
    // return errorResponse;
  }
}

export async function appendCallWithTranscript(callData,COMPANYID,EMAILADDRESS,EMAILNOTIFICAION,shortSummary,summary,callended) {
  try {
    const payload = {
      ...callData,
      COMPANYID: COMPANYID,
      EMAILADDRESS: EMAILADDRESS,
      EMAILNOTIFICAION: EMAILNOTIFICAION,
      SHORTSUMMARY:shortSummary,
      SUMMARY:summary,
      CALLENDED:callended,
      ERP_SESSION_LOG_URL: ERP_SESSION_LOG_URL
    };

    logMessage('appendCallWithTranscript Payload:', payload);
    const response = await axios.post(
      `${ERP_API_BASE_URL}aiagentapp.api.aiapi.save_call_with_transcript`,
      JSON.stringify(payload), // Direct stringification as requested
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `token ${E_ADMIN_API_KEY}:${E_ADMIN_API_SECRET}`
        }
      }
    );

    const result = response.data;
    if (!result.status === 'success') {
      logMessage('Transcript save succeeded but no success status', result);
      return null;
    }

    logMessage('appendCallWithTranscript Transcript saved for call:', result);
    return result;

  } catch (error) {
    const errorInfo = {
      status: 'error',
      message: 'Failed to save transcript',
      details: null
    };

    if (error.response) {
      errorInfo.details = {
        status: error.response.status,
        data: error.response.data
      };
      logMessage('Transcript API Error:', error.response.status, error.response.data);
    } else if (error.request) {
      errorInfo.details = 'No response received';
     logMessage('Transcript API No response:', error.request);
    } else {
      errorInfo.details = error.message;
      logMessage('Transcript API Setup error:', error.message);
    }

    // Return error object instead of throwing
    return errorInfo;
    
    // Optional: Throw in development
    // if (process.env.NODE_ENV === 'development') throw error;
    // return errorInfo;
  }
}


 export async function uploadRecordingViaCustomAPI({
  fileBlob,
  filename,
  doctype,
  docname,
  apiKey,
  apiSecret,
  baseUrl
}) {
  try {
    // Validate required parameters
    if (!fileBlob || !(fileBlob instanceof Blob)) {
      throw new Error('Invalid or missing Blob object.');
    }
    if (!filename || !doctype || !docname || !apiKey || !apiSecret || !baseUrl) {
      throw new Error('Missing required upload parameters.');
    }

    logMessage('filename: ', filename);
    logMessage('doctype: ', doctype);
    logMessage('docname: ', docname);
    logMessage('baseUrl: ', baseUrl);

    // Convert blob to base64
    const buffer = await fileBlob.arrayBuffer();
    const base64Data = Buffer.from(buffer).toString('base64');

    // Build payload
    const payload = {
      filename,
      content_base64: base64Data,
      doctype,
      docname
    };
    const apiurl= `${baseUrl}aiagentapp.api.file_upload.upload_call_recording`;
    logMessage('API URL:', apiurl);
    const response = await fetch(apiurl, {
      method: 'POST',
      headers: {
        'Authorization': `token ${E_ADMIN_API_KEY}:${E_ADMIN_API_SECRET}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    

    if (!response.ok || result.error) {
      logMessage('result error:', result);
      logMessage('[uploadRecordingViaCustomAPI] Upload failed:', result.error || result);
      return { success: false, error: result.error || response.statusText };
    }

    logMessage('[uploadRecordingViaCustomAPI] Upload successful:', result);
    return { success: true, result };

  } catch (error) {
    logMessage('[uploadRecordingViaCustomAPI] Upload error:', error.message);
    return { success: false, error: error.message };
  }
}

export async function getCallSessionDocname(callId) {
  try {
    

    const response = await axios.post(
      `${ERP_API_BASE_URL}aiagentapp.api.aiapi.get_call_session_docname`,
        { callid: callId },   // Send complete body directly
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `token ${E_ADMIN_API_KEY}:${E_ADMIN_API_SECRET}`
        }
      }
    );
    logMessage('getCallSessionDocname Response:', response.data);
    const result = response.data;
    if (!result.message) {
      logMessage('Call log succeeded but no message returned');
      return null;
    }

    logMessage('Call session logged:', result.message);
    return result;

  } catch (error) {
    // Unified error handling
    const errorResponse = {
      status: 'error',
      message: 'Failed to log call session',
      details: null
    };

    if (error.response) {
      // Server responded with error status
      errorResponse.details = {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data
      };
      logMessage('API Error Response:', errorResponse.details);
    } else if (error.request) {
      // No response received
      errorResponse.details = 'No response from server';
      logMessage('No response received:', error.request);
    } else {
      // Setup error
      errorResponse.details = error.message;
      logMessage('Request setup error:', error.message);
    }

    // Return error object instead of throwing
    return errorResponse;

    // Optional: Throw in development
    // if (process.env.NODE_ENV === 'development') throw error;
    // return errorResponse;
  }
}


export async function save_phone_company_log(callData) {
  try {
    

    const response = await axios.post(
      `${ERP_API_BASE_URL}aiagentapp.api.aiapi.save_phone_company_log`,
       JSON.stringify(callData),  // Send complete body directly
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `token ${E_ADMIN_API_KEY}:${E_ADMIN_API_SECRET}`
        }
      }
    );

    const result = response.data;
    if (!result.message) {
      logMessage('Phone Company Call log succeeded but no message returned');
      return null;
    }

    //console.log('Call session logged:', result.message);
    return result;

  } catch (error) {
    // Unified error handling
    const errorResponse = {
      status: 'error',
      message: 'Failed to Phone Company log call ',
      details: null
    };

    if (error.response) {
      // Server responded with error status
      errorResponse.details = {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data
      };
      logMessage('API Error Response:', errorResponse.details);
    } else if (error.request) {
      // No response received
      errorResponse.details = 'No response from server';
      logMessage('No response received:', error.request);
    } else {
      // Setup error
      errorResponse.details = error.message;
      logMessage('Request setup error:', error.message);
    }

    // Return error object instead of throwing
    return errorResponse;

    // Optional: Throw in development
    // if (process.env.NODE_ENV === 'development') throw error;
    // return errorResponse;
  }
}

export async function log_call_joined_event(callData) {
  try {
    

    const response = await axios.post(
      `${ERP_API_BASE_URL}aiagentapp.api.aiapi.log_call_joined_event`,
       JSON.stringify(callData),  // Send complete body directly
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `token ${E_ADMIN_API_KEY}:${E_ADMIN_API_SECRET}`
        }
      }
    );

    const result = response.data;
    if (!result.message) {
      logMessage('Joined Call log succeeded but no message returned');
      return null;
    }

    //console.log('Call session logged:', result.message);
    return result;

  } catch (error) {
    // Unified error handling
    const errorResponse = {
      status: 'error',
      message: 'Failed to log Join call session',
      details: null
    };

    if (error.response) {
      // Server responded with error status
      errorResponse.details = {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data
      };
      logMessage('JoinCall API Error Response:', errorResponse.details);
    } else if (error.request) {
      // No response received
      errorResponse.details = 'No response from server for joincall';
      logMessage('No response received:', error.request);
    } else {
      // Setup error
      errorResponse.details = error.message;
      logMessage('Request setup error on Join Call:', error.message);
    }

    // Return error object instead of throwing
    return errorResponse;

    // Optional: Throw in development
    // if (process.env.NODE_ENV === 'development') throw error;
    // return errorResponse;
  }
}
export async function getCallStatusDocnameExist(callId) {
  if (!callId) {
    console.error('Missing callId in getCallStatusDocnameExist');
    return { success: false, error: 'Missing callId' };
  }

  try {
    const response = await axios.post(
      `${ERP_API_BASE_URL}aiagentapp.api.aiapi.check_doc_joincall_exist`,
      { callid: callId },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `token ${E_ADMIN_API_KEY}:${E_ADMIN_API_SECRET}`
        }
      }
    );

    const result = response.data;
    logMessage('getCallStatusDocnameExist result:', result);

    logMessage('result.message', result.message);
    logMessage('result.message?.success', result.message?.success);
    logMessage('result.message?.message?.name', result.message?.message?.name);

    if (result.message?.success && result?.message?.message?.name) {    
      logMessage('Found match');
      return {
        success: true,
        docname: result?.message?.message?.name
      };
    } else {
      return {
        success: false,
        info: result.info || 'No matching record found.'
      };
    }
  } catch (error) {
    logMessage('[getCallStatusDocnameExist] Error:', error.message);
    return {
      success: false,
      error: error.response?.data || error.message
    };
  }
}