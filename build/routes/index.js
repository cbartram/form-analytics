'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _pizza = require('../models/pizza.js');

var _pizza2 = _interopRequireDefault(_pizza);

var _tracker = require('../models/tracker.js');

var _tracker2 = _interopRequireDefault(_tracker);

var _Form = require('../models/Form.js');

var _Form2 = _interopRequireDefault(_Form);

var _utils = require('../utils/');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();
/* GET home page. */

/* 
a temporary file to test endpoints
*/

router.get('/', function (req, res) {
  res.json({
    success: true,
    msg: 'You have reached the home page of the Analytics Server!'
  });
});

module.exports = router;