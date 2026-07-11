import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      unique: true,
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Please provide a product name'],
    },
    category: {
      type: String,
      required: [true, 'Please provide a category'],
    },
    description: String,
    price: {
      type: Number,
      required: [true, 'Please provide a price'],
    },
    discount: {
      type: Number,
      default: 0,
    },
    size: {
      type: String,
      required: true,
    },
    stock: {
      type: Number,
      required: [true, 'Please provide stock quantity'],
      default: 0,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    imageUrl: String,
    rating: {
      type: Number,
      default: 4.5,
      min: 0,
      max: 5,
    },
    reviews: [
      {
        userId: mongoose.Schema.Types.ObjectId,
        userName: String,
        rating: Number,
        comment: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

export default mongoose.models.Product || mongoose.model('Product', productSchema);
