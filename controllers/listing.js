const Listing = require("../models/listing");
const { cloudinary } = require("../cloudConfig.js");
const ExpressError = require("../utils/ExpressError.js");

module.exports.index = async (req, res) => {
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
    const allListings = await Listing.find(filter);
    res.render("listings/index", { allListings, activeCategory: req.query.category || "" });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new");
};

module.exports.showlisting = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: { path: "author" }
        })
        .populate("owner");

    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }
    res.render("listings/show", { listing });
};

module.exports.createListing = async (req, res) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;

    if (req.file) {
        newListing.image = {
            url: req.file.path,
            filename: req.file.filename
        };
    }

    await newListing.save();
    req.flash("success", "New listing created!");
    res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        throw new ExpressError(404, "Listing not found!");
    }

    let originalImageUrl = "";
    if (listing.image && listing.image.url) {
        originalImageUrl = listing.image.url.replace("/upload", "/upload/h_300,w_250");
    }
    res.render("listings/edit", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }

    listing.set(req.body.listing);

    if (req.file) {
        listing.image = {
            url: req.file.path,
            filename: req.file.filename
        };
    }

    await listing.save();
    req.flash("success", "Listing updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    const { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);

    if (deletedListing?.image?.filename) {
        await cloudinary.uploader.destroy(deletedListing.image.filename);
    }

    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};