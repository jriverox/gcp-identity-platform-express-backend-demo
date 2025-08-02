const express = require('express');
const router = express.Router();
const {
  signUpWithEmailPasswordHandler,
  preSignUpWithEmailTemporaryPasswordHandler,
} = require('../controllers/signup.controller');

router.post('/signup', signUpWithEmailPasswordHandler);
router.post('/pre-signup', preSignUpWithEmailTemporaryPasswordHandler);

module.exports = router;
