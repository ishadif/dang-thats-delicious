const mongoose = require('mongoose');
const Store = mongoose.model('Store');
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');

// this is multer setting to receive uploaded file
const multerOption = {
	storage: multer.memoryStorage(), // we save the image to memory first before resizing and saving it to file
	//checking if photo has mimetype of jpeg, png, or some sort
	fileFilter(req, file, next) {
		const isPhoto = file.mimetype.startsWith('image/');
		if (isPhoto) {
			next(null, true);
		} else {
			next({ message: "This filetype isn't allowed!" }, false);
		}
	}
};

exports.homePage = (req, res) => {
	res.render('index');
};

exports.addStore = (req, res) => {
	res.render('editStore', { title: 'Add Store' });
};

exports.upload = multer(multerOption).single('photo');

exports.resize = async (req, res, next) => {
	if (!req.file) {
		next();
		return;
	}

	// first we need to track down the extension and give unique identifier of the photo
	const extension = req.file.mimetype.split('/')[1];
	req.body.photo = `${uuid.v4()}.${extension}`;

	// now we need to resize the photo using jimp and upload it to filesystem
	const photo = await jimp.read(req.file.buffer);
	await photo.resize(800, jimp.AUTO);
	await photo.write(`./public/uploads/${req.body.photo}`);

	// once we have written to our filesystem, keep going!
	next();
};

exports.createStore = async (req, res) => {
	const store = await (new Store(req.body)).save()
	req.flash('success',`Successfully created ${store.name}, care to leave a review?`);
	res.redirect(`/store/${store.slug}`);
};

exports.getStores = async (req, res) => {
	const stores = await Store.find();

	res.render('stores', { title: 'stores' , stores });
};

exports.editStore = async (req, res) => {
	const store = await Store.findOne({ _id: req.params.id });

	res.render('editStore', { title: 'edit store', store });
};

exports.updateStore = async (req, res) => {
	// set location data to be a point
	req.body.location.type = 'Point';

	const store = await Store.findOneAndUpdate({ _id: req.params.id }, req.body, {
		new: true, //return to us the new store not the old one
		runValidators: true
	}).exec();

	req.flash('success', `Successfully updated <strong>${store.name}</strong>. <a href="/stores/${store.slug}">View store →</a>`);
	res.redirect(`/stores/${store._id}/edit`);
};

exports.getStoreBySlug = async (req, res, next) => {
	const store = await Store.findOne({ slug: req.params.slug });
	if (!store) return next();

	res.render('store', { store, title: store.name });
};

exports.getStoreByTag = async (req,res) => {
	const tag = req.params.tag;
	const tagQuery = tag || { $exists: true }
	const tagsPromise = Store.getTagsList();
	const storesPromise = Store.find({ tags: tagQuery });
	const [tags, stores] = await Promise.all([ tagsPromise, storesPromise ]);

	res.render('tag', { tags , title: 'tags', tag, stores });
};

