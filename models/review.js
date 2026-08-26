const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * Review Schema
 * Represents a review/feedback left by a user on a listing.
 */
const reviewSchema = new Schema({
    // The text content of the review
    comment: {
        type: String,
        required: true
    },
    // The rating score out of 5 stars
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    // Time the review was created (defaults to current time)
    createdAt: {
        type: Date,
        default: Date.now
    },
    // Reference to the User who wrote the review (one-to-many: a review has one author)
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
});

// Export the Review model
module.exports = mongoose.model("Review", reviewSchema);