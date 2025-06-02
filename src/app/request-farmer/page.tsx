"use client";

import { appwrite } from "@/appwrite/appwrite";
import { crudService } from "@/appwrite/crudService";
import FarmerReqCard from "@/components/FarmerReqCard";
import { request } from "http";
import { useEffect, useState } from "react";

export default function requestFarmer(){
    
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
    
    const updateRequestStatus = async(requestId: any, newStatus: any)=>{
        try {
            const updateRequest = await appwrite.databases.updateDocument(
                process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
                process.env.NEXT_PUBLIC_APPWRITE_REQUESTS_COLLECTION_ID!,
                requestId,
                {status: newStatus},
            );
            if(updateRequest){
                alert("Request status is updated..!");
                setRequests(prevRequests => 
                    prevRequests.map(request => 
                       request.$id === requestId 
                         ? {...request, status: newStatus}
                         : request 
                    )
                )
            }
            
        } catch (error:any) {
            console.log("Error in updating status : ",error);
            alert("Failed to update request status..!");    
        }
    }

    //  TODO: add amessge service for consumer when a farmer chnage the state therir two different messages for "completed" or "not completed"
    
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

    return(
        <div className="min-h-[calc(100vh-64px)] w-full bg-[#b0dcb9] flex items-start py-20">
            {requests.map((request, index)=>(
                <FarmerReqCard
                  key={request.$id || index}
                  cropName={request.cropName}
                  imageUrl={request.imageUrl}
                  quantity={request.quantity}
                  status={request.status}
                  onStatusChange={(newStatus)=> updateRequestStatus(request.$id, newStatus)}
                  onDelete={()=>handleDelete(request.$id)}
                ></FarmerReqCard>
            ))}
        </div>
    )
}
