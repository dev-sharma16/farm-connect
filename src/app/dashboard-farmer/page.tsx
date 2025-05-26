"use client"

import FarmerCard from "@/components/FarmerCardComp";
import { authService } from "@/appwrite/authService";
import { crudService } from "@/appwrite/crudService";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
    const router = useRouter();

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

    const handleEdit = async (postId: string , imageId: string) => {

        router.push(`/edit-crop?postId=${postId}`);
    
    };
    
    const handleDelete = async (postId: string, imageId: string) => {

        try {
            const deletePost = await crudService.deleteCrops(postId);
            const deletePostImg = await crudService.deleteCropImage(imageId);

            if(deletePost && deletePostImg){
                setPosts(prev => prev.filter(post => post.$id !== postId))
                alert("Post is deleted..!")
            }
        } catch (error:any) {
            console.log("Error in deleting the post : ",error);        
        }
        
    };

    if (loading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-[#f8fff2]">
                <div className="text-lg">Loading your crops...</div>
            </div>
        );
    }
    
    return(
        <div className="h-screen w-full flex items-center justify-center bg-[#b0dcb9] px-4 gap-5.5 flex-wrap">
            {posts.map((post)=>(
                <FarmerCard
                  key={post.$id}    
                  image={post.imageUrl}   
                  name={post.name}   
                  price={post.price}    
                  availability={post.availability}
                  postId={post.$id}
                  imageId={post.imageId}
                  onEdit={(postId,imageId) => handleEdit(postId, imageId)}
                  onDelete={(postId,imageId) => handleDelete(postId,imageId)}
                />
            ))}
        </div>
    )
}