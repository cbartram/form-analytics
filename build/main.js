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

module.exports = require("chalk");

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
/* WEBPACK VAR INJECTION */(function(__dirname) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Users_g6vc_WebstormProjects_form_analytics_github_node_modules_babel_runtime_regenerator__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Users_g6vc_WebstormProjects_form_analytics_github_node_modules_babel_runtime_regenerator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__Users_g6vc_WebstormProjects_form_analytics_github_node_modules_babel_runtime_regenerator__);


var foo = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0__Users_g6vc_WebstormProjects_form_analytics_github_node_modules_babel_runtime_regenerator___default.a.mark(function _callee() {
        return __WEBPACK_IMPORTED_MODULE_0__Users_g6vc_WebstormProjects_form_analytics_github_node_modules_babel_runtime_regenerator___default.a.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.next = 2;
                        return Element.find({});

                    case 2:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    return function foo() {
        return _ref.apply(this, arguments);
    };
}();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var debug = __webpack_require__(20)('form-analytics:server');
var http = __webpack_require__(21);
var express = __webpack_require__(8);
var path = __webpack_require__(9);
var logger = __webpack_require__(10);
var jade = __webpack_require__(11);
var cookieParser = __webpack_require__(12);
var bluebird = __webpack_require__(13);
var bodyParser = __webpack_require__(14);
var mongoose = __webpack_require__(0);
var chalk = __webpack_require__(1);
var _ = __webpack_require__(2);
var Analytics = __webpack_require__(23);

var app = express();

//Models
var Form = __webpack_require__(17);
var Element = __webpack_require__(18);
var User = __webpack_require__(19);

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
app.post('/form/register', function (req, res) {
    //Get the namespace & Required variables i.e. ApplicationName.formName
    var namespace = req.body.namespace;
    var elements = req.body.elements;
    var method = req.body.method;

    Form.find({ namespace: namespace }, function (err, record) {
        //There was no namespace this is a new form
        if (record.length <= 0) {
            //Create a new namespace
            new Form({ namespace: namespace, elements: elements }).save(function (err, record) {
                console.log(chalk.green('\u2713 Successfully created new Namespace: ' + namespace));

                res.json({
                    success: true,
                    data: []
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
                            return Analytics.perSubjectRecent(val);
                        },
                        'per-subject-frequency': function perSubjectFrequency() {
                            return Analytics.perSubjectFrequency(val);
                        },
                        'decision-tree': function decisionTree() {
                            return Analytics.decisionTree(val);
                        },
                        'bayesian': function bayesian() {
                            return Analytics.bayesian(val);
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

 * @param method String Method of analytics to run i.e. "per-subject-frequency
 */
var runAnalytics = function runAnalytics(dataset, method) {

    var analyticsMethod = {
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
    return analyticsMethod[method]();
};

/**
 * Handles Running Analytics on a Custom Set of Data
 */
app.post('/analytics', function (req, res) {
    var data = req.body.data;
    var method = req.body.method;

    res.json({ data: runAnalytics(data, method) });
});

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

app.post('/query', function (req, res) {
    try {
        var hasTable = req.body.hasOwnProperty('table');
        var hasAnd = req.body.query.hasOwnProperty('and');
        var hasOr = req.body.query.hasOwnProperty('or');
        var hasWhere = req.body.query.hasOwnProperty('where');
        var hasUser = req.body.query.hasOwnProperty('user');
        var hasLike = req.body.query.hasOwnProperty('like');
        var hasLimit = req.body.query.hasOwnProperty('limit');
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
    var query = {};

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
});

app.get('*', function (req, res) {
    res.json({ success: true, msg: 'The server is active and running!' });
});

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
/* 5 */,
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(7);


/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = require("regenerator-runtime");

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
/* 15 */,
/* 16 */
/***/ (function(module, exports) {

module.exports = require("decision-tree");

/***/ }),
/* 17 */
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
/* 18 */
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
/* 19 */
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

/***/ }),
/* 20 */
/***/ (function(module, exports) {

module.exports = require("debug");

/***/ }),
/* 21 */
/***/ (function(module, exports) {

module.exports = require("http");

/***/ }),
/* 22 */,
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

var _ = __webpack_require__(2);
var DecisionTree = __webpack_require__(16);

module.exports = {
    /**
     * Takes the Rightmost 3 Elements from the
     * Mongoose document array as the most recently used pieces of form data
     * @param data
     * @returns {Array}
     */
    perSubjectRecent: function perSubjectRecent(data) {
        return _.takeRight(data, 3);
    },


    /**
     * Find the most frequently used
     * @param data
     */
    perSubjectFrequency: function perSubjectFrequency(data) {
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
        return uniques.sort(compareFrequency);
    },
    decisionTree: function decisionTree(data) {
        var dt = new DecisionTree(data, "value", ["value", "namespace"]);

        var predicted_class = dt.predict({
            value: "Ham",
            namespace: "Pizza.createForm.Meats"
        });

        var treeModel = dt.toJSON();
        return predicted_class;
    },
    bayesian: function bayesian(data) {
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

/***/ })
/******/ ]);
//# sourceMappingURL=main.map