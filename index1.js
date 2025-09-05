import twilio from 'twilio';
import https from 'https';
import express from 'express';
import 'dotenv/config';
import { google } from 'googleapis';
import { createUltravoxCall } from './utils/ultravox-utils-outbound.js';
import { handleCallStatus } from './utils/call-status-handler.js';
// Twilio configuration

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;
const TWILIO_AUTH_TOKEN= process.env.TWILIO_AUTH_TOKEN;
// const DESTINATION_PHONE_NUMBER = process.env.DESTINATION_PHONE_NUMBER;
const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
const TOOLS_BASE_URL = process.env.TOOLS_BASE_URL ;
// Configure Google Auth with service account credentials1
const googleAuth = new google.auth.GoogleAuth({
    credentials: {
      type: 'service_account',
      project_id: process.env.GOOGLE_PROJECT_ID,
      private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      client_id: process.env.GOOGLE_CLIENT_ID,
      auth_uri: 'https://accounts.google.com/o/oauth2/auth',
      token_uri: 'https://oauth2.googleapis.com/token',
      auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
      client_x509_cert_url: process.env.GOOGLE_CLIENT_X509_CERT_URL
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
  });
  async function fetchPendingPatients() {
    try {    
      const sheets = google.sheets({ version: 'v4', auth: googleAuth });
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: 'Patients!A2:L',
      });
  
      console.log('Fetched patients Line 37:', response.data);
      console.log('Fetched patients Line 38:', response.data.values?.length || 0);
  
      if (!response.data.values || response.data.values.length === 0) {
        console.log('No patients found in the spreadsheet.');
        return [];
      }
  
      const patients = response.data.values
        .map((row, index) => ({ 
          data: row, 
          rowIndex: index + 2 
        }))
        .filter(patient => {
          // Ensure row has enough columns
          if (patient.data.length < 11) {
            console.log(`Skipping row ${patient.rowIndex} - insufficient data`);
            return false;
          }
          
          // Clean and validate status
          const status = patient.data[10]?.trim().toLowerCase();
          const hasPhone = patient.data[2]?.trim().length > 5;
          const hasDOB = patient.data[3]?.trim().length === 10; // YYYY-MM-DD
          
          return status === 'pending' && hasPhone && hasDOB;
        });
  
      console.log('Filtered patients:', patients);
      return patients;
    } catch (error) {
      console.error('Failed to fetch patients:', error.message);
      throw error;
    }
  }
  
  async function updatePatientRecordRealtime(rowIndex, status, notes = '') {
    try {
      const sheets = google.sheets({ version: 'v4', auth: googleAuth });
      
      // Columns K (Call Status) and L (Notes)
      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `Patients!K${rowIndex}:M`,
        valueInputOption: 'USER_ENTERED',
        resource: {
          values: [[
            status,          // Column K: Call Status
            notes            // Column L: Notes
          ]]
        }
      });
  
      // Optional: Update timestamp in column J separately if needed
      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `Patients!J${rowIndex}`,
        valueInputOption: 'USER_ENTERED',
        resource: {
          values: [[
            new Date().toISOString()  // Column J: Last Rx Date
          ]]
        }
      });
  
    } catch (error) {
      console.error(`Failed to update row ${rowIndex}:`, error.message);
      throw error;
    }
  }
  async function updatePatientRecord(rowIndex, status, notes = '') {
    try {
      const sheets = google.sheets({ version: 'v4', auth: googleAuth });
      
      // Columns K (Call Status) and L (Notes)
      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `Patients!K${rowIndex}:L`,
        valueInputOption: 'USER_ENTERED',
        resource: {
          values: [[
            status,          // Column K: Call Status
            notes            // Column L: Notes
          ]]
        }
      });
  
      // Optional: Update timestamp in column J separately if needed
      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `Patients!J${rowIndex}`,
        valueInputOption: 'USER_ENTERED',
        resource: {
          values: [[
            new Date().toISOString()  // Column J: Last Rx Date
          ]]
        }
      });
  
    } catch (error) {
      console.error(`Failed to update row ${rowIndex}:`, error.message);
      throw error;
    }
  }
 
   async function initiatePatientCall(patient) {
    try {
      console.log(`Initiating call for patient at row ${patient.data}`);
      console.log(` patient.data[2] ${ patient.data[2]}`);
      console.log(`TWILIO_PHONE_NUMBER ${ TWILIO_PHONE_NUMBER}`);
      console.log(`TOOLS_BASE_URL ${ TOOLS_BASE_URL}`);
      const { joinUrl } = await createUltravoxCall(patient.data);

      const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
      const call = await client.calls.create({
        twiml: `<Response><Connect><Stream url="${joinUrl}"/></Connect></Response>`,
        to: patient.data[2],
        from: TWILIO_PHONE_NUMBER,
        statusCallback: `${TOOLS_BASE_URL}/call-status`,
        statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'],
        statusCallbackMethod: 'POST'
      });
  
      await updatePatientRecord(
        patient.rowIndex,
        'Initiated',
        `Call SID: ${call.sid}`
      );
      return call; 
    
    } catch (error) {
      await updatePatientRecord(
        patient.rowIndex,
        'Failed',
        `Error: ${error.message}`
      );
      throw error;
    }
  } 
  
  async function processCalls() {
    try {
      const pendingPatients = await fetchPendingPatients();
      console.log('Pending patients:', pendingPatients);
      console.log(`Found ${pendingPatients.length} patients to contact`);     
      for (const patient of pendingPatients) {
        try {
          console.log(`Processing patient at row ${patient}`);
          console.log(`Processing patient at row ${patient.rowIndex}`);
          // Initiate call and wait for completion
          const call =await initiatePatientCall(patient);
          await waitForCallCompletion(call.sid, patient);

          await new Promise(resolve => setTimeout(resolve, 5000)); // Rate limiting
        } catch (error) {
          console.error(`Error processing row ${patient.rowIndex}:`, error.message);
        }
      }
    } catch (error) {
      console.error('Critical processing error:', error.message);
      process.exit(1);
    }
  }


// Add this new function
async function waitForCallCompletion(callSid, patient) {
  const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
  
  return new Promise((resolve) => {
    const checkInterval = setInterval(async () => {
      try {
        const call = await client.calls(callSid).fetch();
        console.log(`Call ${callSid} status: ${call.status}`);

        // Update the patient record with the call status in excelsheet
        await updatePatientRecordRealtime(
          patient.rowIndex,
          call.status.charAt(0).toUpperCase() + call.status.slice(1), // Capitalize status
          `Call SID: ${callSid} | Status: ${call.status}`
        )

        if (['completed', 'failed', 'busy', 'no-answer'].includes(call.status)) {
          clearInterval(checkInterval);
          resolve();
        }
      } catch (error) {
        console.error(`Error checking call status for row ${patient.rowIndex}:`, error.message);
        clearInterval(checkInterval);
        resolve();
      }
    }, 5000); // Check every 5 seconds
  });
}

const app = express();
app.use(express.urlencoded({ extended: false }));

app.post('/call-status', handleCallStatus);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`oubound Server running on port ${PORT}`);
  processCalls(); // Start processing calls after server starts
});