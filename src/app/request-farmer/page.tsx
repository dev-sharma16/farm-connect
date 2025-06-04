"use client";

import { appwrite } from "@/appwrite/appwrite";
import { crudService } from "@/appwrite/crudService";
import FarmerReqCard from "@/components/FarmerReqCard";
import { request } from "http";
import { useEffect, useState } from "react";

export default function RequestFarmer(){
    
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(()=>{
        const fetchQueries = async() => {
            try {
                setLoading(true);

                const currentUser = await appwrite.account.get();
                const currentUserId = currentUser.$id;
                
                const requestData = await crudService.getRequestsByUser(currentUserId);

                setRequests(requestData?.documents || []);

            } catch (error: any) {
                console.log("Error in loading Queries : ",error);
            } finally {
                setLoading(false);
            }
        };

        fetchQueries();
    },[])

    const handleStatusSubmit = async (request: any, newStatus: string)=>{
        try {

            const updateRequest = await appwrite.databases.updateDocument(
                process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
                process.env.NEXT_PUBLIC_APPWRITE_REQUESTS_COLLECTION_ID!,
                request.$id,
                {status: newStatus},
            );
            if(updateRequest){
                alert("Request status is updated..!");
                setRequests(prevRequests => 
                    prevRequests.map(req => 
                       req.$id === request.$id
                         ? {...req, status: newStatus}
                         : req
                    )
                )
            
                const clickedRequest = await crudService.getRequestById(request.$id);
                if (clickedRequest) {
                    const payload = {
                        consumerName: clickedRequest.consumerName,
                        consumerPhoneNumber: clickedRequest.consumerPhoneNumber,
                        cropName: clickedRequest.cropName,
                        quantity: clickedRequest.quantity,
                        status: newStatus,
                        farmerName: clickedRequest.farmerName,  
                    }
                // TODO: temperarily disabled the messaging service for testing purpose
                    try {

                        const response = await fetch("/api/send-sms-consumer", {
                            method: 'POST',
                            headers: {
                                "Content-Type" : "application/json"
                            },
                            body: JSON.stringify(payload),
                        });
                    
                        const result = await response.json();
                        if(response.ok){
                            console.log("Status updated and SMS sent successfully");
                            alert("Request status updated and customer notified!");
                        }else{
                            console.error("SMS sending failed:", result);
                            alert("Status updated but failed to notify customer via SMS");
                        }
                    
                    } catch (error: any) {
                        console.log("Error in sending payload to route : ", error);

                    }
                } else {
                    alert("Status updated but failed to get request details for SMS");
                }
            }    

        } catch (error: any) {
            console.error("Error in updating status:", error);
            alert("Failed to update request status!");
        }
    };
    
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

    if (requests.length === 0) {
        return (
            <div className="min-h-[calc(100vh-64px)] w-full bg-[#b0dcb9] flex items-center justify-center">
                <div className="text-lg text-gray-600">No requests found</div>
            </div>
        );
    }

    return(
        <div className="min-h-screen w-full bg-[#b0dcb9] flex items-start py-20 px-4 align-middle">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {requests.map((request, index)=>(
                    <FarmerReqCard
                      key={request.$id || index}
                      cropName={request.cropName}
                      imageUrl={request.imageUrl}
                      quantity={request.quantity}
                      status={request.status}
                      //   onStatusChange={(newStatus)=> updateRequestStatus(request. $id, newStatus)}
                      onDelete={()=>handleDelete(request.$id)}
                      onSubmitStatus={(newStatus)=>handleStatusSubmit(request, newStatus)}
                    ></FarmerReqCard>
                ))}
            </div>
        </div>
    )
}
