module.exports = {
  ensureAuthenticated: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    const message = 'Please login to view this resource.';
    res.render('login', { message });
  },
};
