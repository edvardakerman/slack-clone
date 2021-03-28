const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const channelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 100,
  },
  description: {
    type: String,
  },
  private: {
    type: Boolean,
    required: true,
    default: false,
  },
  posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
});

module.exports = mongoose.model('Channel', channelSchema);
