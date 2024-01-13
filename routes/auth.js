const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const { validateRegister, validateLogin } = require('../utils/validation');

router.post('/login' , validateLogin, authController.postLogin);
router.post('/register' , validateRegister , authController.postRegister);

module.exports = router;