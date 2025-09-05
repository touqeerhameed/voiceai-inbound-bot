import express from 'express';
import twilio from 'twilio';
import 'dotenv/config';
import { createUltravoxCall } from '../utils/ultravox-utils.js';
import { createUltravoxCallConfig } from '../config/ultravox-config.js';
import {  getBusinesses } from '../utils/business-cache.js';
import { hangupCall,fetchTelecomNumberByPhone,sms_reply_rec,log_incoming_call_request,log_TransferCall_status,save_phone_company_log,getbusinessbyPhoneNumber,log_TransferCall_gc,getuv } from '../api/erpcall.js';

import {
  TOOLS_BASE_URL,
} from '../config/config.js';
import activeCalls from '../utils/activeCallsStore.js'; // adjust path accordingly
import { logMessage } from '../utils/logger.js';
import verifyTwilioSignature from '../config/signature-middleware-twilio.js';
import verifyTwilioSignatureSMS from '../config/signature-middleware-twilio-sms.js';
const router = express.Router();

// Hack: Dictionary to store Twilio CallSid and Ultravox Call ID mapping
// In production you will want to replace this with something more durable

async function transferActiveCall(ultravoxCallId, isCallForwarding, forwardingMobileNumber, firstname, lastname, transferReason, fromNumber, toNumber, direction, companyid, conversationSummary,
      intent_from,
      ResponseAccuracy,
      KnowledgeLimitationHandling, ConfidenceandClarity,ToneandEmpathy,
      EscalationHandling,CustomerSatisfactionOutcome,CustomerBehavior,
      CustomerEffortLevel,ConversationCompletion,EmotionalShiftDuringConversation,
      BackgroundNoiseLevelCustomer,BackgroundNoiseLevelAI,CallDisruptionDueToNoiseOrAudioQuality,
      OverallConversationQuality,callIntent,CallerToneandEmpathy
) {
  try {
    if (!isCallForwarding) {
      logMessage('Call forwarding is disabled');
      return {
        status: 'false',
        message: 'Call forwarding is disabled',
      };
    }

    logMessage('Attempting warm transfer for Ultravox Call ID:', ultravoxCallId);
    logMessage('Summary provided:', conversationSummary);

    const callData = activeCalls.get(ultravoxCallId);

    if (!callData || !callData.twilioCallSid) {
      throw new Error('Call not found or invalid CallSid.');
    }

    const callSid = callData.twilioCallSid;

    const result = await log_TransferCall_gc({
      callid: ultravoxCallId,
      twilioCallSid: callSid,
      fromNumber,
      toNumber,
      forwardingMobileNumber,
      firstname,
      lastname,
      transferReason,
      isCallForwarding,
      direction,
      companyid,
      conversationSummary,

      intent_from,
      ResponseAccuracy,
      KnowledgeLimitationHandling, ConfidenceandClarity,ToneandEmpathy,
      EscalationHandling,CustomerSatisfactionOutcome,CustomerBehavior,
      CustomerEffortLevel,ConversationCompletion,EmotionalShiftDuringConversation,
      BackgroundNoiseLevelCustomer,BackgroundNoiseLevelAI,CallDisruptionDueToNoiseOrAudioQuality,
      OverallConversationQuality,callIntent,CallerToneandEmpathy
    });

    const twilio_account_sid = result?.message?.phone_credentials?.twilio_account_sid;
    const twilio_auth_token = result?.message?.phone_credentials?.twilio_auth_token;

    if (!twilio_account_sid || !twilio_auth_token) {
      throw new Error('Twilio credentials not found.');
    }

    const client = twilio(twilio_account_sid, twilio_auth_token);
    const conferenceName = `conference_${callSid}`;

    // Step 1: Redirect the current caller into a conference
    const callerResponse = new twilio.twiml.VoiceResponse();
    callerResponse.say('Please wait a moment while I connect you to a human agent.');
    const callerDial = callerResponse.dial();
    callerDial.conference(conferenceName, {
      startConferenceOnEnter: true,
      endConferenceOnExit: true,
    });

    await client.calls(callSid).update({
      twiml: callerResponse.toString()
    });

    // Step 2: Call the specialist and play the summary before joining conference
    const agentResponse = new twilio.twiml.VoiceResponse();

    agentResponse.say("You are being connected to a user. Here's a quick summary.");
    agentResponse.say(conversationSummary, { voice: "alice", language: "en-US" }); // TTS summary
    const agentDial = agentResponse.dial();
    agentDial.conference(conferenceName, {
      startConferenceOnEnter: true,
      endConferenceOnExit: true,
      // statusCallback: `${TOOLS_BASE_URL}/twilio/transfer-status`,
      // statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'],
      // statusCallbackMethod: 'POST'
    });

    const outboundCall = await client.calls.create({
      to: forwardingMobileNumber,
      from: toNumber,//fromNumber,
      twiml: agentResponse.toString(),
      // Optional: Track outbound call creation status too
      statusCallback: `${TOOLS_BASE_URL}/twilio/transfer-status?mainCallSid=${callSid}`,
      statusCallbackMethod: 'POST',
      statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed']
    });

    logMessage('Outbound call initiated to specialist. SID:', outboundCall.sid);

    return {
      status: 'success',
      message: 'Call transfer initiated with summary playback',
    };

  } catch (error) {
    logMessage('Error transferring call:', error.message);
    await log_incoming_call_request('Error transferring call', {
      ultravoxCallId,
      isCallForwarding,
      forwardingMobileNumber,
      firstname,
      lastname,
      transferReason
    }, error.message);

    throw {
      status: 'error',
      message: 'Failed to transfer call',
      error: error.message
    };
  }
}
async function transferActiveCall_Working_no_message(ultravoxCallId, isCallForwarding, forwardingMobileNumber, firstname, lastname, transferReason, fromNumber, toNumber, direction, companyid, conversationSummary) {
  try {
    if (!isCallForwarding) {
      console.log('Call forwarding is disabled');
      return {
        status: 'false',
        message: 'Call forwarding is disabled',
      };
    }

    console.log('Attempting warm transfer for Ultravox Call ID:', ultravoxCallId);
    console.log('Summary provided:', conversationSummary);

    const callData = activeCalls.get(ultravoxCallId);

    if (!callData || !callData.twilioCallSid) {
      throw new Error('Call not found or invalid CallSid.');
    }

    const callSid = callData.twilioCallSid;

    const result = await log_TransferCall_gc({
      callid: ultravoxCallId,
      twilioCallSid: callSid,
      fromNumber,
      toNumber,
      forwardingMobileNumber,
      firstname,
      lastname,
      transferReason,
      isCallForwarding,
      direction,
      companyid
    });

    const twilio_account_sid = result?.message?.phone_credentials?.twilio_account_sid;
    const twilio_auth_token = result?.message?.phone_credentials?.twilio_auth_token;

    if (!twilio_account_sid || !twilio_auth_token) {
      throw new Error('Twilio credentials not found.');
    }

    const client = twilio(twilio_account_sid, twilio_auth_token);
    const conferenceName = `conference_${callSid}`;

    // Step 1: Redirect the current caller into a conference
    const callerResponse = new twilio.twiml.VoiceResponse();
    const callerDial = callerResponse.dial();
    callerDial.conference(conferenceName, {
      startConferenceOnEnter: true,
      endConferenceOnExit: false,
    });

    await client.calls(callSid).update({
      twiml: callerResponse.toString()
    });

    // Step 2: Call the specialist and add them to the same conference
    const agentResponse = new twilio.twiml.VoiceResponse();
    const agentDial = agentResponse.dial();
    agentResponse.say("Please wait a moment while I connect you to a human agent.");
    agentDial.conference(conferenceName, {
      startConferenceOnEnter: true,
      endConferenceOnExit: true,
    });

    const outboundCall = await client.calls.create({
      to: forwardingMobileNumber,
      from: fromNumber,
      twiml: agentResponse.toString()
    });

    console.log('Outbound call initiated to specialist. SID:', outboundCall.sid);

    return {
      status: 'success',
      message: 'Call transfer initiated',
    };

  } catch (error) {
    console.error('Error transferring call:', error.message);
    await log_incoming_call_request('Error transferring call', {
      ultravoxCallId,
      isCallForwarding,
      forwardingMobileNumber,
      firstname,
      lastname,
      transferReason
    }, error.message);

    throw {
      status: 'error',
      message: 'Failed to transfer call',
      error: error.message
    };
  }
}

async function transferActiveCall_conferenceCode(ultravoxCallId, isCallForwarding, forwardingMobileNumber, firstname, lastname, transferReason, fromNumber, toNumber, direction, companyid, conversationSummary) {
  try {
    if (!isCallForwarding) {
      console.log('Call forwarding is disabled');
      return {
        status: 'false',
        message: 'Call forwarding is disabled',
      };
    }

    console.log('Attempting warm transfer for Ultravox Call ID:', ultravoxCallId);
    console.log('Summary provided:', conversationSummary);

    const callData = activeCalls.get(ultravoxCallId);

    if (!callData || !callData.twilioCallSid) {
      throw new Error('Call not found or invalid CallSid.');
    }

    const callSid = callData.twilioCallSid;

    const result = await log_TransferCall_gc({
      callid: ultravoxCallId,
      twilioCallSid: callSid,
      fromNumber,
      toNumber,
      forwardingMobileNumber,
      firstname,
      lastname,
      transferReason,
      isCallForwarding,
      direction,
      companyid
    });

    const twilio_account_sid = result?.message?.phone_credentials?.twilio_account_sid;
    const twilio_auth_token = result?.message?.phone_credentials?.twilio_auth_token;

    if (!twilio_account_sid || !twilio_auth_token) {
      throw new Error('Twilio credentials not found.');
    }

    const client = twilio(twilio_account_sid, twilio_auth_token);
    const conferenceName = `conference_${callSid}`;

    // Step 1: Redirect the current caller into a conference
    const callerResponse = new twilio.twiml.VoiceResponse();
    const callerDial = callerResponse.dial();
    callerDial.conference(conferenceName, {
      startConferenceOnEnter: true,
      endConferenceOnExit: false,
    });

    await client.calls(callSid).update({
      twiml: callerResponse.toString()
    });

    // Step 2: Call the specialist and add them to the same conference
    const agentResponse = new twilio.twiml.VoiceResponse();
    const agentDial = agentResponse.dial();
    agentResponse.say("Please wait a moment while I connect you to a human agent.");
    agentDial.conference(conferenceName, {
      startConferenceOnEnter: true,
      endConferenceOnExit: true,
    });

    const outboundCall = await client.calls.create({
      to: forwardingMobileNumber,
      from: fromNumber,
      twiml: agentResponse.toString()
    });

    console.log('Outbound call initiated to specialist. SID:', outboundCall.sid);

    return {
      status: 'success',
      message: 'Call transfer initiated',
    };

  } catch (error) {
    console.error('Error transferring call:', error.message);
    await log_incoming_call_request('Error transferring call', {
      ultravoxCallId,
      isCallForwarding,
      forwardingMobileNumber,
      firstname,
      lastname,
      transferReason
    }, error.message);

    throw {
      status: 'error',
      message: 'Failed to transfer call',
      error: error.message
    };
  }
}

async function transferActiveCall_notworking(ultravoxCallId,isCallForwarding,forwardingMobileNumber,firstname,lastname,transferReason,fromNumber,toNumber,direction,companyid,conversationSummary) {
    try {
        if(!isCallForwarding)
        {
           console.log('Call forwarding is  disable');
           return {
           status: 'false',
            message: 'Call forwarding is  disable',
            //callDetails: updatedCall
           }
        }
        // Log the initiation of the transfer attempt
        console.log('Attempting warm transfer for Ultravox Call ID:', ultravoxCallId);
        console.log('Summary provided:', conversationSummary);

        const callData = activeCalls.get(ultravoxCallId);

        if (!callData || !callData.twilioCallSid) {
            console.error('Call not found or invalid Twilio CallSid for Ultravox Call ID:', ultravoxCallId);
            throw new Error('Call not found or invalid CallSid.');
        }

        const twilioCallSid= callData.twilioCallSid;

        // Log the transfer call details to your internal system (e.g., Google Cloud)
        console.log('Logging transfer call details:', {
            callid: ultravoxCallId,
            twilioCallSid,
            isCallForwarding,
            forwardingMobileNumber,
            firstname,
            lastname,
            transferReason,
            fromNumber,
            toNumber
        });
        const result = await log_TransferCall_gc({
            callid: ultravoxCallId,
            twilioCallSid,
            fromNumber,
            toNumber,
            forwardingMobileNumber,
            firstname,
            lastname,
            transferReason,
            isCallForwarding,
            direction,
            companyid
        });
        console.log('log_TransferCall result:', result);

        const twilio_account_sid = result?.message?.phone_credentials?.twilio_account_sid;
        const twilio_auth_token = result?.message?.phone_credentials?.twilio_auth_token;

        if (!twilio_account_sid || !twilio_auth_token) {
            console.error('Twilio credentials missing:', { twilio_account_sid: !!twilio_account_sid, twilio_auth_token: !!twilio_auth_token });
            await log_incoming_call_request('Twilio account SID or auth token is null', { ultravoxCallId, isCallForwarding, forwardingMobileNumber, firstname, lastname, transferReason }, 'Twilio credentials not found');
            throw new Error('Twilio credentials not found.');
        }

        const client = twilio(twilio_account_sid, twilio_auth_token);

        // --- Start of Warm Transfer Logic ---
        const conferenceName = `confer-${ultravoxCallId}`; // Unique name for the conference
        
        // First create a new TwiML to handle the transfer
        const twiml = new twilio.twiml.VoiceResponse();
        console.log('destinationNumber:', forwardingMobileNumber);

        // 1. Tell the original caller they are being transferred and put them into a conference
        twiml.say('Please wait a moment while I connect you to a human agent.');
        
        twiml.dial({
            // IMPORTANT: Adding 'action' to catch when the Dial verb completes
            // This TwiML will be executed if the <Dial> verb completes (e.g., conference initiated, or failed)
            action: `${TOOLS_BASE_URL}/twilio/transfer-status-action`, // A new, dedicated action URL
            method: 'POST', // Make sure this is POST
            // statusCallback for the Dial verb itself
            statusCallback: `${TOOLS_BASE_URL}/twilio/transfer-status`,
            statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'], // Get more events
            statusCallbackMethod: 'POST'
        }).conference({
            startConferenceOnEnter: true,     // Start the conference when the first participant enters
            endConferenceOnExit: false,      // Keep the conference active even if the AI or agent leaves
            waitUrl: 'http://twimlets.com/holdmusic/enqueue?Bucket=com.twilio.music.classical', // Custom hold music URL
            waitMethod: 'GET',
            // IMPORTANT: Add statusCallback for conference events (participant join/leave, conference start/end)
            statusCallback: `${TOOLS_BASE_URL}/twilio/conference-events`,
            statusCallbackEvent: ['start', 'end', 'join', 'leave', 'mute', 'hold'], // Events to subscribe to for the conference
            statusCallbackMethod: 'POST',
            hangupOnStar: true // Allow participant to hang up with *
        }, conferenceName);

        // Update the active call (the one currently connected to Ultravox) with the new TwiML
        // This will transfer the caller from Ultravox control to the conference
        console.log('Updating original call with conference TwiML:', twiml.toString());
        await client.calls(twilioCallSid).update({
            twiml: twiml.toString()
        });
        console.log('Original caller transferred to conference:', conferenceName);

        // 2. Prepare TwiML for the human agent: play summary and then join conference
        const agentTwiml = new twilio.twiml.VoiceResponse();
        agentTwiml.say(`Incoming warm transfer. Here is a summary of the conversation: ${conversationSummary || 'No summary provided.'}`); // Play summary
        agentTwiml.say('Connecting you to the caller now.');
        agentTwiml.dial({
            // IMPORTANT: Add action to agent's dial as well
            action: `${TOOLS_BASE_URL}/twilio/transfer-status-action`,
            method: 'POST',
            statusCallback: `${TOOLS_BASE_URL}/twilio/transfer-status`,
            statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'],
            statusCallbackMethod: 'POST',
            timeout: 30 // Added timeout for agent's phone to answer
        }).conference({
            startConferenceOnEnter: true, // Agent joins the existing conference
            endConferenceOnExit: false,   // Conference remains active if agent hangs up
            hangupOnStar: true // Allow participant to hang up with *
        }, conferenceName);

        // 3. Initiate an outbound call to the human agent with the agent-specific TwiML
        console.log('Initiating outbound call to agent:', forwardingMobileNumber);
        console.log('Agent TwiML for outbound call:', agentTwiml.toString()); // Log agent's TwiML
        const agentCall = await client.calls.create({
            to: forwardingMobileNumber,
            from: fromNumber, // Your Twilio number for outbound calls
            twiml: agentTwiml.toString(),
            // statusCallback for agent's outbound call lifecycle
            statusCallback: `${TOOLS_BASE_URL}/twilio/transfer-status`,
            statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'], // Events to subscribe to for the agent's call
            statusCallbackMethod: 'POST'
        });
        console.log('Outbound call initiated to agent, SID:', agentCall.sid);
        console.log('Status of initiated agentCall object:', agentCall.status); // Log the initial status


        console.log('Warm call transfer initiated successfully.');
      
            return {
            status: 'success',
            message: 'Call transfer initiated',
            //callDetails: updatedCall
        };

    } catch (error) {
        console.error('Error transferring call:', error);
        //Error in transferring call
        await log_incoming_call_request('Error transferring call', { ultravoxCallId, isCallForwarding, forwardingMobileNumber, firstname, lastname, transferReason }, error.message);
        throw {
            status: 'error',
            message: 'Failed to transfer call',
            error: error.message
        };
    }
}

async function transferActiveCall_1_dicconnecte(ultravoxCallId,isCallForwarding,forwardingMobileNumber,firstname,lastname,transferReason,fromNumber,toNumber,direction,companyid,conversationSummary) {
    try {

        if(!isCallForwarding)
        {
           console.log('Call forwarding is  disable');
           return {
           status: 'false',
            message: 'Call forwarding is  disable',
            //callDetails: updatedCall
           }
        }
        // Log the initiation of the transfer attempt
        console.log('Attempting warm transfer for Ultravox Call ID:', ultravoxCallId);
        console.log('Summary provided:', conversationSummary);

        const callData = activeCalls.get(ultravoxCallId);
        //console.log('Call data:', callData);

        if (!callData || !callData.twilioCallSid) {
            throw new Error('Call not found or invalid CallSid');
        }

        // Verify Twilio client initialization
        // if (!client) {
        const twilioCallSid= callData.twilioCallSid;
        //GET PHONE NUMBER TWILO CREDENTIAL with TONUMBER
        console.log('Logging log_TransferCall', {callid: ultravoxCallId, twilioCallSid,isCallForwarding, forwardingMobileNumber, firstname, lastname, transferReason ,fromNumber, toNumber});
        const result = await log_TransferCall_gc({callid: ultravoxCallId,twilioCallSid,fromNumber, toNumber, forwardingMobileNumber,firstname, lastname,transferReason,isCallForwarding,direction,companyid }); 
        console.log('log_TransferCall result:', result);

                 
        
        const twilio_account_sid=result?.message?.phone_credentials?.twilio_account_sid;
        const twilio_auth_token=result?.message?.phone_credentials?.twilio_auth_token;

        if (!twilio_account_sid || !twilio_auth_token) {
         
          await log_incoming_call_request('twilio_account_sid or  twilio_auth_token is null', { ultravoxCallId, isCallForwarding, forwardingMobileNumber, firstname, lastname, transferReason }, error.message);
          throw new Error('Twilio credentials not found');
        }

        const client = twilio(twilio_account_sid, twilio_auth_token);        
         // --- Start of Warm Transfer Logic ---
        const conferenceName = `confer-${ultravoxCallId}`; // Unique name for the conference
        
        // First create a new TwiML to handle the transfer
        const twiml = new twilio.twiml.VoiceResponse();
        console.log('destinationNumber:', forwardingMobileNumber);
        // 1. Tell the original caller they are being transferred and put them into a conference
        twiml.say('Please wait a moment while I connect you to a human agent.');
       

        twiml.dial().conference({
            startConferenceOnEnter: true,     // Start the conference when the first participant enters
            endConferenceOnExit: false,      // Keep the conference active even if the AI or agent leaves
            waitUrl: 'http://twimlets.com/holdmusic/enqueue?Bucket=com.twilio.music.classical', // Custom hold music URL
            waitMethod: 'GET'
        }, conferenceName);

        // Update the active call (the one currently connected to Ultravox) with the new TwiML
        // This will transfer the caller from Ultravox control to the conference
        console.log('Updating original call with conference TwiML:', twiml.toString());
        await client.calls(twilioCallSid).update({
            twiml: twiml.toString()
        });
        console.log('Original caller transferred to conference:', conferenceName);

        // 2. Prepare TwiML for the human agent: play summary and then join conference
        //const agentTwiml = new (require('twilio').twiml.VoiceResponse)();
        const agentTwiml =new twilio.twiml.VoiceResponse();
        agentTwiml.say(`Incoming warm transfer. Here is a summary of the conversation: ${conversationSummary || 'No summary provided.'}`); // Play summary
        agentTwiml.say('Connecting you to the caller now.');
        agentTwiml.dial().conference({
            startConferenceOnEnter: true, // Agent joins the existing conference
            endConferenceOnExit: false   // Conference remains active if agent hangs up
        }, conferenceName);

        // 3. Initiate an outbound call to the human agent with the agent-specific TwiML
        console.log('Initiating outbound call to agent:', forwardingMobileNumber);
        const agentCall = await client.calls.create({
            to: forwardingMobileNumber,
            from: fromNumber, // Your Twilio number for outbound calls
            twiml: agentTwiml.toString(),
            // Optional: statusCallback for agent call progress if needed
            statusCallback: `${TOOLS_BASE_URL}/twilio/transfer-status`,
            statusCallbackMethod: 'POST'
        });
        console.log('Outbound call initiated to agent, SID:', agentCall.sid);

        console.log('Warm call transfer initiated successfully.');
      
         
            return {
            status: 'success',
            message: 'Call transfer initiated',
            //callDetails: updatedCall
        };

    } catch (error) {
        console.error('Error transferring call:', error);
        //Error in transferring call
        await log_incoming_call_request('Error transferring call', { ultravoxCallId, isCallForwarding, forwardingMobileNumber, firstname, lastname, transferReason }, error.message);
        throw {
            status: 'error',
            message: 'Failed to transfer call',
            error: error.message
        };
    }
}

async function transferActiveCall_no_conference(ultravoxCallId,isCallForwarding,forwardingMobileNumber,firstname,lastname,transferReason,fromNumber,toNumber,direction,companyid) {
    try {

        if(!isCallForwarding)
        {
           console.log('Call forwarding is  disable');
           return {
           status: 'false',
            message: 'Call forwarding is  disable',
            //callDetails: updatedCall
           }
        }
        const callData = activeCalls.get(ultravoxCallId);
        //console.log('Call data:', callData);

        if (!callData || !callData.twilioCallSid) {
            throw new Error('Call not found or invalid CallSid');
        }

        // Verify Twilio client initialization
        // if (!client) {
        const twilioCallSid= callData.twilioCallSid;
        //GET PHONE NUMBER TWILO CREDENTIAL with TONUMBER
        console.log('Logging log_TransferCall', {callid: ultravoxCallId, twilioCallSid,isCallForwarding, forwardingMobileNumber, firstname, lastname, transferReason ,fromNumber, toNumber});
        const result = await log_TransferCall_gc({callid: ultravoxCallId,twilioCallSid,fromNumber, toNumber, forwardingMobileNumber,firstname, lastname,transferReason,isCallForwarding,direction,companyid }); 
        console.log('log_TransferCall result:', result);

        console.log('Twilio credentials:', result);
        console.log('Twilio credentials:', result?.message);
        console.log('Twilio credentials:', result?.message?.phone_credentials);       
        console.log('Twilio credentials:', result?.message?.phone_credentials?.twilio_account_sid);       
        console.log('Twilio credentials:', result?.message?.phone_credentials?.twilio_auth_token);           
        
        const twilio_account_sid=result?.message?.phone_credentials?.twilio_account_sid;
        const twilio_auth_token=result?.message?.phone_credentials?.twilio_auth_token;

        if (!twilio_account_sid || !twilio_auth_token) {
         
          await log_incoming_call_request('twilio_account_sid or  twilio_auth_token is null', { ultravoxCallId, isCallForwarding, forwardingMobileNumber, firstname, lastname, transferReason }, error.message);
          throw new Error('Twilio credentials not found');
        }

       const client = twilio(twilio_account_sid, twilio_auth_token);        

        // First create a new TwiML to handle the transfer
        const twiml = new twilio.twiml.VoiceResponse();
        console.log('destinationNumber:', forwardingMobileNumber);

        //twiml.dial().number(forwardingMobileNumber);
        twiml.dial({
        action: `${TOOLS_BASE_URL}/twilio/transfer-status`,
        method: 'POST',
        statusCallbackEvent: 'completed',
        statusCallback: `${TOOLS_BASE_URL}/twilio/transfer-status`,
        statusCallbackMethod: 'POST'
      }).number(forwardingMobileNumber);

        console.log('Dial here:');


        // Update the active call with the new TwiML
        const updatedCall = await client.calls(callData.twilioCallSid)
            .update({
                twiml: twiml.toString()
            });
        //CALL iS GOING TO FORWARD
        console.log('Call transfer initiated:', updatedCall);
         
            return {
            status: 'success',
            message: 'Call transfer initiated',
            //callDetails: updatedCall
        };

    } catch (error) {
        console.error('Error transferring call:', error);
        //Error in transferring call
        await log_incoming_call_request('Error transferring call', { ultravoxCallId, isCallForwarding, forwardingMobileNumber, firstname, lastname, transferReason }, error.message);
        throw {
            status: 'error',
            message: 'Failed to transfer call',
            error: error.message
        };
    }
}


  export async function getCompanyInfoByCallerNumber(callerNumber) {
  if (!callerNumber) {
    throw new Error('callerNumber is required');
  }
  
  const businesses = getBusinesses(); // assume this returns your cached array
  if (!Array.isArray(businesses)) return null;

  // Normalize and match caller number with phone_number
  const match = businesses.find(
    (biz) =>
      biz.telecom_status === 1 &&
      biz.phone_number &&
      biz.phone_number.replace(/\s+/g, '') === callerNumber.replace(/\s+/g, '')
  );

  return match || null;
}
 
router.post('/incoming', verifyTwilioSignature,async (req, res) => {
  const twiml = new twilio.twiml.VoiceResponse();
  const body = req.body;

  try {
    logMessage('Incoming call request received', body);
    //console.log('INCOMING : /incoming request body:', body);

    // Validate request body and required fields
    if (!body || !body.CallSid || !body.Called) {
      await log_incoming_call_request('Missing required fields', body, 'Line 100');
      throw new Error('Missing CallSid or Called in request body');
    }

    const callerNumber = body.Called;
    await log_incoming_call_request('Incoming call', body, callerNumber);

    await save_phone_company_log(body);
    logMessage('save_phone_company_log call successfully');
    //console.log('save_phone_company_log call successfully');

    const company = await getbusinessbyPhoneNumber(callerNumber);
    logMessage('Company fetched by phone number:', company);
    //console.log('Company fetched by phone number:', company);
    if (!company) {
      await log_incoming_call_request('No company matched with Called number', body, callerNumber);
      throw new Error(`No company found for Called number: ${callerNumber}`);
    }
    if(company.bussiness_status == 'Disabled')
    {
      const BUSINESS_DISABLED_INBOUND='Business Disabled INBOUND';      
      await log_incoming_call_request('Sorry, Business is Disabled by Admin, Enabled it', body, BUSINESS_DISABLED_INBOUND);
      return res.type('text/xml').send(twiml.toString());
    }
    if(!company.business_enabled_user)
    {
      const BUSINESS_DISABLED_INBOUND='Business Disabled INBOUND';      
      await log_incoming_call_request('Sorry, Business is Disabled by Client, Enabled it', body, BUSINESS_DISABLED_INBOUND);
      return res.type('text/xml').send(twiml.toString());
    }
    
    if(company.credit_business<=0)
    {
      const BUSINESS_CREDIT_FIN_INBOUND='Business Credit finished INBOUND';      
      await log_incoming_call_request('Sorry, Business Credit finished, contact Company', body, BUSINESS_CREDIT_FIN_INBOUND);
      //twiml.say('Sorry, Business Credit finished, contact Company ');
      return res.type('text/xml').send(twiml.toString());
    }
    logMessage('Matched company:', company);
    //console.log('Matched company:', company);

    const COMPANY_NAME = company.companyname;
    const SYSTEM_PROMPT = company.inboundprompt;
    const AGENT_VOICE = company.voice;
    const FROM = body.From;
    const TO = body.To;
    const TEMPERATURE = company.temperature;
    const ISCALLTRANSCRIPT= company.iscalltranscript;
    const ISCALLRECORDING =  company.iscallrecording;    
    const ISCALLFORWARDING =company.iscallforwarding;  
    const FORWARDING_MOBILE_NUMBER = company.forwardingmobilenumber;
    const COMPANYID=company.name; 
    const EMAILADDRESS =company.emailaddress;  
    const EMAILNOTIFICAION=company.emailnotification;

    const IS_APPOINTMENT_EMAIL=company.appointment_email;
    const MAX_CALL_DUR_INSEC  =company.max_call_dur_insec;
    const ULTRAVOX_CALL_CONFIG = await createUltravoxCallConfig(SYSTEM_PROMPT, AGENT_VOICE,COMPANY_NAME,FROM,TO,TEMPERATURE,ISCALLTRANSCRIPT,ISCALLRECORDING,ISCALLFORWARDING,FORWARDING_MOBILE_NUMBER,COMPANYID,EMAILADDRESS,EMAILNOTIFICAION,IS_APPOINTMENT_EMAIL,MAX_CALL_DUR_INSEC);

    if (!ULTRAVOX_CALL_CONFIG) {
      await log_incoming_call_request('Ultravox call config creation failed', body, callerNumber);
      throw new Error('Failed to create Ultravox call config');
    }

    const TWILIO_NUMBER=TO;
    const UVdate = await getuv(TWILIO_NUMBER);
    if(!UVdate)
    {
       logMessage(`UVdate not found in ERP for twilio: ${TWILIO_NUMBER} uv: ${ UVdate}`);
       return res.status(200).json({ success: true, ignored: true });
    }     
    const uvResponse = await createUltravoxCall(ULTRAVOX_CALL_CONFIG,UVdate);

    if (!uvResponse || !uvResponse.callId || !uvResponse.joinUrl) {
      await log_incoming_call_request('Ultravox call creation failed', body, callerNumber);
      throw new Error('Ultravox call not created or missing joinUrl');
    }

    // Cache the active call
    activeCalls.set(uvResponse.callId, {
      twilioCallSid: body.CallSid,
      createdAt: new Date().toISOString(),
      ultravoxCallId: uvResponse.id,
      type: 'inbound',
      status: 'active'
    });

    // Create TwiML to connect the stream to Ultravox
    const connect = twiml.connect({
      action: `/twilio/callStatus?callId=${uvResponse.callId}`,
      method: 'POST'
    });

    connect.stream({
      url: uvResponse.joinUrl,
      name: 'ultravox'
    });

    res.type('text/xml');
    res.send(twiml.toString());

  } catch (error) {
    logMessage('Error handling incoming call:', error.message);
    //console.error('Error handling incoming call:', error.message);

    twiml.say('Sorry, there was an error connecting your call.');

    res.type('text/xml');
    res.send(twiml.toString());

    try {
      await log_incoming_call_request('Unhandled error in /incoming', body, error.message);
    } catch (logError) {
      logMessage('Failed to log incoming call error:', logError.message);
      //console.error('Failed to log incoming call error:', logError.message);
    }
  }
});

// --- NEW ROUTE FOR INCOMING SMS REPLIES ---
router.post('/reply',verifyTwilioSignatureSMS, async (req, res) => {
    // Twilio sends form-encoded data, which Express's urlencoded middleware parses into req.body
    const MessagingResponse = twilio.twiml.MessagingResponse;
    const twilioPayload = req.body;
    const twiml = new MessagingResponse(); // Use MessagingResponse for SMS

    console.log('Incoming SMS reply webhook received from Twilio:', twilioPayload);
    let erpnextResponseData = null; // Declare a variable to hold the ERPNext response

    try {
        // --- Forward the Twilio payload to your Node.js utility function that calls ERPNext API ---
        // Ensure callErpnextSmsApi is imported and takes twilioPayload
        erpnextResponseData = await sms_reply_rec(twilioPayload);

        console.log('ERPNext API response for SMS logging:', erpnextResponseData);

        // Check ERPNext's response for success.
        // Assuming callErpnextSmsApi returns an object with a 'success' property
        if (erpnextResponseData && erpnextResponseData.success) {
            console.log('SMS successfully logged in ERPNext.');
            // You can add a TwiML message here if you want to send an auto-reply back to the user
            // twiml.message('Thanks for your message! We have received it.');
        } else {
            console.error('ERPNext failed to log SMS:', erpnextResponseData?.message || 'Unknown error');
            // Optionally, send an error reply to the user or log more details
            // twiml.message('Sorry, we could not process your message at this time.');
        }

    } catch (error) {
        console.error('Error processing incoming SMS webhook or forwarding to ERPNext:', error.message);
        // Log detailed error from axios if available
        if (error.response) {
            console.error('ERPNext API Error Response:', error.response.status, error.response.data);
        }
        // In case of an unexpected error, you might still want to reply to Twilio to prevent retries
        // twiml.message('An unexpected error occurred. Please try again later.');
    } finally {
        // Always respond to Twilio with TwiML, even if empty, to avoid retries.
        res.type('text/xml');
        res.send(twiml.toString());
    }
});

// Add status callback handler
router.post('/callStatus', async (req, res) => {
  try {
    const { CallSid: twilioCallSid, CallStatus: status } = req.body || {};

    if (!twilioCallSid || !status) {
      logMessage('Missing CallSid or CallStatus in Twilio callback:', req.body);
      return res.status(400).json({ success: false, error: 'Missing CallSid or CallStatus' });
    }

    logMessage(`Twilio CallStatus callback for ${twilioCallSid}: ${status}`);

    // Safely find Ultravox callId using the Twilio CallSid
    const entry = Array.from(activeCalls.entries())
      .find(([_, data]) => data.twilioCallSid === twilioCallSid);

    if (!entry) {
      console.log(`No matching active call found for CallSid: ${twilioCallSid}`);
    }

    const ultravoxCallId = entry?.[0];

    if (status === 'completed' && ultravoxCallId) {
      activeCalls.delete(ultravoxCallId);
      console.log(`************completed******* ${ultravoxCallId}`);
      logMessage(`/callStatus Deleted completed call from activeCalls: ${ultravoxCallId}`);
    }

    res.status(200).end();
  } catch (error) {
    logMessage('Error handling /callStatus:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});
// Add status callback handler
router.post('/callStatus_old', async (req, res) => {
  try {
      console.log('CALLSTATUS**************** Twilio status /callStatus callback:', req.body);
      const twilioCallSid = req.body.CallSid;
      const status = req.body.CallStatus;
      console.log(`Call status / update for ${twilioCallSid}: ${status}`);
      
      // Find Ultravox call ID
      const ultravoxCallId = Array.from(activeCalls.entries())
          .find(([_, data]) => data.twilioCallSid === twilioCallSid)?.[0];

      if (status === 'completed' && ultravoxCallId) {
          console.log(`Processing completed call ${ultravoxCallId}`);
          
          
          activeCalls.delete(ultravoxCallId);
          console.log('activeCalls deleted now',activeCalls.size);
      }
      
      res.status(200).end();
  } catch (error) {
      console.error('Status callback error:', error);
      res.status(500).json({ 
          success: false,
          error: error.message 
      });
  }
});

router.get('/health', (req, res) => {
  logMessage('Health check endpoint hit');
  res.json({
      status: 'ok',
      activeCalls: activeCalls.size,
      baseUrl: process.env.BASE_URL
  });
});
 
router.post('/transferCall', async (req, res) => {

    logMessage('Transfer call request received inbound:', req.body);  
    const { callId,isCallForwarding,forwardingMobileNumber,firstname,lastname,transferReason,fromNumber,toNumber,direction,companyid,
      conversationSummary,
      intent_from,
      ResponseAccuracy,
      KnowledgeLimitationHandling, ConfidenceandClarity,ToneandEmpathy,
      EscalationHandling,CustomerSatisfactionOutcome,CustomerBehavior,
      CustomerEffortLevel,ConversationCompletion,EmotionalShiftDuringConversation,
      BackgroundNoiseLevelCustomer,BackgroundNoiseLevelAI,CallDisruptionDueToNoiseOrAudioQuality,
      OverallConversationQuality,callIntent,CallerToneandEmpathy
     } = req.body;
    logMessage(`Request to transfer call with callId: ${callId}`);

    try {
        const result = await transferActiveCall(callId,isCallForwarding,forwardingMobileNumber,firstname,lastname,transferReason,fromNumber,toNumber,direction,companyid,conversationSummary,
          
          intent_from,
          ResponseAccuracy,
      KnowledgeLimitationHandling, ConfidenceandClarity,ToneandEmpathy,
      EscalationHandling,CustomerSatisfactionOutcome,CustomerBehavior,
      CustomerEffortLevel,ConversationCompletion,EmotionalShiftDuringConversation,
      BackgroundNoiseLevelCustomer,BackgroundNoiseLevelAI,CallDisruptionDueToNoiseOrAudioQuality,
      OverallConversationQuality,callIntent,CallerToneandEmpathy
        );
        res.json(result);
    } catch (error) {
        res.status(500).json(error);
    }
});
  
// --- /twilio/transfer-status route handler ---
router.post('/transfer-status', async (req, res) => {
  try {
  logMessage('********************');
  logMessage('********************');
  logMessage(req.body);
    const {
      CallSid,
      ParentCallSid,
      From,
      To,
      CallStatus,
      ConferenceSid, // May be present if related to conference events
      StatusCallbackEvent // Will be from Dial's statusCallback or Call Resource's statusCallback
    } = req.body;

    logMessage('📞 Transfer status received:', {
      CallSid,
      ParentCallSid,
      From,
      To,
      CallStatus,
      ConferenceSid,
      StatusCallbackEvent
    });
  const mainCallSid = req.query.mainCallSid;

    // Always return valid TwiML to prevent Twilio from hanging up due to an invalid response.
    const twiml = new twilio.twiml.VoiceResponse();

    if (!CallSid) {
      logMessage('Missing CallSid in transfer status webhook. Cannot process.');
      return res.status(200).send(twiml.toString());
    }
    //Update Event *************
    
    // Pass along mainCallSid to your logging function if needed
    const result = await log_TransferCall_status({
      ...req.body,
      mainCallSid
    });
    logMessage('Logging call Status',result);

//     // Log specific events if needed, but ensure we always return TwiML
//     if (StatusCallbackEvent) { // Check if StatusCallbackEvent is present to differentiate
//       console.log(`Received status event '${StatusCallbackEvent}' for CallSid ${CallSid} with status ${CallStatus}.`);
//       // You can add more specific logic here based on CallSid and StatusCallbackEvent
//       // For example, update your activeCalls map, or log agent status.
//     } else {
//       // This might be a generic call status update if StatusCallbackEvent is not explicitly set
//       console.log(`Received generic call status update for CallSid ${CallSid} with status ${CallStatus}.`);
//     }
//     
//     res.status(200).send(twiml.toString());
  } catch (error) {
    logMessage('❌ Error in /twilio/transfer-status webhook:', error.message);
    // Even on error, return valid TwiML to Twilio to prevent call termination due to webhook error.
//     const twiml = new twilio.twiml.VoiceResponse();
//     twiml.say('An application error occurred during transfer processing. Please try again or contact support.');
//     res.status(500).send(twiml.toString());
  }
});

// --- /twilio/transfer-status-action route handler ---
// This route will be called when the <Dial> verb for a call leg completes (either original caller or agent).
router.post('/transfer-status-action', async (req, res) => {
    try {
        logMessage('📞 Transfer action webhook received:', req.body);
        const { CallSid, DialCallStatus, ConferenceSid } = req.body;

        logMessage(`Action for CallSid ${CallSid} completed with DialCallStatus: ${DialCallStatus}. ConferenceSid: ${ConferenceSid || 'N/A'}`);

        const twiml = new twilio.twiml.VoiceResponse();
        res.status(200).send(twiml.toString());
    } catch (error) {
        logMessage('❌ Error in /twilio/transfer-status-action webhook:', error.message);
        const twiml = new twilio.twiml.VoiceResponse();
        twiml.say('An error occurred. Please contact support.');
        res.status(500).send(twiml.toString());
    }
});

// --- /twilio/conference-events route handler ---
// This webhook will receive events directly from the <Conference> verb
router.post('/conference-events', async (req, res) => {
    try {
        // Log all conference events for detailed debugging
        logConferenceEvent(req.body.StatusCallbackEvent, req.body);

        const twiml = new twilio.twiml.VoiceResponse();
        res.status(200).send(twiml.toString());
    } catch (error) {
        logMessage('❌ Error in /twilio/conference-events webhook:', error.message);
        const twiml = new twilio.twiml.VoiceResponse();
        twiml.say('An internal error occurred related to the conference.'); // Optional message
        res.status(500).send(twiml.toString());
    }
});



/// Helper function to log conference events for better debugging
function logConferenceEvent(eventType, body) {
    console.log(`[CONFERENCE EVENT - ${eventType.toUpperCase()}]`, {
        ConferenceSid: body.ConferenceSid,
        FriendlyName: body.FriendlyName,
        Status: body.Status,
        SequenceNumber: body.SequenceNumber,
        Timestamp: body.Timestamp,
        CallSid: body.CallSid,
        ParticipantProperties: {
            CallSid: body.CallSid,
            AccountSid: body.AccountSid,
            Direction: body.Direction,
            From: body.From,
            To: body.To,
            CallStatus: body.CallStatus,
            ParticipantStatus: body.ParticipantStatus, // 'joined', 'left', 'hold', 'unhold' etc.
            Muted: body.Muted,
            Hold: body.Hold,
            EndConferenceOnExit: body.EndConferenceOnExit,
            StartConferenceOnEnter: body.StartConferenceOnEnter,
        }
    });
}

router.post('/transfer-status_not_in_use', async (req, res) => {
  try {
    const {
      CallSid,
      ParentCallSid,
      From,
      To,
      CallStatus,
      ConferenceSid, // May be present if related to conference events
      StatusCallbackEvent // Will be 'completed' from the Dial's statusCallback
    } = req.body;

    logMessage('*********');
    logMessage('📞 Transfer status received:', {
      CallSid,
      ParentCallSid,
      From,
      To,
      CallStatus,
      ConferenceSid,
      StatusCallbackEvent
    });

    // Relax validation: ParentCallSid might be undefined for the primary call leg
    // being updated to dial into the conference.
    if (!CallSid) {
      logMessage('Missing CallSid in transfer status webhook. Cannot process.');
      // Always return valid TwiML to prevent Twilio from hanging up due to an invalid response.
      const twiml = new twilio.twiml.VoiceResponse();
      return res.status(200).send(twiml.toString());
    }

    // If CallStatus is 'completed' and this is from the Dial's statusCallback (which it should be)
    if (CallStatus === 'completed' && StatusCallbackEvent === 'completed') {
      logMessage(`Call leg ${CallSid} successfully completed dialing into the conference.`);
      // At this point, the original caller's leg is now in the conference.
      // No further action is needed for this leg to keep it connected in the conference.
      // The fetchCallDetails might be for logging or other purposes, ensure it's robust.
      // const details = await fetchCallDetails(CallSid, From); // <-- Ensure fetchCallDetails handles undefined ParentCallSid or other missing data
      // if (!details) {
      //   console.error('Failed to fetch details for completed transfer call');
      // }
      // console.log('📞 Call details for completed transfer:', details);
    } else {
      // Handle other statuses or events if needed
      logMessage(`Received transfer status event for CallSid ${CallSid}: Status=${CallStatus}, Event=${StatusCallbackEvent}`);
    }

    // Always return an empty <Response/> TwiML to Twilio to indicate successful handling
    // and to keep the call leg active within the conference.
    const twiml = new twilio.twiml.VoiceResponse();
    res.status(200).send(twiml.toString());
  } catch (error) {
    logMessage('❌ Error in /twilio/transfer-status webhook:', error.message);
    // Even on error, return valid TwiML to Twilio to prevent call termination due to webhook error.
    const twiml = new twilio.twiml.VoiceResponse();
    twiml.say('An application error occurred during transfer processing. Please try again or contact support.');
    // Consider if you want to hang up the call here for critical errors: twiml.hangup();
    res.status(500).send(twiml.toString());
  }
});

router.post('/hangUpCall', async (req, res) => {
  try {
    console.log('hangUpCall request body:', req.body);
    const { callId,companyid,toNumber,fromNumber,direction,intent_from,
      ResponseAccuracy,     
     KnowledgeLimitationHandling, ConfidenceandClarity,ToneandEmpathy,
     EscalationHandling,CustomerSatisfactionOutcome,CustomerBehavior,
     CustomerEffortLevel,ConversationCompletion,EmotionalShiftDuringConversation,
     BackgroundNoiseLevelCustomer,BackgroundNoiseLevelAI,CallDisruptionDueToNoiseOrAudioQuality,
     OverallConversationQuality,callIntent,CallerToneandEmpathy

     } = req.body;
    await log_incoming_call_request('/hangUpCall', req.body, 'Line 1081');

    if (!callId || typeof callId !== 'string') {
      logMessage("/hangUpCall Invalid or missing callId");
      //return res.status(400).json({ success: false, error: 'Invalid or missing callId' });
    }
    logMessage(' /hangUpCall callId : ',callId);
    const callDetails = activeCalls.get(callId);
    
    if (!callDetails || !callDetails.twilioCallSid) {
      logMessage("/hangUpCall Call not found or invalid Twilio SID");
      return res.status(404).json({ success: false, error: 'Call not found or invalid Twilio SID' });
    }
    logMessage(' /hangUpCall callDetails.twilioCallSid : ',callDetails.twilioCallSid);

    const teleCRED =await fetchTelecomNumberByPhone(toNumber);
    logMessage('teleCRED : ' , teleCRED);

    const client = twilio(teleCRED.twilio_account_sid, teleCRED.twilio_auth_token);

    await client.calls(callDetails.twilioCallSid).update({ status: 'completed' });

    // activeCalls.delete(callId);
    const callid=callId
    const hangup_by="Agent"
    const hangupCallresult =await hangupCall(callid,hangup_by,companyid,toNumber,fromNumber,
     direction,intent_from,ResponseAccuracy,     
     KnowledgeLimitationHandling, ConfidenceandClarity,ToneandEmpathy,
     EscalationHandling,CustomerSatisfactionOutcome,CustomerBehavior,
     CustomerEffortLevel,ConversationCompletion,EmotionalShiftDuringConversation,
     BackgroundNoiseLevelCustomer,BackgroundNoiseLevelAI,CallDisruptionDueToNoiseOrAudioQuality,
     OverallConversationQuality,callIntent,CallerToneandEmpathy);
    logMessage('hangupCall : ',hangupCallresult);

    return res.status(200).json({ success: true, message: 'Call ended successfully' });

  } catch (error) {
    logMessage('❌ /hangUpCall Error hanging up call:', error.message || error);
    return res.status(500).json({ success: false, error: 'Internal Server Error. Failed to hang up call.' });
  }
});



export { router};

