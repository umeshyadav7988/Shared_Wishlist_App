import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { wishlistAPI } from '../services/api';
import { Plus, Users, ShoppingBag, Calendar, Search } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import { Wishlist } from '../types';
import toast from 'react-hot-toast';

const Dashboard: React.FC = () => {
  const { state, dispatch } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newWishlist, setNewWishlist] = useState({
    title: '',
    description: '',
    isPublic: false,
  });

  useEffect(() => {
    loadWishlists();
  }, []);

  const loadWishlists = async () => {
    try {
      dispatch({ type: 'WISHLIST_LOADING' });
      const response = await wishlistAPI.getWishlists();
      dispatch({ type: 'SET_WISHLISTS', payload: response.wishlists });
    } catch (error: any) {
      dispatch({ type: 'WISHLIST_ERROR' });
      toast.error(error.response?.data?.message || 'Failed to load wishlists');
    }
  };

  const handleCreateWishlist = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newWishlist.title.trim()) {
      toast.error('Please enter a wishlist title');
      return;
    }

    try {
      const response = await wishlistAPI.createWishlist(newWishlist);
      dispatch({ type: 'ADD_WISHLIST', payload: response.wishlist });
      setNewWishlist({ title: '', description: '', isPublic: false });
      setShowCreateForm(false);
      toast.success('Wishlist created successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create wishlist');
    }
  };

  const filteredWishlists = state.wishlists.wishlists.filter(
    (wishlist: Wishlist) =>
      wishlist.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wishlist.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Wishlists</h1>
          <p className="mt-1 text-sm text-gray-600">
            Create and manage your collaborative wishlists
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={() => setShowCreateForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Wishlist
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search wishlists..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      {/* Create Wishlist Form */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Create New Wishlist
              </h3>
              <form onSubmit={handleCreateWishlist} className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={newWishlist.title}
                    onChange={(e) =>
                      setNewWishlist({ ...newWishlist, title: e.target.value })
                    }
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter wishlist title"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description (optional)
                  </label>
                  <textarea
                    id="description"
                    rows={3}
                    value={newWishlist.description}
                    onChange={(e) =>
                      setNewWishlist({ ...newWishlist, description: e.target.value })
                    }
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter wishlist description"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    id="isPublic"
                    type="checkbox"
                    checked={newWishlist.isPublic}
                    onChange={(e) =>
                      setNewWishlist({ ...newWishlist, isPublic: e.target.checked })
                    }
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-900">
                    Make this wishlist public
                  </label>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Wishlist Grid */}
      {state.wishlists.isLoading ? (
        <div className="flex justify-center py-8">
          <LoadingSpinner size="large" />
        </div>
      ) : filteredWishlists.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            {searchTerm ? 'No wishlists found' : 'No wishlists yet'}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm
              ? 'Try adjusting your search terms'
              : 'Get started by creating a new wishlist.'}
          </p>
          {!searchTerm && (
            <div className="mt-6">
              <button
                onClick={() => setShowCreateForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create your first wishlist
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredWishlists.map((wishlist: Wishlist) => (
            <Link
              key={wishlist._id}
              to={`/wishlist/${wishlist._id}`}
              className="block"
            >
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-gray-300 transition-all duration-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900 truncate">
                    {wishlist.title}
                  </h3>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      wishlist.isPublic
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {wishlist.isPublic ? 'Public' : 'Private'}
                  </span>
                </div>
                
                {wishlist.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {wishlist.description}
                  </p>
                )}
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center">
                    <ShoppingBag className="h-4 w-4 mr-1" />
                    <span>{wishlist.products.length} items</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    <span>{wishlist.collaborators.length + 1} members</span>
                  </div>
                </div>
                
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>Updated {formatDate(wishlist.updatedAt)}</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    by {wishlist.owner.username}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
