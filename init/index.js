const dns = require('dns');
dns.setDefaultResultOrder && dns.setDefaultResultOrder('ipv4first');
try {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (err) {
    console.warn("Failed to set DNS servers:", err.message);
}

if (process.env.NODE_ENV !== "production") {
    require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
}

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const User = require("../models/user.js");

const MONGO_URL = process.env.ATLASDB_URL || "mongodb://127.0.0.1:27017/dream_land";

  main()
    .then(async () => {
      console.log("connected to db");
      await initDB();
      console.log("seeding complete");
      await mongoose.connection.close();
      process.exit(0);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
 
 async function main(){
     await mongoose.connect(MONGO_URL);
     
 }
 
 const initDB = async() =>{
  await Listing.deleteMany({});
  
  let user = await User.findOne({});
  if (!user) {
    let fakeUser = new User({ email: "test@example.com", username: "testuser" });
    user = await User.register(fakeUser, "password123");
  }

  const categories = ["Trending", "Room", "Iconic Cities", "Mountain", "Castels", "Pools", "Camping", "Farms"];
  initData.data = initData.data.map((obj, index)=>({
    ...obj,
    owner: user._id,
    category: categories[index % categories.length]
  }));
  await Listing.insertMany(initData.data);
  console.log("data was intialized")
 };

// initialization is triggered after DB connection above
 