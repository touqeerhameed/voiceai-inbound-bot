// Test WhatsApp API Integration
import 'dotenv/config';
import { sendWhatsAppMessage } from './utils/twilioUtils.js';

async function testWhatsAppMessage() {
    try {
        console.log('🧪 Testing WhatsApp API integration...\n');

        // Test credentials (replace with your actual credentials)
        const testCredentials = {
            twilio_account_sid: 'your_twilio_account_sid', // Replace with your actual SID
            twilio_auth_token: 'your_twilio_auth_token'   // Replace with your actual token
        };

        // Test phone number (replace with your test phone number)
        const testPhoneNumber = '+447305671889'; // Replace with your actual WhatsApp number

        const testMessage = 'Hello! This is a test message from your Voice AI system. WhatsApp integration is working! 🚀';

        console.log('📱 Sending test WhatsApp message...');
        console.log(`To: ${testPhoneNumber}`);
        console.log(`Message: ${testMessage}\n`);

        const result = await sendWhatsAppMessage(testPhoneNumber, testMessage, testCredentials);

        if (result.success) {
            console.log('✅ SUCCESS! WhatsApp message sent successfully');
            console.log(`Message SID: ${result.messageSid}`);
            console.log(`Status: ${result.status}`);
            console.log(`From: ${result.from}`);
            console.log(`To: ${result.to}`);
        } else {
            console.log('❌ FAILED! WhatsApp message failed to send');
            console.log(`Error: ${result.error}`);
            console.log(`Error Code: ${result.code}`);
        }

    } catch (error) {
        console.error('❌ Test failed with error:', error.message);
    }
}

// Run the test
testWhatsAppMessage();