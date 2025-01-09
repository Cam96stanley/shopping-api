import Product from '../models/product.model.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find();
  res.status(200).json(products);
});

export const getOneProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  res.status(200).json(product);
});

export const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);
  res.status(200).json(product);
});

export const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  // Update the product and return the updated document
  const product = await Product.findByIdAndUpdate(id, req.body, {
    new: true, // Return the updated document
    runValidators: true, // Ensure validators run on update
  });
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  // Convert to plain object to avoid circular references
  res.status(200).json(product.toObject());
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findByIdAndDelete(id);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  res.status(200).json({ message: 'Product deleted successfully' });
});
