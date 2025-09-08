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

 
const bookAppointmentTool = (FROM, TO, is_book_appointment) => ({
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
              "value": is_book_appointment
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
});

const hangUpCallTool = (FROM, TO, company_id ) => ({
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
        value: company_id
      },
      {
        name: "intent_from",
        location: "PARAMETER_LOCATION_BODY",
        value: "inbound Hangup"
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
});

const transferCallTool = (FROM, TO, is_transfercall, transfercall_mobileno, company_id) => ({
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
              "value": is_transfercall
            },
            {
              "name": "forwardingMobileNumber",
              "location": "PARAMETER_LOCATION_BODY",
              "value": transfercall_mobileno
            },
            {
              "name": "direction",
              "location": "PARAMETER_LOCATION_BODY",
              "value": "INBOUND"
            },           
            {
              "name": "companyid",
              "location": "PARAMETER_LOCATION_BODY",
              "value": company_id
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
});


const queryCorpusTool = (RAG_COLLECTION_ID) => ({
    toolName: "queryCorpus",
    parameterOverrides: {
        corpus_id: RAG_COLLECTION_ID,
        max_results: 5
    }
});


function createSelectedTools(FROM, TO, is_book_appointment, is_transfercall, transfercall_mobileno, company_name, company_id,
      is_taking_notes, is_appointment_reminder, knowlege_base_id, use_knowlege_base
    ) {

      console.log('Creating selected tools with use_knowlege_base:', use_knowlege_base, 'and knowlege_base_id:', knowlege_base_id);
      const tools = []; 
      
      // Add knowledge base tool if enabled
      if ((use_knowlege_base === true || use_knowlege_base === 1 || use_knowlege_base === "1") && knowlege_base_id) {
          tools.push(queryCorpusTool(knowlege_base_id));
      }
      
      // Add transfer call tool only if enabled
      if (is_transfercall === true || is_transfercall === 1 || is_transfercall === "1") {
          tools.push(transferCallTool(FROM, TO, is_transfercall, transfercall_mobileno, company_id));
      }
      
      // Add book appointment tool only if enabled
      if (is_book_appointment === true || is_book_appointment === 1 || is_book_appointment === "1") {
          tools.push(bookAppointmentTool(FROM, TO, is_book_appointment));
      }
      
      // Always add hang up call tool
      tools.push(hangUpCallTool(FROM, TO, company_id));
      
      return tools;
}
 

/**
 * Generates a complete Ultravox call configuration
 * @param {string} systemPrompt - The system prompt for the agent
 * @param {string} agentVoice - The TTS voice for the agent
 * @returns {object} ULTRAVOX_CALL_CONFIG
 */
//export async function  createUltravoxCallConfig(System_Prompt, Agent_Voice,COMPANY_NAME,FROM,TO,TEMPERATURE,ISCALLTRANSCRIPT,ISCALLRECORDING,ISCALLFORWARDING,FORWARDING_MOBILE_NUMBER,COMPANYID,EMAILADDRESS,EMAILNOTIFICAION,IS_APPOINTMENT_EMAIL,MAX_CALL_DUR_INSEC) {
export async function  createUltravoxCallConfig(FINAL_PROMPT,voice, company_name ,FROM,TO,temperature,iscalltranscript,iscallrecording,
  transfercall_mobileno,company_id,company_email,notification_email,notification_email_add,is_transfercall,is_book_appointment,
  is_taking_notes,is_appointment_reminder, max_call_dur_insec,knowlege_base_id,use_knowlege_base){
 
  const TRANSCRIPT = (   iscalltranscript === true ||   iscalltranscript=== 'true' ||   iscalltranscript === 1 ||   iscalltranscript === '1' );
  const RECORDING = (   iscallrecording === true ||   iscallrecording=== 'true' ||   iscallrecording === 1 ||   iscallrecording === '1' );
  // const is_transfercall=(is_transfercall === true ||   is_transfercall=== 'true' ||   is_transfercall === 1 ||   is_transfercall === '1' );
  //const is_book_appointment=(is_book_appointment === true ||   is_book_appointment=== 'true' ||   is_book_appointment === 1 ||  is_book_appointment === '1' );
  //const is_taking_notes=(is_taking_notes === true ||   is_taking_notes=== 'true' ||   is_taking_notes === 1 ||   is_taking_notes === '1' );
  //const is_appointment_reminder=(is_appointment_reminder === true ||   is_appointment_reminder=== 'true' ||   is_appointment_reminder === 1 ||   is_appointment_reminder === '1' );
 
  const maxDurationnow = `${max_call_dur_insec}s`;
  console.log('Max Call Duration:', maxDurationnow);
  // Example Output during BST (June):
  // currentDate → "2024-06-15"
  // currentTime → "14:30" (BST = UTC+1)  
return {
    systemPrompt: FINAL_PROMPT,     
    model: 'fixie-ai/ultravox',
    voice: voice,
    temperature: temperature,
    firstSpeaker: 'FIRST_SPEAKER_AGENT',
    selectedTools: createSelectedTools(FROM, TO,is_book_appointment ,is_transfercall,transfercall_mobileno,company_name ,company_id,
      is_transfercall, is_taking_notes,is_appointment_reminder,knowlege_base_id,use_knowlege_base
    ),
    
    medium: { "twilio": {} },
    recordingEnabled: RECORDING,
    transcriptOptional: TRANSCRIPT,
    maxDuration: maxDurationnow,   
    metadata: {
        direction: "INBOUND",
        company: company_id,
        callfrom: FROM,
        callto: TO,
        ISCALLTRANSCRIPT: String(iscalltranscript).toLowerCase() === 'true' ? 'true' : 'false',
        ISCALLRECORDING:  String(iscallrecording).toLowerCase() === 'true' ? 'true' : 'false',  
        
        COMPANYID: company_id,
        EMAILADDRESS:company_email,
        EMAILNOTIFICAION :String(notification_email).toLowerCase() === 'true' ? 'true' : 'false', 
        NOTIFICAIONEMAIL_ADD:notification_email_add
      }
  };
}