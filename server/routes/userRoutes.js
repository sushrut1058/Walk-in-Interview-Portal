const express = require('express');
const multer = require('multer');
const { register, login, verifyEmail, resendEmail, onboardUser, validateToken } = require('./controllers/userController');
const { authenticate, authenticate_lv1 } = require('../middleware/auth');
const { saveUser, createRoom, getActiveRooms, getHistory, fetchPartialProfile, fetchCV, fetchSavedUsers } = require('./controllers/actions');
const { fetchProfile, updateProfile } = require('./controllers/secureActions');
const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    }
  }); 
 
const upload = multer({ storage: storage });

//new user
router.post('/acc/signup', register);
router.post('/acc/login', login);
router.get('/acc/verify-email/:userId/:token', verifyEmail);
router.post('/acc/validate_token', validateToken);
router.post('/acc/resend_email', authenticate_lv1, resendEmail);
router.post('/acc/onboard', authenticate_lv1, upload.single('cv'), onboardUser);
//routine stuff
router.post('/actions/create-room', authenticate, createRoom);
router.get('/actions/active-rooms', authenticate, getActiveRooms);
router.post('/actions/save', authenticate, saveUser);
router.get('/actions/history', authenticate, getHistory);
router.get('/actions/profile/:userId', authenticate, fetchPartialProfile);
router.get('/actions/cv/:userId', authenticate, fetchCV);
//misc imp stuff
router.get('/profile', authenticate, fetchProfile);
router.post('/update', authenticate, updateProfile);
router.get('/actions/saved-users', authenticate, fetchSavedUsers);

module.exports = router;