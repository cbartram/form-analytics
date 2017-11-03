'use strict';

require('regenerator-runtime/runtime');

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

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; } /* 
                                                                                                                                                                                                                                                                                                                                                                                                                                                                           aroute for the pizza controlls
                                                                                                                                                                                                                                                                                                                                                                                                                                                                           */

var router = _express2.default.Router();
/* GET home page. */

router.get('/test', function (req, res) {
	_Form2.default.find({ namespace: "pizzaForm" }, function (err, data) {
		console.log(data);
	});

	res.json({ value: true });
});

// Pizza routes, used for the demo page
router.post('/makePizza', function () {
	var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
		var pizza;
		return regeneratorRuntime.wrap(function _callee$(_context) {
			while (1) {
				switch (_context.prev = _context.next) {
					case 0:
						_context.prev = 0;
						_context.next = 3;
						return _pizza2.default.createAsync(req.body);

					case 3:
						pizza = _context.sent;


						res.send({
							success: true,
							data: pizza
						});
						_context.next = 10;
						break;

					case 7:
						_context.prev = 7;
						_context.t0 = _context['catch'](0);

						res.status(500).send('Something broke!');

					case 10:
					case 'end':
						return _context.stop();
				}
			}
		}, _callee, undefined, [[0, 7]]);
	}));

	return function (_x, _x2) {
		return _ref.apply(this, arguments);
	};
}()); /* GET home page. */

// endpoint for getting suggestions
router.get('/getSuggestions', function () {
	var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(req, res) {
		var highestRated;
		return regeneratorRuntime.wrap(function _callee3$(_context3) {
			while (1) {
				switch (_context3.prev = _context3.next) {
					case 0:
						highestRated = {};
						_context3.next = 3;
						return Promise.all(['meat', 'veggies'].map(function () {
							var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(e) {
								var ranking;
								return regeneratorRuntime.wrap(function _callee2$(_context2) {
									while (1) {
										switch (_context2.prev = _context2.next) {
											case 0:
												_context2.next = 2;
												return (0, _utils.checkTracker)('pizza', e, res);

											case 2:
												ranking = _context2.sent;

												if (!(typeof ranking === 'string')) {
													_context2.next = 5;
													break;
												}

												return _context2.abrupt('return', res.status(500).send(ranking));

											case 5:
												highestRated[e] = ranking;

											case 6:
											case 'end':
												return _context2.stop();
										}
									}
								}, _callee2, undefined);
							}));

							return function (_x5) {
								return _ref3.apply(this, arguments);
							};
						}()));

					case 3:

						res.send(highestRated);

					case 4:
					case 'end':
						return _context3.stop();
				}
			}
		}, _callee3, undefined);
	}));

	return function (_x3, _x4) {
		return _ref2.apply(this, arguments);
	};
}());

module.exports = router;