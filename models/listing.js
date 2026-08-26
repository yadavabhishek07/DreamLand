/**
 * Listing Model
 * Represents a lodging listing (e.g., room, apartment, villa) with properties 
 * like title, description, image, price, location, reviews, and owner.
 */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
    // Title/name of the listing
    title: {
        type: String,
        required: true, 
    },
    // Detailed description
    description: String,
    // Uploaded image details (URL and filename from Cloudinary)
    image: {
        url: String,
        filename: String,
    },
    // Cost per night
    price: Number,
    // City/region location
    location: String,
    // Country location
    country: String,
    // Category for filtering listings (e.g. Trending, Room, Pools)
    category: {
        type: String,
        enum: ["Trending", "Room", "Iconic Cities", "Mountain", "Castels", "Pools", "Camping", "Farms"],
        default: "Room",
    },
    // One-to-Many Relationship: Reference array of Review ObjectIds
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
    // One-to-One Relationship: Reference to the User owner who created the listing
    owner: {
        type: Schema.Types.ObjectId, 
        ref: "User",
    },
});

/**
 * Mongoose Query Post Hook (findOneAndDelete)
 * Automatically runs after findByIdAndDelete or findOneAndDelete queries.
 * Cleans up and deletes all Review documents referenced by this Listing.
 */
listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }   
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing; 