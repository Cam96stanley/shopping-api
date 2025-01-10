import User from '../models/user.model.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find();
  res.status(200).json(users);
});

export const getOneUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  res.status(200).json(user);
});
