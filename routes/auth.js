const express = require('express');
const passport = require('passport');
const router = express.Router();
const authController = require('../controllers/auth');
const { isAuthenticated } = require('../middleware/authenticate');

// GET /login - Initiate GitHub OAuth flow
router.get(
  '/login',
  // #swagger.tags = ['Authentication']
  // #swagger.description = 'Initiate GitHub OAuth 2.0 login authentication'
  passport.authenticate('github', { scope: ['user:email'] })
);

// GET /github/callback - OAuth redirect handler
router.get(
  '/github/callback',
  // #swagger.tags = ['Authentication']
  // #swagger.description = 'GitHub OAuth callback redirect endpoint'
  passport.authenticate('github', {
    failureRedirect: '/api-docs',
    session: true,
  }),
  (req, res) => {
    // Redirect to documentation or dashboard upon successful authentication
    res.redirect('/api-docs');
  }
);

// GET /logout - Session termination
router.get(
  '/logout',
  // #swagger.tags = ['Authentication']
  // #swagger.description = 'Terminate user session and clear authentication cookie'
  // #swagger.responses[200] = { description: 'Logged out successfully' }
  authController.logout
);

// GET /auth/status - Check session status
router.get(
  '/status',
  // #swagger.tags = ['Authentication']
  // #swagger.description = 'Check current session authentication state and user details'
  // #swagger.responses[200] = { description: 'Authentication status retrieved' }
  authController.getStatus
);

// GET /auth/profile - Protected user profile
router.get(
  '/profile',
  // #swagger.tags = ['Authentication']
  // #swagger.description = 'Retrieve profile of currently authenticated user (Requires authentication)'
  // #swagger.security = [{ "cookieAuth": [] }]
  // #swagger.responses[200] = { description: 'Profile retrieved successfully' }
  // #swagger.responses[401] = { description: 'Unauthorized - Login required' }
  isAuthenticated,
  authController.getProfile
);

module.exports = router;
