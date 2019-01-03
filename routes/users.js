// user.js

const express = require('express');
const passport = require('passport');

const router = express.Router();

router.post('/register', passport.authenticate('jwt', {session: false}), require('../controllers/user').register);
router.post('/login', require('../controllers/user').login);
router.get('/me', passport.authenticate('jwt', {session: false}), require('../controllers/user').me);
router.get('/reset', require('../controllers/user').reset);
router.put('/password', passport.authenticate('jwt', {session: false}), require('../controllers/user').changePassword);

module.exports = router;