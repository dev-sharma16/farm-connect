"use client";

import FarmerReqCard from "@/components/FarmerReqCard";

export default function requestFarmer(){

    const onStatusChange = ()=>{} 
    const onDelete = () => {}

    return(
        <div className="min-h-[calc(100vh-64px)] w-full bg-[#b0dcb9] flex items-start py-20">
            <FarmerReqCard
              cropName="onion"
              imageUrl="asdddd"
              quantity={50}
              status="pending"
              onStatusChange={onStatusChange}
              onDelete={onDelete}
            ></FarmerReqCard>
        </div>
    )
}