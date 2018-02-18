const express = require('express');
const router = express.Router();
const storesController = require('../controllers/storesController');

// Do work here
router.get('/', storesController.homePage);

module.exports = router;
