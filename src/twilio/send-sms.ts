import client from "@/twilio/twilio";

export const sendSms = async ({to, body})=>{
   return await client.messages.create({
      body,
      from: process.env.NEXT_PUBLIC_TWILIO_PHONE_NUMBER,
      to,
   });
};