import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Your product must have a name'],
    unique: true,
  },
  slug: String,
  description: {
    type: String,
    required: [true, 'Your product must have a description'],
  },
  price: {
    type: Number,
    required: [true, 'Your product must have a price'],
    min: [0, 'Price must be a postitive number'],
  },
  category: {
    type: String,
    required: [true, 'Your product must have a category'],
    enum: [
      'Electronics',
      'Clothing',
      'Books',
      'Beauty',
      'Home',
      'Sports',
      'Other',
    ],
  },
  stock: {
    type: Number,
    default: 0,
    min: [0, 'Stock cannont be negative'],
  },
  ratingsAverage: {
    type: Number,
    default: 0,
    min: [0, 'Ratings cannot be less than 0'],
    max: [5, 'Ratings cannot be more than 5'],
    set: (val) => Math.round(val * 10) / 10,
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
  },
});

productSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

productSchema.pre('save', function (next) {
  if (this.ratings && this.ratings.length > 0) {
    const total = this.ratings.reduce((sum, review) => sum + review.rating, 0);
    this.ratingsAverage = total / this.ratings.length;
    this.ratingsQuantity = this.ratings.length;
  } else {
    this.ratingsAverage = 0;
    this.ratingsQuantity = 0;
  }
  this.updatedAt = Date.now();
  next();
});

const Product = mongoose.model('Product', productSchema);

export default Product;
