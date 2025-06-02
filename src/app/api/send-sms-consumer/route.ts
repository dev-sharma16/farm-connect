import { sendSms } from "@/twilio/send-sms";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
    try {
        const { consumerName, consumerPhoneNumber, cropName, quantity, status, farmerName } = await req.json();
        
        let messageBody: string;
        if (status === "completed") {
            messageBody = `${consumerName} your request has been ${status} of ${cropName} for ${quantity} by ${farmerName} Thanyou for beleving us, FarConnect..!`;
        } else{
            messageBody = `${consumerName} your request has been ${status} of ${cropName} for ${quantity} by ${farmerName}, No worry explore more : *sample link* `; 
        }

        const response = await sendSms({
            to: consumerPhoneNumber,
            body: messageBody
        });

        return NextResponse.json({
            message: 'Sms sent successfully',
            sid: response.sid,
            status: response.status,
        });

    } catch (error: any) {
        console.log("Error in sending the message to consumer : " ,error);

        return NextResponse.json(
          { 
            message: 'Failed to send SMS',
            error: error.message, 
          }, 
          { status: 500 }
        );
    }
}