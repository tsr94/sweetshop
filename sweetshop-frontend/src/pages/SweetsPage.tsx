import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { sweetService } from '../services/sweetService';
import { SweetDto, SearchParams } from '../types';
import SweetCard from '../components/sweets/SweetCard';
import SweetForm from '../components/sweets/SweetForm';
import SearchBar from '../components/sweets/SearchBar';
import Modal from '../components/common/Modal';
import LoadingSpinner from '../components/common/LoadingSpinner';

const SweetsPage: React.FC = () => {
  const { user } = useAuth();
  const [sweets, setSweets] = useState<SweetDto[]>([]);
  const [filteredSweets, setFilteredSweets] = useState<SweetDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSweet, setEditingSweet] = useState<SweetDto | undefined>();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'quantity' | 'category'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    loadSweets();
  }, []);

  useEffect(() => {
    sortSweets(filteredSweets);
  }, [sortBy, sortOrder]);

  const loadSweets = async () => {
    try {
      setIsLoading(true);
      setError('');
      setSuccess('');
      const data = await sweetService.getAllSweets();
      setSweets(data);
      sortSweets(data);
    } catch (err: any) {
      setError('Failed to load sweets');
      console.error('Error loading sweets:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const sortSweets = (sweetsList: SweetDto[]) => {
    const sorted = [...sweetsList].sort((a, b) => {
      let aValue: any = a[sortBy];
      let bValue: any = b[sortBy];

      if (sortBy === 'price') {
        aValue = a.price;
        bValue = b.price;
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredSweets(sorted);
  };

  const handleSearch = async (params: SearchParams) => {
    try {
      setIsLoading(true);
      setError('');
      const data = await sweetService.searchSweets(params);
      sortSweets(data);
    } catch (err: any) {
      setError('Search failed');
      console.error('Error searching sweets:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateSweet = async (sweetData: Omit<SweetDto, 'id'>) => {
    try {
      await sweetService.createSweet(sweetData);
      setSuccess('Sweet created successfully!');
      await loadSweets();
      setIsModalOpen(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError('Failed to create sweet');
      console.error('Error creating sweet:', err);
    }
  };

  const handleUpdateSweet = async (sweetData: Omit<SweetDto, 'id'>) => {
    if (!editingSweet) return;
    
    try {
      await sweetService.updateSweet(editingSweet.id, sweetData);
      setSuccess('Sweet updated successfully!');
      await loadSweets();
      setIsModalOpen(false);
      setEditingSweet(undefined);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError('Failed to update sweet');
      console.error('Error updating sweet:', err);
    }
  };

  const handleDeleteSweet = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this sweet?')) return;
    
    try {
      await sweetService.deleteSweet(id);
      setSuccess('Sweet deleted successfully!');
      await loadSweets();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError('Failed to delete sweet');
      console.error('Error deleting sweet:', err);
    }
  };

  const handleRestock = async (id: number, quantity: number = 10) => {
    try {
      await sweetService.restockSweet(id, quantity);
      setSuccess('Sweet restocked successfully!');
      await loadSweets();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError('Failed to restock sweet');
      console.error('Error restocking sweet:', err);
    }
  };

  const handlePurchase = async (id: number, quantity: number = 1) => {
    try {
      await sweetService.purchaseSweet(id, quantity);
      setSuccess('Purchase successful!');
      await loadSweets();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError('Failed to purchase sweet');
      console.error('Error purchasing sweet:', err);
    }
  };

  const openCreateModal = () => {
    setEditingSweet(undefined);
    setIsModalOpen(true);
  };

  const openEditModal = (sweet: SweetDto) => {
    setEditingSweet(sweet);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingSweet(undefined);
  };

  const handleSortChange = (newSortBy: typeof sortBy) => {
    if (newSortBy === sortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('asc');
    }
  };

  const clearFilters = () => {
    sortSweets(sweets);
  };

  if (isLoading && sweets.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading delicious sweets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold mb-2">Sweet Collection</h1>
              <p className="text-purple-100 text-lg">
                {user?.role === 'ADMIN' 
                  ? 'Manage your sweet inventory with ease'
                  : 'Discover and purchase delicious sweets'
                }
              </p>
            </div>
            {user?.role === 'ADMIN' && (
              <button
                onClick={openCreateModal}
                className="bg-white text-purple-600 hover:bg-purple-50 px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 flex items-center space-x-2"
              >
                <span>+</span>
                <span>Add New Sweet</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Alerts */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-red-400">⚠️</span>
              </div>
              <div className="ml-3">
                <p className="text-red-800 font-medium">{error}</p>
              </div>
              <button
                onClick={() => setError('')}
                className="ml-auto text-red-400 hover:text-red-600"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-green-400">✅</span>
              </div>
              <div className="ml-3">
                <p className="text-green-800 font-medium">{success}</p>
              </div>
              <button
                onClick={() => setSuccess('')}
                className="ml-auto text-green-400 hover:text-green-600"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Search and Controls */}
        <div className="mb-8">
          <SearchBar onSearch={handleSearch} />
          
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">View:</span>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-all duration-300 ${
                    viewMode === 'grid' 
                      ? 'bg-white shadow-sm text-purple-600' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  ⬜️ Grid
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-all duration-300 ${
                    viewMode === 'list' 
                      ? 'bg-white shadow-sm text-purple-600' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  📃 List
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">Sort by:</span>
              <div className="flex flex-wrap gap-2">
                {['name', 'price', 'quantity', 'category'].map((field) => (
                  <button
                    key={field}
                    onClick={() => handleSortChange(field as typeof sortBy)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 ${
                      sortBy === field
                        ? 'bg-purple-100 text-purple-700 border border-purple-200'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                    {sortBy === field && (
                      <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition duration-300"
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 flex justify-between items-center">
          <p className="text-gray-600">
            Showing <span className="font-semibold">{filteredSweets.length}</span> sweets
            {sweets.length !== filteredSweets.length && ` of ${sweets.length}`}
          </p>
        </div>

        {/* Sweets Grid/List */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredSweets.map((sweet) => (
                  <SweetCard
                    key={sweet.id}
                    sweet={sweet}
                    onEdit={openEditModal}
                    onDelete={handleDeleteSweet}
                    onRestock={handleRestock}
                    onPurchase={handlePurchase}
                    userRole={user?.role || 'USER'}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredSweets.map((sweet) => (
                  <div 
                    key={sweet.id} 
                    className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg flex items-center justify-center text-2xl">
                          🍬
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">{sweet.name}</h3>
                          <p className="text-gray-600">{sweet.category}</p>
                          <div className="flex space-x-4 mt-2">
                            <span className="text-lg font-bold text-purple-600">${sweet.price.toFixed(2)}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              sweet.quantity > 10 
                                ? 'bg-green-100 text-green-800'
                                : sweet.quantity > 0
                                ? 'bg-orange-100 text-orange-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {sweet.quantity} in stock
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        {user?.role === 'ADMIN' ? (
                          <>
                            <button
                              onClick={() => openEditModal(sweet)}
                              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition duration-300"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteSweet(sweet.id)}
                              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition duration-300"
                            >
                              Delete
                            </button>
                            <button
                              onClick={() => handleRestock(sweet.id)}
                              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition duration-300"
                            >
                              Restock
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handlePurchase(sweet.id)}
                            disabled={sweet.quantity === 0}
                            className={`px-6 py-2 rounded-lg transition duration-300 font-medium ${
                              sweet.quantity === 0
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-purple-500 hover:bg-purple-600 text-white'
                            }`}
                          >
                            {sweet.quantity === 0 ? 'Out of Stock' : 'Purchase'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {filteredSweets.length === 0 && !isLoading && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-4">
              🍭
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No sweets found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search criteria or add new sweets.</p>
            {user?.role === 'ADMIN' && (
              <button
                onClick={openCreateModal}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition duration-300"
              >
                Add Your First Sweet
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingSweet ? 'Edit Sweet' : 'Create New Sweet'}
      >
        <SweetForm
          sweet={editingSweet}
          onSubmit={editingSweet ? handleUpdateSweet : handleCreateSweet}
          onCancel={closeModal}
          isEditing={!!editingSweet}
        />
      </Modal>
    </div>
  );
};

export default SweetsPage;