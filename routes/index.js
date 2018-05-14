const express = require('express');
const router = express.Router();
const storesController = require('../controllers/storesController');
const userController = require('../controllers/userController');
const { catchErrors } = require('../handlers/errorHandlers');

// Do work here
router.get('/', catchErrors(storesController.getStores));
router.get('/stores', catchErrors(storesController.getStores));
router.get('/add', storesController.addStore);
router.post('/add',
	storesController.upload,
	catchErrors(storesController.resize),
	catchErrors(storesController.createStore)
);
router.post('/add/:id',
	storesController.upload,
	catchErrors(storesController.resize),
	catchErrors(storesController.updateStore)
);
router.get('/stores/:id/edit', catchErrors(storesController.editStore));
router.get('/store/:slug', catchErrors(storesController.getStoreBySlug));

router.get('/tags', catchErrors(storesController.getStoreByTag));
router.get('/tags/:tag', catchErrors(storesController.getStoreByTag));

router.get('/login', userController.loginForm);
router.get('/register', userController.registerForm);

// 1. validate the registration data
// 2. register the user
// 3. we log them in
router.post('/register', userController.validateRegister);


module.exports = router;
