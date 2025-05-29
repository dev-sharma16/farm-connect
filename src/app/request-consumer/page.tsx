"use client";

import ConsumerReqCard from "@/components/ConsumerReqCard";

export default function requestConsumer(){
    return(
        <div className="min-h-[calc(100vh-64px)] w-full bg-[#b0dcb9] flex items-start py-20">
            <ConsumerReqCard
              cropName="onion"
              imageUrl="asdasd"
              quantity={50}
              farmerName="farmerXYZ"
              status="pending"
            ></ConsumerReqCard>
        </div>
    )
} 