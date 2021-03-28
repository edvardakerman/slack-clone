const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdminUser: {
    type: Boolean,
    required: true,
    default: false,
  },
  profilePhoto: {
    type: String,
    default: '/public/nophoto.png'
  },
});

module.exports = mongoose.model('User', userSchema);
