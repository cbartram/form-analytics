/*
	a test model, used to simulate tracking most commonly picked items for 
	front end purposes.

	Warning: dirty
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = mongoose.model('Tracker', {
  group: { type: String }, // which group it falls under: ex. pizza, users
  items: { type: Object }, // the items within the category that are being tracked
  category: {type: String} // ex: veggies, meat, names
});
