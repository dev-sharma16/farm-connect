import React from "react";

interface ConsumerRequestCardProps {
  cropName: string;
  imageUrl: string;
  quantity: number;
  farmerName: string;
  status: "pending" | "completed" | "not_completed";
  onDelete?: () => void;
}

const getStatusStyles = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-200 text-yellow-800";
    case "completed":
      return "bg-green-200 text-green-800";
    case "not_completed":
      return "bg-red-200 text-red-800";
    default:
      return "";
  }
};

const ConsumerReqCard: React.FC<ConsumerRequestCardProps> = ({
  cropName,
  imageUrl,
  quantity,
  farmerName,
  status,
  onDelete,
}) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 max-w-sm">
      <img src={imageUrl} alt={cropName} className="w-full h-40 object-cover rounded-md" />
      <h2 className="text-xl font-semibold mt-2">{cropName}</h2>
      <p className="text-gray-700">Quantity: {quantity} kg</p>
      <p className="text-gray-600">Farmer: {farmerName}</p>

      <span className={`inline-block px-3 py-1 mt-2 text-sm font-medium rounded-full ${getStatusStyles(status)}`}>
        {status.replace("_", " ")}
      </span>

      {status === "pending" && (
        <button
          onClick={onDelete}
          className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Delete Request
        </button>
      )}
    </div>
  );
};

export default ConsumerReqCard;
