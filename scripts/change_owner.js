/*
Usage:
  - Dry run (shows matches):
      node scripts/change_owner.js
  - Apply changes:
      node scripts/change_owner.js --apply

Make sure MongoDB is running locally and the project dependencies are installed.
*/

require('dotenv').config();
const mongoose = require('mongoose');
const path = require('path');

const MONGO_URL = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/dream_land';

async function main() {
  await mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to', MONGO_URL);

  const User = require(path.join(__dirname, '..', 'models', 'user'));
  const Listing = require(path.join(__dirname, '..', 'models', 'listing'));

  const oldUsername = 'delta-students';
  const newUsername = 'abhisek';

  const oldUser = await User.findOne({ username: oldUsername });
  if (!oldUser) {
    console.error('Old user not found:', oldUsername);
    process.exit(1);
  }
  const newUser = await User.findOne({ username: newUsername });
  if (!newUser) {
    console.error('New user not found:', newUsername);
    process.exit(1);
  }

  const matches = await Listing.find({ owner: oldUser._id }).select('_id title owner');
  console.log(`Found ${matches.length} listing(s) owned by ${oldUsername}.`);
  if (matches.length) {
    console.log('Sample matches:');
    matches.slice(0, 10).forEach((m) => console.log('-', m._id.toString(), '|', m.title || '(no title)'));
  }

  const apply = process.argv.includes('--apply');
  if (!apply) {
    console.log('\nDry run complete. To apply the change, run:');
    console.log('  node scripts/change_owner.js --apply');
    await mongoose.disconnect();
    process.exit(0);
  }

  const result = await Listing.updateMany({ owner: oldUser._id }, { $set: { owner: newUser._id } });
  console.log(`Updated ${result.modifiedCount || result.nModified || result.n} listing(s) to owner ${newUsername}.`);

  await mongoose.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
