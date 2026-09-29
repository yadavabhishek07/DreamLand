const express = require("express");
const router = express.Router();
const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync.js");
const { saveRedirectUrl } = require("../middlewares.js");
const userController = require("../controllers/user.js");

router.get("/", (req, res) => {
    res.redirect("/listings");
});

router.get("/api/check-email", wrapAsync(userController.checkEmail));

router.route("/signup")
    .get(userController.renderSignupForm)
    .post(wrapAsync(userController.signup));

router.route("/login")
    .get(userController.renderLoginForm)
    .post(saveRedirectUrl, wrapAsync(userController.loginInitiate));

router.route("/verify-login")
    .get(userController.renderVerifyForm)
    .post(wrapAsync(userController.verifyOtp));

router.get("/logout", userController.logout);

router.get("/auth/google", (req, res, next) => {
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || process.env.GOOGLE_CLIENT_ID === "MOCK_CLIENT_ID") {
        return res.render("user/mockGoogle.ejs");
    }
    passport.authenticate("google", { scope: ["profile", "email"] })(req, res, next);
});

router.get("/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/login", failureFlash: true }),
    (req, res) => {
        req.flash("success", "Welcome to DreamLand! Logged in with Google.");
        res.redirect("/listings");
    }
);

router.post("/auth/google/mock-callback", wrapAsync(userController.mockGoogleCallback));

module.exports = router;