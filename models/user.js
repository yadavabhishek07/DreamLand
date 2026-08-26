/**
 * User Model
 * Represents a registered user. Integrates with passport-local-mongoose 
 * to handle secure credentials salting/hashing and username/password fields automatically.
 */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    // User's email address
    email: {
        type: String, 
        required: true,
    },
});

// Configure passportLocalMongoose plugin.
// This automatically adds username, hash, and salt fields to the userSchema.
userSchema.plugin(passportLocalMongoose.default || passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);