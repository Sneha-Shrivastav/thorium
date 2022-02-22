let obj = require('./logger.js')
const express = require('express');
const router = express.Router();

router.get('/test-me', function (req, res) {
    obj.PrintMessage('thorium')
    res.send('prints ‘Welcome to my application. I am Sneha and a part of FunctionUp Thorium cohort')
});

module.exports = router;