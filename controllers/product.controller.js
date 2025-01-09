import Product from '../models/product.model.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find();
  res.status(200).json(products);
});

export const getOneProduct = asyncHandler((req, res) => {
  const { id } = req.params;
  const product = Product.findById(id);
  res.status(200).json(product);
});

export const createProduct = asyncHandler((req, res) => {
  const product = Product.create(req.body);
  res.status(200).json(product);
});

export const updateProduct = asyncHandler((req, res) => {
  const { id } = req.params;
  const product = Product.findByIdAndUpdate(id, req.body);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  const updatedProduct = Product.findById(id);
  res.status(200).json(updatedProduct);
});

export const deleteProduct = asyncHandler((req, res) => {
  const { id } = req.params;
  const product = Product.findByIdAndDelete(id);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  res.status(200).json({ message: 'Product deleted successfully' });
});
