/**
 * Dream Land Web Application - Main Entrypoint (app.js)
 * This file configures the Express application, sets up middleware, 
 * configures session storage with MongoDB, handles Passport authentication, 
 * mounts routes, and initializes the database connection.
 */

// 1. Environment Configurations
// Only load dotenv local variables in non-production environments.
if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

// 2. DNS Workaround for Node.js
// Fixes potential IPv6 resolution issues with MongoDB Atlas on local environments.
const dns = require('dns');
dns.setDefaultResultOrder && dns.setDefaultResultOrder('ipv4first');
try {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (err) {
    console.warn("Failed to set DNS servers:", err.message);
}

// 3. Module Imports
const express = require("express");
const app = express();
app.set("trust proxy", 1); // Trust reverse proxy headers (e.g. Render, Heroku) for HTTPS redirect URL generation
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo").default || require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

// 4. Route Imports
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

// 5. Database Connection String Config
let dbUrl = process.env.ATLASDB_URL;
const secret = process.env.SECRET || "thisshouldbeabettersecret!";

if (!dbUrl) {
    console.log("No ATLASDB_URL environment variable found.");
}

// 6. View Engine and Middleware Setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method")); // Allows PUT and DELETE requests from HTML forms
app.engine('ejs', ejsMate); // Use ejs-mate for layout templating (boilerplates)
app.use(express.static(path.join(__dirname, "/public"))); // Serve static files (CSS/JS)

/// 7. Server and Database Initialization
(async () => {
    let isInMemory = false;
    let mongoServer;

    // 1. Resolve dbUrl (Atlas -> Local -> Memory)
    if (!dbUrl) {
        console.log("No ATLASDB_URL environment variable found. Checking local MongoDB...");
        // Test local connection
        const localDbUri = "mongodb://127.0.0.1:27017/dream_land";
        const testLocalConnection = async () => {
            return new Promise((resolve) => {
                const net = require('net');
                const socket = new net.Socket();
                socket.setTimeout(1000);
                socket.on('connect', () => {
                    socket.destroy();
                    resolve(true);
                });
                socket.on('timeout', () => {
                    socket.destroy();
                    resolve(false);
                });
                socket.on('error', () => {
                    socket.destroy();
                    resolve(false);
                });
                socket.connect(27017, '127.0.0.1');
            });
        };

        const localDbRunning = await testLocalConnection();
        if (localDbRunning) {
            dbUrl = localDbUri;
            console.log("Found running local MongoDB instance. Using:", dbUrl);
        } else {
            console.log("Local MongoDB is not running. Attempting to start in-memory MongoDB server...");
            try {
                const { MongoMemoryServer } = require('mongodb-memory-server');
                mongoServer = await MongoMemoryServer.create({
                    binary: {
                        version: '6.0.16'
                    },
                    instance: {
                        startupTimeoutMS: 60000
                    }
                });
                dbUrl = mongoServer.getUri();
                isInMemory = true;
                console.log("Started in-memory MongoDB server at:", dbUrl);
            } catch (err) {
                console.warn("Could not start in-memory MongoDB server:", err.message);
                console.error("Please ensure MongoDB is installed and running, or configure ATLASDB_URL in a .env file.");
            }
        }
    }

    // 2. Connect mongoose
    if (dbUrl) {
        try {
            await mongoose.connect(dbUrl, {
                autoIndex: false,
                serverSelectionTimeoutMS: 5000,
            });
            console.log(`Connected to MongoDB: ${isInMemory ? "In-Memory Database" : dbUrl}`);

            // Automatically seed database if using in-memory database
            if (isInMemory) {
                await seedInMemoryDatabase();
            }
        } catch (err) {
            console.error("MongoDB connection failed:", err.message);
        }
    }

    // 3. Configure MongoDB Session Store
    let store;
    if (dbUrl && mongoose.connection.readyState === 1) {
        try {
            store = MongoStore.create({
                mongoUrl: dbUrl,
                ttl: 14 * 24 * 60 * 60, // Session lifespan: 14 days
                autoRemove: "native",
                crypto: {
                    secret: secret,
                },
            });

            store.on("error", (err) => {
                console.error("Mongo session store error:", err);
            });
        } catch (err) {
            console.error("Failed to create Mongo session store:", err.message);
        }
    }

    // 4. Session & Flash Middleware Configurations
    const sessionOptions = {
        ...(store ? { store } : {}),
        secret,
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true, // Enhances security (stops XSS from reading session ID)
            maxAge: 14 * 24 * 60 * 60 * 1000, // 14 days
        },
    };

    app.use(session(sessionOptions));
    app.use(flash()); // Flash messaging for success/error alerts

    // 5. Passport Authentication Setup
    app.use(passport.initialize());
    app.use(passport.session());
    passport.use(new LocalStrategy(User.authenticate())); // Uses passport-local for username/password authentication

    // Google OAuth 2.0 Strategy Configuration
    const GoogleStrategy = require("passport-google-oauth20").Strategy;
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID || "MOCK_CLIENT_ID",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || "MOCK_CLIENT_SECRET",
        callbackURL: "/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
            const email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null;
            if (!email) {
                return done(new Error("No email associated with this Google Account."));
            }
            
            let user = await User.findOne({ email: email.toLowerCase().trim() });
            if (!user) {
                const baseUsername = profile.displayName.replace(/\s+/g, "").toLowerCase();
                const randomSuffix = Math.floor(100 + Math.random() * 900);
                const username = baseUsername + randomSuffix;
                
                user = new User({ email: email.toLowerCase().trim(), username });
                await User.register(user, Math.random().toString(36).substring(2)); // Register with random local password
            }
            return done(null, user);
        } catch (err) {
            return done(err);
        }
      }
    ));

    // Configure serialization (saving user details to session) and deserialization
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser()); 

    // 6. Local Variables Middleware
    // Injects success, error flash messages, current logged-in user, and activeCategory query to EJS templates.
    app.use((req, res, next) => {
        res.locals.success = req.flash("success");
        res.locals.error = req.flash("error");
        res.locals.currUser = req.user;
        res.locals.activeCategory = req.query.category || "";
        next();
    });

    // 7. Route Mounting
    app.use("/listings", listingRouter);
    app.use("/listings/:id/reviews", reviewRouter);
    app.use("/", userRouter);

    // 8. 404 Route Handler
    app.use((req, res, next) => {
        next(new ExpressError(404, "Page not found"));
    });

    // 9. Global Error Handling Middleware
    // Automatically catches errors thrown from any of the wrapAsync controllers.
    app.use((err, req, res, next) => {
        let { statusCode = 500, message = "something went wrong" } = err;
        res.status(statusCode).render("error.ejs", { message, err });
    });

    // 10. Start Server
    const port = process.env.PORT || 5000;
    app.listen(port, () => {
        console.log(`Server is listening on port ${port}`);
    });
})();

async function seedInMemoryDatabase() {
    console.log("Seeding in-memory database with sample listings...");
    const Listing = require("./models/listing.js");
    const User = require("./models/user.js");
    const initData = require("./init/data.js");

    try {
        await Listing.deleteMany({});
        
        let user = await User.findOne({});
        if (!user) {
            let fakeUser = new User({ email: "test@example.com", username: "testuser" });
            user = await User.register(fakeUser, "password123");
        }

        const categories = ["Trending", "Room", "Iconic Cities", "Mountain", "Castels", "Pools", "Camping", "Farms"];
        const seededData = initData.data.map((obj, index) => ({
            ...obj,
            owner: user._id,
            category: categories[index % categories.length]
        }));

        await Listing.insertMany(seededData);
        console.log("In-memory database seeded successfully!");
    } catch (err) {
        console.error("Failed to seed in-memory database:", err.message);
    }
}


