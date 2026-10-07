const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { User } = require('../../server/src/modules/users/user.model.js');

async function reset() {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is required. Configure the MongoDB Atlas connection string.');
  }
  await mongoose.connect(process.env.MONGODB_URI);
  const hash = await bcrypt.hash('password123', 12);
  await User.updateOne({ email: 'admin@uass.local' }, { passwordHash: hash });
  console.log('Password reset to password123');
  process.exit(0);
}
reset();
