const Wishlist = require('../models/wishlistModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.setTourUserIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getAllWishlist = factory.getAll(Wishlist);
exports.getWishlist = factory.getOne(Wishlist);
exports.createWishlist = factory.createOne(Wishlist);
exports.updateWishlist = factory.updateOne(Wishlist);
exports.deleteWishlist = factory.deleteOne(Wishlist);
