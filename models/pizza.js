/*
	a test model for Shayna's pizza page.
*/

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = mongoose.model('Pizza', {
  crust: { type: String, default: 'original' },
  size: { type: String, default: 'small' },
  cheese: { type: String, default: 'normal' },
  veggies: { type: String, default: 'none' },
  meat: { type: String, default: 'none' },
});