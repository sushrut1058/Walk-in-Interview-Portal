const express = require('express');
const { register, login, verifyEmail, resendEmail, onboardUser, validateToken } = require('./controllers/userController');
const { authenticate, authenticate_lv1 } = require('../middleware/auth');
const { saveUser, createRoom, getActiveRooms, getHistory } = require('./controllers/actions');
const router = express.Router();

router.post('/acc/signup', register);
router.post('/acc/login', login);
router.get('/acc/verify-email/:userId/:token', verifyEmail);
router.post('/acc/validate_token', validateToken);
router.post('/acc/resend_email', authenticate_lv1, resendEmail);
router.post('/acc/onboard', authenticate_lv1, onboardUser);
router.post('/actions/create-room', authenticate, createRoom);
router.get('/actions/active-rooms', authenticate, getActiveRooms);
router.get('/actions/save', authenticate, saveUser);
router.get('/actions/history', authenticate, getHistory);

module.exports = router;
