const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slugs');

const storeSchema = new mongoose.Schema({
	name: {
		type: String,
		trim: true,
		required: 'Please enter the store name!'
	},
	slug: String,
	description: {
		type: String,
		trim: true
	},
	tag: [String]
});

storeSchema.pre('save', function(next){
	if (!this.isModified('name')) {
		next(); // skip it!
		return; // stop the function from running
	}
	
	this.slug = slug(this.name);
	next();
});

module.exports = mongoose.model('Store', storeSchema);