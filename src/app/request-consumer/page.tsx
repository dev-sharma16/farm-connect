"use client";

import ConsumerReqCard from "@/components/ConsumerReqCard";
import { crudService } from "@/appwrite/crudService";
import { useEffect, useState } from "react";
import { appwrite } from "@/appwrite/appwrite";


export default function RequestConsumer(){

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState(""); 

    useEffect(()=>{
        const fetchRequest = async ()=>{
            try {
                setLoading(true);

                const crrntUser = await appwrite.account.get();
                const crrntUserId = crrntUser.$id;
                setUserId(crrntUser.$id);

                const requestData = await crudService.getRequestsByUser(crrntUserId);
                setRequests(requestData?.documents || []);

            } catch (error: any) {
                console.log("Error in fetching Reqeusts : ", error);
            } finally{
                setLoading(false);
            }
        }

        fetchRequest();
    },[])    

    const handleDelete = async (requestId: string) => {
        try {
            const isConfirmed = window.confirm("Are sure you want to delete the request..!");
            if (isConfirmed) {
                await crudService.deleteRequest(requestId);
                setRequests(prevRequests => 
                    prevRequests.filter(request => request.$id !== requestId)
                );
                alert("Request is deleted..!");
            }
        } catch (error: any) {
            console.log("Error in deleting the request : ",error);
            alert("Error in deleting the request, try again later");
        }
    }
    
    if (loading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-[#f8fff2]">
                <div className="text-lg">Loading posts...</div>
            </div>
        );
    }

    if (!requests || requests.length === 0) {
        return (
            <div className="min-h-[calc(100vh-64px)] w-full bg-[#b0dcb9] flex items-center justify-center py-20">
                <div className="text-lg text-gray-700">No requests found</div>
            </div>
        );
    }

    return(
        <div className="min-h-screen w-full bg-[#b0dcb9] flex items-start py-20 px-4 align-middle">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {requests.map((request, index)=>(
                    <ConsumerReqCard
                      key = {request.$id || index}
                      cropName={request.cropName}
                      imageUrl={request.imageUrl}
                      quantity={request.quantity}
                      farmerName={request.farmerName}
                      status={request.status}
                      onDelete={()=> handleDelete(request.$id)}
                    ></ConsumerReqCard>
                ))}
            </div>
        </div>
    )
} 