import axios, { AxiosResponse } from 'axios';
import { 
  AuthResponse, 
  User, 
  Wishlist, 
  CreateWishlistData, 
  UpdateWishlistData, 
  CreateProductData, 
  UpdateProductData 
} from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: async (userData: {
    username: string;
    email: string;
    password: string;
  }): Promise<AuthResponse> => {
    const response: AxiosResponse<AuthResponse> = await api.post('/auth/register', userData);
    return response.data;
  },

  login: async (credentials: {
    email: string;
    password: string;
  }): Promise<AuthResponse> => {
    const response: AxiosResponse<AuthResponse> = await api.post('/auth/login', credentials);
    return response.data;
  },

  getProfile: async (): Promise<{ user: User }> => {
    const response: AxiosResponse<{ user: User }> = await api.get('/auth/profile');
    return response.data;
  },
};

// Wishlist API
export const wishlistAPI = {
  getWishlists: async (): Promise<{ wishlists: Wishlist[] }> => {
    const response: AxiosResponse<{ wishlists: Wishlist[] }> = await api.get('/wishlists');
    return response.data;
  },

  getPublicWishlists: async (): Promise<{ wishlists: Wishlist[] }> => {
    const response: AxiosResponse<{ wishlists: Wishlist[] }> = await api.get('/wishlists/public');
    return response.data;
  },

  getWishlist: async (id: string): Promise<{ wishlist: Wishlist }> => {
    const response: AxiosResponse<{ wishlist: Wishlist }> = await api.get(`/wishlists/${id}`);
    return response.data;
  },

  createWishlist: async (data: CreateWishlistData): Promise<{ wishlist: Wishlist; message: string }> => {
    const response: AxiosResponse<{ wishlist: Wishlist; message: string }> = await api.post('/wishlists', data);
    return response.data;
  },

  updateWishlist: async (id: string, data: UpdateWishlistData): Promise<{ wishlist: Wishlist; message: string }> => {
    const response: AxiosResponse<{ wishlist: Wishlist; message: string }> = await api.put(`/wishlists/${id}`, data);
    return response.data;
  },

  deleteWishlist: async (id: string): Promise<{ message: string }> => {
    const response: AxiosResponse<{ message: string }> = await api.delete(`/wishlists/${id}`);
    return response.data;
  },

  addProduct: async (wishlistId: string, data: CreateProductData): Promise<{ wishlist: Wishlist; message: string }> => {
    const response: AxiosResponse<{ wishlist: Wishlist; message: string }> = await api.post(`/wishlists/${wishlistId}/products`, data);
    return response.data;
  },

  updateProduct: async (wishlistId: string, productId: string, data: UpdateProductData): Promise<{ wishlist: Wishlist; message: string }> => {
    const response: AxiosResponse<{ wishlist: Wishlist; message: string }> = await api.put(`/wishlists/${wishlistId}/products/${productId}`, data);
    return response.data;
  },

  deleteProduct: async (wishlistId: string, productId: string): Promise<{ wishlist: Wishlist; message: string }> => {
    const response: AxiosResponse<{ wishlist: Wishlist; message: string }> = await api.delete(`/wishlists/${wishlistId}/products/${productId}`);
    return response.data;
  },
};

export default api;
