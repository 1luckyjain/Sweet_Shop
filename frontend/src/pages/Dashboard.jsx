import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Alert from '../components/Alert';
import LoadingSpinner from '../components/LoadingSpinner';
import SweetCard from '../components/SweetCard';
import PurchaseModal from '../components/PurchaseModal';
import SweetModal from '../components/SweetModal';

const Dashboard = () => {
  const [sweets, setSweets] = useState([]);
  const [filteredSweets, setFilteredSweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: ''
  });
  const [selectedSweet, setSelectedSweet] = useState(null);
  const [modalType, setModalType] = useState(null); // 'purchase', 'add', 'edit'
  const [successMessage, setSuccessMessage] = useState('');

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Fetch sweets on component mount
  useEffect(() => {
    fetchSweets();
  }, []);

  // Filter sweets when search or filters change
  useEffect(() => {
    if (searchTerm || filters.category || filters.minPrice || filters.maxPrice) {
      searchSweets();
    } else {
      setFilteredSweets(sweets);
    }
  }, [searchTerm, filters, sweets]);

  const fetchSweets = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getAllSweets();
      setSweets(response.data.data);
      setFilteredSweets(response.data.data);
    } catch (error) {
      setError('Error loading sweets. Please try again.');
      console.error('Fetch sweets error:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchSweets = async () => {
    try {
      setError(null);
      const searchParams = {};
      
      if (searchTerm) searchParams.name = searchTerm;
      if (filters.category) searchParams.category = filters.category;
      if (filters.minPrice) searchParams.minPrice = filters.minPrice;
      if (filters.maxPrice) searchParams.maxPrice = filters.maxPrice;

      const response = await api.searchSweets(searchParams);
      setFilteredSweets(response.data.data);
    } catch (error) {
      setError('Error searching sweets. Please try again.');
      console.error('Search sweets error:', error);
    }
  };

  const handleSearch = () => {
    searchSweets();
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handlePurchase = (sweet) => {
    setSelectedSweet(sweet);
    setModalType('purchase');
  };

  const handleAddSweet = () => {
    setSelectedSweet(null);
    setModalType('add');
  };

  const handleEditSweet = (sweet) => {
    setSelectedSweet(sweet);
    setModalType('edit');
  };

  const handleDeleteSweet = async (sweet) => {
    if (window.confirm(`Are you sure you want to delete ${sweet.name}?`)) {
      try {
        await api.deleteSweet(sweet._id);
        setSuccessMessage(`${sweet.name} deleted successfully`);
        fetchSweets(); // Refresh the list
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (error) {
        setError('Error deleting sweet. Please try again.');
        console.error('Delete sweet error:', error);
      }
    }
  };

  const handlePurchaseSubmit = async (quantity) => {
    try {
      const response = await api.purchaseSweet(selectedSweet._id, quantity);
      setSuccessMessage(response.data.data.message || 'Purchase successful!');
      setModalType(null);
      setSelectedSweet(null);
      fetchSweets(); // Refresh the list
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      throw error; // Let PurchaseModal handle the error
    }
  };

  const handleSweetSubmit = async (sweetData) => {
    try {
      if (modalType === 'add') {
        await api.createSweet(sweetData);
        setSuccessMessage('Sweet added successfully!');
      } else if (modalType === 'edit') {
        await api.updateSweet(selectedSweet._id, sweetData);
        setSuccessMessage('Sweet updated successfully!');
      }
      
      setModalType(null);
      setSelectedSweet(null);
      fetchSweets(); // Refresh the list
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      throw error; // Let SweetModal handle the error
    }
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedSweet(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isAdmin = user?.role === 'ADMIN';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome, {user?.name}!
              </h1>
              <div className="flex items-center space-x-4 mt-1">
                <span className="text-sm text-gray-500">{user?.email}</span>
                <span className="text-sm text-gray-400">|</span>
                <span className="text-sm font-medium text-gray-700">{user?.role}</span>
                {isAdmin && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                    Admin
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="btn-secondary"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Success Message */}
      {successMessage && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <Alert 
            message={successMessage} 
            type="success" 
            onClose={() => setSuccessMessage('')}
            autoClose={true}
          />
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="card mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Search & Filter Sweets</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search Input */}
            <div className="lg:col-span-2">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Search by Name
              </label>
              <input
                id="search"
                type="text"
                placeholder="Search sweets..."
                value={searchTerm}
                onChange={handleSearchChange}
                onKeyPress={handleKeyPress}
                className="input-field"
              />
            </div>

            {/* Category Filter */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="input-field"
              >
                <option value="">All Categories</option>
                <option value="Cake">Cake</option>
                <option value="Cookie">Cookie</option>
                <option value="Candy">Candy</option>
                <option value="Ice Cream">Ice Cream</option>
                <option value="Pie">Pie</option>
                <option value="Pastry">Pastry</option>
                <option value="Chocolate">Chocolate</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700 mb-2">
                Min Price
              </label>
              <input
                id="minPrice"
                name="minPrice"
                type="number"
                placeholder="0"
                value={filters.minPrice}
                onChange={handleFilterChange}
                className="input-field"
              />
            </div>

            <div>
              <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700 mb-2">
                Max Price
              </label>
              <input
                id="maxPrice"
                name="maxPrice"
                type="number"
                placeholder="1000"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                className="input-field"
              />
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button onClick={handleSearch} className="btn-primary">
              Search
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8">
            <Alert 
              message={error} 
              type="error" 
              onClose={() => setError(null)}
            />
          </div>
        )}

        {/* Admin Add Button */}
        {isAdmin && (
          <div className="mb-6 flex justify-end">
            <button
              onClick={handleAddSweet}
              className="btn-primary"
            >
              Add Sweet
            </button>
          </div>
        )}

        {/* Sweets Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <LoadingSpinner size="large" text="Loading sweets..." />
          </div>
        ) : filteredSweets.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No sweets found</p>
            <p className="text-gray-400 mt-2">
              {searchTerm || filters.category || filters.minPrice || filters.maxPrice
                ? 'Try adjusting your search or filters'
                : 'Start by adding some sweets to your inventory'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredSweets.map((sweet) => (
              <SweetCard
                key={sweet._id}
                sweet={sweet}
                onPurchase={handlePurchase}
                onEdit={handleEditSweet}
                onDelete={handleDeleteSweet}
                isAdmin={isAdmin}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modals */}
      {modalType === 'purchase' && (
        <PurchaseModal
          sweet={selectedSweet}
          onSubmit={handlePurchaseSubmit}
          onClose={closeModal}
        />
      )}

      {(modalType === 'add' || modalType === 'edit') && (
        <SweetModal
          sweet={modalType === 'edit' ? selectedSweet : null}
          mode={modalType}
          onSubmit={handleSweetSubmit}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default Dashboard;
