import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/product.model.js';
import User from '../models/user.model.js';
import Review from '../models/review.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: './config.env' });

const DB = process.env.MONGO_URL;

mongoose.connect(DB, {});

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(async () => {
    console.log('Successfully connected to the database');
  })
  .catch((err) => {
    console.log(err);
  });

// Read JSON file
const products = JSON.parse(
  fs.readFileSync(`${__dirname}/products.json`, 'utf-8')
);
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`));

// Import data into database
const importData = async () => {
  try {
    await Product.create(products);
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);
    console.log('Data successfully loaded!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// Delete all data from collection

const deleteData = async () => {
  try {
    await Product.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log('Data successfully deleted!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}

console.log(process.argv);
