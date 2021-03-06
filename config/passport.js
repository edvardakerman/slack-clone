const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../models/user');

// för login
module.exports = (passport) => {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      //match user
      User.findOne({ email: email })
        .then((user) => {
          if (!user) {
            return done(null, false, {
              message: 'That email is not registered.',
            });
            /* const message = 'That email is not registered.'
            res.render('login', {message}) */
          }
          //crypterar och jämför lössenord
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false, { message: 'Incorrect password.' });
            }
          });
        })
        .catch((err) => {
          console.log(err);
        });
    })
  );
  // serilize
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  // deserializes
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
};
