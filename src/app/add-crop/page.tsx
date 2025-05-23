"use client";

import { useForm } from "react-hook-form";
import Input from "@/components/Input";
import { authService } from "@/appwrite/authService";
import { crudService } from "@/appwrite/crudService";
import { useDispatch, UseDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import {STATES_AND_CITIES} from "@/constants/locationData"
import { error } from "console";

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
        formState: {errors}
    } = useForm<FormData>()
    
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [loading, setloading] = useState(false)

    // useEffect(()=>{
    //     const getUser = async ()=>{
    //         const user  = await authService.getCurrentUser();
    //         if (user) {
    //             setUserId(user.$id)
    //         } 
    //     };
    //     getUser();
    // },[]);

    // const handleInputChanges = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>)=>{
    //     const {name, value} = e.target;
    //     setFormData(prev=>({...prev,[name]: value}));
    // };

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) =>{
        const file = e.target.files?.[0];
        if(file){
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    
    const onSubmit = async (data: FormData) => {
        try {
            
            if (!imageFile) {
                alert("Please upload an image..!");
                return ;
            }
            
            const user = await authService.getCurrentUser();
            const userId = user?.$id;
            
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
                state: data.state,
                city: data.city
            });

            if (createdCrop) {
                alert("Crop posted succefully..!")
            }else {
                alert("Posting failed..!")
            }

            reset();
            setImageFile(null);
            setImagePreview(null);
            
        } catch (error: any) {
            console.log("Error in creating the post : ",error );
        }
    }

    return(
        <div className="max-w-md mx-auto mt-8">
            <h2 className="text-2xl font-bold mb-4">Add New Crop</h2>
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

                {/* <Input>TODO: add select field for state</Input> */}

                {/* <Input>TODO: add select field for cities based on the state</Input> */}

                {/* Image Upload */}
                <div className="mb-4">
                    <label className="block mb-1 font-medium ">Select Image</label>
                    <input type="file" accept="image/*" onChange={handleImageChange}/>
                </div>

                {/*Image Preview*/}
                {imagePreview && (
                    <div className="mb-4">
                        <img src={imagePreview} alt="Selected image preview" className="w-40 h-40 object-cover rounded"/>
                    </div>
                )}

                <button 
                   type="submit" 
                   className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                > 
                   Add Crop
                </button>

            </form>
        </div>
    )
}


