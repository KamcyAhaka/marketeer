const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({
    error: 'Unauthorized: You must log in via OAuth to access this resource',
  });
};

module.exports = { isAuthenticated };
