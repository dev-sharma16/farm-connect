"use client";

import { crudService } from "@/appwrite/crudService";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ConsumerCardComp from "@/components/ConsumerCardComp";


export default function dashboardConsumer(){

    const [loading, setLoading] = useState(false);
    const [posts, setPosts] = useState([]);

    // TODO: add a click function on posts when user click on the post it redirects to the details page 
    const router = useRouter();

    useEffect(()=>{
        const fetchPosts = async () => {
            try {
                setLoading(true);
                const postData = await crudService.getCrops();
                if (postData) {
                    setPosts(postData);
                }
            } catch (error:any) {
                console.log("Error in loading the Posts : ", error);
            } finally{
                setLoading(false);
            }
        };

        fetchPosts();

    },[])

    if (loading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-[#f8fff2]">
                <div className="text-lg">Loading posts...</div>
            </div>
        );
    }



    return(
        <div className="h-screen w-full flex items-center justify-center bg-[#f8fff2] px-4 gap-5.5 flex-wrap">
            {posts.map((post)=>(
                <ConsumerCardComp
                   key={post.$id}
                   imageUrl={post.imageUrl}
                   name={post.name}
                   price={post.price}
                   sellerName={post.userName}
                />
            ))}
        </div>
    )
}