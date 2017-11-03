'use strict';

require('regenerator-runtime/runtime');

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _Form = require('../models/Form');

var _Form2 = _interopRequireDefault(_Form);

var _User = require('../models/User');

var _User2 = _interopRequireDefault(_User);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; } // a placeholder for a user route, if needed


var router = _express2.default.Router();

// a mock signup. Not secure.
router.post('/signup', function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
    var newUser, isUser, user;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            newUser = req.body;

            if (!newUser) {
              _context.next = 31;
              break;
            }

            isUser = void 0;
            _context.prev = 3;
            _context.next = 6;
            return _User2.default.findOneAsync({ userName: newUser.userName });

          case 6:
            isUser = _context.sent;
            _context.next = 12;
            break;

          case 9:
            _context.prev = 9;
            _context.t0 = _context['catch'](3);
            return _context.abrupt('return', res.status(500).send('ERROR: error processing user: ' + _context.t0));

          case 12:
            if (!isUser) {
              _context.next = 16;
              break;
            }

            return _context.abrupt('return', res.status(409).send(new Error('Username Already Taken')));

          case 16:
            user = void 0;
            _context.prev = 17;
            _context.next = 20;
            return _User2.default.createAsync(newUser);

          case 20:
            user = _context.sent;
            _context.next = 26;
            break;

          case 23:
            _context.prev = 23;
            _context.t1 = _context['catch'](17);
            return _context.abrupt('return', res.status(500).send('ERROR: error registering user: ' + _context.t1));

          case 26:
            if (user) {
              _context.next = 30;
              break;
            }

            return _context.abrupt('return', res.status(500).send('ERROR: error registering user: User not found'));

          case 30:
            res.send(user);

          case 31:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[3, 9], [17, 23]]);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());

// a mock login. Not secure.
router.post('/login', function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res) {
    var loggedUser, isUser, user;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            loggedUser = req.body;

            if (!loggedUser) {
              _context2.next = 37;
              break;
            }

            isUser = void 0;
            _context2.prev = 3;
            _context2.next = 6;
            return _User2.default.findOneAsync({ userName: loggedUser.userName });

          case 6:
            isUser = _context2.sent;
            _context2.next = 12;
            break;

          case 9:
            _context2.prev = 9;
            _context2.t0 = _context2['catch'](3);
            return _context2.abrupt('return', res.status(500).send('ERROR: error processing user: ' + _context2.t0));

          case 12:
            if (isUser) {
              _context2.next = 16;
              break;
            }

            return _context2.abrupt('return', res.send({ error: 'Invalid Username/combination' }));

          case 16:
            if (!(loggedUser.password === isUser.password)) {
              _context2.next = 34;
              break;
            }

            user = void 0;
            _context2.prev = 18;
            _context2.next = 21;
            return _User2.default.createAsync(newUser);

          case 21:
            user = _context2.sent;
            _context2.next = 27;
            break;

          case 24:
            _context2.prev = 24;
            _context2.t1 = _context2['catch'](18);
            return _context2.abrupt('return', res.status(500).send('ERROR: error registering user: ' + _context2.t1));

          case 27:
            if (user) {
              _context2.next = 31;
              break;
            }

            return _context2.abrupt('return', res.status(500).send('ERROR: error registering user: User not found'));

          case 31:
            return _context2.abrupt('return', res.send(user));

          case 32:
            _context2.next = 35;
            break;

          case 34:
            return _context2.abrupt('return', res.send({ error: 'Invalid Username/combination' }));

          case 35:
            _context2.next = 38;
            break;

          case 37:
            return _context2.abrupt('return', res.send({ error: 'User Not Processed From Form' }));

          case 38:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined, [[3, 9], [18, 24]]);
  }));

  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}());

module.exports = router;