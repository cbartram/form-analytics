'use strict';

require('regenerator-runtime/runtime');

var _tracker = require('../models/tracker.js');

var _tracker2 = _interopRequireDefault(_tracker);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }
// gets the top 3 topping picks for the given toppings.


var utils = {
	checkTracker: function () {
		var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(group, category) {
			var tracker, num, highestList, highest;
			return regeneratorRuntime.wrap(function _callee$(_context) {
				while (1) {
					switch (_context.prev = _context.next) {
						case 0:
							tracker = void 0;
							_context.prev = 1;
							_context.next = 4;
							return _tracker2.default.findOneAsync({ group: group, category: category });

						case 4:
							tracker = _context.sent;
							_context.next = 11;
							break;

						case 7:
							_context.prev = 7;
							_context.t0 = _context['catch'](1);

							console.log(_context.t0);
							return _context.abrupt('return', 'Error: Something broke!');

						case 11:
							if (tracker) {
								_context.next = 13;
								break;
							}

							return _context.abrupt('return', 'Error: No Tracker Found');

						case 13:
							num = 0;
							highestList = [];

							while (num < 3) {
								highest = Object.keys(tracker.items).reduce(function (a, b) {
									return tracker.items[a] > tracker.items[b] ? a : b;
								});


								delete tracker.items[highest];

								highestList.push(highest);

								num += 1;
							}

							return _context.abrupt('return', highestList);

						case 17:
						case 'end':
							return _context.stop();
					}
				}
			}, _callee, undefined, [[1, 7]]);
		}));

		function checkTracker(_x, _x2) {
			return _ref.apply(this, arguments);
		}

		return checkTracker;
	}()
};

module.exports = utils;