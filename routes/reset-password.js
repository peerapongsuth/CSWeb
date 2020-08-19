const express = require('express');
const router = express.Router();

const {resetPassword} = require('../controllers/auth')

router.put('/:resetLink',  resetPassword);

module.exports = router;

