import React from 'react';

const SweetCard = ({ sweet, onPurchase, onEdit, onDelete, isAdmin }) => {
  return (
    <div className="card hover:shadow-lg transition-shadow">
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{sweet.name}</h3>
        <p className="text-sm text-gray-500 mb-2">{sweet.category}</p>
        {sweet.description && (
          <p className="text-sm text-gray-600 mb-3">{sweet.description}</p>
        )}
        <div className="flex justify-between items-center mb-3">
          <span className="text-lg font-bold text-primary-600">${sweet.price?.toFixed(2)}</span>
          <span className={`text-sm ${sweet.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {sweet.quantity > 0 ? `${sweet.quantity} in stock` : 'Out of stock'}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onPurchase(sweet)}
            disabled={sweet.quantity === 0}
            className="btn-primary flex-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Purchase
          </button>
          {isAdmin && (
            <>
              <button
                onClick={() => onEdit(sweet)}
                className="btn-secondary text-sm px-3"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(sweet)}
                className="btn-secondary text-sm px-3 text-red-600 hover:text-red-700"
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SweetCard;
