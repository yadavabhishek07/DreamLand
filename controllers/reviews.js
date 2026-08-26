/**
 * Reviews Controller
 * Houses business logic for handling user reviews/ratings on listings.
 */

const Listing = require("../models/listing");
const Review = require("../models/review");
const ExpressError = require("../utils/ExpressError.js");

/**
 * Controller: Create a review on a listing
 * POST /listings/:id/reviews
 */
module.exports.createReview = async (req, res) => {
    // Find the listing that is being reviewed
    let listing = await Listing.findById(req.params.id);
    if (!listing) {
        throw new ExpressError(404, "Listing not found");
    }

    // Instantiate new Review
    let newReview = new Review(req.body.review);
    // Associate the logged-in user as the review author
    newReview.author = req.user._id;
    console.log(newReview);
 
    // Save review to the database
    await newReview.save();
    // Add review reference to the listing's reviews array
    listing.reviews.push(newReview._id);
    await listing.save();

    req.flash("success", "New review created!");
    res.redirect(`/listings/${listing._id}`);
};

/**
 * Controller: Delete a review from a listing
 * DELETE /listings/:id/reviews/:reviewId
 */
module.exports.destroyReview = async (req, res) => {
    let { id, reviewId } = req.params;

    // Delete the Review document from Reviews collection
    await Review.findByIdAndDelete(reviewId);
    // Pull (remove) the review ID reference from the Listing's reviews array
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

    req.flash("success", "Review Deleted!");
    res.redirect(`/listings/${id}`);
};