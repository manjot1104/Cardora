const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename: userId-timestamp-originalname
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${req.user.id}-${uniqueSuffix}${ext}`);
  }
});

// File filter - only allow images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: fileFilter
});

// @route   POST /api/upload/image
// @desc    Upload image for card
// @access  Private
router.post('/image', auth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const userId = req.user.id;
    const imageType = req.body.imageType || 'card'; // 'profile', 'background', 'card'
    const imageUrl = `/uploads/${req.file.filename}`;

    // Update user with image URL
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Delete old image if exists
    if (imageType === 'profile' && user.profileImage) {
      const oldImagePath = path.join(process.cwd(), 'public', user.profileImage);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    } else if (imageType === 'background' && user.cardBackgroundImage) {
      const oldImagePath = path.join(process.cwd(), 'public', user.cardBackgroundImage);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    } else if (imageType === 'couplePhoto' && user.couplePhoto) {
      const oldImagePath = path.join(process.cwd(), 'public', user.couplePhoto);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    // Update user based on image type
    if (imageType === 'profile') {
      user.profileImage = imageUrl;
    } else if (imageType === 'background') {
      user.cardBackgroundImage = imageUrl;
    } else if (imageType === 'couplePhoto') {
      user.couplePhoto = imageUrl;
    } else {
      // Add to cardImages array
      if (!user.cardImages) {
        user.cardImages = [];
      }
      user.cardImages.push(imageUrl);
    }

    await user.save();

    res.json({
      success: true,
      imageUrl: imageUrl,
      imageType: imageType,
      message: 'Image uploaded successfully'
    });
  } catch (error) {
    console.error('Image upload error:', error);
    
    // Delete uploaded file if there was an error
    if (req.file) {
      const filePath = path.join(uploadsDir, req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    res.status(500).json({ 
      error: error.message || 'Failed to upload image' 
    });
  }
});

// @route   DELETE /api/upload/image/:imageUrl
// @desc    Delete uploaded image
// @access  Private
router.delete('/image/:imageUrl', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const imageUrl = decodeURIComponent(req.params.imageUrl);
    const imagePath = path.join(process.cwd(), 'public', imageUrl);

    // Verify file exists
    if (!fs.existsSync(imagePath)) {
      return res.status(404).json({ error: 'Image not found' });
    }

    // Verify user owns this image (check filename starts with userId)
    const filename = path.basename(imageUrl);
    if (!filename.startsWith(userId + '-')) {
      return res.status(403).json({ error: 'Unauthorized to delete this image' });
    }

    // Update user to remove image reference
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Remove from user's image arrays
    if (user.profileImage === imageUrl) {
      user.profileImage = undefined;
    }
    if (user.cardBackgroundImage === imageUrl) {
      user.cardBackgroundImage = undefined;
    }
    if (user.cardImages && user.cardImages.includes(imageUrl)) {
      user.cardImages = user.cardImages.filter(url => url !== imageUrl);
    }

    await user.save();

    // Delete file
    fs.unlinkSync(imagePath);

    res.json({
      success: true,
      message: 'Image deleted successfully'
    });
  } catch (error) {
    console.error('Image delete error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to delete image' 
    });
  }
});

// @route   GET /api/upload/images
// @desc    Get all user's uploaded images
// @access  Private
router.get('/images', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('profileImage cardBackgroundImage cardImages');
    
    const images = {
      profile: user.profileImage || null,
      background: user.cardBackgroundImage || null,
      cards: user.cardImages || [],
    };

    res.json({
      success: true,
      images: images
    });
  } catch (error) {
    console.error('Get images error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to get images' 
    });
  }
});

module.exports = router;
