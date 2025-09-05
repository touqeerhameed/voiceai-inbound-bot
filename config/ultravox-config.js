import 'dotenv/config';
import {
  TOOLS_BASE_URL
} from './config.js';

const assessmentReq=false;
const sharedAssessmentParameters = [
  {
            name: "ResponseAccuracy",
            location: "PARAMETER_LOCATION_BODY",
            schema: {
              "description": "The AI's self-assessed response accuracy based on its knowledge, as a digit 1-4. (4: Completely accurate, 3: Mostly accurate, 2: Somewhat inaccurate, 1: Frequently incorrect)",
              "type": "number",
              "default": 0,
              "enum": [1, 2, 3, 4]
            },
            required: assessmentReq
          },
          {
            name: "KnowledgeLimitationHandling",
            location: "PARAMETER_LOCATION_BODY",
            schema: {
              "description": "The AI's self-assessment of how it handled knowledge limitations, as a digit 1-4. (4: Clearly stated limits, 3: Occasionally mentioned limits, 2: Rarely mentioned limits, 1: Overstepped limits)",
              "type": "number",
              "default": 0,
              "enum": [1, 2, 3, 4]
            },
            required: assessmentReq
          },
          {
            name: "ConfidenceandClarity",
            location: "PARAMETER_LOCATION_BODY",            
            schema: {
              "description": "The AI's self-assessed confidence and clarity in responses, as a digit 1-4. (4: Clear/Concise/Confident, 3: Mostly confident/Wordy/Vague, 2: Uncertain/Repetitive, 1: Confusing/Lacked direction)",
              "type": "number",
              "default": 0,
              "enum": [1, 2, 3, 4]
            },
            required: assessmentReq
          },
          {
            name: "ToneandEmpathy",
            location: "PARAMETER_LOCATION_BODY",
            schema: {
              "description": "The AI's self-assessed tone and empathy during the call, as a digit 1-4. (4: Very appropriate, 3: Neutral, 2: Robotic, 1: Cold/Inappropriate)",
              "type": "number",
              "default": 0,
              "enum": [1, 2, 3, 4]
            },
            required: assessmentReq
          },
          {
            name: "EscalationHandling",
            location: "PARAMETER_LOCATION_BODY",
            schema: {
              "description": "The AI's self-assessment of its escalation handling, as a digit 1-4. (4: Offered at right time, 3: Offered only when prompted, 2: Needed but delayed, 1: Needed but not offered)",
              "type": "number",
              "default": 0,
              "enum": [1, 2, 3, 4]
            },
            required: assessmentReq
          },
          
          {
            name: "CustomerSatisfactionOutcome",
            location: "PARAMETER_LOCATION_BODY",
            schema: {
              "description": "The AI's assessment of the customer's final sentiment/satisfaction, as a digit 1-4. (4: Satisfied/Appreciative, 3: Neutral/Not dissatisfied, 2: Mildly frustrated, 1: Clearly unhappy/Angry)",
              "type": "number",
              "default": 0,
              "enum": [1, 2, 3, 4]
            },
            required: assessmentReq
          },
          {
            name: "CustomerBehavior",
            location: "PARAMETER_LOCATION_BODY",
            schema: {
              "description": "The AI's assessment of the customer's overall tone and attitude, as a digit 1-4. (4: Calm/Cooperative, 3: Mildly confused/Assertive, 2: Impatient/Slightly rude, 1: Hostile/Abusive)",
              "type": "number",
              "default": 0,
              "enum": [1, 2, 3, 4]
            },
            required: assessmentReq
          },
          {
            name: "CustomerEffortLevel",
            location: "PARAMETER_LOCATION_BODY",
            schema: {
              "description": "The AI's assessment of customer effort to get a helpful answer, as a digit 1-4. (4: Very little effort, 3: Some rephrasing, 2: Repeated clarification, 1: Gave up/Frustrated)",
              "type": "number",
              "default": 0,
              "enum": [1, 2, 3, 4]
            },
            required: assessmentReq
          },
          {
            name: "ConversationCompletion",
            location: "PARAMETER_LOCATION_BODY",
            schema: {
              "description": "The AI's assessment of whether the query was completely handled, as a digit 1-4. (4: Fully handled, 3: Mostly handled, 2: Partially handled, 1: Not handled)",
              "type": "number",
              "default": 0,
              "enum": [1, 2, 3, 4]
            },
            required: assessmentReq
          },
          {
            name: "EmotionalShiftDuringConversation",
            location: "PARAMETER_LOCATION_BODY",
            schema: {
              "description": "The AI's assessment of emotional shift during the conversation, as a digit 1-4. (4: Improved, 3: Stayed same, 2: Slightly worsened, 1: Significantly worsened)",
              "type": "number",
              "default": 0,
              "enum": [1, 2, 3, 4]
            },
            required: assessmentReq
          },
          {
            name: "BackgroundNoiseLevelCustomer",
            location: "PARAMETER_LOCATION_BODY",
            schema: {
              "description": "The AI's assessment of background noise on the customer's side, as a digit 1-4. (4: No noise, 3: Minor noise, 2: Moderate noise, 1: High noise)",
              "type": "number",
              "default": 0,
              "enum": [1, 2, 3, 4]
            },
            required: assessmentReq
          },
          {
            name: "BackgroundNoiseLevelAI",
            location: "PARAMETER_LOCATION_BODY",
            schema: {
              "description": "The AI's assessment of background noise/glitches from the AI/system side, as a digit 1-4. (4: Crystal clear, 3: Slight artifacts/echo, 2: Noticeable distortion/lag, 1: Difficult to hear)",
              "type": "number",
              "default": 0,
              "enum": [1, 2, 3, 4]
            },
            required: assessmentReq
          },
          {
            name: "CallDisruptionDueToNoiseOrAudioQuality",
            location: "PARAMETER_LOCATION_BODY",
            schema: {
              "description": "The AI's assessment of call disruption due to noise/audio quality, as a digit 1-4. (4: No impact, 3: Slight impact, 2: Some parts repeated, 1: Seriously impacted)",
              "type": "number",
              "default": 0,
              "enum": [1, 2, 3, 4]
            },
            "required": assessmentReq
          },
          {
            name: "OverallConversationQuality",
            location: "PARAMETER_LOCATION_BODY",
            schema: {
              "description": "The AI's overall rating of the conversation quality, as a digit 1-4. (4: Excellent, 3: Good, 2: Fair, 1: Poor)",
              "type": "number",
              "default": 0,
              "enum": [1, 2, 3, 4]
            },
            required: assessmentReq
          },
          {
            name: "callIntent",
            location: "PARAMETER_LOCATION_BODY",
            schema: {
              "description": "The AI's classification of the primary intent of the call, as a digit 1-4. (1: Information Inquiry, 2: Service/Support Request, 3: Sales/New Business Inquiry, 4: Other/Unclear)",
              "type": "number",
              "default": 0,
              "enum": [1, 2, 3, 4]
            },
            required: assessmentReq
          },
          {
            name: "CallerToneandEmpathy",
            location: "PARAMETER_LOCATION_BODY",
            schema: {
              "description": "The AI's assessment of the caller's tone and empathy during the call, as a digit 1-4. (4: Calm/Cooperative/Positive, 3: Neutral/Polite, 2: Impatient/Mildly frustrated, 1: Hostile/Angry/Abusive)",
              "type": "number",
              "default": 0,
              "enum": [1, 2, 3, 4]
            },
            required: assessmentReq
          }
]; 

 
const bookAppointmentTool = (FROM, TO, IS_APPOINTMENT_EMAIL) => ({
  temporaryTool: {
    modelToolName: "bookAppointment",
    description: "Schedule appointments",
    staticParameters: [
      { "name": "fromNumber", "location": "PARAMETER_LOCATION_BODY", "value": TO },
      { "name": "toNumber", "location": "PARAMETER_LOCATION_BODY", "value": FROM },
      { "name": "isAppointEmail", "location": "PARAMETER_LOCATION_BODY", "value": IS_APPOINTMENT_EMAIL },
      { "name": "intent_from", "location": "PARAMETER_LOCATION_BODY", "value": "outbound Appointment" }
    ],
    automaticParameters: [{
      "name": "callId",
      "location": "PARAMETER_LOCATION_BODY",
      "knownValue": "KNOWN_PARAM_CALL_ID"
    }],
    dynamicParameters: [       
      { name: "firstname", location: "PARAMETER_LOCATION_BODY", schema: { type: "string" }, required: true },
      { name: "lastname", location: "PARAMETER_LOCATION_BODY", schema: { type: "string" }, required: true },
      { name: "contactnumber", location: "PARAMETER_LOCATION_BODY", schema: { type: "string" }, required: true },
      { name: "emailaddress", location: "PARAMETER_LOCATION_BODY", schema: { type: "string" }, required: true },
      { name: "purpose", location: "PARAMETER_LOCATION_BODY", schema: { type: "string" }, required: true },
      { name: "appointmentdate", location: "PARAMETER_LOCATION_BODY", schema: { type: "string", format: "date" }, required: true },
      { name: "appointmenttime", location: "PARAMETER_LOCATION_BODY", schema: { type: "string", format: "time" }, required: true },
      { name: "conversationSummary", location: "PARAMETER_LOCATION_BODY", schema: { 
          description: "A 2-3 sentence summary of the conversation",
          type: "string"
        }, required: true 
      },
      ...sharedAssessmentParameters
    ],
    http: {
      baseUrlPattern: `${TOOLS_BASE_URL}/whook/bookAppointment`,
      httpMethod: "POST",
    }
  }
});

const hangUpCallTool = (FROM, TO, COMPANYID, JOB_ID) => ({
  temporaryTool: {
    modelToolName: "hangUpCall",
    description: "Ends the call when the conversation is complete.",
    staticParameters: [
      { "name": "fromNumber", "location": "PARAMETER_LOCATION_BODY", "value": FROM },
      { "name": "toNumber", "location": "PARAMETER_LOCATION_BODY", "value": TO },
      { "name": "direction", "location": "PARAMETER_LOCATION_BODY", "value": "OUTBOUND" },
      { "name": "companyid", "location": "PARAMETER_LOCATION_BODY", "value": COMPANYID },
      { "name": "job_id", "location": "PARAMETER_LOCATION_BODY", "value": JOB_ID },
      { "name": "intent_from", "location": "PARAMETER_LOCATION_BODY", "value": "outbound Hangup" }
    ], 
    automaticParameters: [{
      name: "callId",
      location: "PARAMETER_LOCATION_BODY",
      knownValue: "KNOWN_PARAM_CALL_ID"
    }],
    dynamicParameters: [            
      ...sharedAssessmentParameters
    ],
    http: {
      baseUrlPattern: `${TOOLS_BASE_URL}/twilio/hangUpCall`,
      httpMethod: "POST"
    }
  }
});

const transferCallTool = (FROM, TO, ISCALLFORWARDING, FORWARDING_MOBILE_NUMBER, COMPANYID, JOB_ID) => ({
  temporaryTool: {
    modelToolName: "transferCall",
    description: "Escalate to human agent", 
    staticParameters: [
      { "name": "fromNumber", "location": "PARAMETER_LOCATION_BODY", "value": FROM },
      { "name": "toNumber", "location": "PARAMETER_LOCATION_BODY", "value": TO },
      { "name": "isCallForwarding", "location": "PARAMETER_LOCATION_BODY", "value": ISCALLFORWARDING },
      { "name": "forwardingMobileNumber", "location": "PARAMETER_LOCATION_BODY", "value": FORWARDING_MOBILE_NUMBER },
      { "name": "direction", "location": "PARAMETER_LOCATION_BODY", "value": "OUTBOUND" },
      { "name": "companyid", "location": "PARAMETER_LOCATION_BODY", "value": COMPANYID },
      { "name": "job_id", "location": "PARAMETER_LOCATION_BODY", "value": JOB_ID },
      { "name": "intent_from", "location": "PARAMETER_LOCATION_BODY", "value": "outbound Transfer" }
    ],         
    automaticParameters: [{
      "name": "callId",
      "location": "PARAMETER_LOCATION_BODY",
      "knownValue": "KNOWN_PARAM_CALL_ID"
    }],
    dynamicParameters: [
      { name: "firstname", location: "PARAMETER_LOCATION_BODY", schema: { type: "string" }, required: false },
      { name: "lastname", location: "PARAMETER_LOCATION_BODY", schema: { type: "string" }, required: false },
      { name: "transferReason", location: "PARAMETER_LOCATION_BODY", schema: { type: "string" }, required: false },
      { name: "conversationSummary", location: "PARAMETER_LOCATION_BODY", schema: { 
          description: "A concise summary of the current conversation",
          type: "string" 
        }, required: false 
      },
      ...sharedAssessmentParameters
    ],
    http: {
      baseUrlPattern: `${TOOLS_BASE_URL}/twilio/transferCall`,
      httpMethod: "POST",
    }
  }
});


function createSelectedTools(FROM, TO,IS_APPOINTMENT_EMAIL,ISCALLFORWARDING,FORWARDING_MOBILE_NUMBER,COMPANY_NAME ,COMPANYID) {
  return [
      {
        temporaryTool: {
          modelToolName: "transferCall",          
          description: "Escalate to human agent", 
           staticParameters: [
            {
              "name": "fromNumber",
              "location": "PARAMETER_LOCATION_BODY",
              "value": FROM
            },
            {
              "name": "toNumber",
              "location": "PARAMETER_LOCATION_BODY",
              "value": TO
            },
            {
              "name": "isCallForwarding",
              "location": "PARAMETER_LOCATION_BODY",
              "value": ISCALLFORWARDING
            },
            {
              "name": "forwardingMobileNumber",
              "location": "PARAMETER_LOCATION_BODY",
              "value": FORWARDING_MOBILE_NUMBER
            },
            {
              "name": "direction",
              "location": "PARAMETER_LOCATION_BODY",
              "value": "INBOUND"
            },           
            {
              "name": "companyid",
              "location": "PARAMETER_LOCATION_BODY",
              "value": COMPANYID
            },
            {
              "name": "intent_from",
              "location": "PARAMETER_LOCATION_BODY",
              "value": "inbound Transfer"
            }
            
          ],         
          automaticParameters: [{
              "name": "callId",
              "location": "PARAMETER_LOCATION_BODY",
              "knownValue": "KNOWN_PARAM_CALL_ID"
            },
          
          ],
          dynamicParameters: [
            { name: "firstname", location: "PARAMETER_LOCATION_BODY", schema: { type: "string" }, required: true },
            { name: "lastname", location: "PARAMETER_LOCATION_BODY", schema: { type: "string" }, required: true },
            { name: "transferReason", location: "PARAMETER_LOCATION_BODY", schema: { type: "string" }, required: true },
            // --- ADD THIS NEW PARAMETER FOR THE SUMMARY ---
            // {
            //   name: "conversationSummary", // A descriptive name for the summary parameter
            //   location: "PARAMETER_LOCATION_BODY",
            //   schema: { type: "string" },
            //   required: true, // Make it required so the AI always provides a summary
            //   description: "A concise summary of the current conversation, to be provided to the human agent."
            // }

             { name: "conversationSummary",location: "PARAMETER_LOCATION_BODY", schema: { description: "A concise summary of the current conversation, to be provided to the human agent.",
              type: "string"
            },
            required: true},
            ...sharedAssessmentParameters
          ],
          http: {
            baseUrlPattern: `${TOOLS_BASE_URL}/twilio/transferCall`,
            httpMethod: "POST",
          },
        }
      },
      {
        temporaryTool: {
          modelToolName: "bookAppointment",
          description: "Schedule appointments",
          staticParameters: [
            {
              "name": "fromNumber",
              "location": "PARAMETER_LOCATION_BODY",
              "value": FROM
            },
            {
              "name": "toNumber",
              "location": "PARAMETER_LOCATION_BODY",
              "value": TO
            },
            {
              "name": "direction",
              "location": "PARAMETER_LOCATION_BODY",
              "value": "INBOUND"
            },  
             {
              "name": "isAppointEmail",
              "location": "PARAMETER_LOCATION_BODY",
              "value": IS_APPOINTMENT_EMAIL
            },
            {
              "name": "intent_from",
              "location": "PARAMETER_LOCATION_BODY",
              "value": "inbound Appointment"
            }

          ],
          automaticParameters: [
          {
              "name": "callId",
              "location": "PARAMETER_LOCATION_BODY",
              "knownValue": "KNOWN_PARAM_CALL_ID"
            },  
          ],
          dynamicParameters: [       
            { name: "firstname", location: "PARAMETER_LOCATION_BODY", schema: { type: "string" }, required: true },
            { name: "lastname", location: "PARAMETER_LOCATION_BODY", schema: { type: "string" }, required: true },
            { name: "contactnumber", location: "PARAMETER_LOCATION_BODY", schema: { type: "string" }, required: true },
            { name: "emailaddress", location: "PARAMETER_LOCATION_BODY", schema: { type: "string" }, required: true },
            { name: "purpose", location: "PARAMETER_LOCATION_BODY", schema: { type: "string" }, required: true },// Enforces YYYY-MM-DD format
            { name: "appointmentdate", location: "PARAMETER_LOCATION_BODY", schema: { type: "string", format: "date"  }, required: true },// Enforces HH:MM:SS (24-hour format)
            { name: "appointmenttime", location: "PARAMETER_LOCATION_BODY", schema: { type: "string",format: "time" }, required: true },
            { name: "conversationSummary",location: "PARAMETER_LOCATION_BODY", schema: { description: "A 2-3 sentence summary of the conversation.",
              type: "string"
            },
            required: true},
            ...sharedAssessmentParameters
            
          ],
          http: {
            baseUrlPattern: `${TOOLS_BASE_URL}/whook/bookAppointment`,
            httpMethod: "POST",
          },
        }
      },
      {
        temporaryTool: {
          modelToolName: "hangUpCall",
          description: "Ends the call when the conversation is complete.",
        staticParameters: [
      {
        name: "fromNumber",
        location: "PARAMETER_LOCATION_BODY",
        value: FROM
      },
      {
        name: "toNumber",
        location: "PARAMETER_LOCATION_BODY",
        value: TO
      },
      
      {
        name: "direction",
        location: "PARAMETER_LOCATION_BODY",
        value: "INBOUND"
      },           
      {
        name: "companyid",
        location: "PARAMETER_LOCATION_BODY",
        value: COMPANYID
      },
      {
              "name": "intent_from",
              "location": "PARAMETER_LOCATION_BODY",
              "value": "inbound Hangup"
      }
      
        ], 
        automaticParameters: [
          {
            name: "callId",
            location: "PARAMETER_LOCATION_BODY",
            knownValue: "KNOWN_PARAM_CALL_ID"
          }
        ],
          
        dynamicParameters: [
          ...sharedAssessmentParameters
        ] 
        ,
        http: {
          baseUrlPattern: `${TOOLS_BASE_URL}/twilio/hangUpCall`,
          httpMethod: "POST"
        }
        }
     }

     ];
} 

 

/**
 * Generates a complete Ultravox call configuration
 * @param {string} systemPrompt - The system prompt for the agent
 * @param {string} agentVoice - The TTS voice for the agent
 * @returns {object} ULTRAVOX_CALL_CONFIG
 */
export async function  createUltravoxCallConfig(System_Prompt, Agent_Voice,COMPANY_NAME,FROM,TO,TEMPERATURE,ISCALLTRANSCRIPT,ISCALLRECORDING,ISCALLFORWARDING,FORWARDING_MOBILE_NUMBER,COMPANYID,EMAILADDRESS,EMAILNOTIFICAION,IS_APPOINTMENT_EMAIL,MAX_CALL_DUR_INSEC) {

 
  const TRANSCRIPT = (   ISCALLTRANSCRIPT === true ||   ISCALLTRANSCRIPT=== 'true' ||   ISCALLTRANSCRIPT === 1 ||   ISCALLTRANSCRIPT === '1' );
  const RECORDING = (   ISCALLRECORDING === true ||   ISCALLRECORDING=== 'true' ||   ISCALLRECORDING === 1 ||   ISCALLRECORDING === '1' );

  // 1. Get UK time with BST/GMT awareness
  const ukDateOptions = {
    timeZone: 'Europe/London',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  };

  
  const ukTimeOptions12h = {
    timeZone: 'Europe/London',
    hour12: true,
    hour: '2-digit',
    minute: '2-digit'
  };
  const ukTimeOptions24h = {
    timeZone: 'Europe/London',
    hour12: false,
    hour: '2-digit',
    minute: '2-digit'
  };

  // 2. Format dates/times explicitly for UK
  const currentDate = new Date().toLocaleDateString('en-GB', ukDateOptions)
    .split('/').reverse().join('-'); // Converts DD/MM/YYYY → YYYY-MM-DD

  const currentTime12h = new Date().toLocaleTimeString('en-GB', ukTimeOptions12h); // HH:mm (12h)
  const currentTime24h = new Date().toLocaleTimeString('en-GB', ukTimeOptions24h); // HH:mm (24h)

  const maxDurationnow = `${MAX_CALL_DUR_INSEC}s`;
  console.log('Max Call Duration:', maxDurationnow);
  // Example Output during BST (June):
  // currentDate → "2024-06-15"
  // currentTime → "14:30" (BST = UTC+1)  

return {
    systemPrompt: System_Prompt
    .replace(/\[CURRENT_DATE_YYYY-MM-DD\]/g, currentDate)
    .replace(/\[CURRENT_TIME_HH:MM \(12h\)\]/g, currentTime12h)
    .replace(/\[CURRENT_TIME_HH:MM \(24h\)\]/g, currentTime24h)
    .replace(/\[CALLERPHONENO]/g, FROM),     
    model: 'fixie-ai/ultravox',
    voice: Agent_Voice,
    temperature: TEMPERATURE,
    firstSpeaker: 'FIRST_SPEAKER_AGENT',
    selectedTools: createSelectedTools(FROM, TO,IS_APPOINTMENT_EMAIL,ISCALLFORWARDING,FORWARDING_MOBILE_NUMBER,COMPANY_NAME ,COMPANYID),//selectedTools,
    
    medium: { "twilio": {} },
    recordingEnabled: RECORDING,
    transcriptOptional: TRANSCRIPT,
    maxDuration: maxDurationnow,   
    metadata: {
        direction: "INBOUND",
        company: COMPANY_NAME,
        callfrom: FROM,
        callto: TO,
        ISCALLTRANSCRIPT: String(ISCALLTRANSCRIPT).toLowerCase() === 'true' ? 'true' : 'false',
        ISCALLRECORDING:  String(ISCALLRECORDING).toLowerCase() === 'true' ? 'true' : 'false',  
        
        COMPANYID: COMPANYID,
        EMAILADDRESS:EMAILADDRESS,
        EMAILNOTIFICAION :String(EMAILNOTIFICAION).toLowerCase() === 'true' ? 'true' : 'false', 
        

      }
  };
}