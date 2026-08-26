const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/user.js");

// Redirect root domain to listings page
router.get("/", (req, res) => {
    res.redirect("/listings");
});

// API: Check if email exists (for unified login/signup flow)
router.get("/api/check-email", wrapAsync(userController.checkEmail));

// Render and handle the signup form flow
router.route("/signup")
    .get(userController.renderSignupForm)
    .post(wrapAsync(userController.signup));

// Render and handle the login form flow.
// Initiates the login by validating credentials and triggering OTP generation.
router.route("/login")
    .get(userController.renderLoginForm)
    .post(
        saveRedirectUrl, // Middleware to save the redirect URL
        wrapAsync(userController.loginInitiate)
    );

// Render and process the OTP verification code flow
router.route("/verify-login")
    .get(userController.renderVerifyForm)
    .post(wrapAsync(userController.verifyOtp));

// Handle the user logout flow
router.get("/logout", userController.logout);

// Google OAuth Initiation Route (with simulated Google interface if credentials are missing)
router.get("/auth/google", (req, res, next) => {
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || process.env.GOOGLE_CLIENT_ID === "MOCK_CLIENT_ID") {
        // Render mock Google Account selection screen for zero-config local development
        return res.render("user/mockGoogle.ejs");
    }
    passport.authenticate("google", { scope: ["profile", "email"] })(req, res, next);
});

// Google OAuth Callback Route (Real Google redirects here)
router.get("/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/login", failureFlash: true }),
    (req, res) => {
        req.flash("success", "Welcome to Dream Land! Logged in with Google.");
        res.redirect("/listings");
    }
);

// Simulated Google OAuth Callback Route (Mock Google redirects here)
const User = require("../models/user.js");
router.post("/auth/google/mock-callback", wrapAsync(async (req, res, next) => {
    const { email, name } = req.body;
    if (!email) {
        req.flash("error", "Simulated Google authentication failed.");
        return res.redirect("/login");
    }

    let user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
        // Automatically create and register the simulated user
        const baseUsername = email.split("@")[0].replace(/\s+/g, "").toLowerCase();
        const randomSuffix = Math.floor(100 + Math.random() * 900);
        const username = baseUsername + randomSuffix;

        user = new User({ email: email.toLowerCase().trim(), username });
        await User.register(user, Math.random().toString(36).substring(2)); // Register with random local password
    }

    req.login(user, (err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", `Welcome to Dream Land! Logged in with Google Account (${email}).`);
        res.redirect("/listings");
    });
}));

module.exports = router;  