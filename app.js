import express, { json } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import Product from './models/product.model.js';
import User from './models/user.model.js';
import productRoute from './routes/product.route.js';

const app = express();

/////////////// Middleware
app.use('/assets', express.static('public/assets'));
app.use(express.urlencoded({ extended: false }));
app.use(json());
dotenv.config();
/////////////// Error handling middleware
app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).json({ message: err.message });
});

/////////////// Routes
app.use('/api/products', productRoute);

/////////////// Server logic
const port = process.env.PORT || 8000;
const mongoUrl = process.env.MONGO_URL;

app.get('/', (req, res) => {
  res.send('Hello from Shopping API');
});

app.post('/api/products', async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).json({ message: 'Duplicate product detected' });
    } else {
      res.status(500).json({ message: err.message });
    }
  }
});

// Function to refresh products and users when the server starts
const refreshProducts = async () => {
  try {
    // Check if data already exists to prevent repeated population
    const productCount = await Product.countDocuments();
    const userCount = await User.countDocuments();

    if (productCount === 0 && userCount === 0) {
      console.log('Populating database with initial data...');

      // Read and parse the JSON files
      const productData = fs.readFileSync('./data/products.json', 'utf-8');
      const userData = fs.readFileSync('./data/users.json', 'utf-8');
      const products = JSON.parse(productData);
      const users = JSON.parse(userData);

      // Insert new products and users
      await Product.insertMany(products);
      await User.insertMany(users);
      console.log('Products and users populated successfully.');
    }
  } catch (err) {
    console.error(`Error refreshing products: ${err.message}`);
  }
};

mongoose
  .connect(mongoUrl)
  .then(async () => {
    console.log('Successfully connected to the database');
    await refreshProducts(); // Refresh database products and users when the server starts
    app.listen(port, () => {
      console.log(`Server is running on port: ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
