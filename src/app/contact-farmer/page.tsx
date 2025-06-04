"use client";

import { crudService } from "@/appwrite/crudService";
import Input from "@/components/Input";
import { STATES_AND_CITIES } from "@/constants/locationData";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { appwrite } from "@/appwrite/appwrite";
import { Query } from "appwrite";

type FormData = {
  name: string,
  phoneNumber: string,
  quantity: number,
  state: string,
  city: string,
}

export default function contactFarmer(){
    const {
      register,
      handleSubmit,
      reset,
      setValue,
      watch,
      formState: {errors}
    } = useForm<FormData>();

    const [loading, setLoading] = useState(false);
    const [availableCities, setAvailableCities] = useState<string[]>([]);
    const [post, setPost] = useState([]);
    const [farmerDetails, setFarmerDetails] = useState<{
      cropName : string,
      farmerName : string,
      farmerPhoneNumber: string,
    } | null>(null);

    const [farmerId, setFarmerId] = useState("");
    const [user, setUser] = useState("");

    const searchParams = useSearchParams();
    const postId = searchParams.get("postId");

    const selectedState = watch("state");

    const router = useRouter(); 

    useEffect(()=>{
      if (selectedState) {
        const stateData  = STATES_AND_CITIES.find((item)=> item.state === selectedState); 
        
        if (stateData) {
           setAvailableCities(stateData.cities)    
           setValue("city", "");
        }
      }

    },[selectedState, setValue])    

    useEffect(()=>{
      const fetchPostAndFarmerDetails = async ()=>{
        const post  = await crudService.getCropById(postId!);
        const {name: cropName, userName: farmerName, userId} = post;

        setFarmerId(userId);

        const farmerDetailsRes = await appwrite.databases.listDocuments(
          process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
          process.env.NEXT_PUBLIC_APPWRITE_USER_ROLE_COLLECTION_ID!,
          [Query.equal("userId", userId)]
        );
        
        const { phoneNumber } = farmerDetailsRes.documents[0];

        setFarmerDetails({
          cropName,
          farmerName,
          farmerPhoneNumber: phoneNumber,
        })

        const crrntUser = await appwrite.account.get();
        if(crrntUser){
          setUser(crrntUser.$id);
        }
      }

      fetchPostAndFarmerDetails();

    },[])

    const onSubmit = async (data: FormData) => {
      try {
        console.log('Form submitted:', data);
        setLoading(true);

        if(!farmerDetails) return ; 

        const payload={
          consumerName: data.name,
          consumerPhone: data.phoneNumber,
          quantity: data.quantity,
          cropName: farmerDetails.cropName,
          farmerName: farmerDetails.farmerName,
          farmerPhone: farmerDetails.farmerPhoneNumber,
          location: `${data.city}, ${data.state}`,
        }

        if(payload){
          const databaseID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
          const requestsCollectionID= process.env.NEXT_PUBLIC_APPWRITE_REQUESTS_COLLECTION_ID; 
          const bucketID = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID;

          const post = await crudService.getCropById(postId!)

          const imageUrl = post?.postImageUrl;
          
          try {
            await appwrite.databases.createDocument(
              databaseID!,
              requestsCollectionID!,
              appwrite.ID.unique(),
              {
                farmerId: farmerId,
                farmerName: farmerDetails.farmerName,
                postId: postId,
                customerId: user,
                imageUrl: imageUrl,
                cropName: farmerDetails.cropName,
                status: "pending",
                quantity: data.quantity,
                location: `${data.city}, ${data.state}`,
                consumerPhoneNumber: `+91${data.phoneNumber}`,
                consumerName: data.name,
              }
            )
          } catch (error:any) {
            console.log("Error in saving the request : ",error);
          }
        }

        try{
          // TODO: tempriarly disabled the message service for testing
          const response = await fetch("./api/send-sms",{
            method: 'POST',
            headers: {
              "Content-Type" : "application/json"
            },
            body:JSON.stringify(payload),
          });

          const result  = await response.json();
          if (response.ok){
            alert("Request sent successfully..!, wait for farmer response");
            reset();
            router.push("/dashboard-consumer");
          }else{
            alert(`Failed to submit request..!, try again later ${result.message}`);
          }
        }catch(error: any){
          console.error("Error sending SMS:", error);
          alert("Something went wrong!");
        }
        
      } catch (error:any) {
        console.error("Error creating account : ", error);
      } finally{
        setLoading(false);
      }
    }

    return (
      <div className="min-h-screen bg-[#b0dcb9] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white shadow-md rounded-xl p-8 border border-green-200 mt-10">
          <h1 className="text-3xl font-bold text-green-900 mb-6 text-center">Contact form</h1>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
  
            <Input
              label="Name"
              type="text"
              placeholder="ex Alex"
              {...register('name', { required: 'Name is required' })}
              error={errors.name?.message}
            />
  
            <Input
              label="Phone-no"
              type="phoneNumber"
              placeholder="+91 ----------"
              {...register('phoneNumber', { required: 'Phone number is required' })}
              error={errors.phoneNumber?.message}
            />
      
            <Input
              label="Quantity"
              type="quantity"
              placeholder="-- kg"
              {...register('quantity', { required: 'Quantity is required' })}
              error={errors.quantity?.message}
            />

            {/* State selection */}
            <div className="mb-4">
                <label className="block mb-1 font-medium">State</label>
                <select 
                   {...register("state",{required: "Please select the State"})}
                   className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500"
                >
                    <option value="">Select State</option>
                    {STATES_AND_CITIES.map((item)=>(
                        <option key={item.state} value={item.state}>{item.state}</option>
                    ))};
                </select>
                {errors.state && 
                   <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>
                }
            </div>

            {/* City Selection */}
            <div className="mb-4">
                <label className="block mb-1 font-medium">City</label>
                <select 
                  {...register("city", {required : "Please select the city"})}
                  disabled={!selectedState || availableCities.length === 0}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">
                      {!selectedState ? "First select a state" : "Select City"}
                  </option>
                  {availableCities.map((city)=>(
                    <option key={city} value={city}>
                        {city}
                    </option>
                  ))};
                </select>
                {errors.city && 
                  <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
                }
            </div>

            <button
              type="submit"
              className="w-full bg-green-900 text-white font-semibold py-2 px-4 rounded hover:bg-green-800 transition-colors"
            >
              {loading ? "Submiting request.." : "Submit"}
            </button>
          </form>
        </div>
      </div>
    )

}