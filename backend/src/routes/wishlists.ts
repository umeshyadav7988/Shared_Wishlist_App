import express from 'express';
import { body } from 'express-validator';
import {
  getWishlists,
  getWishlist,
  getPublicWishlists,
  createWishlist,
  updateWishlist,
  deleteWishlist,
  addProduct,
  updateProduct,
  deleteProduct
} from '../controllers/wishlists';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Validation middleware
const wishlistValidation = [
  body('title')
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be between 1 and 100 characters')
    .trim(),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description must be less than 500 characters')
    .trim(),
  body('isPublic')
    .optional()
    .isBoolean()
    .withMessage('isPublic must be a boolean')
];

const productValidation = [
  body('name')
    .isLength({ min: 1, max: 100 })
    .withMessage('Product name must be between 1 and 100 characters')
    .trim(),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description must be less than 500 characters')
    .trim(),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('imageUrl')
    .optional()
    .isURL()
    .withMessage('Image URL must be a valid URL'),
  body('url')
    .optional()
    .isURL()
    .withMessage('Product URL must be a valid URL'),
  body('category')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Category must be less than 50 characters')
    .trim(),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be low, medium, or high')
];

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Wishlist routes
router.get('/', getWishlists);
router.get('/public', getPublicWishlists);
router.get('/:id', getWishlist);
router.post('/', wishlistValidation, createWishlist);
router.put('/:id', wishlistValidation, updateWishlist);
router.delete('/:id', deleteWishlist);

// Product routes
router.post('/:id/products', productValidation, addProduct);
router.put('/:id/products/:productId', productValidation, updateProduct);
router.delete('/:id/products/:productId', deleteProduct);

export default router;
