"use client";

import { crudService } from "@/appwrite/crudService";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ConsumerCardComp from "@/components/ConsumerCardComp";
import { STATES_AND_CITIES } from "@/constants/locationData"


export default function dashboardConsumer(){

    const [loading, setLoading] = useState(false);
    const [posts, setPosts] = useState([]);

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCity, setSelectedCity] = useState("");
    const [priceRange, setPriceRange] = useState([0, 1000]); 
    const [filteredPost, setFilterdCrops] = useState([]);

    const router = useRouter();

    useEffect(()=>{
      const fetchPosts = async () => {
        try {
            setLoading(true);
            const postData = await crudService.getCrops();
            if (postData) {
              setPosts(postData);

              // Set initial price range based on actual data
              if (postData.length > 0) {
                  const prices = postData.map(post => parseFloat(post.price) || 0);
                  const minPrice = Math.min(...prices);
                  const maxPrice = Math.max(...prices);
                  setPriceRange([minPrice, maxPrice]);
              }
            }
        } catch (error:any) {
           console.log("Error in loading the Posts : ", error);
        } finally{
            setLoading(false);
        }
      };

      fetchPosts();

    },[])

    useEffect(()=>{
      let filtered = posts;

      if(searchQuery){
        filtered = filtered.filter(post =>
          post.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      if(selectedCity){
        filtered = filtered.filter(post =>
          post.city && post.city.toLowerCase() === selectedCity.toLowerCase()
        );
      }

      filtered = filtered.filter(post =>{
        const price = parseFloat(post.price) || 0;
        return price >= priceRange[0] && price <=priceRange[1];
      })

      setFilterdCrops(filtered);
      
    },[searchQuery,selectedCity,priceRange, posts])

    const getAllCities = () => {
      const cities = [];
      STATES_AND_CITIES.forEach(stateData => {
        stateData.cities.forEach(city => {
          cities.push({ city, state: stateData.state });
        });
      });
      return cities;
    };

    const handleResetFilters = () => {
      setSearchQuery("");
      setSelectedCity("");
      
      if (posts.length > 0) {
        const prices = posts.map(post => parseFloat(post.price) || 0);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        setPriceRange([minPrice, maxPrice]);
      }
    };

    if (loading) {
        return (
          <div className="h-screen w-full flex items-center justify-center bg-[#f8fff2]">
              <div className="text-lg">Loading posts...</div>
          </div>
        );
    }

    return(
        <div className="min-h-[calc(100vh-64px)] w-full bg-[#b0dcb9] flex items-start py-20 ">{/*mt-18*/}
            {/* Left Sidebar - Filters */}
            <div className="w-[20%] bg-white p-4 border-r border-gray-200 flex flex-col gap-4 h-90 ml-5 mt-5 rounded-3xl shadow-md ">
              <input
                type="text"
                placeholder="Search for crop"
                className="border p-2 rounded-2xl text-sm"
                onChange={(e)=> setSearchQuery(e.target.value)}
              />
              <div className="font-semibold">Filter</div>

              {/* City dropdown */}
              <select
                className="border p-2 rounded-2xl text-sm"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
              >
                <option value="">Select City</option>
                {getAllCities().map((cityData, index) => (
                  <option key={index} value={cityData.city}>
                    {cityData.city}, {cityData.state}
                  </option>
                ))}
              </select>

              {/* Price range section */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">
                  Price Range (₹ per kg): ₹{priceRange[0]} - ₹{priceRange[1]}
                </label>
                
                {/* Min price slider */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs">Min Price</label>
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    step="10"
                    value={priceRange[0]}
                    onChange={(e) => {
                      const newMin = parseInt(e.target.value);
                      
                      if (newMin <= priceRange[1]) {
                        setPriceRange([newMin, priceRange[1]]);
                      }
                    }}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>

                {/* Max price slider */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs">Max Price</label>
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    step="10"
                    value={priceRange[1]}
                    onChange={(e) => {
                      const newMax = parseInt(e.target.value);
                      
                      if (newMax >= priceRange[0]) {
                        setPriceRange([priceRange[0], newMax]);
                      }
                    }}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
              </div>

              {/* Reset button */}
              <button 
                className="bg-green-700 text-white rounded-2xl px-4 py-2 hover:bg-green-800 text-sm"
                onClick={handleResetFilters}
              >
                Reset
              </button>

              {/* Filter results count */}
              <div className="text-xs text-gray-600 mx-4 text-center" >
                Showing {filteredPost.length} of {posts.length} results
              </div>
            </div>

            {/* Middle Section - Cards */}
            <div className="w-[60%] p-4 overflow-y-auto h-screen space-y-4">
                { filteredPost.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"> 
                    {filteredPost.map((post) => (
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
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-lg text-gray-600 mb-2">No results found</div>
                      <div className="text-sm text-gray-500">Try adjusting your filters or search criteria</div>
                    </div>
                  </div>
                )}
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