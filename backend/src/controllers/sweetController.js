const Sweet = require('../models/Sweet');

// @desc    Create a new sweet
// @route   POST /api/sweets
// @access  Private (Admin only)
const createSweet = async (req, res) => {
  try {
    const { name, category, price, quantity } = req.body;

    // Validate required fields
    if (!name || !category || !price || quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, category, price, and quantity'
      });
    }

    // Validate price is positive
    if (price <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Price must be greater than 0'
      });
    }

    // Validate quantity is non-negative
    if (quantity < 0) {
      return res.status(400).json({
        success: false,
        message: 'Quantity cannot be negative'
      });
    }

    // Create sweet
    const sweet = await Sweet.create({
      name,
      category,
      price: parseFloat(price),
      quantity: parseInt(quantity)
    });

    res.status(201).json({
      success: true,
      data: sweet
    });
  } catch (error) {
    console.error('Create sweet error:', error);
    
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }

    // Handle duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({
        success: false,
        message: `${field} already exists`
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while creating sweet'
    });
  }
};

// @desc    Get all sweets
// @route   GET /api/sweets
// @access  Private
const getAllSweets = async (req, res) => {
  try {
    const sweets = await Sweet.find({}).sort({ name: 1 });

    res.json({
      success: true,
      data: sweets,
      count: sweets.length
    });
  } catch (error) {
    console.error('Get sweets error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching sweets'
    });
  }
};

// @desc    Search sweets
// @route   GET /api/sweets/search
// @access  Private
const searchSweets = async (req, res) => {
  try {
    const { name, category, minPrice, maxPrice } = req.query;

    // Build search parameters
    const searchParams = {};
    
    if (name) searchParams.name = name;
    if (category) searchParams.category = category;
    if (minPrice !== undefined) searchParams.minPrice = minPrice;
    if (maxPrice !== undefined) searchParams.maxPrice = maxPrice;

    // If no search parameters, return all sweets
    if (Object.keys(searchParams).length === 0) {
      const sweets = await Sweet.find({}).sort({ name: 1 });
      return res.json({
        success: true,
        data: sweets,
        count: sweets.length
      });
    }

    // Search sweets
    const sweets = await Sweet.findBySearch(searchParams);

    res.json({
      success: true,
      data: sweets,
      count: sweets.length
    });
  } catch (error) {
    console.error('Search sweets error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while searching sweets'
    });
  }
};

// @desc    Get single sweet by ID
// @route   GET /api/sweets/:id
// @access  Private
const getSweetById = async (req, res) => {
  try {
    const sweet = await Sweet.findById(req.params.id);

    if (!sweet) {
      return res.status(404).json({
        success: false,
        message: 'Sweet not found'
      });
    }

    res.json({
      success: true,
      data: sweet
    });
  } catch (error) {
    console.error('Get sweet error:', error);
    
    // Handle invalid ObjectId
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid sweet ID'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while fetching sweet'
    });
  }
};

// @desc    Update sweet
// @route   PUT /api/sweets/:id
// @access  Private (Admin only)
const updateSweet = async (req, res) => {
  try {
    const { name, category, price, quantity } = req.body;

    // Find sweet first
    let sweet = await Sweet.findById(req.params.id);

    if (!sweet) {
      return res.status(404).json({
        success: false,
        message: 'Sweet not found'
      });
    }

    // Validate price if provided
    if (price !== undefined && price <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Price must be greater than 0'
      });
    }

    // Validate quantity if provided
    if (quantity !== undefined && quantity < 0) {
      return res.status(400).json({
        success: false,
        message: 'Quantity cannot be negative'
      });
    }

    // Update fields
    if (name) sweet.name = name;
    if (category) sweet.category = category;
    if (price !== undefined) sweet.price = parseFloat(price);
    if (quantity !== undefined) sweet.quantity = parseInt(quantity);

    // Save updated sweet
    const updatedSweet = await sweet.save();

    res.json({
      success: true,
      data: updatedSweet
    });
  } catch (error) {
    console.error('Update sweet error:', error);
    
    // Handle invalid ObjectId
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid sweet ID'
      });
    }

    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while updating sweet'
    });
  }
};

// @desc    Delete sweet
// @route   DELETE /api/sweets/:id
// @access  Private (Admin only)
const deleteSweet = async (req, res) => {
  try {
    const sweet = await Sweet.findById(req.params.id);

    if (!sweet) {
      return res.status(404).json({
        success: false,
        message: 'Sweet not found'
      });
    }

    await sweet.deleteOne();

    res.json({
      success: true,
      message: 'Sweet deleted successfully'
    });
  } catch (error) {
    console.error('Delete sweet error:', error);
    
    // Handle invalid ObjectId
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid sweet ID'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while deleting sweet'
    });
  }
};

// @desc    Purchase sweet
// @route   POST /api/sweets/:id/purchase
// @access  Private
const purchaseSweet = async (req, res) => {
  try {
    const { quantity } = req.body;

    // Validate quantity
    if (!quantity || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid purchase quantity'
      });
    }

    // Find sweet
    const sweet = await Sweet.findById(req.params.id);

    if (!sweet) {
      return res.status(404).json({
        success: false,
        message: 'Sweet not found'
      });
    }

    // Check if purchase is possible
    if (!sweet.canPurchase(quantity)) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient stock or invalid quantity'
      });
    }

    // Process purchase
    await sweet.purchase(quantity);

    res.json({
      success: true,
      message: `Successfully purchased ${quantity} ${sweet.name}(s)`,
      data: {
        sweet,
        purchasedQuantity: quantity,
        remainingStock: sweet.quantity
      }
    });
  } catch (error) {
    console.error('Purchase sweet error:', error);
    
    // Handle invalid ObjectId
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid sweet ID'
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || 'Server error while processing purchase'
    });
  }
};

// @desc    Restock sweet
// @route   POST /api/sweets/:id/restock
// @access  Private (Admin only)
const restockSweet = async (req, res) => {
  try {
    const { quantity } = req.body;

    // Validate quantity
    if (!quantity || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid restock quantity'
      });
    }

    // Find sweet
    const sweet = await Sweet.findById(req.params.id);

    if (!sweet) {
      return res.status(404).json({
        success: false,
        message: 'Sweet not found'
      });
    }

    // Process restock
    await sweet.restock(quantity);

    res.json({
      success: true,
      message: `Successfully restocked ${quantity} ${sweet.name}(s)`,
      data: {
        sweet,
        restockedQuantity: quantity,
        totalStock: sweet.quantity
      }
    });
  } catch (error) {
    console.error('Restock sweet error:', error);
    
    // Handle invalid ObjectId
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid sweet ID'
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || 'Server error while processing restock'
    });
  }
};

module.exports = {
  createSweet,
  getAllSweets,
  searchSweets,
  getSweetById,
  updateSweet,
  deleteSweet,
  purchaseSweet,
  restockSweet
};
