const express = require('express');
const router = express.Router();
const storesController = require('../controllers/storesController');
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

module.exports = router;
