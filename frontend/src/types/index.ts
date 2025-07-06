export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
}

export interface Product {
  _id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  url?: string;
  category?: string;
  priority?: 'low' | 'medium' | 'high';
  addedBy: User;
  addedAt: string;
  updatedAt: string;
}

export interface Wishlist {
  _id: string;
  title: string;
  description?: string;
  owner: User;
  collaborators: User[];
  products: Product[];
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface ApiError {
  message: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

export interface CreateWishlistData {
  title: string;
  description?: string;
  isPublic?: boolean;
}

export interface UpdateWishlistData {
  title?: string;
  description?: string;
  isPublic?: boolean;
}

export interface CreateProductData {
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  url?: string;
  category?: string;
  priority?: 'low' | 'medium' | 'high';
}

export interface UpdateProductData {
  name?: string;
  description?: string;
  price?: number;
  imageUrl?: string;
  url?: string;
  category?: string;
  priority?: 'low' | 'medium' | 'high';
}
