import { sendSms } from "@/twilio/send-sms";
// import twilioClient from "@/twilio/twilio";
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest){

  try {
        const { consumerName, consumerPhone, quantity, cropName, farmerName, farmerPhone, location, } = await req.json();
      
        const messageBody = `
          Hi 👋🏻 ${farmerName},
          📩 New Crop Inquiry From: ${consumerName} (${consumerPhone}), Crop: ${cropName}, Quantity: ${quantity}, Location: ${location}
        `;
        
        const response = await sendSms({
            to: farmerPhone,
            body: messageBody,
        });

        console.log("Sending sms to : ",farmerPhone);
        
        return NextResponse.json({
            message: 'Sms sent successfully',
            sid: response.sid,
            status: response.status,
        });
    }catch (error: any) {
        console.log("Error in sending the message : " ,error);

        return NextResponse.json(
          { 
            message: 'Failed to send SMS',
            error: error.message, 
          }, 
          { status: 500 }
        );
    }
}