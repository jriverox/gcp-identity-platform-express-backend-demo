const express = require('express');
const router = express.Router();
const {
  signInWithEmailPasswordHandler,
} = require('../controllers/auth.controller');

router.post('/auth', signInWithEmailPasswordHandler);

module.exports = router;
