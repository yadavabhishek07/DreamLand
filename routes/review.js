const express = require("express");
// mergeParams: true allows us to access parameters from the parent router (e.g. :id for listingId)
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");

// POST Route: Create a new review on a listing
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

// DELETE Route: Delete a review from a listing
router.delete(
    "/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(reviewController.destroyReview)
);

module.exports = router;