'use strict';

var express = require('express');
var path = require('path');
var logger = require('morgan');
var jade = require('jade');
var cookieParser = require('cookie-parser');
var bluebird = require('bluebird');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var chalk = require('chalk');
var _ = require('lodash');
var Analytics = require('./src/AnalyticsWidget.js');

var app = express();

//Models
var Form = require('./models/Form');
var Element = require('./models/Element');
var User = require('./models/User');

bluebird.promisifyAll(mongoose);
mongoose.Promise = global.Promise;

//
// mongoose.connect('mongodb://localhost/test', {
//     keepAlive: true,
//     reconnectTries: Number.MAX_VALUE,
//     useMongoClient: true
// }, (error) => {
//     if (error) {
//         console.log(chalk.hex('#e81a00')('\u2715 Failed to Connect to the Database....Check Connection URI'))
//     } else {
//         console.log(chalk.green('\u2713 connected to MongoDB:LOCAL ENV'));
//     }
// });

//Connect to Database
mongoose.connect('mongodb://mongoAdmin:Innov8@34.226.210.46:27017/admin', {
    keepAlive: true,
    reconnectTries: Number.MAX_VALUE,
    useMongoClient: true
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
 * Handles Calculating the Analytics
 * @param dataset Array of MongoDB document objects
 * @param method String Method of analytics to run i.e. "per-subject-frequency
 */
var runAnalytics = function runAnalytics(dataset, method) {
    //Acts as a switch statement to effectively compute based on the specified method
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

app.use('/', require('./routes/index'));
app.use('/user', require('./routes/user'));
app.use('/pizza', require('./routes/pizza'));

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
    !hasTable ? query.namespace = { $regex: req.body.namespace, $options: 'i' } : query.namespace = req.body.namespace + '.' + req.body.table;
    hasWhere ? query.value = req.body.query.where : null;
    hasAnd ? query['references.value'] = { $all: req.body.query.and } : null;
    hasOr ? query['references.value'] = { $in: req.body.query.or } : null;
    hasUser ? query.user = req.body.query.user : null;
    hasLike ? query.value = { $regex: '.*' + req.body.query.like + '.*', $options: 'i' } : null;

    Element.find(query, function (err, docs) {
        return res.json(docs);
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

module.exports = app;