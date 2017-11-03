'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var User = _mongoose2.default.Schema({
  name: String,
  username: String,
  email: String,
  password: String
});

/**
 * Schema Methods
 */

//Export the Model
/**
 * Created by christianbartram on 10/18/17.
 */
module.exports = _mongoose2.default.model('User', User);