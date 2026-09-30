const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { User } = require('../../server/src/modules/users/user.model.js');

async function reset() {
  await mongoose.connect('mongodb://localhost:27017/uass_dev');
  const hash = await bcrypt.hash('password123', 12);
  await User.updateOne({ email: 'admin@uass.local' }, { passwordHash: hash });
  console.log('Password reset to password123');
  process.exit(0);
}
reset();
