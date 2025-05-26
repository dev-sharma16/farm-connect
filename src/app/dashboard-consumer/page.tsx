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
// mt-18
    return(
        <div className="min-h-[calc(100vh-64px)] w-full bg-[#b0dcb9] flex items-start py-20 ">
            {/* Left Sidebar - Filters */}
            <div className="w-[20%] bg-white p-4 border-r border-gray-200 flex flex-col gap-4 h-70 ml-5 mt-5 rounded-3xl shadow-md ">
              <input
                type="text"
                placeholder="Search for crop"
                className="border p-2 rounded-2xl text-sm"
              />
              <div className="font-semibold">Filter</div>
              <input
                type="text"
                placeholder="Select City"
                className="border p-2 rounded-2xl text-sm"
              />
              <input
                type="number"
                placeholder="Select Price"
                className="border p-2 rounded-2xl text-sm"
              />
              <button className="bg-green-700 text-white rounded-2xl px-4 py-2 hover:bg-green-800 text-sm">
                Reset
              </button>
            </div>

            {/* Middle Section - Cards */}
            <div className="w-[60%] p-4 overflow-y-auto h-screen space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {posts.map((post) => (
                  <ConsumerCardComp
                    key={post.$id}
                    imageUrl={post.imageUrl}
                    name={post.name}
                    price={post.price}
                    sellerName={post.userName} 
                    onClick={()=> router.push(`/crop-details?postId=${post.$id}`)}
                  />
                ))}
              </div>
            </div>

            {/* Right Sidebar - Profile */}
            <div className="w-[20%] bg-white p-4 border-l border-gray-200 flex flex-col items-center text-center gap-3 h-70 mr-5 mt-5 rounded-3xl shadow-md">
              <div className="w-20 h-20 rounded-full bg-green-600 flex items-center justify-center text-white text-xl">
                  Pic
              </div>
              <div className="text-lg font-semibold">User Name</div>
              <div className="text-sm text-gray-600">Other props of user</div>
            </div>
        </div>
    )
}