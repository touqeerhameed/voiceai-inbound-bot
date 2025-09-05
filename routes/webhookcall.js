 import axios from 'axios';
import express from 'express';
import 'dotenv/config';
import {
  ERP_API_BASE_URL,
  // ULTRAVOX_API_KEY,
  ULTRAVOX_API_URL,
  E_ADMIN_API_KEY,
  E_ADMIN_API_SECRET,
} from '../config/config.js';
import { log_incoming_call_request,log_CallSession,appendCallWithTranscript,
  getCallSessionDocnameExistWComp,getCallSessionDocnameExist,uploadRecordingViaCustomAPI,getCallSessionDocname,log_call_joined_event,getCallStatusDocnameExist,getuv } from '../api/erpcall.js';
import { logMessage } from '../utils/logger.js'; 
import { getCallTranscript_Ultra,getCallRecording_Ultra,deleteCall_U } from '../api/ultracall.js';
import { fetchCallDetails  } from '../utils/twilioUtils.js';
import verifyUltravoxSignature from '../config/signature-middleware.js';


const router = express.Router();

// Note: all of these should be secured in a production application
// Handle requests for looking up spots on the calendar
 
// Handle requests for creating a booking
router.post('/callend',verifyUltravoxSignature, async (req, res) => {
//router.post('/callend', async (req, res) => {
  try {
    const body = req.body;
     
    //STOP HERE IF RECORD CALL AGAIN
    
      
    //console.log('Received Ultravox webhook:', body);
    await log_incoming_call_request('received body /saveTranscript: ',  body, " when call ended");

    // Acknowledge unsupported event types quickly
    if (!body || body.event !== 'call.ended') {
        logMessage('Ignoring unsupported event type:', body.event);
      return res.status(200).json({ success: true, ignored: true });
    }

    const callId = body?.call?.callId;
    const COMPANYID =body?.call?.metadata?.COMPANYID;
    //const sessionCheck = await getCallSessionDocnameExist(callId);
    logMessage('*******going...');
    const sessionCheck = await getCallSessionDocnameExistWComp(callId,COMPANYID);
    logMessage('*******getCallSessionDocnameExistWComp*******',sessionCheck);

    if (sessionCheck.success) {
      logMessage('Session already exists:', sessionCheck.docname);

      return res.status(200).json({
        success: true,
        message: 'Call session already handled',
        docname: sessionCheck.docname
      });
    }
    const d_call=sessionCheck.d_call;
    const shortSummary = body?.call?.shortSummary;
    const summary = body?.call?.summary;
    const callended = body?.call?.ended
    const ISCALLTRANSCRIPT=body?.call?.metadata?.ISCALLTRANSCRIPT;
    const ISCALLRECORDING=body?.call?.metadata?.ISCALLRECORDING;

    //const COMPANYID=body?.call?.metadata?.COMPANYID;
    const EMAILADDRESS=body?.call?.metadata?.EMAILADDRESS;
    const DIRECTION=body?.call?.metadata?.direction;
    const callfrom=body?.call?.metadata?.callfrom;
    const callto=body?.call?.metadata?.callto;
    let TWILIO_NUMBER=0;
      if(DIRECTION == "OUTBOUND")
      {
        TWILIO_NUMBER=callfrom;

      }else if(DIRECTION == "INBOUND")
      {
        TWILIO_NUMBER=callto;
      }
    const UVdate = await getuv(TWILIO_NUMBER);
    if(!UVdate)
    {
       logMessage(`UVdate not found in ERP for twilio: ${TWILIO_NUMBER} uv: ${ UVdate}`);
        return res.status(200).json({ success: true, ignored: true });

    }


    const EMAILNOTIFICAION=body?.call?.metadata?.EMAILNOTIFICAION;


   logMessage('Ultravox callId:', callId);
   logMessage('Short summary:', shortSummary);
    // console.log('Full summary:', summary);

    if (!callId) {
      logMessage('Missing callId in Ultravox webhook');
        await log_incoming_call_request('Missing callId in Ultravox webhook /scallend:',  error, `Line 69`);
      return res.status(200).json({ success: true, ignored: true });
    }  
   logMessage('callId line 72:');
   logMessage('callId line 72:');
    const CALL_SESSION_DATA = await log_CallSession(req.body);  
       await log_incoming_call_request('log_CallSession /callend:',  CALL_SESSION_DATA,`Line 75`);
    logMessage('CALL_SESSION_DATA Response log_incoming_call_request:', CALL_SESSION_DATA);
    // console.log('CALL_SESSION_DATA Response:', CALL_SESSION_DATA);

    const callTranscriptEndpoint = await getCallTranscript_Ultra(callId,UVdate);
    await log_incoming_call_request('getCallTranscript_Ultra /callend:',  callTranscriptEndpoint, `Line 81`);
   
    logMessage('Fetched call callTranscriptEndpoint:', callTranscriptEndpoint);

    if(ISCALLTRANSCRIPT)
    {
    const APPEND_CALLWITH_TRANSCRIPT = await  appendCallWithTranscript(callTranscriptEndpoint,COMPANYID,EMAILADDRESS,EMAILNOTIFICAION,shortSummary,summary,callended);
    await log_incoming_call_request('appendCallWithTranscript /callend:',  APPEND_CALLWITH_TRANSCRIPT,  `Line 87`);
    }else{
      logMessage('ISCALLTRANSCRIPT is false, not appending transcript');
    }
    //console.log('APPEND_CALLWITH_TRANSCRIPT Response:', APPEND_CALLWITH_TRANSCRIPT);

    await log_incoming_call_request('await getCallTranscript_Ultra /saveTranscript: ',  callTranscriptEndpoint, "after getCallTranscript_Ultra");

    if (!callTranscriptEndpoint) {
      logMessage(`Transcript not found or failed to fetch for callId: ${callId}`);
    } else {
      //console.log(`Transcript fetched for callId ${callId}:`, callTranscriptEndpoint, 'messages');
      // TODO: Save or process transcript here
    }

    if(ISCALLRECORDING)
    {
      logMessage('Recording enabled, fetching recording...');
      await  getCallRecording_Ultra(callId,UVdate);
    }
    else{

      logMessage('Recording not  enabled, not fetching recording...');
    }
    if(d_call){
        await deleteCall_U(callId,UVdate);
        console.log('Recording fetched and call deleted successfully');  
        logMessage('Recording fetched and call deleted successfully');   
    }
   

    // Always acknowledge the webhook to prevent retries
    res.status(200).json({ success: true });
    

  } catch (error) {
    logMessage('Error in /callend Line 117: ', error.message);
    await log_incoming_call_request('Error in /callend:',  error, error.message);
    
    // Do not throw or re-crash, just log and respond
    res.status(200).json({ 
      success: false,
      error: error.message 
    });
  }
});

//router.post('/calljoin', async (req, res) => {
router.post('/calljoin',verifyUltravoxSignature, async (req, res) => {
  try {
    const body = req.body;   
    //CHECK HERE IF CALL SESSION ID ALREADY EXIST
     
    const callId = body?.call?.callId;
    const sessionCheck = await getCallStatusDocnameExist(callId);
    logMessage('**************',sessionCheck);

    if (sessionCheck.success) {
      logMessage('Session Call Staus already exists:', sessionCheck.docname);

      return res.status(200).json({
        success: true,
        message: 'Call Status session already handled',
        docname: sessionCheck.docname
      });
    }


     await log_incoming_call_request('RECEIVED body /calljoin: ',  body, " when call joined");   
    logMessage('Ultravox log_call_joined_event:', callId); 
    const call_joined_event=await log_call_joined_event(body);
    logMessage('log_call_joined_event Response:', call_joined_event);

    logMessage('CALL JOIN ENDED calljoin:');
    res.status(200).json({ success: true });

} catch (error)
 {
   logMessage('Error in /calljoin Line 154: ', error.message);
    await log_incoming_call_request('Error in /callend:',  error, error.message);

  //console.log('Error in /calljoin:', error.message);   
  }
});


router.post('/bookAppointment',async (req, res) => {
  console.log('******************');
  console.log('Received request for /bookAppointment:', req.body);
  logMessage('Got a request for bookAppointment:::', req.body);
  await log_incoming_call_request('Webhook /bookAppointment: ',  null,JSON.stringify(req.body));

  const booking = await createBooking(req.body);
  console.log('Booking response:', booking);
  res.json(booking);
});

router.post('/updateAppointment', async (req, res) => {
  logMessage('Got a request for updateAppointment:', req.body);
  
  // Validate required fields
  //const requiredFields = ['firstname', 'lastname', 'postcode', 'address', 'doornumber'];
  // const missingFields = requiredFields.filter(field => !req.body[field]);
  /*
  if (missingFields.length > 0) {
    return res.status(400).json({
      success: false,
      error: `Missing required fields: ${missingFields.join(', ')}`
    });
  } */
  const booking = await updateBooking(req.body);
  logMessage('Booking update response:', booking);
  res.json(booking);
});


 
async function createBooking(details) {
  try {
    if(!details.isAppointEmail)
      {
          console.log('createBooking Email is disable', details);
          return  {     
          success: false,
          error: 'Appointment Email is disable'
        };

      }  
    logMessage('Creating booking with details:', details);
    const url = `${ERP_API_BASE_URL}aiagentapp.api.appointments.book_google_appointment`;
    console.log('Booking URL:', url);

    
    logMessage('Booking URL:', url);
    const response = await fetch(url, {
      method: 'POST',
      headers: {        
        'Content-Type': 'application/json',  
        'Authorization': `token ${E_ADMIN_API_KEY}:${E_ADMIN_API_SECRET}`      
      },         
      body: JSON.stringify(details),
    });
    //console.log('Response :', response);
    if (!response.ok) {
      //const errorText = await response.text();
      // console.error('Failed to create booking:', {
      //   status: response.status,
      //   statusText: response.statusText,
      //   error: errorText,
      // });
      // throw new Error(`Failed to create booking: ${response.statusText}`);
      console.error('Failed to create booking:');
      await log_incoming_call_request('createBooking /bookAppointment !response.ok: ',  error,JSON.stringify(details));
      throw new Error(`Failed to create booking: ${response}`);
    }

    const booking = await response.json();
    return {
      //success: true,      
      booking
    };
  } catch (error) {
    console.error('Error creating booking:', error);
    logMessage('Failed to create appoitment booking:', error);
    // Log the error to your logging system
     await log_incoming_call_request('createBooking /bookAppointment: ',  error,JSON.stringify(details));
     return {     

      // Log here if booking not successufull 
      success: false,
      error: 'Failed to create booking'
    };
  }
}


async function updateBooking(details) {
  try {
    logMessage('Update booking with details:', details);
    
    // Destructure with default values to prevent undefined errors
    const { 
      id, 
      new_firstname = null, 
      new_lastname = null, 
      new_postcode = null, 
      new_address = null, 
      new_doornumber = null,     
    } = details;

    logMessage('Received fields:', {
      id,
      new_firstname,
      new_lastname,
      new_postcode,
      new_address,
      new_doornumber,      
    });

    // Validate at least one update field is present
    const updateFields = ['new_firstname', 'new_lastname', 'new_postcode', 'new_address', 'new_doornumber']
      .filter(field => details[field] !== undefined);

    if (updateFields.length === 0) {
      throw new Error('No update fields provided');
    }

    // Build payload dynamically
    const payload = {
      name: id,
      ...(new_firstname && { firstname: new_firstname }),
      ...(new_lastname && { lastname: new_lastname }),
      ...(new_postcode && { postcode: new_postcode }),
      ...(new_address && { address: new_address }),
      ...(new_doornumber && { doornumber: new_doornumber }),
     
    };

    logMessage('Constructed payload:', payload);

    const response = await fetch(`${ERP_API_BASE_URL}/zero_integration.api.apiai.update_survey`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `token ${E_ADMIN_API_KEY}:${E_ADMIN_API_SECRET}`
        // Uncomment and use actual auth headers
        // 'Authorization': `Bearer ${config.apiKey}`,
        // 'cal-api-version': '2024-08-13'
      },
      body: JSON.stringify(payload)
    });

    const responseData = await response.json();
    
    if (!response.ok) {
      logMessage('ERP Update Error:', {
        status: response.status,
        error: responseData,
        payloadSent: payload
      });
      throw new Error(responseData.message || 'Update failed');
    }

    return {
      success: true,
      booking: responseData
    };

  } catch (error) {
    logMessage('Update Booking Failure:', {
      error: error.message,
      stack: error.stack,
      originalDetails: details
    });
    
    return {
      success: false,
      error: error.message
    };
  }
}
  
export { router };