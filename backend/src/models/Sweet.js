const mongoose = require('mongoose');

const sweetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Sweet name is required'],
    trim: true,
    minlength: [2, 'Sweet name must be at least 2 characters long'],
    maxlength: [100, 'Sweet name cannot exceed 100 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true,
    enum: [
      'Cake',
      'Cookie',
      'Candy',
      'Ice Cream',
      'Pie',
      'Pastry',
      'Chocolate',
      'Other'
    ],
    default: 'Other'
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price must be a positive number'],
    validate: {
      validator: function(value) {
        return value > 0;
      },
      message: 'Price must be greater than 0'
    }
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [0, 'Quantity cannot be negative'],
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for checking if sweet is in stock
sweetSchema.virtual('inStock').get(function() {
  return this.quantity > 0;
});

// Virtual for stock status
sweetSchema.virtual('stockStatus').get(function() {
  if (this.quantity === 0) return 'Out of Stock';
  if (this.quantity < 5) return 'Low Stock';
  return 'In Stock';
});

// Text index for search functionality
sweetSchema.index({ name: 'text', category: 'text' });

// Compound index for price range queries
sweetSchema.index({ price: 1, quantity: 1 });

// Pre-save middleware to ensure data consistency
sweetSchema.pre('save', function(next) {
  // Round price to 2 decimal places
  if (this.price) {
    this.price = Math.round(this.price * 100) / 100;
  }
  
  // Ensure quantity is integer
  if (this.quantity) {
    this.quantity = Math.floor(this.quantity);
  }
  
  next();
});

// Static method to find sweets by search criteria
sweetSchema.statics.findBySearch = function(searchParams) {
  const query = {};
  
  // Name search (case-insensitive)
  if (searchParams.name) {
    query.name = { $regex: searchParams.name, $options: 'i' };
  }
  
  // Category filter (case-insensitive)
  if (searchParams.category) {
    query.category = { $regex: new RegExp(`^${searchParams.category}$`, 'i') };
  }
  
  // Price range
  if (searchParams.minPrice !== undefined || searchParams.maxPrice !== undefined) {
    query.price = {};
    if (searchParams.minPrice !== undefined) {
      query.price.$gte = parseFloat(searchParams.minPrice);
    }
    if (searchParams.maxPrice !== undefined) {
      query.price.$lte = parseFloat(searchParams.maxPrice);
    }
  }
  
  // Stock filter
  if (searchParams.inStock !== undefined) {
    if (searchParams.inStock === 'true') {
      query.quantity = { $gt: 0 };
    } else if (searchParams.inStock === 'false') {
      query.quantity = { $eq: 0 };
    }
  }
  
  return this.find(query).sort({ name: 1 });
};

// Instance method to check if purchase is possible
sweetSchema.methods.canPurchase = function(requestedQuantity) {
  return this.quantity >= requestedQuantity && requestedQuantity > 0;
};

// Instance method to purchase sweets
sweetSchema.methods.purchase = function(requestedQuantity) {
  if (!this.canPurchase(requestedQuantity)) {
    throw new Error('Insufficient stock or invalid quantity');
  }
  
  this.quantity -= requestedQuantity;
  return this.save();
};

// Instance method to restock sweets
sweetSchema.methods.restock = function(additionalQuantity) {
  if (additionalQuantity <= 0) {
    throw new Error('Restock quantity must be positive');
  }
  
  this.quantity += additionalQuantity;
  return this.save();
};

module.exports = mongoose.model('Sweet', sweetSchema);
