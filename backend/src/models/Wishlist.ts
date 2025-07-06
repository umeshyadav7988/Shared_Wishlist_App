import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  url?: string;
  category?: string;
  priority?: 'low' | 'medium' | 'high';
  addedBy: mongoose.Types.ObjectId;
  addedAt: Date;
  updatedAt: Date;
}

export interface IWishlist extends Document {
  title: string;
  description?: string;
  owner: mongoose.Types.ObjectId;
  collaborators: mongoose.Types.ObjectId[];
  products: IProduct[];
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  imageUrl: {
    type: String,
    trim: true
  },
  url: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    trim: true,
    maxlength: 50
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  addedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  addedAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const wishlistSchema = new Schema<IWishlist>({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  collaborators: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  products: [productSchema],
  isPublic: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export const Wishlist = mongoose.model<IWishlist>('Wishlist', wishlistSchema);
