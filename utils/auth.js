const withAuth = (req, res, next) => {
    if (!req.session.user_id) {
        console.log('WITH UTH REDIRECTED!!!')
      res.redirect('/login');
    } else {
      next();
    }
  };
  
  module.exports = withAuth;