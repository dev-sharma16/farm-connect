import twilio from 'twilio';

const twilioClient = twilio(
    process.env.NEXT_PUBLIC_TWILIO_ACCOUNT_SID,
    process.env.NEXT_PUBLIC_TWILIO_AUTH_TOKEN
);

export default twilioClient;