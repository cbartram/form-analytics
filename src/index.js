const debug = require('debug')('form-analytics:server');
const http = require('http');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const jade = require('jade');
const cookieParser = require('cookie-parser');
const bluebird = require('bluebird');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const chalk = require('chalk');
const _ = require('lodash');
const Analytics = require('./utils/AnalyticsWidget.js');

const app = express();

//Models
const Form = require('../models/Form');
const Element = require('../models/Element');
const User = require('../models/User');

bluebird.promisifyAll(mongoose);
mongoose.Promise = global.Promise;

//Connect to Database
mongoose.connect('mongodb://mongoAdmin:Innov8@34.226.210.46:27017/admin', {
    keepAlive: true,
    reconnectTries: 5,
    useMongoClient: true,
    reconnectInterval: 500
}, (err) => {
    if (err) {
        chalk.hex('#e81a00')('\u2715 Failed to Connect to AWS instance, attemping to connect to local instance');
        mongoose.connect('mongodb://localhost/test', (error) => {
            if (error) {
                console.log(chalk.hex('#e81a00')('\u2715 Failed to Connect to the Database....Check Connection URI'))
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

app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'jade');


//Allow CORS
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    //intercepts OPTIONS method
    'OPTIONS' === req.method ? res.send(200) : next();
});

app.options("/*", function(req, res, next){
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    res.send(200);
});


/**
 * Handles registering a new Namespace (for a new form)
 * or Running Analytics on an existing namespace
 */
app.post('/form/register', async (req, res) => {
    //Get the namespace & Required variables i.e. ApplicationName.formName
    const namespace = req.body.namespace;
    const elements = req.body.elements;
    const method = req.body.method;
    let limit;

    if(req.body.hasOwnProperty('limit')) {
         limit = req.body.limit;
    } else {
         limit = MAX_INTEGER;
    }

    Form.find({namespace}, (err, record) => {
        //There was no namespace this is a new form
        if(record.length <= 0) {
            //Create a new namespace
            new Form({namespace, elements}).save((err, record) => {
                console.log(chalk.green(`\u2713 Successfully created new Namespace: ${namespace}`));

                res.json({
                    success:true,
                    namespace
                })
            });

        } else {

            //Find the different element & Join them into the Form Namespace
            record[0].set({elements: _.union(elements.filter(e => !record[0].elements.includes(e)), record[0].elements)});
            record[0].save();


            console.log(chalk.green(`\u2713 Namespace: ${namespace} has been located running analytics...`));

            let promises = [];
            let responseData = [];

            elements.forEach(element => {
                console.log(chalk.green(`\u2713 Found Data for Element Namespace: ${element}`));
                //Find each element given its parent namespace
                let p = Element.find({namespace: `${namespace}.${element}`}).exec().then(val => {
                    //Acts as a switch statement to effectively compute based on the specified method
                    let analyticsMethod = {
                        'per-subject-recent': () => {
                            return  Analytics.perSubjectRecent(val, limit);
                        },
                        'per-subject-frequency': () => {
                            return Analytics.perSubjectFrequency(val, limit);
                        },
                        'decision-tree': () => {
                            return Analytics.decisionTree(val, limit);
                        },
                        'bayesian': () => {
                            return Analytics.bayesian(val, limit);
                        }
                    };
                    //Push the results of the analytics to an empty array
                    responseData.push(analyticsMethod[method]());
                });
                promises.push(p);
            });
            Promise.all(promises).then(() => {
                res.json(responseData);
            }).catch((err) => {
                console.error(err);
            });
        }
    });
});

/**
 * Handles a basic user signup
 */
app.post('/signup', async (req, res) => {
    let {name, email, password, username }  = req.body;

    let user = new User({name, email, password, username});
    user.save();

    res.json({success:true, user});
});

/**
 * Handles Calculating the Analytics on a custom dataset
 * @param dataset Array of MongoDB document objects

 * @param method String Method of analytics to run i.e. "per-subject-frequency
 */
const runAnalytics = async (dataset, method) => {

    let analyticsMethod = {
        'per-subject-recent': () => {
            return  Analytics.perSubjectRecent(dataset);
        },
        'per-subject-frequency': () => {
            return Analytics.perSubjectFrequency(dataset);
        },
        'decision-tree': () => {
            return Analytics.decisionTree(dataset);
        },
        'bayesian': () => {
            return Analytics.bayesian(dataset);
        }
    };

    //Push the results of the analytics to an empty array
    return analyticsMethod[method]();
};

/**
 * Handles Running Analytics on a Custom Set of Data
 */
app.post('/analytics', async (req, res) => {
    const data = req.body.data;
    const method = req.body.method;

    res.json({data: runAnalytics(data, method)});

});


/**
 * Handles Inserting data into Mongo but does not run analytics
 * this is how the classifier is updated when the Submit button is pressed
 */
app.post('/insert', async  (req, res) => {
    const formNamespace = req.body.namespace; //Pizza.createForm
    const elementNamespaces = req.body.elements; //[Meat, Veggies, CrustStyle]
    const elementValues = req.body.values; //[Pepperoni, Tomatoes, Thin]
    let user = req.body.user; //UserID

    if(typeof user === 'undefined') {
        user = null
    }

    if(elementNamespaces.length !== elementValues.length) {
        console.log(chalk.hex('#e81a00')('\u2715 ElementOutOfBoundsException Error: More Elements than Values to fill.'));
        res.json({success: false, msg: 'There were more namespaces than values to fill or vice versa....Please ensure both arrays are of the same length.'});
    } else {

        //Ensure the elements exist in the Form Namespace
        Form.find({namespace: formNamespace}, (err, record) => {
            if (typeof record !== "undefined" && record.length > 0) {
                if (!elementNamespaces.every(elem => record[0].elements.indexOf(elem) > -1)) {

                    //An elementNamespace is not already defined in the Form model
                    console.log(chalk.hex('#e81a00')('\u2715 UndefinedNamespaceException: One of the element namespaces has not yet been defined in the Form Model'));
                    res.json({
                        success: false,
                        msg: 'UndefinedNamespaceException: One of the element namespaces has not yet been defined in the Form Model'
                    })

                } else {
                    let records = [];

                    //Add a new value for each namespace
                    elementNamespaces.map((value, key) => {
                        //Remove the Item being stored from referencing itself
                        let references = elementValues.filter(e => e !== elementValues[key]);
                        let namespaces = elementNamespaces.filter(e => e !== elementNamespaces[key]);

                        //Map over each reference and convert it into an object
                        let finalRef = references.map((ele, key) => {
                            return {
                                namespace: `${formNamespace}.${namespaces[key]}`,
                                value: ele
                            }
                        });

                        records.push(new Element({
                            namespace: `${formNamespace}.${value}`,
                            value: elementValues[key],
                            user,
                            references: finalRef,
                            updatedAt: new Date(),
                            createdAt: new Date()
                        }));
                    });

                    //Insert Bulk operation
                    Element.collection.insert(records, (err, data) => {
                        if(err) res.json({success: false, err});
                        console.log(chalk.green(`\u2713 Element data saved!`));
                        res.json({success: true});
                    });
                }
            } else {
                console.log(chalk.hex('#e81a00')('\u2715 UndefinedNamespaceException: One of the Form namespaces has not yet been defined in the Form Model use /form/register to define a new namespace'));
                res.json({
                    success: false,
                    msg: 'UndefinedNamespaceException: One of the Form namespaces has not yet been defined in the Form Model use /form/register to define a new namespace'
                })
            }
        });
    }
});

/**
 * Deletes all records in a Collection
 */
app.get('/remove', (req, res) => {
    Form.remove({}, () => {});
    Element.remove({}, () => {});
    res.json({success: true});
});

app.get('/all', (req, res) => {
    Form.find({namespace: "Pizza.createForm"}, (err, data) => {
        console.log(data);
    });

    Element.find({}, (err, d) => {
        res.json(d);
    });
});

app.post('/query', async (req, res) => {
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
    if(hasAnd && hasOr) {
        res.json({
            error: true,
            msg: 'At this time you must either have an "and" property or an "or" property but not both.'
        })
    }

    if(hasLike && hasWhere) {
        res.json({
            error: true,
            msg: 'At this time you must either have a "where" clause or a "like" clause but not both'
        })
    }

    //Build up the query from an empty object
    let query = {};

    if(typeof req.body.table === 'object') {
        req.body.table.forEach(t => {
            query.namespace = `${req.body.namespace}.${req.body.t}`;
            hasWhere ? query.value = req.body.query.where : null;
            hasAnd ? query['references.value'] = {$all: req.body.query.and} : null;
            hasOr ? query['references.value'] = {$in: req.body.query.or} : null;
            hasUser ? query.user = req.body.query.user : null;
            hasLike ? query.value = {$regex: '.*' + req.body.query.like + '.*', $options: 'i'} : null;
        });

        hasLimit ?
            await Element.find(query).sort({'value': -1}).limit(req.body.query.limit).exec((err, docs) => res.json(docs)) :
            Element.find(query, (err, docs) => {
                res.json(docs);
            });

    }

    //Match Req body to query values
    !hasTable ? query.namespace = {
        $regex: req.body.namespace,
        $options: 'i'
    } : query.namespace = `${req.body.namespace}.${req.body.table}`;
    hasWhere ? query.value = req.body.query.where : null;
    hasAnd ? query['references.value'] = {$all: req.body.query.and} : null;
    hasOr ? query['references.value'] = {$in: req.body.query.or} : null;
    hasUser ? query.user = req.body.query.user : null;
    hasLike ? query.value = {$regex: '.*' + req.body.query.like + '.*', $options: 'i'} : null;

    hasLimit ?
        Element.find(query).sort({'value': -1}).limit(req.body.query.limit).exec((err, docs) => res.json(docs)) :
        Element.find(query, (err, docs) => {
            res.json(docs);
        });

});

app.get('*', async (req, res) => {
    res.json({success: true, msg: 'The server is active and running!'});
});

// error handler
app.use((err, req, res) => {
    console.log(err);
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);

    res.json({error: err});

});


/**
 * Get port from environment and store in Express.
 */

const port = 3010;
console.log(chalk.blue('\u2713 Setting Server Port to 3010...'));
app.set('port', port);

/**
 * Create HTTP server.
 */
console.log(chalk.blue('\u2713 Creating HTTP Server...'));
const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port, (err) => {
    if(err) onError(err);
    onListening();
});

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    let bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

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
    let addr = server.address();
    console.log(chalk.blue('-------------------------------------------'));
    console.log(chalk.blue(`| Analytics Server Listening on Port ${addr.port} |`));
    console.log(chalk.blue('-------------------------------------------'));
}
