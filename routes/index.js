const express = require('express');
const router = express.Router();
const storesController = require('../controllers/storesController');
const { catchErrors } = require('../handlers/errorHandlers');

// Do work here
router.get('/', storesController.homePage);
router.get('/add', storesController.addStore);
router.post('/add', catchErrors(storesController.createStore));

module.exports = router;
