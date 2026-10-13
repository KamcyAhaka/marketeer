const getStatus = (req, res) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return res.status(200).json({
      loggedIn: true,
      user: {
        id: req.user.id || req.user._json?.id,
        username: req.user.username || req.user._json?.login,
        displayName: req.user.displayName || req.user._json?.name,
        email:
          req.user.emails && req.user.emails[0]
            ? req.user.emails[0].value
            : req.user._json?.email || null,
        provider: req.user.provider || 'github',
      },
    });
  }
  return res.status(200).json({
    loggedIn: false,
    user: null,
  });
};

const getProfile = (req, res) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).json({
      error: 'Unauthorized: You must log in via OAuth to access this profile',
    });
  }
  return res.status(200).json({
    message: 'User profile retrieved successfully',
    profile: req.user,
  });
};

const logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    if (req.session) {
      req.session.destroy(() => {
        res.clearCookie('connect.sid');
        return res.status(200).json({
          message: 'Logged out successfully',
          loggedIn: false,
        });
      });
    } else {
      return res.status(200).json({
        message: 'Logged out successfully',
        loggedIn: false,
      });
    }
  });
};

module.exports = {
  getStatus,
  getProfile,
  logout,
};
