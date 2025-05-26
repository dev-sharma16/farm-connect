"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { crudService } from "@/appwrite/crudService";

export default function CropDetailPage() {
  const searchParams = useSearchParams();
  const postId = searchParams.get("postId");

  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPostDetails = async () => {
      if (!postId) return;

      try {
        const result = await crudService.getCropById(postId);
        setPost(result);
      } catch (error) {
        console.error("Error fetching post details", error);
      }
    };

    fetchPostDetails();
  }, [postId]);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl font-semibold">
        Loading crop details...
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#b0dcb9] flex items-center justify-center px-4 mt-16">
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col md:flex-row scale-[0.85] md:scale-100">
          
          {/* Image Section */}
          <div className="md:w-1/2 w-full bg-gray-100 flex justify-center items-center p-6">
              <img
                src={post.postImageUrl}
                alt={post.name}
                className="rounded-xl max-h-[350px] w-full object-contain"
              />
          </div>
      
          {/* Info Section */}
          <div className="md:w-1/2 w-full p-6 flex flex-col justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-green-800 mb-3">{post.name}</h1>
                  <p className="text-xl text-gray-800 font-semibold mb-1">₹ {post.price} / kg</p>
                  <p className="text-sm text-gray-500 mb-4">Available stock: {post.availability} kg</p>
        
                  <div className="space-y-2 mb-6">
                       <p><span className="font-semibold">Seller Name:</span> {post.userName}</p>
                       <p><span className="font-semibold">Location:</span> {post.city}, {post.state}</p>
                       <p><span className="font-semibold">Listed By:</span> Farmer</p>
                  </div>
                </div>
      
                {/* Dummy Contact Button */}
                <button
                  className="bg-green-700 hover:bg-green-800 text-white py-3 rounded-xl text-center text-lg font-medium transition-all duration-200"
                  onClick={() => alert("Contact Farmer feature coming soon!")}
                >
                  Contact Farmer
                </button>
          </div>
        </div>
    </div>

  );
}
