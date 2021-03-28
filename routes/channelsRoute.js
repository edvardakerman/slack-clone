const express = require('express');
const router = express.Router();
const Channel = require('../models/channel');
const Post = require('../models/post');

const { ensureAuthenticated } = require('../config/auth.js');
router.use(express.urlencoded({ extended: true }));

router.get('/', ensureAuthenticated, (req, res) => {
  res.render('index', { user: req.user });
});

router.post('/create', ensureAuthenticated, (req, res) => {
  const channel = new Channel({
    name: req.body.name,
    description: req.body.description || '',
    private: req.body.private ? true : false,
  });
  channel.save((err) => {
    if (err) return console.error(err);
    console.log('Channel created.');
    res.redirect('/channels');
  });
});

//Handle individual channel

router.get('/:id', ensureAuthenticated, (req, res) => {
  Channel.findById(req.params.id)
    .populate({
      path: 'posts',
      populate: {
        path: 'byId',
        model: 'User',
      },
    })
    .exec((err, channel) => {
      if (err) return console.error(err);
      res.render('channel.ejs', { channel: channel, user: req.user });
    });
});

//DMorProfile
router.get('/DMorProfile/:id', ensureAuthenticated, (req, res) => {
  if (req.params.id === req.user._id.toString()) {
    res.redirect('/users/profile');
  } else {
    res.send('<h1>Here we will add DM functionality</h1>');
  }
});

//Edit and Delete posts
router.get(
  '/editPost/:channel_id/:post_id',
  ensureAuthenticated,
  (req, res) => {
    Post.findById(req.params.post_id)
      .populate('byId')
      .exec((err, data) => {
        if (err) return console.error(err);
        res.render('editPost', {
          post: data,
          user: req.user,
          channel_id: req.params.channel_id,
        });
      });
  }
);

router.get(
  '/deletePost/:channel_id/:post_id',
  ensureAuthenticated,
  (req, res) => {
    Post.findById(req.params.post_id)
      .populate('byId')
      .exec((err, post) => {
        if (err) return console.error(err);
        if (req.user._id.toString() === post.byId._id.toString()) {
          Post.findByIdAndDelete(req.params.post_id).exec((err, data) => {
            if (err) return console.error(err);
            res.redirect(`/channels/${req.params.channel_id}`);
          });
        } else {
          res.send('<h1>You are not authorized to do this.</h1>');
        }
      });
  }
);

module.exports = router;
