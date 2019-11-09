const express = require('express');
const router = new express.Router();

// API
router.use('/api', require('./api/api'));

module.exports = router;
