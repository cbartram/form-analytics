'use strict';

/**
 * Created by christianbartram on 10/18/17.
 */
var mongoose = require('mongoose');

var Form = mongoose.Schema({
  namespace: String,
  elements: Array,
  output: String,
  method: String
});

/**
 * Schema Methods
 */

//Export the Model
module.exports = mongoose.model('Form', Form);