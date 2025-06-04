import Image from "next/image";

type FarmerCardProps = {
  image: string;         
  name: string;          
  price: number | string;
  availability: number | string;
  postId: string;
  imageId: string; 
  onEdit:(postId: string,imageId: string) => void;
  onDelete:(postId: string,imageId: string) => void;
};

export default function FarmerCard({
  image,
  name,
  price,
  availability,
  postId,
  imageId,
  onEdit,
  onDelete,
}: FarmerCardProps) {
  return (
        <div className="bg-white rounded-2xl shadow-md w-[300px] p-4 flex flex-col items-center gap-4">
          <div className="w-full h-[180px] bg-gray-300 rounded-xl overflow-hidden flex justify-center items-center">
            {image ? (
                // <Image
                //    src={image}
                //    alt={name}
                //    width={300}
                //    height={180}
                //    className="object-cover w-full h-full"
                // />

                <img
                   src={image}
                   alt={name}
                   width={300}
                   height={180}
                   className="object-cover w-full h-full"
                />
            ) : (
              <span className="text-gray-700">Placeholder for crop image</span>
            )}
          </div>
    
          <h2 className="text-xl font-semibold">{name}</h2>
    
          <div className="flex justify-between w-full px-4 text-base">
            <p>
              <span className="font-semibold">Price:</span> ₹{price}
            </p>
            <p>
              <span className="font-semibold">Quantity:</span> {availability}kg
            </p>
          </div>
    
          <div className="flex gap-4 mt-2">
            <button
              onClick={() => onEdit(postId,imageId)}
              className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg"
            >
              Edit Post
            </button>
            <button
              onClick={() => onDelete(postId, imageId)}
              className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg"
            >
              Delete
            </button>
          </div>
        </div>
    );
}
