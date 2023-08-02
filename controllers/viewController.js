const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Wishlist = require('../models/wishlistModel');
const Review = require('../models/reviewModel');

exports.getOverview = catchAsync(async (req, res) => {
  let filter = {};
  let wishlist = [];

  if (req.user) {
    // Get the wishlists of the current user
    wishlist = await Wishlist.find({ user: req.user.id });
    wishlist = wishlist.map((wish) => wish.tour + '');
  }

  let tours = await Tour.find();

  // Map through the tours and check if each tour's ID exists in the wishlist array for the current user
  tours = tours.map(async (tour) => {
    const tempTour = tour.toObject();
    const hasWishlisted = wishlist.includes(tempTour.id);

    return { ...tempTour, wishlist: hasWishlisted };
  });

  tours = await Promise.all(tours);

  const users = await User.find().sort({ createdAt: -1 }).limit(10);

  // Build template and render it using tour data from above
  res.status(200).render('overview', {
    title: 'All Tours',
    tours: tours,
    users,
  });
});

exports.getWishlist = catchAsync(async (req, res) => {
  let wishlist = await Wishlist.find({ user: req.user.id });

  wishlist = wishlist.map(async (wish) => {
    const result = await Tour.findById(wish.tour);
    return { ...result.toObject(), wishlist: true };
  });
  wishlist = await Promise.all(wishlist);

  res.status(200).render('overview', {
    title: 'Wishlist',
    tours: wishlist,
  });
});

exports.getReviews = catchAsync(async (req, res) => {
  let reviews = await Review.find({ user: req.user.id });

  res.status(200).render('my-review', {
    reviews,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  // 1) Get the data, for the requested tour including reviews and guides
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });

  if (!tour) {
    return next(new AppError('There is no tour with that name. ', 404));
  }

  res.status(200).render('tour', {
    title: `${tour.name} tour`,
    tour,
  });
});

exports.getLoginForm = catchAsync(async (req, res) => {
  res.status(200).render('login', {
    title: 'Log into your account',
  });
});

exports.getSignupForm = catchAsync(async (req, res) => {
  res.status(200).render('signup', {
    title: 'Create your account',
  });
});
exports.getAccount = (req, res) => {
  res
    .status(200)
    .set('Content-Security-Policy', "connect-src 'self' http://127.0.0.1:3000")
    .render('account', {
      title: 'Your account',
    });
};

exports.getMyTours = catchAsync(async (req, res, next) => {
  // 1) Find all bookings
  const bookings = await Booking.find({ user: req.user.id });

  // 2) Find tours with the returned IDs
  const tourIDs = bookings.map((el) => el.tour);
  const tours = await Tour.find({ _id: { $in: tourIDs } });

  res.status(200).render('overview', {
    title: 'My Tours',
    tours,
  });
});

exports.updateUserData = catchAsync(async (req, res, next) => {
  // console.log(req.body);
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res
    .status(200)
    .set('Content-Security-Policy', "connect-src 'self' http://127.0.0.1:3000")
    .render('account', {
      title: 'Your account',
      user: updatedUser,
    });
});
