// import twilio from 'twilio';
// import https from 'https';
import express from 'express';
import 'dotenv/config';
// import { createUltravoxCall } from './utils/ultravox-utils-outbound.js';
// import { handleCallStatus } from './utils/call-status-handler.js';


import {
  PORT
} from './config/config.js';
import { router as twilioRoutes } from './routes/twilio.js';
import { router as webhookcall } from './routes/webhookcall.js';
import { GET_outboundSETTINGS,create_call_active_log } from './api/erpcall.js';
import activeCalls from './utils/activeCallsStore.js'; // adjust path accordingly
import { startCallLogLoop } from './utils/scheduler.js';
import { logMessage } from './utils/logger.js';
let FETCH_INTERVAL_MS = 60 * 1000; // Call every 60 seconds
// Twilio configuration

 
const app = express();
app.set('trust proxy', true);
// app.use(express.json());
app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf.toString(); // Save raw body string for signature verification
  }
}));

app.use(express.urlencoded({ extended: true })); 

// app.post('/call-status', handleCallStatus);

app.use('/twilio/', twilioRoutes);
app.use('/whook/', webhookcall);

// Start server
app.listen(PORT, async () => {

  const outboundSettings = await  GET_outboundSETTINGS();
  if (outboundSettings) {

    console.log('Outbound settings retrieved successfully:', outboundSettings);    
    logMessage('Outbound settings retrieved successfully:', outboundSettings);
    //  outboundSettings.message.success = true;
    if(outboundSettings?.message?.success)
    {
      //console.log('Outbound settings are successfully set in frequencysec : ',outboundSettings.message.settings.frequencysec);
      logMessage('Outbound settings are successfully set in frequencysec : ',outboundSettings.message.settings.frequencysec);
      FETCH_INTERVAL_MS= outboundSettings.message?.settings?.frequencysec  * 1000; // Convert seconds to milliseconds
    }

    startCallLogLoop(FETCH_INTERVAL_MS, outboundSettings.message.settings);

   /* setInterval(async () => {
      try {

        console.log('Active call count:', activeCalls.size);
        const result= await create_call_active_log(activeCalls.size,0,"INBOUND",outboundSettings.message.settings.no_of_job_pick_sett,outboundSettings.message.settings.max_active_call_count_sett);
        // console.log('result : ' ,result);
      
      } catch (err) {
        console.error("❌ Active call count:", err.message);
      }
    }, FETCH_INTERVAL_MS); */
    console.log('Active call count:', activeCalls.size);
    logMessage('Active call count:', activeCalls.size);
    
  } else {
    console.error('Failed to retrieve outbound settings.');
  }

  console.log(` NEO AI Server FOR INBOUND CALL is running on port ${PORT}`);    
   
});
