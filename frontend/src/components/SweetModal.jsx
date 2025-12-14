import React, { useState, useEffect } from 'react';

const SweetModal = ({ sweet, mode, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Cake',
    price: '',
    quantity: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isEditMode = mode === 'edit';

  useEffect(() => {
    if (isEditMode && sweet) {
      setFormData({
        name: sweet.name,
        category: sweet.category,
        price: sweet.price.toString(),
        quantity: sweet.quantity.toString()
      });
    } else {
      setFormData({
        name: '',
        category: 'Cake',
        price: '',
        quantity: ''
      });
    }
  }, [isEditMode, sweet, mode]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters long';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Price must be a positive number';
    }

    if (!formData.quantity || parseInt(formData.quantity) < 0) {
      newErrors.quantity = 'Quantity must be a non-negative number';
    }

    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear specific error when user starts typing
    if (error[name]) {
      setError(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const sweetData = {
        name: formData.name,
        category: formData.category,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity)
      };

      if (isEditMode) {
        await onSubmit(sweet._id, sweetData);
      } else {
        await onSubmit(sweetData);
      }
      
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'An error occurred');
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return;
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 animate-slide-up">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEditMode ? `Edit ${sweet.name}` : 'Add New Sweet'}
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

        {/* Error Message */}
        {error && (
          <div className="mb-4">
            <div className="error-message">
              <span className="flex-shrink-0">{error}</span>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Sweet Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className="input-field"
              placeholder="Enter sweet name"
              disabled={loading}
            />
            {error.name && (
              <p className="mt-2 text-sm text-red-600" role="alert">
                {error.name}
              </p>
            )}
          </div>

          {/* Category Field */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="input-field"
              disabled={loading}
            >
              <option value="">Select a category</option>
              <option value="Cake">Cake</option>
              <option value="Cookie">Cookie</option>
              <option value="Candy">Candy</option>
              <option value="Ice Cream">Ice Cream</option>
              <option value="Pie">Pie</option>
              <option value="Pastry">Pastry</option>
              <option value="Chocolate">Chocolate</option>
              <option value="Other">Other</option>
            </select>
            {error.category && (
              <p className="mt-2 text-sm text-red-600" role="alert">
                {error.category}
              </p>
            )}
          </div>

          {/* Price Field */}
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
              Price ($)
            </label>
            <input
              id="price"
              name="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              className="input-field"
              placeholder="0.00"
              disabled={loading}
            />
            {error.price && (
              <p className="mt-2 text-sm text-red-600" role="alert">
                {error.price}
              </p>
            )}
          </div>

          {/* Quantity Field */}
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
              Quantity
            </label>
            <input
              id="quantity"
              name="quantity"
              type="number"
              value={formData.quantity}
              onChange={handleChange}
              className="input-field"
              placeholder="0"
              disabled={loading}
            />
            {error.quantity && (
              <p className="mt-2 text-sm text-red-600" role="alert">
                {error.quantity}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="btn-secondary flex-1"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="small" />
                  <span className="ml-2">
                    {isEditMode ? 'Updating...' : 'Adding...'}
                  </span>
                </>
              ) : (
                isEditMode ? 'Update Sweet' : 'Add Sweet'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SweetModal;
