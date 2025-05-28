import client from "@/twilio/twilio";

interface SendSmsParams {
   to: string;
   body: string;
}

export const sendSms = async ({to, body}: SendSmsParams)=>{
   try {

      const message = await client.messages.create({
        body,
        from: process.env.TWILIO_PHONE_NUMBER,
        to,
      });
      
      return message;

   } catch (error: any) {
      console.error('Error sending SMS:', error);
      throw error;
   }
};