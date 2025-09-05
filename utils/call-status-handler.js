// call-status-handler.js
import { google } from 'googleapis';
import { console } from 'inspector';
import { URLSearchParams } from 'url';
import { logMessage } from './logger.js';

export async function handleCallStatus(req, res) {
  try {
    const { CallSid, CallStatus, To, Duration, CallDuration } = req.body;
    logMessage(`Received status update for call ${CallSid}: ${CallStatus}`);

    logMessage('*************');
    const auth = new google.auth.GoogleAuth({
      credentials: {
        type: 'service_account',
        project_id: process.env.GOOGLE_PROJECT_ID,
        private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        client_id: process.env.GOOGLE_CLIENT_ID,
        auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
        client_x509_cert_url: process.env.GOOGLE_CLIENT_X509_CERT_URL
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });

    const sheets = google.sheets({ version: 'v4', auth });
    
    // Search for the call SID in the sheet
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: 'Patients!A2:L', // Updated to column L
    });

    const rows = response.data.values;
    const rowIndex = rows.findIndex(row => 
      row[11] && row[11].includes(`Call SID: ${CallSid}`) // Notes is column L (index 11)      
    );
  

    if (rowIndex === -1) {
      logMessage(`Call SID ${CallSid} not found in sheet`);
      return res.status(404).end();
    }

    // Update status and duration
    const updateRange = `Patients!K${rowIndex + 2}:M`; 
    const status = CallStatus === 'completed' ? 'Completed' : 'Failed';
    const duration = Duration || CallDuration || 'N/A';
    logMessage('*********');
    await sheets.spreadsheets.values.update({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: updateRange,
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [[
          status,
          new Date().toISOString(),
          `Duration: ${duration}s | Status_1: ${CallStatus}`
        ]]
      }
    });

    logMessage(`Updated row ${rowIndex + 2} for call ${CallSid}`);
    res.status(200).end();
  } catch (error) {
    logMessage('Error handling call status_2:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

