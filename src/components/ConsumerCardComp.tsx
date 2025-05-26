// import Image from "next/image";
import React from "react";

type CropCardProps = {
  name: string;
  price?: number; // optional, can be undefined or null
  sellerName: string;
  imageUrl: string;
};

const ConsumerCardComp: React.FC<CropCardProps> = ({ name, price, sellerName, imageUrl }) => {
  return (
    <div className="flex max-w-md w-full bg-white rounded-3xl shadow-md overflow-hidden p-4 gap-4 items-center">
      {/* Crop Image */}
      <div className="w-36 h-36 bg-gray-200 rounded-xl overflow-hidden flex-shrink-0">
        {/* <Image
          src={imageUrl}
          alt={name}
          width={144}
          height={144}
          className="w-full h-full object-cover"
        /> */}

        <img
          src={imageUrl}
          alt={name}
          width={144}
          height={144}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Info Section */}
      <div className="flex flex-col justify-between flex-1 h-full">
        <h2 className="text-xl font-semibold text-black truncate">{name}</h2>
        <p className="text-lg text-gray-800 mt-1">
          ₹ {price ? price : "--"} <span className="text-sm text-gray-600">(kg)</span>
        </p>
        <p className="text-sm text-gray-600 mt-2 truncate">sold by {sellerName}</p>
      </div>
    </div>
  );
};

export default ConsumerCardComp;
