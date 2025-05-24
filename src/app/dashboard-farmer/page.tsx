"use client"

import FarmerCard from "@/components/FarmerCardComp";
import { authService } from "@/appwrite/authService";
import { crudService } from "@/appwrite/crudService";
import { useState, useEffect } from "react";
// import { appwrite } from "@/appwrite/appwrite";
// import { Query } from "appwrite";
// import { appwrite } from "@/appwrite/appwrite";

// export type CropPost = {
//      name: string;
//      price: number;
//      state: string;
//      city: string;
//      imageId: string;
//      userId: string;
//      availability: string;
//      [key: string]: any;
// }

export default function dashboardFarmer(){
    
    // const [posts, setPosts] = useState<CropPost[]>([]);
    
    const [posts, setPosts] = useState([]);
    const [userId, setUserId] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        const fetchCrops = async () => {
            try {
                const currentUser = await authService.getCurrentUser();
                if (currentUser) {
                    const crntUserId = currentUser.$id;
                    setUserId(crntUserId);

                    const crops = await crudService.getCropsByUser(crntUserId);
                    if (crops) {
                        setPosts(crops);
                    }
                }
                
            } catch (error:any) {
                console.log("Error in fetching the crop databse : ",error);
            } finally {
                setLoading(false);
            }
        }

        fetchCrops();

    },[])

    const handleEdit = () => {
        // TODO: implement a edit post function
      console.log("Edit clicked");
    };
    
    const handleDelete = () => {
        // TODO: implement a delete function
      console.log("Delete clicked");
    };

    if (loading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-[#f8fff2]">
                <div className="text-lg">Loading your crops...</div>
            </div>
        );
    }


    
    return(
        <div className="h-screen w-full flex items-center justify-center bg-[#f8fff2] px-4 gap-5.5">
            {posts.map((post)=>(
                <FarmerCard
                  key={post.$id}    
                  image={post.imageUrl}   
                  name={post.name}    
                  price={post.price}    
                  availability={post.availability}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
            ))}
        </div>
    )
}