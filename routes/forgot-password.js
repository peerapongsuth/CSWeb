const express = require('express');
const router = express.Router();

const {forgotPassword} = require('../controllers/auth')

router.put('/',  forgotPassword);

module.exports = router;

