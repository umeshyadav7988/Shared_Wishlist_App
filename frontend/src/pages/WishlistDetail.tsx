import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { wishlistAPI } from '../services/api';
import { Plus, Edit, Trash2, ExternalLink, DollarSign, Clock, User } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import { Product } from '../types';
import toast from 'react-hot-toast';

const WishlistDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: '',
    url: '',
    category: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
  });

  const { currentWishlist, isLoading } = state.wishlists;

  useEffect(() => {
    if (id) {
      loadWishlist();
    }
  }, [id]);

  const loadWishlist = async () => {
    if (!id) return;
    
    try {
      dispatch({ type: 'WISHLIST_LOADING' });
      const response = await wishlistAPI.getWishlist(id);
      dispatch({ type: 'SET_CURRENT_WISHLIST', payload: response.wishlist });
    } catch (error: any) {
      dispatch({ type: 'WISHLIST_ERROR' });
      toast.error(error.response?.data?.message || 'Failed to load wishlist');
      navigate('/dashboard');
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newProduct.name.trim() || !newProduct.price.trim()) {
      toast.error('Please fill in the required fields');
      return;
    }

    try {
      const productData = {
        ...newProduct,
        price: parseFloat(newProduct.price),
      };
      
      const response = await wishlistAPI.addProduct(id!, productData);
      dispatch({ type: 'UPDATE_WISHLIST', payload: response.wishlist });
      setNewProduct({
        name: '',
        description: '',
        price: '',
        imageUrl: '',
        url: '',
        category: '',
        priority: 'medium',
      });
      setShowAddForm(false);
      toast.success('Product added successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add product');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const response = await wishlistAPI.deleteProduct(id!, productId);
      dispatch({ type: 'UPDATE_WISHLIST', payload: response.wishlist });
      toast.success('Product deleted successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete product');
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!currentWishlist) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">Wishlist not found</h3>
        <p className="mt-1 text-sm text-gray-500">
          The wishlist you're looking for doesn't exist or you don't have access to it.
        </p>
        <div className="mt-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{currentWishlist.title}</h1>
            {currentWishlist.description && (
              <p className="mt-1 text-sm text-gray-600">{currentWishlist.description}</p>
            )}
            <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
              <span>Created by {currentWishlist.owner.username}</span>
              <span>•</span>
              <span>{currentWishlist.products.length} items</span>
              <span>•</span>
              <span>{currentWishlist.collaborators.length + 1} members</span>
            </div>
          </div>
          <div className="mt-4 sm:mt-0">
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </button>
          </div>
        </div>
      </div>

      {/* Add Product Form */}
      {showAddForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Product</h3>
              <form onSubmit={handleAddProduct} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Product Name *</label>
                  <input
                    type="text"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter product name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Price *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="0.00"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    rows={3}
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter product description"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Image URL</label>
                  <input
                    type="url"
                    value={newProduct.imageUrl}
                    onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Product URL</label>
                  <input
                    type="url"
                    value={newProduct.url}
                    onChange={(e) => setNewProduct({ ...newProduct, url: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="https://example.com/product"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Priority</label>
                  <select
                    value={newProduct.priority}
                    onChange={(e) => setNewProduct({ ...newProduct, priority: e.target.value as 'low' | 'medium' | 'high' })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                  >
                    Add Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Products Grid */}
      {currentWishlist.products.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900">No products yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Add your first product to get started with this wishlist.
          </p>
          <div className="mt-6">
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </button>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {currentWishlist.products.map((product: Product) => (
            <div key={product._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {product.imageUrl && (
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
              )}
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-medium text-gray-900 truncate">{product.name}</h3>
                  <div className="flex items-center space-x-2">
                    {product.url && (
                      <a
                        href={product.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-primary-600"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                    <button
                      onClick={() => handleDeleteProduct(product._id)}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-lg font-semibold text-green-600">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(product.priority || 'medium')}`}>
                    {product.priority || 'medium'}
                  </span>
                </div>
                
                {product.description && (
                  <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                    {product.description}
                  </p>
                )}
                
                <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    <span>{product.addedBy.username}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{formatDate(product.addedAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistDetail;
