import mongoose from 'mongoose';
import Product from './product.model';
import User from './user.model';

const reviewSchema = new mongoose.Schema({
  review: {
    type: String,
    required: [true, 'Review cannot be empty'],
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: [true, 'Rating is required'],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: [true, 'Review must belong to a product'],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Review must belong to a user'],
  },
});

// Prevent duplicate reviews
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

// Populate references
reviewSchema.pre(/^find/, function (next) {
  this.populate({ path: 'product', select: 'name price' }).populate({
    path: 'user',
    select: 'name email',
  });
  next();
});

// Method to calculate average
reviewSchema.statics.calcAverageRating = async function (productId) {
  const stats = await this.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: '$product',
        avgRating: { $avg: '$rating' },
        numRatings: { $sum: 1 },
      },
    },
  ]);
  if (stats.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      ratingsAverage: stats[0].avgRating,
      ratingsQuantity: stats[0].numRatings,
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      ratingsAverage: 0,
      ratingsQuantity: 0,
    });
  }
};

// Middleware to update average ratings after saving review
reviewSchema.post('save', function () {
  this.constructor.calcAverageRating(this.product);
});

// Middleware to update average ratings after deleting review
reviewSchema.post('remove', function () {
  this.constructor.calcAverageRating(this.product);
});

const Review = mongoose.model('Review', reviewSchema);

export default Review;
