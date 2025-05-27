import { sendSms } from "@/twilio/send-sms";

export default async function handler(req, res){
    if(req.method ==='POST'){
        return res.status(405).json({message: "only POST method is allowed"})
    }

    const { farmerPhone, consumerName, consumerPhone, location, quantity, cropName } = req.body;

    const messageBody = `
        📩 New Crop Inquiry:
        From: ${consumerName} (${consumerPhone})
        Crop: ${cropName}
        Quantity: ${quantity}
        Location: ${location}
    `;

    try {
      const response = await sendSms({ to: farmerPhone, body: messageBody });
      res.status(200).json({ message: 'SMS sent', sid: response.sid });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to send SMS', error });
    }
}