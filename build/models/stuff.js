'use strict';

/*
	a test file for testing new schemas, if needed
*/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Blog', {
  title: String
});