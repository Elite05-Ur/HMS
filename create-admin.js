const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
require('dotenv').config();
const userModel = require('./src/model/user.model');

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const existing = await userModel.findOne({ email: 'admin@hms.com' });
  if (!existing) {
    const hash = await bcrypt.hash('admin123', 10);
    await userModel.create({ username: 'admin', email: 'admin@hms.com', password: hash, role: 'admin' });
    console.log('created admin account');
  } else {
    console.log('admin account already exists');
  }
  await mongoose.disconnect();
})();
