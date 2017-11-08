require('source-map-support/register')
module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("mongoose");

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("lodash");

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(3);


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* WEBPACK VAR INJECTION */(function(__dirname) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Users_g6vc_WebstormProjects_form_analytics_github_node_modules_babel_runtime_regenerator__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Users_g6vc_WebstormProjects_form_analytics_github_node_modules_babel_runtime_regenerator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__Users_g6vc_WebstormProjects_form_analytics_github_node_modules_babel_runtime_regenerator__);


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _this = this;

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var debug = __webpack_require__(6)('form-analytics:server');
var http = __webpack_require__(7);
var express = __webpack_require__(8);
var path = __webpack_require__(9);
var logger = __webpack_require__(10);
var jade = __webpack_require__(11);
var cookieParser = __webpack_require__(12);
var bluebird = __webpack_require__(13);
var bodyParser = __webpack_require__(14);
var mongoose = __webpack_require__(0);
var chalk = __webpack_require__(15);
var _ = __webpack_require__(1);
var Analytics = __webpack_require__(16);

var app = express();

//Models
var Form = __webpack_require__(18);
var Element = __webpack_require__(19);
var User = __webpack_require__(20);

bluebird.promisifyAll(mongoose);
mongoose.Promise = global.Promise;

//Connect to Database
mongoose.connect('mongodb://mongoAdmin:Innov8@34.226.210.46:27017/admin', {
    keepAlive: true,
    reconnectTries: 5,
    useMongoClient: true,
    reconnectInterval: 500
}, function (err) {
    if (err) {
        chalk.hex('#e81a00')('\u2715 Failed to Connect to AWS instance, attemping to connect to local instance');
        mongoose.connect('mongodb://localhost/test', function (error) {
            if (error) {
                console.log(chalk.hex('#e81a00')('\u2715 Failed to Connect to the Database....Check Connection URI'));
            } else {
                console.log(chalk.green('\u2713 connected to MongoDB:LOCAL ENV'));
            }
        });
    } else {
        console.log(chalk.green('\u2713 Successfully connected to MongoDB in AWS'));
    }
});

// uncomment after placing your favicon in /public
app.use(logger('dev'));
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'jade');

//Allow CORS
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    //intercepts OPTIONS method
    'OPTIONS' === req.method ? res.send(200) : next();
});

app.options("/*", function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    res.send(200);
});

/**
 * Handles registering a new Namespace (for a new form)
 * or Running Analytics on an existing namespace
 */
app.post('/form/register', function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0__Users_g6vc_WebstormProjects_form_analytics_github_node_modules_babel_runtime_regenerator___default.a.mark(function _callee(req, res) {
        var namespace, elements, method, limit;
        return __WEBPACK_IMPORTED_MODULE_0__Users_g6vc_WebstormProjects_form_analytics_github_node_modules_babel_runtime_regenerator___default.a.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        //Get the namespace & Required variables i.e. ApplicationName.formName
                        namespace = req.body.namespace;
                        elements = req.body.elements;
                        method = req.body.method;
                        limit = void 0;


                        if (req.body.hasOwnProperty('limit')) {
                            limit = req.body.limit;
                        }

                        Form.find({ namespace: namespace }, function (err, record) {
                            //There was no namespace this is a new form
                            if (record.length <= 0) {
                                //Create a new namespace
                                new Form({ namespace: namespace, elements: elements }).save(function (err, record) {
                                    console.log(chalk.green('\u2713 Successfully created new Namespace: ' + namespace));

                                    res.json({
                                        success: true,
                                        namespace: namespace
                                    });
                                });
                            } else {

                                //Find the different element & Join them into the Form Namespace
                                record[0].set({ elements: _.union(elements.filter(function (e) {
                                        return !record[0].elements.includes(e);
                                    }), record[0].elements) });
                                record[0].save();

                                console.log(chalk.green('\u2713 Namespace: ' + namespace + ' has been located running analytics...'));

                                var promises = [];
                                var responseData = [];

                                elements.forEach(function (element) {
                                    console.log(chalk.green('\u2713 Found Data for Element Namespace: ' + element));
                                    //Find each element given its parent namespace
                                    var p = Element.find({ namespace: namespace + '.' + element }).exec().then(function (val) {
                                        //Acts as a switch statement to effectively compute based on the specified method
                                        var analyticsMethod = {
                                            'per-subject-recent': function perSubjectRecent() {
                                                return Analytics.perSubjectRecent(val, limit);
                                            },
                                            'per-subject-frequency': function perSubjectFrequency() {
                                                return Analytics.perSubjectFrequency(val, limit);
                                            },
                                            'decision-tree': function decisionTree() {
                                                return Analytics.decisionTree(val, limit);
                                            },
                                            'bayesian': function bayesian() {
                                                return Analytics.bayesian(val, limit);
                                            }
                                        };
                                        //Push the results of the analytics to an empty array
                                        responseData.push(analyticsMethod[method]());
                                    });
                                    promises.push(p);
                                });
                                Promise.all(promises).then(function () {
                                    res.json(responseData);
                                }).catch(function (err) {
                                    console.error(err);
                                });
                            }
                        });

                    case 6:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, _this);
    }));

    return function (_x, _x2) {
        return _ref.apply(this, arguments);
    };
}());

/**
 * Handles a basic user signup
 */
app.post('/signup', function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0__Users_g6vc_WebstormProjects_form_analytics_github_node_modules_babel_runtime_regenerator___default.a.mark(function _callee2(req, res) {
        var _req$body, name, email, password, username, user;

        return __WEBPACK_IMPORTED_MODULE_0__Users_g6vc_WebstormProjects_form_analytics_github_node_modules_babel_runtime_regenerator___default.a.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        _req$body = req.body, name = _req$body.name, email = _req$body.email, password = _req$body.password, username = _req$body.username;
                        user = new User({ name: name, email: email, password: password, username: username });

                        user.save();

                        res.json({ success: true, user: user });

                    case 4:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, _this);
    }));

    return function (_x3, _x4) {
        return _ref2.apply(this, arguments);
    };
}());

/**
 * Handles Calculating the Analytics on a custom dataset
 * @param dataset Array of MongoDB document objects

 * @param method String Method of analytics to run i.e. "per-subject-frequency
 */
var runAnalytics = function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0__Users_g6vc_WebstormProjects_form_analytics_github_node_modules_babel_runtime_regenerator___default.a.mark(function _callee3(dataset, method) {
        var analyticsMethod;
        return __WEBPACK_IMPORTED_MODULE_0__Users_g6vc_WebstormProjects_form_analytics_github_node_modules_babel_runtime_regenerator___default.a.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        analyticsMethod = {
                            'per-subject-recent': function perSubjectRecent() {
                                return Analytics.perSubjectRecent(dataset);
                            },
                            'per-subject-frequency': function perSubjectFrequency() {
                                return Analytics.perSubjectFrequency(dataset);
                            },
                            'decision-tree': function decisionTree() {
                                return Analytics.decisionTree(dataset);
                            },
                            'bayesian': function bayesian() {
                                return Analytics.bayesian(dataset);
                            }
                        };

                        //Push the results of the analytics to an empty array

                        return _context3.abrupt('return', analyticsMethod[method]());

                    case 2:
                    case 'end':
                        return _context3.stop();
                }
            }
        }, _callee3, _this);
    }));

    return function runAnalytics(_x5, _x6) {
        return _ref3.apply(this, arguments);
    };
}();

/**
 * Sorts JSON by specified object property
 * @param data Array JSON data to sort
 * @param prop String Object property name to sort by
 * @param asc boolean True to sort in ascending order
 * @returns {Aggregate|Query|*|Array.<T>}
 */
var sortResults = function sortResults(data, prop, asc) {
    data = data.sort(function (a, b) {
        if (asc) {
            return a[prop] > b[prop] ? 1 : a[prop] < b[prop] ? -1 : 0;
        } else {
            return b[prop] > a[prop] ? 1 : b[prop] < a[prop] ? -1 : 0;
        }
    });

    return data;
};

/**
 * Handles Running Analytics on a Custom Set of Data
 * This method will do 3 things
 * 1.) Find all unique namespaces in the input data set
 * 2.) For each unique namespace run the specified analytics method on all of the data in that namespace
 * 3.) return an array with X amount of nested arrays representing the analysis for each unique namespace
 */
app.post('/analytics', function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0__Users_g6vc_WebstormProjects_form_analytics_github_node_modules_babel_runtime_regenerator___default.a.mark(function _callee4(req, res) {
        var data, method, namespaces, analysis, sortedData, i;
        return __WEBPACK_IMPORTED_MODULE_0__Users_g6vc_WebstormProjects_form_analytics_github_node_modules_babel_runtime_regenerator___default.a.wrap(function _callee4$(_context4) {
            while (1) {
                switch (_context4.prev = _context4.next) {
                    case 0:
                        data = req.body.data;
                        method = req.body.method;


                        data.forEach(function (d) {
                            if (d.namespace === 'Pizza.createForm.Veggies') {
                                console.log(d);
                            }
                        });

                        namespaces = []; //Array holding all unique namespace

                        analysis = []; //Array holding analysis for each unique namespace

                        sortedData = sortResults(data, 'namespace', true);


                        for (i = 0; i < sortedData.length; i++) {
                            if (!_.includes(namespaces, sortedData[i].namespace)) {
                                namespaces.push(sortedData[i].namespace);
                            }
                        }

                        //Filter the data and run the analytics
                        namespaces.forEach(function (namespace) {
                            var temp = [];

                            //TODO for some reason filter produces inconsistent results...weird..gonna have to filter manually for now
                            data.forEach(function (d) {
                                if (d.namespace === namespace) {
                                    temp.push(d);
                                }
                            });

                            analysis.push(runAnalytics(temp, method));
                        });

                        Promise.all(analysis).then(function (result) {
                            res.json(result);
                        }).catch(function (err) {
                            console.error(err);
                        });

                    case 9:
                    case 'end':
                        return _context4.stop();
                }
            }
        }, _callee4, _this);
    }));

    return function (_x7, _x8) {
        return _ref4.apply(this, arguments);
    };
}());

/**
 * Handles Inserting data into Mongo but does not run analytics
 * this is how the classifier is updated when the Submit button is pressed
 */
app.post('/insert', function () {
    var _ref5 = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0__Users_g6vc_WebstormProjects_form_analytics_github_node_modules_babel_runtime_regenerator___default.a.mark(function _callee5(req, res) {
        var formNamespace, elementNamespaces, elementValues, user;
        return __WEBPACK_IMPORTED_MODULE_0__Users_g6vc_WebstormProjects_form_analytics_github_node_modules_babel_runtime_regenerator___default.a.wrap(function _callee5$(_context5) {
            while (1) {
                switch (_context5.prev = _context5.next) {
                    case 0:
                        formNamespace = req.body.namespace; //Pizza.createForm

                        elementNamespaces = req.body.elements; //[Meat, Veggies, CrustStyle]

                        elementValues = req.body.values; //[Pepperoni, Tomatoes, Thin]

                        user = req.body.user; //UserID

                        if (typeof user === 'undefined') {
                            user = null;
                        }

                        if (elementNamespaces.length !== elementValues.length) {
                            console.log(chalk.hex('#e81a00')('\u2715 ElementOutOfBoundsException Error: More Elements than Values to fill.'));
                            res.json({ success: false, msg: 'There were more namespaces than values to fill or vice versa....Please ensure both arrays are of the same length.' });
                        } else {

                            //Ensure the elements exist in the Form Namespace
                            Form.find({ namespace: formNamespace }, function (err, record) {
                                if (typeof record !== "undefined" && record.length > 0) {
                                    if (!elementNamespaces.every(function (elem) {
                                        return record[0].elements.indexOf(elem) > -1;
                                    })) {

                                        //An elementNamespace is not already defined in the Form model
                                        console.log(chalk.hex('#e81a00')('\u2715 UndefinedNamespaceException: One of the element namespaces has not yet been defined in the Form Model'));
                                        res.json({
                                            success: false,
                                            msg: 'UndefinedNamespaceException: One of the element namespaces has not yet been defined in the Form Model'
                                        });
                                    } else {
                                        var records = [];

                                        //Add a new value for each namespace
                                        elementNamespaces.map(function (value, key) {
                                            //Remove the Item being stored from referencing itself
                                            var references = elementValues.filter(function (e) {
                                                return e !== elementValues[key];
                                            });
                                            var namespaces = elementNamespaces.filter(function (e) {
                                                return e !== elementNamespaces[key];
                                            });

                                            //Map over each reference and convert it into an object
                                            var finalRef = references.map(function (ele, key) {
                                                return {
                                                    namespace: formNamespace + '.' + namespaces[key],
                                                    value: ele
                                                };
                                            });

                                            records.push(new Element({
                                                namespace: formNamespace + '.' + value,
                                                value: elementValues[key],
                                                user: user,
                                                references: finalRef,
                                                updatedAt: new Date(),
                                                createdAt: new Date()
                                            }));
                                        });

                                        //Insert Bulk operation
                                        Element.collection.insert(records, function (err, data) {
                                            if (err) res.json({ success: false, err: err });
                                            console.log(chalk.green('\u2713 Element data saved!'));
                                            res.json({ success: true });
                                        });
                                    }
                                } else {
                                    console.log(chalk.hex('#e81a00')('\u2715 UndefinedNamespaceException: One of the Form namespaces has not yet been defined in the Form Model use /form/register to define a new namespace'));
                                    res.json({
                                        success: false,
                                        msg: 'UndefinedNamespaceException: One of the Form namespaces has not yet been defined in the Form Model use /form/register to define a new namespace'
                                    });
                                }
                            });
                        }

                    case 6:
                    case 'end':
                        return _context5.stop();
                }
            }
        }, _callee5, _this);
    }));

    return function (_x9, _x10) {
        return _ref5.apply(this, arguments);
    };
}());

/**
 * Deletes all records in a Collection
 */
app.get('/remove', function (req, res) {
    Form.remove({}, function () {});
    Element.remove({}, function () {});
    res.json({ success: true });
});

app.get('/all', function (req, res) {
    Form.find({ namespace: "Pizza.createForm" }, function (err, data) {
        console.log(data);
    });

    Element.find({}, function (err, d) {
        res.json(d);
    });
});

app.post('/query', function () {
    var _ref6 = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0__Users_g6vc_WebstormProjects_form_analytics_github_node_modules_babel_runtime_regenerator___default.a.mark(function _callee6(req, res) {
        var hasTable, hasAnd, hasOr, hasWhere, hasUser, hasLike, hasLimit, query;
        return __WEBPACK_IMPORTED_MODULE_0__Users_g6vc_WebstormProjects_form_analytics_github_node_modules_babel_runtime_regenerator___default.a.wrap(function _callee6$(_context6) {
            while (1) {
                switch (_context6.prev = _context6.next) {
                    case 0:
                        try {
                            hasTable = req.body.hasOwnProperty('table');
                            hasAnd = req.body.query.hasOwnProperty('and');
                            hasOr = req.body.query.hasOwnProperty('or');
                            hasWhere = req.body.query.hasOwnProperty('where');
                            hasUser = req.body.query.hasOwnProperty('user');
                            hasLike = req.body.query.hasOwnProperty('like');
                            hasLimit = req.body.query.hasOwnProperty('limit');
                        } catch (err) {
                            //They are missing some properties of the query
                            console.log('\u2715 Part of the Query is Undefined');
                        }

                        //Basic Error Checking
                        if (hasAnd && hasOr) {
                            res.json({
                                error: true,
                                msg: 'At this time you must either have an "and" property or an "or" property but not both.'
                            });
                        }

                        if (hasLike && hasWhere) {
                            res.json({
                                error: true,
                                msg: 'At this time you must either have a "where" clause or a "like" clause but not both'
                            });
                        }

                        //Build up the query from an empty object
                        query = {};

                        if (!(_typeof(req.body.table) === 'object')) {
                            _context6.next = 12;
                            break;
                        }

                        req.body.table.forEach(function (t) {
                            query.namespace = req.body.namespace + '.' + req.body.t;
                            hasWhere ? query.value = req.body.query.where : null;
                            hasAnd ? query['references.value'] = { $all: req.body.query.and } : null;
                            hasOr ? query['references.value'] = { $in: req.body.query.or } : null;
                            hasUser ? query.user = req.body.query.user : null;
                            hasLike ? query.value = { $regex: '.*' + req.body.query.like + '.*', $options: 'i' } : null;
                        });

                        if (!hasLimit) {
                            _context6.next = 11;
                            break;
                        }

                        _context6.next = 9;
                        return Element.find(query).sort({ 'value': -1 }).limit(req.body.query.limit).exec(function (err, docs) {
                            return res.json(docs);
                        });

                    case 9:
                        _context6.next = 12;
                        break;

                    case 11:
                        Element.find(query, function (err, docs) {
                            res.json(docs);
                        });

                    case 12:

                        //Match Req body to query values
                        !hasTable ? query.namespace = {
                            $regex: req.body.namespace,
                            $options: 'i'
                        } : query.namespace = req.body.namespace + '.' + req.body.table;
                        hasWhere ? query.value = req.body.query.where : null;
                        hasAnd ? query['references.value'] = { $all: req.body.query.and } : null;
                        hasOr ? query['references.value'] = { $in: req.body.query.or } : null;
                        hasUser ? query.user = req.body.query.user : null;
                        hasLike ? query.value = { $regex: '.*' + req.body.query.like + '.*', $options: 'i' } : null;

                        hasLimit ? Element.find(query).sort({ 'value': -1 }).limit(req.body.query.limit).exec(function (err, docs) {
                            return res.json(docs);
                        }) : Element.find(query, function (err, docs) {
                            res.json(docs);
                        });

                    case 19:
                    case 'end':
                        return _context6.stop();
                }
            }
        }, _callee6, _this);
    }));

    return function (_x11, _x12) {
        return _ref6.apply(this, arguments);
    };
}());

app.get('*', function () {
    var _ref7 = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0__Users_g6vc_WebstormProjects_form_analytics_github_node_modules_babel_runtime_regenerator___default.a.mark(function _callee7(req, res) {
        return __WEBPACK_IMPORTED_MODULE_0__Users_g6vc_WebstormProjects_form_analytics_github_node_modules_babel_runtime_regenerator___default.a.wrap(function _callee7$(_context7) {
            while (1) {
                switch (_context7.prev = _context7.next) {
                    case 0:
                        res.json({ success: true, msg: 'The server is active and running!' });

                    case 1:
                    case 'end':
                        return _context7.stop();
                }
            }
        }, _callee7, _this);
    }));

    return function (_x13, _x14) {
        return _ref7.apply(this, arguments);
    };
}());

// error handler
app.use(function (err, req, res) {
    console.log(err);
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);

    res.json({ error: err });
});

/**
 * Get port from environment and store in Express.
 */

var port = 3010;
console.log(chalk.blue('\u2713 Setting Server Port to 3010...'));
app.set('port', port);

/**
 * Create HTTP server.
 */
console.log(chalk.blue('\u2713 Creating HTTP Server...'));
var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port, function (err) {
    if (err) onError(err);
    onListening();
});

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
    var addr = server.address();
    console.log(chalk.blue('-------------------------------------------'));
    console.log(chalk.blue('| Analytics Server Listening on Port ' + addr.port + ' |'));
    console.log(chalk.blue('-------------------------------------------'));
}
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, "src"))

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(5);


/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = require("regenerator-runtime");

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("debug");

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = require("http");

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = require("morgan");

/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = require("jade");

/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = require("cookie-parser");

/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = require("bluebird");

/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = require("body-parser");

/***/ }),
/* 15 */
/***/ (function(module, exports) {

module.exports = require("chalk");

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

var _ = __webpack_require__(1);
var DecisionTree = __webpack_require__(17);

module.exports = {
    /**
     * Takes the Rightmost 3 Elements from the
     * Mongoose document array as the most recently used pieces of form data
     * @param data
     * @param limit int Limit the analysis results being returned
     * @returns {Array}
     */
    perSubjectRecent: function perSubjectRecent(data) {
        var limit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 3;

        return _.take(data, limit);
    },


    /**
     * Find the most frequently used
     * @param data
     * @param limit int Limit the analysis results being returned
     */
    perSubjectFrequency: function perSubjectFrequency(data) {
        var limit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 3;

        var frequency = {},
            value;

        // compute frequencies of each value
        for (var i = 0; i < data.length; i++) {
            value = data[i].value;
            if (value in frequency) {
                frequency[value]++;
            } else {
                frequency[value] = 1;
            }
        }

        // make array from the frequency object to de-duplicate
        var uniques = [];
        for (value in frequency) {
            uniques.push(value);
        }

        //Remove any blank values
        uniques = uniques.filter(function (n) {
            return n != '';
        });

        // sort the uniques array in descending order by frequency
        function compareFrequency(a, b) {
            return frequency[b] - frequency[a];
        }
        uniques.sort(compareFrequency);

        return _.take(uniques, limit);
    },


    /**
     *
     * @param data
     * @param limit int Limit the analysis results being returned
     * @returns {*}
     */
    decisionTree: function decisionTree(data) {
        var limit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 3;

        var dt = new DecisionTree(data, "value", ["value", "namespace"]);

        var predicted_class = dt.predict({
            value: "Ham",
            namespace: "Pizza.createForm.Meats"
        });

        var treeModel = dt.toJSON();
        return predicted_class;
    },


    /**
     *
     * @param data
     * @param limit int Limit the analysis results being returned
     * @returns {*}
     */
    bayesian: function bayesian(data) {
        var limit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 3;

        //TODO mutate data
        return data;
    },


    /**
     * Takes a Parent Form Namespace and an array of elements which belong to the form
     * and returns an array of fully quantified Namespaces ready for querying
     * @param formNamespace
     * @param elementArray
     */
    toFullNamespace: function toFullNamespace(formNamespace, elementArray) {
        return elementArray.map(function (value) {
            return formNamespace + '.' + value;
        });
    }
};

/***/ }),
/* 17 */
/***/ (function(module, exports) {

module.exports = require("decision-tree");

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Created by christianbartram on 10/18/17.
 */
var mongoose = __webpack_require__(0);

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

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Created by christianbartram on 10/18/17.
 */
var mongoose = __webpack_require__(0);

var Element = mongoose.Schema({
  namespace: String, //Element on the forms specific namespace/id
  type: String, //Select field, radio button, checkbox etc...
  value: String,
  user: String,
  references: Array,
  updatedAt: Date,
  createdAt: Date
});

/**
 * Schema Methods
 */

//Export the Model
module.exports = mongoose.model('Element', Element);

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Created by christianbartram on 10/18/17.
 */
var mongoose = __webpack_require__(0);

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

/***/ })
/******/ ]);
//# sourceMappingURL=main.map