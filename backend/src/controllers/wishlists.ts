import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { Wishlist } from '../models/Wishlist';
import { AuthenticatedRequest } from '../middleware/auth';

export const getWishlists = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user._id;
    
    const wishlists = await Wishlist.find({
      $or: [
        { owner: userId },
        { collaborators: userId },
        { isPublic: true }
      ]
    })
    .populate('owner', 'username email avatar')
    .populate('collaborators', 'username email avatar')
    .populate('products.addedBy', 'username email avatar')
    .sort({ updatedAt: -1 });

    res.json({ wishlists });
  } catch (error) {
    console.error('Get wishlists error:', error);
    res.status(500).json({ message: 'Server error fetching wishlists' });
  }
};

export const getWishlist = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const wishlist = await Wishlist.findOne({
      _id: id,
      $or: [
        { owner: userId },
        { collaborators: userId },
        { isPublic: true }
      ]
    })
    .populate('owner', 'username email avatar')
    .populate('collaborators', 'username email avatar')
    .populate('products.addedBy', 'username email avatar');

    if (!wishlist) {
      res.status(404).json({ message: 'Wishlist not found' });
      return;
    }

    res.json({ wishlist });
  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({ message: 'Server error fetching wishlist' });
  }
};

export const getPublicWishlists = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const wishlists = await Wishlist.find({ isPublic: true })
      .populate('owner', 'username email avatar')
      .populate('collaborators', 'username email avatar')
      .populate('products.addedBy', 'username email avatar')
      .sort({ updatedAt: -1 });

    res.json({ wishlists });
  } catch (error) {
    console.error('Get public wishlists error:', error);
    res.status(500).json({ message: 'Server error fetching public wishlists' });
  }
};

export const createWishlist = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { title, description, isPublic } = req.body;
    const userId = req.user._id;

    const wishlist = new Wishlist({
      title,
      description,
      owner: userId,
      collaborators: [],
      products: [],
      isPublic: isPublic || false
    });

    await wishlist.save();
    
    const populatedWishlist = await Wishlist.findById(wishlist._id)
      .populate('owner', 'username email avatar')
      .populate('collaborators', 'username email avatar');

    res.status(201).json({
      message: 'Wishlist created successfully',
      wishlist: populatedWishlist
    });
  } catch (error) {
    console.error('Create wishlist error:', error);
    res.status(500).json({ message: 'Server error creating wishlist' });
  }
};

export const updateWishlist = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { id } = req.params;
    const { title, description, isPublic } = req.body;
    const userId = req.user._id;

    const wishlist = await Wishlist.findOne({
      _id: id,
      $or: [
        { owner: userId },
        { collaborators: userId }
      ]
    });

    if (!wishlist) {
      res.status(404).json({ message: 'Wishlist not found' });
      return;
    }

    // Only owner can update wishlist details
    if (wishlist.owner.toString() !== userId.toString()) {
      res.status(403).json({ message: 'Only the owner can update wishlist details' });
      return;
    }

    wishlist.title = title || wishlist.title;
    wishlist.description = description || wishlist.description;
    wishlist.isPublic = isPublic !== undefined ? isPublic : wishlist.isPublic;

    await wishlist.save();

    const populatedWishlist = await Wishlist.findById(wishlist._id)
      .populate('owner', 'username email avatar')
      .populate('collaborators', 'username email avatar')
      .populate('products.addedBy', 'username email avatar');

    res.json({
      message: 'Wishlist updated successfully',
      wishlist: populatedWishlist
    });
  } catch (error) {
    console.error('Update wishlist error:', error);
    res.status(500).json({ message: 'Server error updating wishlist' });
  }
};

export const deleteWishlist = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const wishlist = await Wishlist.findOne({
      _id: id,
      owner: userId
    });

    if (!wishlist) {
      res.status(404).json({ message: 'Wishlist not found or unauthorized' });
      return;
    }

    await Wishlist.findByIdAndDelete(id);

    res.json({ message: 'Wishlist deleted successfully' });
  } catch (error) {
    console.error('Delete wishlist error:', error);
    res.status(500).json({ message: 'Server error deleting wishlist' });
  }
};

export const addProduct = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { id } = req.params;
    const { name, description, price, imageUrl, url, category, priority } = req.body;
    const userId = req.user._id;

    const wishlist = await Wishlist.findOne({
      _id: id,
      $or: [
        { owner: userId },
        { collaborators: userId }
      ]
    });

    if (!wishlist) {
      res.status(404).json({ message: 'Wishlist not found' });
      return;
    }

    const newProduct = {
      name,
      description,
      price,
      imageUrl,
      url,
      category,
      priority: priority || 'medium',
      addedBy: userId,
      addedAt: new Date(),
      updatedAt: new Date()
    };

    wishlist.products.push(newProduct as any);
    await wishlist.save();

    const populatedWishlist = await Wishlist.findById(wishlist._id)
      .populate('owner', 'username email avatar')
      .populate('collaborators', 'username email avatar')
      .populate('products.addedBy', 'username email avatar');

    res.status(201).json({
      message: 'Product added successfully',
      wishlist: populatedWishlist
    });
  } catch (error) {
    console.error('Add product error:', error);
    res.status(500).json({ message: 'Server error adding product' });
  }
};

export const updateProduct = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { id, productId } = req.params;
    const { name, description, price, imageUrl, url, category, priority } = req.body;
    const userId = req.user._id;

    const wishlist = await Wishlist.findOne({
      _id: id,
      $or: [
        { owner: userId },
        { collaborators: userId }
      ]
    });

    if (!wishlist) {
      res.status(404).json({ message: 'Wishlist not found' });
      return;
    }

    const product = wishlist.products.find(p => p._id.toString() === productId);
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    // Update product fields
    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = price;
    if (imageUrl !== undefined) product.imageUrl = imageUrl;
    if (url !== undefined) product.url = url;
    if (category !== undefined) product.category = category;
    if (priority !== undefined) product.priority = priority;
    product.updatedAt = new Date();

    await wishlist.save();

    const populatedWishlist = await Wishlist.findById(wishlist._id)
      .populate('owner', 'username email avatar')
      .populate('collaborators', 'username email avatar')
      .populate('products.addedBy', 'username email avatar');

    res.json({
      message: 'Product updated successfully',
      wishlist: populatedWishlist
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Server error updating product' });
  }
};

export const deleteProduct = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id, productId } = req.params;
    const userId = req.user._id;

    const wishlist = await Wishlist.findOne({
      _id: id,
      $or: [
        { owner: userId },
        { collaborators: userId }
      ]
    });

    if (!wishlist) {
      res.status(404).json({ message: 'Wishlist not found' });
      return;
    }

    const product = wishlist.products.find(p => p._id.toString() === productId);
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    // Only product owner or wishlist owner can delete
    if (product.addedBy.toString() !== userId.toString() && 
        wishlist.owner.toString() !== userId.toString()) {
      res.status(403).json({ message: 'Unauthorized to delete this product' });
      return;
    }

    wishlist.products = wishlist.products.filter(p => p._id.toString() !== productId);
    await wishlist.save();

    const populatedWishlist = await Wishlist.findById(wishlist._id)
      .populate('owner', 'username email avatar')
      .populate('collaborators', 'username email avatar')
      .populate('products.addedBy', 'username email avatar');

    res.json({
      message: 'Product deleted successfully',
      wishlist: populatedWishlist
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Server error deleting product' });
  }
};
