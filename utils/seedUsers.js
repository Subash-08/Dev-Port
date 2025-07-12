const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/user');

dotenv.config({ path: './config/.env' });

const users = [
  {
    username: 'dev-subash',
    firstName: 'Subash',
    lastName: 'M',
    email: 'subash@example.com',
    password: 'password123',
    avatar: 'https://i.pravatar.cc/150?img=68',
    bio: 'Full-stack developer building DevPort'
  },
  {
    username: 'devjane',
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'jane@example.com',
    password: 'password123',
    avatar: 'https://i.pravatar.cc/150?img=12',
    bio: 'React lover & open source contributor'
  }
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB ✅');

    for (const user of users) {
      const exists = await User.findOne({ $or: [{ email: user.email }, { username: user.username }] });
      if (!exists) {
        const newUser = new User(user);
        await newUser.save();
        console.log(`✔️ Added: ${user.username}`);
      } else {
        console.log(`⚠️ Skipped (exists): ${user.username}`);
      }
    }

    process.exit();
  } catch (err) {
    console.error('❌ Error inserting users:', err.message);
    process.exit(1);
  }
};

seed();
