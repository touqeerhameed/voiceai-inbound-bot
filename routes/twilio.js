import express from 'express';

import 'dotenv/config';
import { createUltravoxCall } from '../utils/ultravox-utils.js';
import {MAKE_PROMPT} from '../utils/utility.js';
import { createUltravoxCallConfig } from '../config/ultravox-config.js';
import {  getBusinesses } from '../utils/business-cache.js';
import { hangupCall,fetchTelecomNumberByPhone,getbusinessbyPhoneNumber_voice,sms_reply_rec,whatsapp_reply_rec,log_incoming_call_request,log_TransferCall_status,save_phone_company_log,getbusinessbyPhoneNumber,log_TransferCall_gc,getuv,getTTokenForCompany,log_Conference_status,get_conf_party,log_Conference_end } from '../api/erpcall.js';

import {
  TOOLS_BASE_URL,
} from '../config/config.js';
import twilio from 'twilio';
import activeCalls from '../utils/activeCallsStore.js'; // adjust path accordingly
import { logMessage } from '../utils/logger.js';
import verifyTwilioSignature from '../config/signature-middleware-twilio.js';
import verifyTwilioSignatureSMS from '../config/signature-middleware-twilio-sms.js';
import verifyTwilioSignatureWhatsApp, { verifyTwilioSignatureWhatsAppDev } from '../config/signature-middleware-twilio-whatsapp.js';
const router = express.Router();
function escapeXml(unsafe) {
    return unsafe.replace(/[<>&'"]/g, function (c) {
        switch (c) {
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '&': return '&amp;';
            case '\'': return '&apos;';
            case '"': return '&quot;';
        }
    });
}
const VoiceResponse = twilio.twiml.VoiceResponse;

router.post('/incoming', verifyTwilioSignature,async (req, res) => {
  console.log('**************************************************')
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

    //const company = await getbusinessbyPhoneNumber(callerNumber);
    const result = await getbusinessbyPhoneNumber_voice(callerNumber);
    const company = result?.message?.business || null;
    const inbound_prompt = result?.message?.inbound_prompt || null;
    const ai_tags_dictionary = result?.message?.ai_tags_dictionary || null;
    const ai_settings = result?.message?.ai_settings || null;

    logMessage('inbound_prompt',inbound_prompt);

    const ib_enable = inbound_prompt.enable_prompt;    
    
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
     if(!ib_enable)
    {
      const BUSINESS_DISABLED='Prompt Disabled';      
      await log_incoming_call_request('Sorry, Business is Disabled by Admin, Enabled it', body, BUSINESS_DISABLED);
      return res.type('text/xml').send(twiml.toString());
    }    
    if(!company?.user_status?.exists)
    {
      const BUSINESS_User_EXIST ='Business User Not exists INBOUND';      
      await log_incoming_call_request('Sorry, Business email does not exist in User', body, BUSINESS_User_EXIST);
      return res.type('text/xml').send(twiml.toString());
    }
    if(!company?.user_status?.enabled)
    {
      const BUSINESS_User_ENABLE ='Business User Not enable INBOUND';      
      await log_incoming_call_request('Sorry, Business  user not enabled in User', body, BUSINESS_User_ENABLE);
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

    const company_id = company?.name;
    const company_name = company?.companyname;
    const companyaddress = company?.companyaddress;
    const website = company?.website;
    const company_email = company?.emailaddress;
    const business_services = company?.business_services;
    const business_description =company?.business_description;
    const company_phone_number = company?.phone_number;
    const default_company = company?.default_company;
    const contactpersonno=  company?.contactpersonno;
    const contactemail=  company?.contactemail;
    const business_knowledge_base= company?.business_knowledge_base;
    const use_knowlege_base= company?.use_knowlege_base;
    const knowlege_base_id= company?.knowlege_base_id;
    const social_media= company?.social_media;
    const opening_hours= company?.opening_hours;
    const temperature= company?.temperature;
    const voice= company?.voice;
    const d_call_ult= company?.d_call_ult;
    const transfer_call_recording= company?.transfer_call_recording;
    const iscalltranscript= company?.iscalltranscript;
    const iscallrecording= company?.iscallrecording;
    const fee_business_inbound= company?.fee_business_inbound;
    const fee_business_outbound= company?.fee_business_outbound;
    const credit_business= company?.credit_business;
    const sms_rate= company?.sms_rate;
    const sms_due_credit= company?.sms_due_credit;
    const table_faqs= company?.table_faqs;

    const ai_datetime_handling = ai_settings.ai_datetime_handling;
    const pronunciation = ai_settings.pronunciation;
    const kpi_assessment= ai_settings.kpi_assessment;

    
    const prompt_title =inbound_prompt?.prompt_title;
    const direction =inbound_prompt?.direction;
    const agent_name =inbound_prompt?.agent_name;

    const persona_tone =inbound_prompt?.persona_tone;
    const unresponsive_spam =inbound_prompt?.unresponsive_spam;
    const greeting =inbound_prompt?.greeting;
    const is_record_disclaimer= inbound_prompt?.is_record_disclaimer; 
    const record_disclaimer =inbound_prompt?.record_disclaimer;
    const core_objective =inbound_prompt?.core_objective;
    const call_flow = inbound_prompt?.call_flow;    
    const escalation = inbound_prompt?.escalation;
    const key_rules_constraints = inbound_prompt?.key_rules_constraints;

    const is_taking_notes = inbound_prompt?.is_taking_notes; 
    const is_transfercall = inbound_prompt?.is_transfercall;
    const transfercall_mobileno = inbound_prompt?.transfercall_mobileno;
    const tool_functions = inbound_prompt?.tool_functions;
    const is_book_appointment = inbound_prompt?.is_book_appointment;
    const example_scenario = inbound_prompt?.example_scenario;


    const appointment_emails = inbound_prompt?.appointment_emails;
    const is_appointment_reminder = inbound_prompt?.is_appointment_reminder;
    // const trigger_on_call_end_section = inbound_prompt?.trigger_on_call_end_section;
    const notification_email = appointment_emails?.notification_email;
    const notification_email_add = appointment_emails?.notification_email_add;
    const notification_sms = appointment_emails?.notification_sms;
    const notification_phoneno = appointment_emails?.notification_phoneno;
    const notification_whatsapp = appointment_emails?.notification_whatsapp;
    const max_call_dur_insec = inbound_prompt?.max_call_dur_insec;
    const prompt_misc =inbound_prompt?.prompt_misc;    

    // 1 persona_tone (AI Prompt)
    // 2 core_objective  (AI Prompt)
    // 3 key_rules_constraints  (AI Prompt)
    // 3.1 unresponsive_spam
    // 4 tool_functions  (AI Prompt)
    // 5 ai_datetime_handling  (AI settings)
    // 6 prompt_misc (AI Prompt)
    // 7 call_flow  (AI Prompt)
    // *8 business knowledge  
    // 9  pronunciation (AI settings)
    // 10 kpi_assessment (AI settings)

    // 1 persona_tone (AI Prompt)
    // 2 core_objective  (AI Prompt)
    // 3 key_rules_constraints  (AI Prompt)
    // 3.1 unresponsive_spam
    // 4 tool_functions  (AI Prompt)
    // 5 ai_datetime_handling  (AI settings)
    // 6 prompt_misc (AI Prompt)
    // 7 call_flow  (AI Prompt)
    // *8 business knowledge  (business)
    // 8.1 table_faqs (business)
    // 8.2 example_scenario (AI Prompt)
    // 9  pronunciation (AI settings)
    // 10 kpi_assessment (AI settings)
    

    const FROM = body.From;
    const TO = body.To;

    const FINAL_PROMPT = MAKE_PROMPT(
      //PROMPT
      persona_tone, core_objective, key_rules_constraints, unresponsive_spam, tool_functions, ai_datetime_handling, prompt_misc,
      call_flow, business_knowledge_base,example_scenario,table_faqs, pronunciation, kpi_assessment,
      //REPLACEMENT
      is_record_disclaimer,record_disclaimer,FROM,ai_tags_dictionary,website,company_name,agent_name,
      greeting,business_services,business_description,opening_hours
    );

    const ULTRAVOX_CALL_CONFIG = await createUltravoxCallConfig(FINAL_PROMPT, voice,company_name ,FROM,TO,temperature,iscalltranscript,
      iscallrecording,transfercall_mobileno,
      company_id,company_email,notification_email,notification_email_add,is_transfercall,is_book_appointment,is_taking_notes,is_appointment_reminder, 
       max_call_dur_insec,knowlege_base_id,use_knowlege_base);

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
    logMessage('Error handling incoming call:', error);
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

router.post('/transfer-conference-entry-point', (req, res) => {
    try {
        const {
            conferenceName,
            // fromNumber,
            // toNumber,
            companyid,           
            mainCallSid,
            record,
            max_dur
        } = req.query;

        //twilio/transfer-conference-entry-point?conferenceName=${encodeURIComponent(conferenceName)}&job_id=${encodeURIComponent(job_id)}&mainCallSid=${encodeURIComponent(callSid)}`;
        //record=${encodeURIComponent(recordEnabled)}&max_dur
        logMessage('Received transfer-conference-entry-point request:', JSON.stringify(req.query, null, 2));

        if (!conferenceName) {
            console.error('Missing conferenceName in query parameters');
            const errorResponse = new VoiceResponse();
            errorResponse.say('Conference name is missing. Please try again.');
            res.type('text/xml');
            return res.status(400).send(errorResponse.toString());
        }

        // Start building the TwiML response string manually for the customer leg
        let customerTwimlString = `<?xml version="1.0" encoding="UTF-8"?><Response>`;
        customerTwimlString += `<Say>Please wait a moment while I connect you to a human agent.</Say>`;
        
        const conference_status_URL = `${TOOLS_BASE_URL}/twilio/conference-status?conferenceName=${encodeURIComponent(conferenceName)}&mainCallSid=${mainCallSid}&companyid=${companyid}`;
        const recording_status_URL_customer = `${TOOLS_BASE_URL}/twilio/recording-status?conferenceName=${encodeURIComponent(conferenceName)}&mainCallSid=${encodeURIComponent(mainCallSid)}&companyid=${companyid}`;
        // const recording_status_URL_customer = `${TOOLS_BASE_URL}/twilio/recording-status?companyid=${encodeURIComponent(companyid)}&job_id=${encodeURIComponent(job_id)}&mainCallSid=${encodeURIComponent(mainCallSid)}&conferenceName=${encodeURIComponent(conferenceName)}`;
        const escapedCustomerRecordingStatusUrl = escapeXml(recording_status_URL_customer);


        // Manually construct the <Dial> and <Conference> verbs with attributes
        customerTwimlString += `<Dial>`;
        const escapedCustomerStatusUrl = escapeXml(conference_status_URL); // Use the helper function
        //const recordEnabled = 'false'; // Enable recording for customer leg
        customerTwimlString += `<Conference` +
            ` statusCallback="${escapedCustomerStatusUrl}"` +
            ` statusCallbackEvent="start join leave end"` +
            ` statusCallbackMethod="POST"` +
            ` startConferenceOnEnter="false"` + // Wait for agent to join first
            ` endConferenceOnExit="false"` +    // Don't end when customer leaves (managed by /conference-status)
            ` record="${record}"` + // Enable recording
            ` maxDuration="${max_dur}"` + // <--- Added maxDuration
            ` recordingStatusCallback="${escapedCustomerRecordingStatusUrl}"` + // Recording status URL
            ` recordingStatusCallbackMethod="POST"` + // Method for recording status
            `>${conferenceName}</Conference>`;
        customerTwimlString += `</Dial>`;
        customerTwimlString += `</Response>`;

        //console.log('Final TwiML sent successfully (MANUAL):', customerTwimlString);
        logMessage('Final TwiML sent successfully (MANUAL):', customerTwimlString);
        res.type('text/xml');
        res.send(customerTwimlString);
        
    } catch (error) {
        console.error('Error in transfer-conference-entry-point:', error.message);
        logMessage('Error in transfer-conference-entry-point:', error.message);
        
        const errorResponse = new VoiceResponse();
        errorResponse.say('There was an error connecting your call. Please contact support.');
        res.type('text/xml');
        res.status(500).send(errorResponse.toString());
    }
});

router.post('/recording-status', async (req, res) => {
    try {
      const {
        CallSid,
        ConferenceSid, // This will be present for conference recordings
        RecordingSid,
        RecordingUrl,
        RecordingStatus,
        RecordingDuration,
        RecordingChannels,
        Timestamp
      } = req.body;
    
      const {  mainCallSid, conferenceName } = req.query; // job_id,  These will now be passed from the TwiML recordingStatusCallbackURL
    
      console.log('📥 Twilio Recording Status Received:');
      console.log('Request Body:', JSON.stringify(req.body, null, 2));
      console.log('Request Query:', JSON.stringify(req.query, null, 2));
      
      logMessage('Received recording status webhook:', JSON.stringify({
        body: req.body,
        query: req.query
      }, null, 2));
    
      // Determine if this is a conference recording or call recording
      const isConferenceRecording = !!ConferenceSid;
      
      console.log(`Recording Type: ${isConferenceRecording ? 'Conference' : 'Call'} Recording`);
      
      if (RecordingUrl && RecordingStatus === 'completed') {

        //Download and save in erpnext like form ultravox we do
        // Construct direct .mp3 download URL
        const mp3Url = `${RecordingUrl}.mp3`;
        
        console.log(`📼 Recording Available: ${mp3Url}`);
        console.log(`📊 Duration: ${RecordingDuration} seconds`);
        console.log(`🔊 Channels: ${RecordingChannels}`);
        
        const recordingDetails = {
          callSid: CallSid,
          conferenceSid: ConferenceSid,
          recordingSid: RecordingSid,
          recordingUrl: mp3Url,
          status: RecordingStatus,
          duration: RecordingDuration,
          channels: RecordingChannels,
          timestamp: Timestamp,                    
          mainCallSid: mainCallSid, // Now available from query
          conferenceName: conferenceName, // Now available from query
          recordingType: isConferenceRecording ? 'conference' : 'call'
        };
    
        console.log('Recording details to save:', recordingDetails);
        logMessage('Recording details to save:', JSON.stringify(recordingDetails, null, 2));
        
        // You can call your database save function here, e.g.:
        // await saveRecordingToDatabase(recordingDetails);
      }
      else{

        logMessage('Recording URL or status is not completed. Recording not saved.'); 
      }
    
      res.status(200).send('Recording status received');
    } catch (error) {
      console.error('❌ Error in recording-status webhook:', error);
      logMessage('Error in recording-status webhook:', error.message);
      res.status(500).send('Internal Server Error');
    }
});



async function transferActiveCall_old07092025(ultravoxCallId, isCallForwarding, forwardingMobileNumber, firstname, lastname, transferReason, fromNumber, toNumber, direction, companyid, conversationSummary,
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

// --- transferActiveCall Function (Agent Leg) ---
async function transferActiveCall(ultravoxCallId, isCallForwarding, forwardingMobileNumber, firstname, lastname, transferReason, fromNumber, toNumber, direction, companyid,  conversationSummary, intent_from, ResponseAccuracy, KnowledgeLimitationHandling, ConfidenceandClarity, ToneandEmpathy, EscalationHandling, CustomerSatisfactionOutcome, CustomerBehavior, CustomerEffortLevel, ConversationCompletion, EmotionalShiftDuringConversation, BackgroundNoiseLevelCustomer, BackgroundNoiseLevelAI, CallDisruptionDueToNoiseOrAudioQuality, OverallConversationQuality, callIntent, CallerToneandEmpathy) {
    try {
        logMessage('transferActiveCall called with parameters:', JSON.stringify({
            ultravoxCallId, isCallForwarding, forwardingMobileNumber, firstname, lastname, transferReason, fromNumber, toNumber, direction, companyid
        }, null, 2));

        if (!isCallForwarding) {
            await log_incoming_call_request('Call forwarding is disabled', { 
                ultravoxCallId, isCallForwarding, forwardingMobileNumber, firstname, lastname, transferReason, direction, companyid,  conversationSummary,
                intent_from, ResponseAccuracy, KnowledgeLimitationHandling, ConfidenceandClarity, ToneandEmpathy,
                EscalationHandling, CustomerSatisfactionOutcome, CustomerBehavior, CustomerEffortLevel, ConversationCompletion, EmotionalShiftDuringConversation,
                BackgroundNoiseLevelCustomer, BackgroundNoiseLevelAI, CallDisruptionDueToNoiseOrAudioQuality, OverallConversationQuality, callIntent, CallerToneandEmpathy
            }, 'transferActiveCall');

            console.log('Call forwarding is disabled');
            return {
                status: 'false',
                message: 'Call forwarding is disabled'
            };
        }

        const callData = activeCalls.get(ultravoxCallId);
        console.log('Call data:', callData);
        
        if (!callData || !callData.twilioCallSid) {
            logMessage('Call not found or invalid CallSid');
            await log_incoming_call_request('Call not found or invalid CallSid', { 
                ultravoxCallId, isCallForwarding, forwardingMobileNumber, firstname, lastname, transferReason,  conversationSummary 
            }, 'transferActiveCall');
            throw new Error('Call not found or invalid CallSid');
        }
        const twilioCallSid = callData.twilioCallSid;
        const callSid = twilioCallSid; // Renaming for clarity as this is the main call SID

        console.log('Getting Twilio credentials...');
        logMessage('Getting Twilio credentials for call transfer:');
        const result = await log_TransferCall_gc({
            callid: ultravoxCallId, twilioCallSid, fromNumber, toNumber, forwardingMobileNumber, firstname, 
            lastname, transferReason, isCallForwarding, direction, companyid,  conversationSummary,
            intent_from, ResponseAccuracy, KnowledgeLimitationHandling, ConfidenceandClarity, ToneandEmpathy,
            EscalationHandling, CustomerSatisfactionOutcome, CustomerBehavior, CustomerEffortLevel, ConversationCompletion, EmotionalShiftDuringConversation,
            BackgroundNoiseLevelCustomer, BackgroundNoiseLevelAI, CallDisruptionDueToNoiseOrAudioQuality, OverallConversationQuality, callIntent, CallerToneandEmpathy
        }); 
        // logMessage('log_TransferCall_gc result:', JSON.stringify(result, null, 2));

        const twilio_account_sid = result?.message?.phone_credentials?.twilio_account_sid;
        const twilio_auth_token = result?.message?.phone_credentials?.twilio_auth_token;
        const transfer_call_recording = result?.message?.transfer_call_recording;
        const max_conf_duration=  result?.message?.max_conf_duration;

        const recordEnabled = transfer_call_recording === 1;

       if (!twilio_account_sid || !twilio_auth_token) {
            await log_incoming_call_request('twilio_account_sid or twilio_auth_token is null', { 
                ultravoxCallId, isCallForwarding, forwardingMobileNumber, firstname, lastname, transferReason  
            }, 'Missing Twilio credentials');
            throw new Error('Twilio credentials not found');
        }

        const client = twilio(twilio_account_sid, twilio_auth_token); 
        const conferenceName = `conference_${callSid}`;

        console.log('Updating call to redirect to conference entry point...');
        const transferConferenceEntryPoint=`${TOOLS_BASE_URL}/twilio/transfer-conference-entry-point?conferenceName=${encodeURIComponent(conferenceName)}&mainCallSid=${encodeURIComponent(callSid)}&record=${encodeURIComponent(recordEnabled)}&max_dur=${encodeURIComponent(max_conf_duration)}&companyid=${encodeURIComponent(companyid)}  `;    

        const updatedCall = await client.calls(callData.twilioCallSid)
            .update({
                url: transferConferenceEntryPoint,
                // url: `${TOOLS_BASE_URL}/twilio/transfer-conference-entry-point?conferenceName=${encodeURIComponent(conferenceName)}&fromNumber=${encodeURIComponent(fromNumber)}&toNumber=${encodeURIComponent(toNumber)}&companyid=${encodeURIComponent(companyid)}&job_id=${encodeURIComponent(job_id)}&mainCallSid=${encodeURIComponent(callSid)}`,
                method: 'POST'
            });

        console.log('Call redirected successfully. Now creating outbound call to agent...');

        // Start building the TwiML response string manually for the agent leg
        let agentTwimlString = `<?xml version="1.0" encoding="UTF-8"?><Response>`;
        agentTwimlString += `<Say>You are being connected to a user. Here's a quick summary.</Say>`;
        
        if (conversationSummary) {
            agentTwimlString += `<Say>${escapeXml(conversationSummary)}</Say>`;
        }

        //const conference_status_URL = `${TOOLS_BASE_URL}/twilio/conference-status?conferenceName=${encodeURIComponent(conferenceName)}&mainCallSid=${mainCallSid}&job_id=${encodeURIComponent(job_id)}`;
        //const recording_status_URL_customer = `${TOOLS_BASE_URL}/twilio/recording-status?conferenceName=${encodeURIComponent(conferenceName)}&mainCallSid=${encodeURIComponent(mainCallSid)}&job_id=${encodeURIComponent(job_id)}`;
       
        const mainCallSid= callSid; // Use the main call SID for the agent leg
        //const conference_status_URL = `${TOOLS_BASE_URL}/twilio/conference-status?conferenceName=${encodeURIComponent(conferenceName)}&mainCallSid=${mainCallSid}`;
        const conference_status_URL=`${TOOLS_BASE_URL}/twilio/conference-status?conferenceName=${encodeURIComponent(conferenceName)}&mainCallSid=${mainCallSid}&companyid=${encodeURIComponent(companyid)}`;
        logMessage('Conference status callback URL for agent:', conference_status_URL);

        // --- Recording Status Callback URL for Agent Leg ---
        // const recording_status_URL_agent = `${TOOLS_BASE_URL}/twilio/recording-status?companyid=${encodeURIComponent(companyid)}&job_id=${encodeURIComponent(job_id)}&mainCallSid=${encodeURIComponent(mainCallSid)}&conferenceName=${encodeURIComponent(conferenceName)}`;
        const recording_status_URL_agent=`${TOOLS_BASE_URL}/twilio/recording-status?conferenceName=${encodeURIComponent(conferenceName)}&mainCallSid=${encodeURIComponent(mainCallSid)}&companyid=${encodeURIComponent(companyid)}`;
        const escapedAgentRecordingStatusUrl = escapeXml(recording_status_URL_agent);


        // Manually construct the <Dial> and <Conference> verbs with attributes
        agentTwimlString += `<Dial>`;
        const escapedAgentStatusUrl = escapeXml(conference_status_URL); // Use the helper function
        
        // const recordEnabled = transfer_call_recording        'false'; // Enable recording for customer leg
        agentTwimlString += `<Conference` +
            ` statusCallback="${escapedAgentStatusUrl}"` +
            ` statusCallbackEvent="start join leave end"` +
            ` statusCallbackMethod="POST"` +
            ` startConferenceOnEnter="true"` +
            ` endConferenceOnExit="true"` + // Agent leaving ends conference
            ` maxDuration="${max_conf_duration}"` + // <--- Added maxDuration
            ` record="${recordEnabled}"`+  // Enable recording
            ` recordingStatusCallback="${escapedAgentRecordingStatusUrl}"` + // Recording status URL
            ` recordingStatusCallbackMethod="POST"` + // Method for recording status
            `>${conferenceName}</Conference>`;
        agentTwimlString += `</Dial>`;
        agentTwimlString += `</Response>`;

        // console.log('Conference TwiML created successfully (MANUAL):', agentTwimlString);
        // logMessage('Conference TwiML created successfully (MANUAL):', agentTwimlString);

        // Create outbound call to the agent using the manually constructed TwiML
        const transferstatusCallBack=`${TOOLS_BASE_URL}/twilio/transfer-status?mainCallSid=${mainCallSid}`
        logMessage('Transfer status callback URL:', transferstatusCallBack);
        const outboundCall = await client.calls.create({
            to: forwardingMobileNumber,
            from: fromNumber,
            twiml: agentTwimlString,
            statusCallback: transferstatusCallBack,
            statusCallbackMethod: 'POST',
            statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed']
        });

        // console.log('Outbound call initiated to specialist. SID:', outboundCall.sid);
        // logMessage('Outbound call initiated to specialist. SID:', outboundCall.sid);

        return {
            status: 'success',
            message: 'Call transfer initiated'
        };

    } catch (error) {
        logMessage('Error transferring call:', error.message || error);
        console.error('Error transferring call:', error);
        
        await log_incoming_call_request('Error transferring call', { 
            ultravoxCallId, isCallForwarding, forwardingMobileNumber, firstname, lastname, transferReason, direction, companyid  
        }, error.message);
        
        throw {
            status: 'error',
            message: 'Failed to transfer call',
            error: error.message
        };
    }
}

router.post('/conference-status', async (req, res) => {
    logMessage('Conference status webhook called:');
    logMessage('Body:', JSON.stringify(req.body, null, 2));
    logMessage('Query:', JSON.stringify(req.query, null, 2)); 

    try {
        const {
            ConferenceSid,            
            StatusCallbackEvent,
            FriendlyName,
            Timestamp,
            CallSid // The CallSid of the participant who joined/left
        } = req.body;
        
        const mainCallSidFromQuery = req.query.mainCallSid; 
        // const job_idFromQuery = req.query.job_id; 
        const conferenceNameFromQuery = req.query.conferenceName; 
        const companyid = req.query.companyid; 

        logMessage(`/conference-status Conference Event: ${StatusCallbackEvent} for Conference: ${FriendlyName} (${ConferenceSid} ) companyid : ${companyid}  `);

        const auth_tokens = await getTTokenForCompany(companyid); 
        if (!auth_tokens?.message?.twilio_account_sid || !auth_tokens?.message?.twilio_auth_token) {
            logMessage('Error: Twilio credentials not found for job_id:' );
            return res.status(500).send('Error: Twilio credentials missing');
        }
        const client = twilio(auth_tokens.message.twilio_account_sid, auth_tokens.message.twilio_auth_token);
        
        switch (StatusCallbackEvent) {
            case 'conference-start':
                console.log(`Conference ${FriendlyName} (${ConferenceSid}) started.`);
                logMessage(`conference-start ${FriendlyName} (${ConferenceSid}) started.`);
                
                break;

            case 'participant-join':
                console.log(`Participant ${CallSid} joined conference ${FriendlyName}.`);
                logMessage(`participant-join ${CallSid} joined conference ${FriendlyName}.`);

                try {
                  // Log conference start in your system
                  await log_Conference_status({
                      ...req.body,
                      mainCallSid: mainCallSidFromQuery 
                  });
                   

                } catch (error) {
                    console.error(`❌ Error fetching/saving participant ${CallSid} on join for conference ${ConferenceSid}:`, error.message);
                    logMessage(`Error fetching/saving participant ${CallSid} on join:`, error.message);
                }
                break;

            case 'participant-leave':
                console.log(`Participant ${CallSid} left conference ${FriendlyName}.`);
                logMessage(`participant-leave ${CallSid} left conference ${FriendlyName}.`);
                
                try {
                    
                    const conferenceDetails = await client.conferences(ConferenceSid).fetch();
                    if (conferenceDetails.status === 'completed') {
                        logMessage(`Conference ${FriendlyName} (${ConferenceSid}) is already completed due to participant-leave with endConferenceOnExit. 'conference-end' will handle final details.`);
                        return res.status(200).send('OK');
                    }
                    
                    logMessage(`Conference ${FriendlyName} (${ConferenceSid}) is still active. Checking participants...`);
                    const activeParticipants = await client.conferences(ConferenceSid).participants.list();
                    const currentParticipantsCount = activeParticipants.length;

                    console.log(`Conference ${FriendlyName} (${ConferenceSid}): Current active participants after leave: ${currentParticipantsCount}`);
                    logMessage(`Conference ${FriendlyName} (${ConferenceSid}): Current active participants after leave: ${currentParticipantsCount}`);

                    if (currentParticipantsCount === 1) {
                        logMessage(`Only 1 active participant left in conference ${FriendlyName}. Explicitly ending conference.`);
                        await client.conferences(ConferenceSid).update({ status: 'completed' });
                        console.log(`Conference ${FriendlyName} (${ConferenceSid}) successfully ended by explicit command.`);
                        logMessage(`Conference ${FriendlyName} (${ConferenceSid}) successfully ended by explicit command due to 1 participant remaining.`);
                    } else if (currentParticipantsCount === 0) {
                        logMessage(`0 active participants left in conference ${FriendlyName}. Conference should have ended or will end soon.`);
                        console.log(`0 active participants left in conference ${FriendlyName}. Conference should have ended or will end soon.`);
                    }

                } catch (error) {
                    if (error.status === 404) {
                        console.warn(`404 Conference ${ConferenceSid} or participant ${CallSid} not found (might have ended already or participant disconnected abruptly):`, error.message);
                        logMessage(`404 Conference ${ConferenceSid} or participant ${CallSid} not found:`, error.message);
                    } else {
                        console.error(`❌ Error in participant-leave processing for ${ConferenceSid} / ${CallSid}:`, error.message);
                        logMessage(`Error in participant-leave processing for ${ConferenceSid} / ${CallSid}:`, error.message);
                    }
                }
                break;

            case 'conference-end':
                console.log(`Conference ${FriendlyName} (${ConferenceSid}) ended.`);
                logMessage(`conference-end ${FriendlyName} (${ConferenceSid}) ended.`);

                // Log conference end in your system
                const confPartyResult = await get_conf_party({
                    ...req.body,
                    mainCallSid: mainCallSidFromQuery                   
                });
                
                logMessage('get_conf_party result:', JSON.stringify(confPartyResult, null, 2));
                let overallConferenceDuration = 0;
                let endReason = "unknown";
                const participantDetails = [];
                
                
                
                try {
                    const conferenceDetails = await client.conferences(ConferenceSid).fetch();
                    logMessage(`Fetched conference details at conference-end for ${ConferenceSid}:`, JSON.stringify(conferenceDetails, null, 2));

                    if (conferenceDetails.dateCreated && conferenceDetails.dateUpdated) {
                        const createdDate = new Date(conferenceDetails.dateCreated);
                        const updatedDate = new Date(conferenceDetails.dateUpdated);
                        overallConferenceDuration = (updatedDate.getTime() - createdDate.getTime()) / 1000;
                    }
                    endReason = conferenceDetails.reasonConferenceEnded || "unknown"; 

                    logMessage(`Overall Conference Duration: ${overallConferenceDuration.toFixed(3)} seconds`);
                    console.log(`Overall Conference Duration: ${overallConferenceDuration.toFixed(3)} seconds`);
                    logMessage(`Conference End Reason: ${endReason}`);
                    console.log(`Conference End Reason: ${endReason}`);

                 
                  let callSidsFromPartyApi = [];
                    if (confPartyResult?.message?.success && confPartyResult.message.party && Array.isArray(confPartyResult.message.party)) {
                        callSidsFromPartyApi = confPartyResult.message.party.map(p => p.callsid).filter(Boolean); // Extract and filter out null/undefined
                        logMessage(`Received ${callSidsFromPartyApi.length} CallSIDs from get_conf_party API: ${JSON.stringify(callSidsFromPartyApi)}`);
                    } else {
                        logMessage(`No valid 'party' data received from get_conf_party API for conference ${ConferenceSid}. Result: ${JSON.stringify(confPartyResult)}`);
                    }

                    // Iterate through these CallSIDs and fetch their details from Twilio
                    let totalDurationP=0;
                    for (const callSid of callSidsFromPartyApi) { 
                        try {
                            const callLeg = await client.calls(callSid).fetch();
                            logMessage(`Fetched CallLeg details for CallSid ${callSid}:`, JSON.stringify(callLeg, null, 2));
                            totalDurationP += parseFloat(callLeg.duration) || 0;
                            participantDetails.push({                                
                                callSid: callLeg.sid,
                                from: callLeg.from,
                                to: callLeg.to,
                                status: callLeg.status,
                                duration: parseFloat(callLeg.duration) || 0,
                                startTime: callLeg.startTime,
                                endTime: callLeg.endTime
                            });
                            

                            // logMessage(`Participant Call ${callLeg.sid} (From: ${callLeg.from}, To: ${callLeg.to}) duration: ${callLeg.duration} seconds, Price: ${callLeg.price || 'N/A'} ${callLeg.priceUnit || ''}`);
                            // console.log(`Participant Call ${callLeg.sid} (From: ${callLeg.from}, To: ${callLeg.to}) duration: ${callLeg.duration} seconds, Price: ${callLeg.price || 'N/A'} ${callLeg.priceUnit || ''}`);
                        } catch (fetchCallError) {
                            console.warn(`⚠️ Could not fetch details for CallSid ${callSid} (might be completed/invalid): ${fetchCallError.message}`);
                            logMessage(`Warning: Could not fetch details for CallSid ${callSid}: ${fetchCallError.message}`);
                        }
                    }

                    const apiPayload = {
                        main_call_sid: mainCallSidFromQuery,
                        conference_sid: ConferenceSid,
                        conference_friendly_name: FriendlyName,
                        overall_duration: overallConferenceDuration,
                        totalDurationP: totalDurationP,
                        end_reason: endReason,
                        participants: participantDetails // Send all collected participant data
                    };
                    logMessage(`Sending conference end details to Backend log_Conference_end: ${JSON.stringify(apiPayload, null, 2)}`);
                    const logConfEnd = await log_Conference_end({
                        apiPayload
                    });
                    logMessage(`log_Conference_end API response: ${JSON.stringify(logConfEnd, null, 2)}`);


                } catch (fetchError) {
                    console.error(`❌ Error in conference-end processing for ${ConferenceSid}:`, fetchError.message);
                    logMessage(`Error in conference-end processing for ${ConferenceSid}:`, fetchError.message);
                }
                break;

            default:
                console.log('Unknown conference event:', StatusCallbackEvent);
                logMessage('Unknown conference event:', StatusCallbackEvent);
        }

        res.status(200).send('OK');
    } catch (err) {
        console.error('❌ Error handling conference status webhook:', err.message);
        logMessage('Error handling conference status webhook:', err.message);
        res.status(500).send('Error');
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

// --- NEW ROUTE FOR INCOMING WHATSAPP MESSAGES ---
router.post('/whatsapp-webhook', verifyTwilioSignatureWhatsApp, async (req, res) => {
    const MessagingResponse = twilio.twiml.MessagingResponse;
    const twilioPayload = req.body;
    const twiml = new MessagingResponse();

    console.log('Incoming WhatsApp message webhook received from Twilio:', twilioPayload);
    logMessage(`NEW ROUTE FOR INCOMING WHATSAPP MESSAGES /whatsapp-webhook: ${JSON.stringify(twilioPayload, null, 2)}`);
    let erpnextResponseData = null;

    try {
        // Mark message as WhatsApp for logging
        const whatsappPayload = {
            ...twilioPayload,
            messageType: 'whatsapp'
        };

        // Forward to ERPNext API (reusing SMS function)
        erpnextResponseData = await whatsapp_reply_rec(whatsappPayload);

        console.log('ERPNext API response for WhatsApp logging:', erpnextResponseData);

        if (erpnextResponseData && erpnextResponseData.success) {
            console.log('WhatsApp message successfully logged in ERPNext.');
            // Optional auto-reply
            // twiml.message('Thanks for your WhatsApp message! We have received it.');
        } else {
            console.error('ERPNext failed to log WhatsApp message:', erpnextResponseData?.message || 'Unknown error');
        }

    } catch (error) {
        console.error('Error processing incoming WhatsApp webhook:', error.message);
        if (error.response) {
            console.error('ERPNext API Error Response:', error.response.status, error.response.data);
        }
    } finally {
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

