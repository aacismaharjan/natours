const express = require('express');
const authController = require('../controllers/authController');
const wishlistController = require('../controllers/wishlistController');
const Wishlist = require('../models/wishlistModel');
const AppError = require('../utils/appError');

const router = express.Router();

router.use(authController.protect);

router
  .route('/')
  .get((req, res, next) => {
    req.params.userId = req.user.id;
    next();
  }, wishlistController.getAllWishlist)
  .post(wishlistController.setTourUserIds, wishlistController.createWishlist);

router
  .route('/:id')
  .get(wishlistController.getWishlist)
  .patch(wishlistController.setTourUserIds, wishlistController.updateWishlist)
  .delete(async (req, res, next) => {
    const tourId = req.params.id;
    const userId = req.user.id;

    if (tourId && userId) {
      const wishlist = await Wishlist.findOne({ tour: tourId, user: userId });

      if (wishlist) {
        req.params.id = wishlist.toObject()._id;
        next();
      }
    }
  }, wishlistController.deleteWishlist);

module.exports = router;
