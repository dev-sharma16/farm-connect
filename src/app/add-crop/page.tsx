"use client";

import { useForm } from "react-hook-form";
import Input from "@/components/Input";
import { authService } from "@/appwrite/authService";
import { crudService } from "@/appwrite/crudService";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import {STATES_AND_CITIES} from "@/constants/locationData"

type FormData = {
  name: string,
  availability: number,
  price: number,
  state: string,
  city: string,
}


export default function addCrop(){
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: {errors}
    } = useForm<FormData>()
    
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [loading, setloading] = useState(false);
    const [availableCities, setAvailableCities] = useState<string[]>([]);
    
    const selectedState = watch("state");

    useEffect(()=>{
        if (selectedState) {
            const stateData  = STATES_AND_CITIES.find((item)=> item.state === selectedState); //TODO: why filter is not used ..?

            if (stateData) {
               setAvailableCities(stateData.cities)    
               setValue("city", "");
            }
        }

    },[selectedState, setValue])

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) =>{
        const file = e.target.files?.[0];
        if(file){
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const router = useRouter();
    const onSubmit = async (data: FormData) => {
        try {
            setloading(true);

            if (!imageFile) {
                alert("Please upload an image..!");
                return ;
            }
            
            const user = await authService.getCurrentUser();
            const userId = user?.$id;
            const userName = user?.name;
            
            const uploadImage = await crudService.uploadCropImage(imageFile);
            const imageId = uploadImage?.$id;

            if (!imageId) {
                alert("Image upload is failed..!");
                return;
            }

            const createdCrop = await crudService.createCrop({
                name: data.name,
                availability: Number(data.availability),
                price: Number(data.price),
                imageId: imageId!,
                userId: userId!,
                userName: userName!,
                state: data.state,
                city: data.city
            });

            if (createdCrop) {
                const confirmed = window.confirm("Crop has been uploaded! Click OK to go to dashbord.")

                reset();
                setImageFile(null);
                setImagePreview(null);

                if (confirmed) {
                  router.push("/dashboard-farmer");
                }

            }else {
                alert("Posting failed..!")
            }

            
        } catch (error: any) {
            console.log("Error in creating the post : ",error );
        } finally{
            setloading(false);
        }
    }

    return(
        <div className="max-w-lg mx-auto mt-22 bg-white rounded shadow-md px-4 py-8">
            <h2 className="text-2xl font-bold mb-4 w-full text-center">Add New Crop</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Input
                  label="Crop name"
                  {...register("name", {required: "Crop name is required"})}
                  error={errors.name?.message}
                />

                <Input
                  label="Availability (in kg)"
                  type="number"
                  {...register("availability", {required: "Crop name is required"})}
                  error={errors.name?.message}
                />

                <Input
                  label="Price (₹ per kg)"
                  type="number"
                  {...register("price", {required: "Crop name is required"})}
                  error={errors.name?.message}
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

                {/* Image Upload */}
                <div className="mb-6">
                    <label className="block mb-1 text-sm font-semibold text-gray-700">
                        Select Image<span className="text-red-500">*</span>
                    </label>

                    <div className="flex items-center space-x-4">
                        <label
                          htmlFor="imageUpload"
                          className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded shadow-sm transition duration-150"
                        >
                          Choose Image
                        </label>

                        <input 
                           id="imageUpload"
                           type="file" 
                           accept="image/*" 
                           onChange={handleImageChange} 
                           className="hidden"
                        />

                        <span className="text-sm text-gray-600">
                          {imageFile ? imageFile.name : "No file selected"}
                        </span>
                    </div>
                </div>

                {/*Image Preview*/}
                {imagePreview && ( 
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Image Preview
                        </label>
                        <div className="relative inline-block">
                            <img 
                              src={imagePreview} 
                              alt="Selected image preview" 
                              className="w-40 h-40 object-cover rounded border border-gray-300 shadow-sm"
                            />
    
                            <button
                               type="button"
                               onClick={() => {
                                 setImageFile(null);
                                 setImagePreview(null);
                               }}
                               className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white rounded-full px-2 py-1 text-xs"
                            >
                               ✕
                            </button>
                        </div>
                    </div>
                )}

                <button 
                   type="submit" 
                   className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded"
                > 
                   {loading ? "Posting.." : "Add Crop"}
                </button>
            </form>
        </div>
    )
}


