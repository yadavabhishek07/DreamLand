const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const User = require("../models/user.js");

if (process.env.NODE_ENV !== "production") {
    require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
}

const MONGO_URL = process.env.ATLASDB_URL || "mongodb://127.0.0.1:27017/dream_land";

async function main() {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to DB");
    await initDB();
    console.log("Seeding complete");
    await mongoose.connection.close();
    process.exit(0);
}

const initDB = async () => {
    await Listing.deleteMany({});
    
    let user = await User.findOne({});
    if (!user) {
        const fakeUser = new User({ email: "test@example.com", username: "testuser" });
        user = await User.register(fakeUser, "password123");
    }

    const categories = ["Trending", "Room", "Iconic Cities", "Mountain", "Castles", "Pools", "Camping", "Farms"];
    initData.data = initData.data.map((obj, index) => ({
        ...obj,
        owner: user._id,
        category: categories[index % categories.length],
    }));

    await Listing.insertMany(initData.data);
    console.log("Data was initialized");
};

main().catch((err) => {
    console.error(err);
    process.exit(1);
});