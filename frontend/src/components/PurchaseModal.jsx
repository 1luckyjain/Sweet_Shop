import React, { useState } from 'react';

const PurchaseModal = ({ sweet, onSubmit, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (quantity <= 0) {
      setError('Please enter a valid quantity');
      return;
    }

    if (quantity > sweet.quantity) {
      setError(`Only ${sweet.quantity} available`);
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onSubmit(quantity);
      setQuantity(1);
      onClose();
    } catch (err) {
      setError(err.message || 'Purchase failed');
      setLoading(false);
    }
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    if (value > 0) {
      setQuantity(value);
      setError('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  const handleClose = () => {
    if (loading) return;
    onClose();
  };

  const totalPrice = (quantity * sweet.price).toFixed(2);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 animate-slide-up">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Purchase {sweet.name}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Sweet Info */}
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <img
              src={`data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="%23A3A4" stroke="%2373718"><path d="M12 2L2 7v10c0 1.1.9.9.9 10 10 10s9.9 4 10-10 4-10l10 5v11c0 1.1.9.9.9 10-10 10H12c-1.1 0-2-2 0 0z"/></svg>')}`}
              alt={sweet.name}
              className="w-16 h-16 rounded-lg object-cover mr-4"
            />
            <div>
              <h3 className="text-lg font-medium text-gray-900">{sweet.name}</h3>
              <p className="text-sm text-gray-600">{sweet.category}</p>
              <p className="text-sm text-gray-500">In stock: {sweet.quantity}</p>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              <span className="font-medium text-gray-900">Price:</span> ${sweet.price} each
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium text-gray-900">Available:</span> {sweet.quantity} items
            </p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4">
            <div className="error-message">
              <span className="flex-shrink-0">{error}</span>
            </div>
          </div>
        )}

        {/* Quantity Input */}
        <div className="mb-6">
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
            Quantity
          </label>
          <input
            id="quantity"
            type="number"
            min="1"
            max={sweet.quantity}
            value={quantity}
            onChange={handleQuantityChange}
            onKeyPress={handleKeyPress}
            className="input-field"
            placeholder="Enter quantity"
            disabled={loading}
          />
        </div>

        {/* Order Summary */}
        <div className="mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Order Summary</h4>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Quantity:</span>
                <span className="font-medium text-gray-900">{quantity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Unit Price:</span>
                <span className="font-medium text-gray-900">${sweet.price}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Price:</span>
                <span className="font-medium text-gray-900">${totalPrice}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleClose}
            className="btn-secondary flex-1"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="btn-primary flex-1"
            disabled={loading}
          >
            {loading ? (
              <>
                <LoadingSpinner size="small" />
                <span className="ml-2">Processing...</span>
              </>
            ) : (
              'Confirm Purchase'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PurchaseModal;
