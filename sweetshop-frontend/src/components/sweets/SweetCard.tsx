import React from 'react';
import { SweetDto } from '../../types';

interface SweetCardProps {
  sweet: SweetDto;
  onEdit: (sweet: SweetDto) => void;
  onDelete: (id: number) => void;
  onRestock: (id: number, quantity: number) => void;
  onPurchase: (id: number, quantity: number) => void;
  userRole: string;
}

const SweetCard: React.FC<SweetCardProps> = ({
  sweet,
  onEdit,
  onDelete,
  onRestock,
  onPurchase,
  userRole
}) => {
  const isAdmin = userRole === 'ADMIN';

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{sweet.name}</h3>
      <p className="text-gray-600 mb-1">Category: {sweet.category}</p>
      <p className="text-gray-600 mb-1">Price: ${sweet.price.toFixed(2)}</p>
      <p className="text-gray-600 mb-4">Quantity: {sweet.quantity}</p>
      
      <div className="flex flex-wrap gap-2">
        {isAdmin ? (
          <>
            <button
              onClick={() => onEdit(sweet)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition duration-300"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(sweet.id)}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition duration-300"
            >
              Delete
            </button>
            <button
              onClick={() => onRestock(sweet.id, 10)}
              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm transition duration-300"
            >
              Restock
            </button>
          </>
        ) : (
          <button
            onClick={() => onPurchase(sweet.id, 1)}
            disabled={sweet.quantity === 0}
            className={`px-3 py-1 rounded text-sm transition duration-300 ${
              sweet.quantity === 0
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-purple-500 hover:bg-purple-600 text-white'
            }`}
          >
            {sweet.quantity === 0 ? 'Out of Stock' : 'Purchase'}
          </button>
        )}
      </div>
    </div>
  );
};

export default SweetCard;