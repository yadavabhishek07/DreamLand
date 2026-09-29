const User = require("../models/user.js");
const passport = require("passport");
const sendOtpEmail = require("../utils/sendEmail.js");

module.exports.renderSignupForm = (req, res) => {
    res.render("user/authenticate.ejs");
};

module.exports.signup = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const normalizedEmail = email.toLowerCase().trim();
        const newUser = new User({ email: normalizedEmail, username });
        const registeredUser = await User.register(newUser, password);
        
        req.login(registeredUser, (err) => {
            if (err) return next(err);
            req.flash("success", "Welcome to Dream Land");
            res.redirect("/listings");
        });
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/login");
    }
};

module.exports.renderLoginForm = (req, res) => {
    res.render("user/authenticate.ejs");
};

module.exports.checkEmail = async (req, res) => {
    const { email } = req.query;
    if (!email) return res.json({ exists: false });
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    res.json({ exists: !!user });
};

module.exports.loginInitiate = async (req, res, next) => {
    if (req.body.email) {
        const user = await User.findOne({ email: req.body.email.toLowerCase().trim() });
        if (user) req.body.username = user.username;
    }

    passport.authenticate("local", (err, user, info) => {
        if (err) return next(err);
        if (!user) {
            req.flash("error", info.message || "Invalid email or password");
            return res.redirect("/login");
        }
        
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        
        req.session.tempUser = {
            id: user._id,
            otp: otp,
            expiresAt: Date.now() + 5 * 60 * 1000,
            redirectUrl: res.locals.redirectUrl || "/listings"
        };
        
        sendOtpEmail(user.email, otp, user.username);
        req.flash("success", "A verification code has been sent to your email.");
        res.redirect("/verify-login");
    })(req, res, next);
};

module.exports.renderVerifyForm = (req, res) => {
    if (!req.session.tempUser) {
        req.flash("error", "Session expired or invalid. Please login again.");
        return res.redirect("/login");
    }
    res.render("user/verify.ejs");
};

module.exports.verifyOtp = async (req, res, next) => {
    const { otp } = req.body;
    const tempUser = req.session.tempUser;
    
    if (!tempUser) {
        req.flash("error", "Session expired or invalid. Please login again.");
        return res.redirect("/login");
    }
    
    if (Date.now() > tempUser.expiresAt) {
        delete req.session.tempUser;
        req.flash("error", "Verification code has expired. Please login again.");
        return res.redirect("/login");
    }
    
    if (otp !== tempUser.otp) {
        req.flash("error", "Invalid verification code. Please try again.");
        return res.redirect("/verify-login");
    }
    
    try {
        const user = await User.findById(tempUser.id);
        if (!user) {
            delete req.session.tempUser;
            req.flash("error", "User not found.");
            return res.redirect("/login");
        }
        
        req.login(user, (err) => {
            if (err) return next(err);
            const redirectUrl = tempUser.redirectUrl || "/listings";
            delete req.session.tempUser;
            req.flash("success", "You are logged in!");
            res.redirect(redirectUrl);
        });
    } catch (err) {
        next(err);
    }
};

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        req.flash("success", "You are logged out!");
        res.redirect("/listings");
    });
};

module.exports.mockGoogleCallback = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        req.flash("error", "Simulated Google authentication failed.");
        return res.redirect("/login");
    }

    let user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
        const baseUsername = email.split("@")[0].replace(/\s+/g, "").toLowerCase();
        const username = baseUsername + Math.floor(100 + Math.random() * 900);
        user = new User({ email: email.toLowerCase().trim(), username });
        await User.register(user, Math.random().toString(36).substring(2));
    }

    req.login(user, (err) => {
        if (err) return next(err);
        req.flash("success", `Welcome to DreamLand! Logged in as ${user.username}.`);
        res.redirect("/listings");
    });
};