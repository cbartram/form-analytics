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
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("mongoose");

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("node-mind");

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("lodash");

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(4);


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* WEBPACK VAR INJECTION */(function(__dirname) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Users_g6vc_WebstormProjects_form_analytics_github_node_modules_babel_runtime_regenerator__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Users_g6vc_WebstormProjects_form_analytics_github_node_modules_babel_runtime_regenerator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__Users_g6vc_WebstormProjects_form_analytics_github_node_modules_babel_runtime_regenerator__);


var _this = this;

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var debug = __webpack_require__(7)('form-analytics:server');
var http = __webpack_require__(8);
var express = __webpack_require__(9);
var path = __webpack_require__(10);
var logger = __webpack_require__(11);
var jade = __webpack_require__(12);
var cookieParser = __webpack_require__(13);
var bluebird = __webpack_require__(14);
var bodyParser = __webpack_require__(15);
var mongoose = __webpack_require__(0);
var chalk = __webpack_require__(16);
var Mind = __webpack_require__(1);
var _ = __webpack_require__(2);
var Analytics = __webpack_require__(17);

var app = express();
var VERSION = "1.0.2";

//Models
var Form = __webpack_require__(19);
var Element = __webpack_require__(20);
var User = __webpack_require__(21);

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
 * Gets the currently Running Version
 */
app.get('/version', function (req, res) {
    res.json({ version: VERSION });
});

/**
 * Handles registering a new Namespace (for a new form)
 * or Running Analytics on an existing namespace
 */
app.post('/form/register', function (req, res) {
    //Get the namespace & Required variables i.e. ApplicationName.formName
    var namespace = req.body.namespace;
    var elements = req.body.elements;
    var method = req.body.method;
    var limit = void 0;

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
                        },
                        'neural-network': function neuralNetwork() {
                            return predict(elements, element);
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
});

/**
 * Handles a basic user signup
 */
app.post('/signup', function (req, res) {
    var _req$body = req.body,
        name = _req$body.name,
        email = _req$body.email,
        password = _req$body.password,
        username = _req$body.username;


    var user = new User({ name: name, email: email, password: password, username: username });
    user.save();

    res.json({ success: true, user: user });
});

/**
 * Handles Calculating the Analytics on a custom dataset
 * @param dataset Array of MongoDB document objects
 * @param limit int The limit to
 * @param method String Method of analytics to run i.e. "per-subject-frequency
 */
var runAnalytics = function runAnalytics(dataset, method) {
    var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 3;

    var analyticsMethod = {
        'per-subject-recent': function perSubjectRecent() {
            return Analytics.perSubjectRecent(dataset, limit);
        },
        'per-subject-frequency': function perSubjectFrequency() {
            return Analytics.perSubjectFrequency(dataset, limit);
        },
        'decision-tree': function decisionTree() {
            return Analytics.decisionTree(dataset, limit);
        },
        'bayesian': function bayesian() {
            return Analytics.bayesian(dataset, limit);
        },
        'neural-network': function neuralNetwork() {
            return predict(dataset, dataset[dataset.length - 1]);
        }
    };

    //Push the results of the analytics to an empty array
    return analyticsMethod[method]();
};

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
    var _ref = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0__Users_g6vc_WebstormProjects_form_analytics_github_node_modules_babel_runtime_regenerator___default.a.mark(function _callee(req, res) {
        var data, method, limit, namespaces, analysis, sortedData, i;
        return __WEBPACK_IMPORTED_MODULE_0__Users_g6vc_WebstormProjects_form_analytics_github_node_modules_babel_runtime_regenerator___default.a.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        data = req.body.data;
                        method = req.body.method;
                        limit = void 0;


                        if (req.body.hasOwnProperty('limit')) {
                            limit = req.body.limit;
                        }

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

                            analysis.push(runAnalytics(temp, method, limit));
                        });

                        Promise.all(analysis).then(function (result) {
                            res.json(result);
                        }).catch(function (err) {
                            console.error(err);
                        });

                    case 10:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, _this);
    }));

    return function (_x2, _x3) {
        return _ref.apply(this, arguments);
    };
}());

/**
 * Handles Inserting data into Mongo but does not run analytics
 * this is how the classifier is updated when the Submit button is pressed
 */
app.post('/insert', function (req, res) {
    var formNamespace = req.body.namespace; //Pizza.createForm
    var elementNamespaces = req.body.elements; //[Meat, Veggies, CrustStyle]
    var elementValues = req.body.values; //[Pepperoni, Tomatoes, Thin]
    var user = req.body.user; //UserID

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
                        console.log(chalk.green('\u2713 Running Neural Network'));

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
});

/**
 * Run the Feed Forward Neural network
 * @param train Array set of data to train on
 * @param test Object a single document to base the prediction off of. This is the test data NOT the training data.
 * @param filter boolean True if the result should be filtered for only positive values. Defaults to true.
 */
var predict = function predict(train, test) {
    var filter = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

    //Only take 10 docs
    train = _.takeRight(train, 10);

    var res = train.map(function (doc) {
        return {
            input: normalizeArray(doc.references),
            output: normalize(doc)
        };
    });

    var mind = new Mind().learn(res);

    //Normalize the test data
    test = normalize(test);
    var result = denormalize(mind.predict(test));
    if (filter) {
        return result.filter(function (o) {
            return o.confidence > 0;
        }).sort(function (a, b) {
            return b.confidence - a.confidence;
        });
    }

    return result.sort(function (a, b) {
        return b.confidence - a.confidence;
    });
};

/**
 * Normalizes an output that is not an Array but a single value
 * @param obj Element document from MongoDB
 * @returns {[number,number,number,number,number,number,number,number,number,number,number,number,number,number]}
 */
var normalize = function normalize(obj) {
    var keys = ['Beef', 'Ham', 'Anchovies', 'Turkey', 'Bacon', 'Corn', 'Peppers', 'Onions', 'Tomato', 'Basil', 'Thin', 'Thick', 'Cheese', 'Pie'];
    var map = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; //Represents beef => 0, Ham => 0 Anchovies => 1 Bacon => 1

    var index = _.findIndex(keys, function (o) {
        return o === obj.value;
    });

    if (index !== null && index !== -1) {
        //This is also going to be the same index in the map array which needs to be updated to be 1
        map[index] = 1;
    }

    return map;
};

/**
 * De-normalizes a prediction back into human readable values
 * @param prediction Array of predicted values
 */
var denormalize = function denormalize(prediction) {
    var keys = ['Beef', 'Ham', 'Anchovies', 'Turkey', 'Bacon', 'Corn', 'Peppers', 'Onions', 'Tomato', 'Basil', 'Thin', 'Thick', 'Cheese', 'Pie'];

    if (prediction.length !== keys.length) {
        return null;
    }

    return keys.map(function (value, key) {
        return {
            name: value,
            confidence: prediction[key]
        };
    });
};

/**
 * Normalizes a set of Form References into a binary classification
 * to be trained into a neural network
 * @param references
 * @returns {*}
 */
var normalizeArray = function normalizeArray(references) {
    var keys = ['Beef', 'Ham', 'Anchovies', 'Turkey', 'Bacon', 'Corn', 'Peppers', 'Onions', 'Tomato', 'Basil', 'Thin', 'Thick', 'Cheese', 'Pie'];
    var map = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; //Represents beef => 0, Ham => 0 Anchovies => 1 Bacon => 1

    references.map(function (reference) {
        //Find the index in the keys array where the value of the key is equal to the value of the reference
        var index = _.findIndex(keys, function (o) {
            return o === reference.value;
        });

        if (index !== null && index !== -1) {
            //This is also going to be the same index in the map array which needs to be updated to be 1
            map[index] = 1;
        }
    });

    return map;
};

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
    var _ref2 = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0__Users_g6vc_WebstormProjects_form_analytics_github_node_modules_babel_runtime_regenerator___default.a.mark(function _callee2(req, res) {
        var hasTable, hasAnd, hasOr, hasWhere, hasUser, hasLike, hasLimit, hasTables, query;
        return __WEBPACK_IMPORTED_MODULE_0__Users_g6vc_WebstormProjects_form_analytics_github_node_modules_babel_runtime_regenerator___default.a.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        try {
                            hasTable = req.body.hasOwnProperty('table');
                            hasAnd = req.body.query.hasOwnProperty('and');
                            hasOr = req.body.query.hasOwnProperty('or');
                            hasWhere = req.body.query.hasOwnProperty('where');
                            hasUser = req.body.query.hasOwnProperty('user');
                            hasLike = req.body.query.hasOwnProperty('like');
                            hasLimit = req.body.query.hasOwnProperty('limit');
                            hasTables = req.body.hasOwnProperty('tables');
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

                        if (hasTable && hasTables) {
                            res.json({
                                error: true,
                                msg: 'At this time you must either have a "table" clause or a "tables" clause but not both'
                            });
                        }

                        //Build up the query from an empty object
                        query = {};

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
                        if (hasTables) {
                            query.namespace = Analytics.toFullNamespace(req.body.namespace, req.body.tables);
                        }
                        hasLimit ? Element.find(query, function (err, docs) {
                            docs = _.take(docs, req.body.limit);
                            res.json(docs);
                        }) : Element.find(query, function (err, docs) {
                            res.json(docs);
                        });

                    case 13:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, _this);
    }));

    return function (_x5, _x6) {
        return _ref2.apply(this, arguments);
    };
}());

app.get('*', function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0__Users_g6vc_WebstormProjects_form_analytics_github_node_modules_babel_runtime_regenerator___default.a.mark(function _callee3(req, res) {
        return __WEBPACK_IMPORTED_MODULE_0__Users_g6vc_WebstormProjects_form_analytics_github_node_modules_babel_runtime_regenerator___default.a.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        res.json({ success: true, msg: 'The server is active and running!' });

                    case 1:
                    case 'end':
                        return _context3.stop();
                }
            }
        }, _callee3, _this);
    }));

    return function (_x7, _x8) {
        return _ref3.apply(this, arguments);
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
    console.log(chalk.green('\u2713 Running version (' + VERSION + ')'));
    console.log(chalk.blue('-------------------------------------------'));
    console.log(chalk.blue('| Analytics Server Listening on Port ' + addr.port + ' |'));
    console.log(chalk.blue('-------------------------------------------'));
}
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, "src"))

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(6);


/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("regenerator-runtime");

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = require("debug");

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = require("http");

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = require("morgan");

/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = require("jade");

/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = require("cookie-parser");

/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = require("bluebird");

/***/ }),
/* 15 */
/***/ (function(module, exports) {

module.exports = require("body-parser");

/***/ }),
/* 16 */
/***/ (function(module, exports) {

module.exports = require("chalk");

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

var _ = __webpack_require__(2);
var DecisionTree = __webpack_require__(18);
var mind = __webpack_require__(1);

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

        var arr = _.take(data, limit).map(function (i) {
            return i.value;
        });

        return arr.filter(Boolean);
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
/* 18 */
/***/ (function(module, exports) {

module.exports = require("decision-tree");

/***/ }),
/* 19 */
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
/* 20 */
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
/* 21 */
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