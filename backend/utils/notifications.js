// Utility functions for notifications
const twilio = require('twilio');

const sendSMS = async (phoneNumber, message) => {
  try {
    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    
    const result = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber
    });

    return result;
  } catch (error) {
    console.error('SMS sending error:', error);
    throw error;
  }
};

const sendEmail = async (email, subject, message) => {
  // Implement Firebase email sending
  console.log(`Email would be sent to ${email}: ${subject}`);
};

module.exports = { sendSMS, sendEmail };
