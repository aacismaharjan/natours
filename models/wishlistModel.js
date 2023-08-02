const mongoose = require('mongoose');
const User = require('./userModel');
const Tour = require('./tourModel');

const wishlistSchema = new mongoose.Schema(
  {
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Wishlist must have a tour.'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Wishlist must belong to a user.'],
    },
    active: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

wishlistSchema.index({ tour: 1, user: 1 }, { unique: true });

wishlistSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo',
  });

  next();
});

const Wishlist = mongoose.model('Wishlist', wishlistSchema);
module.exports = Wishlist;
