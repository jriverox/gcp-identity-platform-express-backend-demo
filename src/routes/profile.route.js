const express = require('express');
const router = express.Router();
const { profileHandler } = require('../controllers/profile.controller');
const { authenticate } = require('../middlewares/firebaseAuthenticator');

// Get user profile. This route demonstrates how to get a protected resource, it requires an authenticated request.
router.get('/profile', authenticate, profileHandler);

module.exports = router;
