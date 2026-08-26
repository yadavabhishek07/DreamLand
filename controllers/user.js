const User = require("../models/user.js");
const passport = require("passport");
const sendOtpEmail = require("../utils/sendEmail.js");

/**
 * Controller: Render Signup Form (Redirect to unified authentication page)
 * GET /signup
 */
module.exports.renderSignupForm = (req, res) => {
    res.render("user/authenticate.ejs");
};

/**
 * Controller: Register a new user
 * POST /signup
 */
module.exports.signup = async (req, res, next) => {
    try {
        let { username, email, password } = req.body;
        const normalizedEmail = email.toLowerCase().trim();
        const newUser = new User({ email: normalizedEmail, username });
        // passport-local-mongoose registers user and automatically hashes/salts password
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        
        // Log in the user immediately after successful registration
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to Dream Land");
            res.redirect("/listings");
        });
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/login");   
    }
};

/**
 * Controller: Render Login Form (Redirect to unified authentication page)
 * GET /login
 */
module.exports.renderLoginForm = (req, res) => {
    res.render("user/authenticate.ejs");
};

/**
 * Controller: Check if an email exists
 * GET /api/check-email
 */
module.exports.checkEmail = async (req, res) => {
    const { email } = req.query;
    if (!email) {
        return res.json({ exists: false });
    }
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    res.json({ exists: !!user });
};

/**
 * Controller: Initiate Login (Credential authentication & OTP dispatch)
 * POST /login
 */
module.exports.loginInitiate = async (req, res, next) => {
    // If email is passed in request body, resolve username for passport strategy
    if (req.body.email) {
        const user = await User.findOne({ email: req.body.email.toLowerCase().trim() });
        if (user) {
            req.body.username = user.username;
        }
    }

    passport.authenticate("local", (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            req.flash("error", info.message || "Invalid email or password");
            return res.redirect("/login");
        }
        
        // Generate a random 6-digit verification code
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Store user login info temporarily in session
        req.session.tempUser = {
            id: user._id,
            otp: otp,
            expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
            redirectUrl: res.locals.redirectUrl || "/listings"
        };
        
        // Send verification code to user's registered email
        sendOtpEmail(user.email, otp, user.username);
        
        req.flash("success", "A verification code has been sent to your email.");
        res.redirect("/verify-login");
    })(req, res, next);
};

/**
 * Controller: Render OTP verification view
 * GET /verify-login
 */
module.exports.renderVerifyForm = (req, res) => {
    if (!req.session.tempUser) {
        req.flash("error", "Session expired or invalid. Please login again.");
        return res.redirect("/login");
    }
    res.render("user/verify.ejs");
};

/**
 * Controller: Validate OTP and finalize session login
 * POST /verify-login
 */
module.exports.verifyOtp = async (req, res, next) => {
    const { otp } = req.body;
    const tempUser = req.session.tempUser;
    
    if (!tempUser) {
        req.flash("error", "Session expired or invalid. Please login again.");
        return res.redirect("/login");
    }
    
    // Check code expiration
    if (Date.now() > tempUser.expiresAt) {
        delete req.session.tempUser;
        req.flash("error", "Verification code has expired. Please login again.");
        return res.redirect("/login");
    }
    
    // Match OTP code
    if (otp !== tempUser.otp) {
        req.flash("error", "Invalid verification code. Please try again.");
        return res.redirect("/verify-login");
    }
    
    // Verification successful: fetch user from DB and log in
    try {
        const user = await User.findById(tempUser.id);
        if (!user) {
            delete req.session.tempUser;
            req.flash("error", "User not found.");
            return res.redirect("/login");
        }
        
        req.login(user, (err) => {
            if (err) {
                return next(err);
            }
            const redirectUrl = tempUser.redirectUrl || "/listings";
            delete req.session.tempUser; // Clear temp user credentials
            req.flash("success", "You are logged in!");
            res.redirect(redirectUrl);
        });
    } catch (err) {
        next(err);
    }
};

/**
 * Controller: Log out a user
 * GET /logout
 */
module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You are logged out!");
        res.redirect("/listings");
    });
};    