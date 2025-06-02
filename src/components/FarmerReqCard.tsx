import React, { useState } from "react";

interface FarmerRequestCardProps {
  cropName: string;
  imageUrl: string;
  quantity: number;
  status: "pending" | "completed" | "not-completed";
  // onStatusChange: (newStatus: string) => void;
  onDelete: () => void;
  onSubmitStatus?: (newStatus: string) => void;
}

const getStatusStyles = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-200 text-yellow-800";
    case "completed":
      return "bg-green-200 text-green-800";
    case "not-completed":
      return "bg-red-200 text-red-800";
    default:
      return "";
  }
};

const getStatusDisplayText = (status: string) => {
  switch (status) {
    case "not-completed":
      return "Not Completed";
    case "completed":
      return "Completed";
    case "pending":
      return "Pending";
    default:
      return status;
  }
};

const FarmerReqCard: React.FC<FarmerRequestCardProps> = ({
  cropName,
  imageUrl,
  quantity,
  status,
  // onStatusChange,
  onDelete,
  onSubmitStatus
}) => {

  const [selectedStatus, setSelectedStatus] = useState(status);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isStatusFinalized = status === "completed" || status === "not-completed";

  const handleSubmit = async () => {
    if (selectedStatus !== status && !isSubmitting) {
      const confirmed = confirm(`Are you sure you want to change the status  from "${getStatusDisplayText(status)}" to "${getStatusDisplayText(selectedStatus)}`);
      if (confirmed) {
        setIsSubmitting(true);
        try {
          await onSubmitStatus(selectedStatus);
        } catch (error) {
          console.error("Error updating status:", error);
          setSelectedStatus(status);
        } finally {
          setIsSubmitting(false);
        }
      }
    }
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(e.target.value);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 max-w-sm">
      <img src={imageUrl} alt={cropName} className="w-full h-40 object-cover rounded-md" />
      <h2 className="text-xl font-semibold mt-2">{cropName}</h2>
      <p className="text-gray-700">Quantity: {quantity} kg</p>

      <span className={`inline-block px-3 py-1 mt-2 text-sm font-medium rounded-full ${getStatusStyles(status)}`}>
        {getStatusDisplayText(status)}
      </span>

      {!isStatusFinalized ? (
        <div className="mt-4">
          <select
            id="status-select"
            value={selectedStatus}
            onChange={handleStatusChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isSubmitting}
          >
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="not-completed">Not Completed</option>
          </select>

          {selectedStatus !== status && (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`w-full px-4 py-2 text-white rounded-md transition-colors ${
                isSubmitting 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {isSubmitting ? 'Updating...' : 'Update Status'}
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
