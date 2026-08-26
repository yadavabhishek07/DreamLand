const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError.js"); 
const { listingSchema, reviewSchema } = require("./schema.js");

/**
 * Middleware: Check if the user is authenticated.
 * Used to protect routes that require a logged-in session.
 */
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        // Store the URL the user was trying to access so we can redirect them back after logging in
        req.session.redirectUrl = req.originalUrl; 
        req.flash("error", "You must be logged in to do that!");
        return res.redirect("/login");
    }
    next();
};

/**
 * Middleware: Save the redirect URL from the session to res.locals.
 * Since passport clears req.session on login, we move it to res.locals 
 * to access it in the login redirect handler.
 */
module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

/**
 * Middleware: Authorization check for Listing Owner.
 * Prevents unauthorized users from modifying or deleting listings.
 */
module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Cannot find that listing!");
        return res.redirect("/listings");
    }
    if (!req.user || !listing.owner.equals(req.user._id)) {
        req.flash("error", "You don't have permission to do that!");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

/**
 * Helper: Schema Validation middleware factory.
 * Compiles a validation middleware using Joi schemas to validate request body.
 */
const validateSchema = (schema) => (req, res, next) => {
    console.log("validateSchema - req.body:", req.body);
    const { error } = schema.validate(req.body);
    if (error) {
        console.log("validateSchema - Joi Error details:", error.details);
        const errMsg = error.details.map((el) => el.message).join(',');
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

// Expose schema-based validation middlewares
module.exports.validateListing = validateSchema(listingSchema);
module.exports.validateReview = validateSchema(reviewSchema);

/**
 * Middleware: Authorization check for Review Author.
 * Prevents users from deleting reviews they did not write.
 */
module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if (!review) {
        req.flash("error", "Cannot find that review!");
        return res.redirect(`/listings/${id}`);
    }
    // Check if the user is logged in AND if they are the author of the review
    if (!req.user || !review.author.equals(req.user._id)) {
        req.flash("error", "You are not the author of this review!");
        return res.redirect(`/listings/${id}`);
    }
    next();
};