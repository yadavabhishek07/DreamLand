const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

// Route Chaining for "/"
// GET: Fetch all listings
// POST: Create a new listing (requires authentication, file upload, Joi validation)
router.route("/")
    .get(wrapAsync(listingController.index)) 
    .post(
        isLoggedIn,
        upload.single('listing[image]'),
        validateListing,
        wrapAsync(listingController.createListing) 
    );     
   
// GET Route: Render form to create a new listing (requires login)
router.get("/new", isLoggedIn, listingController.renderNewForm);

// Route Chaining for "/:id"
// GET: Display details for a single listing
// PUT: Update a listing (requires login, owner authorization, file upload, Joi validation)
// DELETE: Delete a listing (requires login, owner authorization)
router.route("/:id")
    .get(wrapAsync(listingController.showlisting))
    .put(
        isLoggedIn,
        isOwner,
        upload.single('listing[image]'),
        validateListing,
        wrapAsync(listingController.updateListing)
    )
    .delete(
        isLoggedIn, 
        isOwner,
        wrapAsync(listingController.destroyListing)
    );

// GET Route: Render form to edit an existing listing (requires login and owner authorization)
router.get("/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.renderEditForm)
); 

module.exports = router;