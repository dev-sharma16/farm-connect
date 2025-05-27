import { sendSms } from "@/twilio/send-sms";
import twilioClient from "@/twilio/twilio";
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest){

  try {
        const { consumerName, consumerPhone, quantity, cropName, farmerName, farmerPhone, location, } = await req.json();
      
        const messageBody = `
          Hi 👋🏻 ${farmerName},
          📩 New Crop Inquiry:
          From: ${consumerName} (${consumerPhone})
          Crop: ${cropName}
          Quantity: ${quantity}
          Location: ${location}
        `;

        const twilioNumber = process.env.NEXT_PUBLIC_TWILIO_PHONE_NUMBER; 
        
        const response = await twilioClient.messages.create({
            body: messageBody,
            from: twilioNumber,
            to: farmerPhone,
        });

        console.log(farmerPhone);
        

        return NextResponse.json({
            message: 'Sms sent successfully',
            sid: response.sid
        });
    }catch (error: any) {
        console.log("Error in sending the message : " ,error);
        return NextResponse.json(
          { message: 'Failed to send SMS', error: error.message }, 
          { status: 500 }
        );
    }
}