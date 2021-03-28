const express = require('express');
const router = express.Router();
const Channel = require('../models/channel');
const User = require('../models/user');
const Post = require('../models/post');
const { ensureAuthenticated } = require('../config/auth.js');
router.use(express.json());

router.get('/channels', ensureAuthenticated, (req, res) => {
  Channel.find({ private: false }, (err, channels) => {
    if (err) return handleError(err);
    res.status(200).json(channels);
  });
});

router.get('/users', ensureAuthenticated, (req, res) => {
  User.find({}, (err, users) => {
    if (err) return handleError(err);
    res.status(200).json(users);
  });
});

router.post('/channels/:id', ensureAuthenticated, (req, res) => {
  var post = new Post({
    by: req.user.name,
    byId: req.user._id,
    content: req.body.content,
  });
  post.save((err) => {
    if (err) return handleError(err);
    Channel.updateOne(
      { _id: req.params.id },
      { $push: { posts: post } },
      (err) => {
        if (err) return handleError(err);
        res.status(201).json(post);
      }
    );
  });
});

module.exports = router;
