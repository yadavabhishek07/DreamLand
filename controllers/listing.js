/**
 * Listing Controller
 * Part of the MVC (Model-View-Controller) architecture.
 * This controller houses the business logic for listings: fetching,
 * displaying, creating, editing, and deleting listings.
 */

const Listing = require("../models/listing");
const { cloudinary } = require("../cloudConfig.js");
const ExpressError = require("../utils/ExpressError.js");

/**
 * Controller: Get all listings
 * GET /listings
 */
module.exports.index = async (req, res, next) => {
    let filter = {};
    if (req.query.category) {
        filter.category = req.query.category;
    } else if (req.query.search) {
        const searchRegex = new RegExp(req.query.search, "i");
        filter = {
            $or: [
                { location: searchRegex },
                { country: searchRegex },
                { title: searchRegex }
            ]
        };
    }
    // Fetch filtered listings from the database
    const allListings = await Listing.find(filter);
    // Render the index template with listings data and active category state
    res.render("listings/index", { allListings, activeCategory: req.query.category || "" });
};

/**
 * Controller: Render form to create a new listing
 * GET /listings/new
 */
module.exports.renderNewForm = (req, res) => {
    res.render("listings/new");
};

/**
 * Controller: Display details for a single listing
 * GET /listings/:id
 */
module.exports.showlisting = async (req, res) => {
    let { id } = req.params;
    // Populate reviews, their authors, and the owner of the listing
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author",
            },
        })
        .populate("owner");
    
    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show", { listing });
};

/**
 * Controller: Create a new listing
 * POST /listings
 */
module.exports.createListing = async (req, res, next) => {
    // Instantiate new Listing using the request body validated data
    const newListing = new Listing(req.body.listing);
    // Assign the logged-in user as the owner of this listing
    newListing.owner = req.user._id;

    console.log("createListing - req.body.listing:", req.body.listing);
    console.log("createListing - req.file:", req.file);

    // If a file was uploaded, extract its Cloudinary URL and filename
    if (req.file) {
        let url = req.file.path;
        let filename = req.file.filename;
        newListing.image = { url, filename };
    }

    // Save the listing to MongoDB
    await newListing.save();
    console.log("createListing - saved listing:", newListing);
    req.flash("success", "New listing created!");
    res.redirect("/listings");
};

/**
 * Controller: Render form to edit an existing listing
 * GET /listings/:id/edit
 */
module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        throw new ExpressError(404, "Listing not found!");
    }
    
    // Create a smaller/lower resolution thumbnail preview of the image for the form
    let originalImageUrl = "";
    if (listing.image && listing.image.url) {
        originalImageUrl = listing.image.url.replace("/upload", "/upload/h_300,w_250");
    }
    res.render("listings/edit", { listing, originalImageUrl });
};

/**
 * Controller: Update listing
 * PUT /listings/:id
 */
module.exports.updateListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }

    // Merge listing fields from the update form
    listing.set(req.body.listing);

    // If a new file is uploaded, update image URL and Cloudinary filename reference
    if (req.file) {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
    }
    
    await listing.save();
    req.flash("success", "Listing updated!");
    res.redirect(`/listings/${id}`);
};

/**
 * Controller: Delete listing and its images from cloud
 * DELETE /listings/:id
 */
module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    // Find and delete the listing. Triggers post "findOneAndDelete" middleware to clean reviews
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);

    // Clean up the image hosted on Cloudinary
    if (deletedListing.image && deletedListing.image.filename) {
        await cloudinary.uploader.destroy(deletedListing.image.filename);
    }

    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};