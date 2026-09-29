if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const dns = require("dns");
dns.setDefaultResultOrder && dns.setDefaultResultOrder("ipv4first");
try {
    dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (err) {
    // Continue if DNS server override is restricted
}

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const MongoStore = require("connect-mongo").default || require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const User = require("./models/user.js");
const ExpressError = require("./utils/ExpressError.js");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const app = express();
app.set("trust proxy", 1);

// View engine & middleware setup
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// MongoDB connection
const dbUrl = process.env.ATLASDB_URL || "mongodb+srv://abhisheky0718_db_user:8HwcrAloqa7o9pWj@cluster0.dnarzwz.mongodb.net/dream_land?appName=Cluster0";
const secret = process.env.SECRET || "dreamland_session_secret_key";

async function connectDB() {
    if (mongoose.connection.readyState === 1) return;
    try {
        await mongoose.connect(dbUrl, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log("Connected to MongoDB successfully.");
    } catch (err) {
        console.error("MongoDB connection error:", err.message);
    }
}
connectDB();

app.use(async (req, res, next) => {
    await connectDB();
    next();
});

// Session configuration
const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: { secret },
    touchAfter: 24 * 3600,
});

store.on("error", (err) => {
    console.error("Mongo Session Store Error:", err);
});

app.use(session({
    store,
    secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    },
}));

app.use(flash());

// Authentication setup
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || "MOCK_CLIENT_ID",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "MOCK_CLIENT_SECRET",
    callbackURL: "/auth/google/callback",
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null;
        if (!email) return done(new Error("No email associated with Google account"));
        
        let user = await User.findOne({ email: email.toLowerCase().trim() });
        if (!user) {
            const baseUsername = profile.displayName.replace(/\s+/g, "").toLowerCase();
            const username = baseUsername + Math.floor(100 + Math.random() * 900);
            user = new User({ email: email.toLowerCase().trim(), username });
            await User.register(user, Math.random().toString(36).substring(2));
        }
        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Global template variables
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    res.locals.activeCategory = req.query.category || "";
    next();
});

// Routes
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// 404 & Centralized Error Handler
app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("error.ejs", { message, err });
});

const PORT = process.env.PORT || 5000;
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`DreamLand server running on port ${PORT}`);
    });
}

module.exports = app;
