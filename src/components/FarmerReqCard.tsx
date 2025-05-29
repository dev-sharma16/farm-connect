import React, { useState } from "react";

interface FarmerRequestCardProps {
  cropName: string;
  imageUrl: string;
  quantity: number;
  status: "pending" | "completed" | "not_completed";
  onStatusChange: (newStatus: string) => void;
  onDelete: () => void;
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

const FarmerReqCard: React.FC<FarmerRequestCardProps> = ({
  cropName,
  imageUrl,
  quantity,
  status,
  onStatusChange,
  onDelete,
}) => {
  const [selectedStatus, setSelectedStatus] = useState(status);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    if (selectedStatus !== status) {
      const confirmed = confirm("Are you sure you want to change the status?");
      if (confirmed) {
        onStatusChange(selectedStatus);
        setIsSubmitted(true);
      }
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 max-w-sm">
      <img src={imageUrl} alt={cropName} className="w-full h-40 object-cover rounded-md" />
      <h2 className="text-xl font-semibold mt-2">{cropName}</h2>
      <p className="text-gray-700">Quantity: {quantity} kg</p>

      <span className={`inline-block px-3 py-1 mt-2 text-sm font-medium rounded-full ${getStatusStyles(status)}`}>
        {status.replace("_", " ")}
      </span>

      {!isSubmitted ? (
        <div className="mt-4">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="not_completed">Not Completed</option>
          </select>

          {selectedStatus !== status && (
            <button
              onClick={handleSubmit}
              className="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Submit
            </button>
          )}
        </div>
      ) : (
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

export default FarmerReqCard;
