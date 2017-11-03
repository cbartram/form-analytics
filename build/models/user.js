'use strict';

/**
 * Created by christianbartram on 10/18/17.
 */
var mongoose = require('mongoose');

var User = mongoose.Schema({
  name: String,
  username: String,
  email: String,
  password: String
});

/**
 * Schema Methods
 */

//Export the Model
module.exports = mongoose.model('User', User);