const express = require('express');
const {
  createSweet,
  getAllSweets,
  searchSweets,
  getSweetById,
  updateSweet,
  deleteSweet,
  purchaseSweet,
  restockSweet
} = require('../controllers/sweetController');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/sweets
// @desc    Get all sweets
// @access  Public
router.get('/', getAllSweets);

// @route   GET /api/sweets/search
// @desc    Search sweets
// @access  Public
router.get('/search', searchSweets);

// @route   GET /api/sweets/:id
// @desc    Get single sweet by ID
// @access  Public
router.get('/:id', getSweetById);

// Apply authentication middleware to protected routes
router.use(protect);

// @route   POST /api/sweets
// @desc    Create a new sweet
// @access  Private (Admin only)
router.post('/', admin, createSweet);

// @route   PUT /api/sweets/:id
// @desc    Update sweet
// @access  Private (Admin only)
router.put('/:id', admin, updateSweet);

// @route   DELETE /api/sweets/:id
// @desc    Delete sweet
// @access  Private (Admin only)
router.delete('/:id', admin, deleteSweet);

// @route   POST /api/sweets/:id/purchase
// @desc    Purchase sweet
// @access  Private
router.post('/:id/purchase', purchaseSweet);

// @route   POST /api/sweets/:id/restock
// @desc    Restock sweet
// @access  Private (Admin only)
router.post('/:id/restock', admin, restockSweet);

module.exports = router;
