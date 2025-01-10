import path from 'path';
import express, { json } from 'express';
import dotenv from 'dotenv';
import productRoute from './routes/product.route.js';
import userRoute from './routes/user.route.js';

const app = express();

/////////////// Middleware
app.use('/assets', express.static('public/assets'));
app.use(express.urlencoded({ extended: false }));
app.use(json());
dotenv.config();

/////////////// Routes
app.use('/api/products', productRoute);
app.use('/api/users', userRoute);

export default app;
