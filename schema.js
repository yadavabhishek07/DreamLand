/**
 * Validation Schemas (Joi)
 * Provides server-side validation schemas to ensure incoming request data
 * matches expected rules before writing to MongoDB.
 */

const Joi = require('joi');

// Schema to validate Listing body input data
module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.string().allow("", null),
        category: Joi.string().valid("Trending", "Room", "Iconic Cities", "Mountain", "Castels", "Pools", "Camping", "Farms").optional(),
    }).required()
});

// Schema to validate Review body input data
module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required(),
    }).required()
});     