# Form Analytics

This is a fully functional Analytics server built with 
NodeJS, Express, React and MongoDB. This project allows anyone to quickly and simply 
add powerful analytical functionality to any of their web based forms!

Form Analytics supports the following analytical models:
- per-subject-recent
- per-subject-freqency
- bayesian
- decision-tree
- **New** neural-network

## Getting Started

To get started contributing or simply testing the project you can clone this repository by running

`git clone http://edclgitp401.bcbsfl.com/git-ats/Form-Analytics.git`

see the Prerequisites and Installation sections to learn how to install and dependencies and start up the servers!

### Prerequisites

All dependencies in this project are managed with Node package manager or (NPM for short) which helps to simplify the entire process
of managing, updating, and removing dependencies.

Simply install any predefined dependencies by running

```
npm i
```

Note: Ensure you are in the project directory (which you cloned in the Getting Started section) before you run the `npm` command

### Installing

Now that you have cloned the project and installed the dependencies its time to fire up the engines and get
everything working!

Run the following command to boot up the server after the dependencies are installed.

```
compile the program: npm run compile
start the program: npm start
```

After the server is running it will be active on your network at http://localhost:3010 You can verify this by following the URL and you should see a Static HTML page notifying you that the server successfully processed your request!

This package also comes pre-installed with a demonstration client showing the functionality of the product to run the client navigate in your terminal to the `/client/analytics-client` directory then run the command `npm start` the client will automatically
connect to a setup MongoDB instance in AWS with pre-populated data to run the analytics on. Any additional data which is created will also be stored in AWS.

## Usage & Examples

For the purpose of all these examples we are going to use the Analytics Widget to predict which Pizza Toppings users might want to add to their pizza.

We have several elements within our pizza creation form and we need analytics for all of them:
- Crust Style
- Meat
- Veggies

For example many people might like sausage of their pizza we could suggest other options to them based on what we think they may like such as:
- turkey
- ham
- bacon
- beef

For this example a frequency classifier is going to be our best model so we can utilize the per-subject-frequency
method to easily predict toppings for this form.

```javascript
//First we import the Client Library
import AnalyticsWidget from 'analytics-widget';

//Next we want to register a new pick predictor
new AnalyticsWidget.registerPickPredictor({
    namespace: "Pizza.createForm",
	elements: ["Veggies", "Meats", "Crust"],
	method: "per-subject-frequency"
}, (data) => {
    //data is the result of the Analytical Functions
});
```

If you would prefer to use the raw API endpoints instead of the client side library then you must **register your forms namespace before any documents can be inserted**
To register a namespace use the endpoint `/form/register` with a POST request body which looks like this

```json
{
	"namespace": "Pizza.createForm",
	"elements": ["Meat", "Veggies", "Crust Style"],
	"method": "per-subject-frequency"
}
```
Upon the first form registration if the operation is successful the server will respond with the JSON that follows:
```json
{
    "success": true,
    "data": []
}
```
**Data will be an empty array** because you have not inserted any data into this namespace and so we cannot suggest relevant
fields when there is no data in the next step you will learn how to insert data into this namespace for querying and predictions.

The API provides a fluid way to query, insert, and run analytical functions on data, however, **it is the responsibility of the programmer
to wire up the data coming from the forms and pass it into the API for insertion.**

In a React App state is a perfect way to take input from the forms and use the AnalyticsWidget API insert the data directly into the correct namespace
check out the example below:

```jsx
import React, {Component} from 'react'

export default class PizzaForm extends Component
            constructor() {
                super();

                this.state = {
                    veggie: null
                }
            }

            handleChange = (e) => this.setState({veggie: e.target.value)});

            insertData = () => {
                const {veggie} = this.state;

                //Insert data
                AnalyticsWidget.insert({
                    namespace: ["Pizza.createForm"],
                    elements: ["Veggies"],
                    values: [veggie],
                });
            }

            ...
            render() {
                return(
                    <input type="text" onChange={this.handleChange} />
                    <button type="submit" onClick={this.insertData} />
                )
            }
```

Notice how it is up to the **programmer to ensure input is updated to state when the `onChange` event occurs** and
the `AnalyticsWidget` only serves to insert the form data into the proper namespace and table.

Currently we know how to register new namespaces (when new forms are created), run analytics on form fields, and insert new form data
into the correct namespace to allow for better predictions. But What about Querying specific data? Nothing the fear the Query API is here!

The Query API is a powerful part of the Analytics Widget and it allows you to quickly used chained method calls to reduce
a data set based on specific constraints. Lets jump in!

All Queries start with the `query()` method which tells the API that each method call henceforth is a constraint to the query.
`query()` takes no parameters and by default will create a brand new query to the database. The last query API call must be `exec()` which takes a callback
function to retrieve the results of your query! That's it! The query API is beautiful because it can be as simple
or complex as your needs!

For instance:

```javascript
AnalyticsWidget.query().exec(data => {
    console.log(data);
})
```
We notice in the query above we invoke the query API with `query()` and then instantly end it with `exec()` so this query says
"Get me all documents"

We can constrain the data set by chaining the `databse()` method to the query like so:

```javascript
AnalyticsWidget.query().database("Pizza.createForm").table("Meats").exec(data => {
    console.log(data);
})
```
As you might have guessed this query pulls every 'Meat' document within the 'Pizza.createForm' namespace.
We can add `and`, `like`, `where`, `limit` and `or` clauses as well to further constrain the data set!

Lets run through another example:

```javascript
AnalyticsWidget.query()
    .database("Pizza.createForm")
    .table("Veggies")
    .like("Pepp")
    .limit(10)
    .exec(data => console.log(data));
```

This query finds all documents in the Veggies namespace where the value includes the text "Pepp" (peppers would be returned in this instance)
but we also constrain the data set to a maximum of 10 records.

We can also use the `onlyUser($userID)` method to ensure
that each document that comes back is a document submitted by your logged in user, simply pass in your applications unique user ID and
the API takes care of the rest!

How about running analytics on a custom data set? No problem!

```javascript
AnalyticsWidget.query()
    .database("Pizza.createForm")
    .table("Meats")
    .where("Turkey")
    .and("Tomato")
    .onlyUser("al9qI12W9")
    .exec(data => {
        //We can pass our data right into the analytics function!!
        AnalyticsWidget.analyze({
            data,
            method: 'per-subject-frequency'
        }, result => {
            //result holds the most frequently added toppings given a unique data set!
        });
})
```

As you can see the Query API is a powerful part of any developer's workflow; It aims to make it simple to pull out aggregated sets of data
for analysis and prediction!

Check out our API endpoints below!

## API Endpoints

| **Endpoint**     	| **Request Type** 	| **Body**                                                                                                                    	|
|------------------	|------------------	|-----------------------------------------------------------------------------------------------------------------------------	|
| `/insert`        	| `POST`           	| ```{"namespace": "Pizza.createForm","elements": ["Veggies", "Meat"],"values": ["Peppers", "Pepperoni"]}```               	|
| `/form/register` 	| `POST`           	| ```{"namespace": "Pizza.createForm","elements": ["Meat", "Veggies", "Crust Style"],"method": "per-subject-frequency"}``` 	|
| `/remove`        	| `GET`            	| None                                                                                                                        	|
| `/all`           	| `GET`            	| None                                                                                                                        	|
| `/query`         	| `POST`           	| ```{"namespace": "Pizza.createForm","table": "Meat","query": {"where": ["Turkey"],"and": ["Tomato", "Thin"]}}```      	|
| `/analytics`         	| `POST`           	| ```{"data": [ //Array of your data ], "method": 'per-subject-frequency'}```      	|
| `/version`         	| `GET`           	| None     	|



## Analytics Methods

This module supports a variety of different analytical methods including `per-subject-frequency`, `per-subject-recent`, and even a `neural-network`!

The per-subject-frequency method is great for finding the most frequently occurring values in a set of objects. For example if you want to figure out what the most
frequently ordered meat topping then per-subject frequency would be the way to go!

Per-subject-recent finds the most recently inserted items and as such **can** include duplicates in the list. This would be an excellent choice
if you would like the answer the question "what did the last five people choose to put on their pizza?"

The `neural-network` is the latest addition to the Analytics Module and uses a feed forward neural network to make accurate predictions about the
most likely topping someone will choose next. The neural network will train its data on the custom data set that is returned from your query and will
by default take the last item in the array of custom data as the test data. Lets run through a full example!

```javascript
//First We start by making a Query
AnalyticsAPI.query()
    .database("Pizza.createForm")
    .table("Meats")
    .onlyUser("A9hB6Lfqk")
    .exec((err, res) => {

        //Now lets analyze our results with the neural network!
        let config = {
            data: res, //Notice how we feed our custom data set directly into the configuration
            method: 'neural-network' //We must specify neural network as our method of choice
        };

        AnalyticsAPI.analyze(config, res => {
                //We did it! Heres our result from the neural network!
                console.log(res);
        });

});
```
So what exactly does the neural network's response look like? Simple! Its an array of objects with 2 properties
```json
{
    "name": "Beef"
    "confidence": ".98961748361"
}
```
This can be interpreted as follows: "We are 98% sure that the person who ordered this pizza would like to select Beef as a topping."
And just like that you have an array of predictions made by a Feed forward neural network to give to your customers!

For now we cannot further configure the neural network to take a specific piece of test data (such as when new data is submitted predictions are updated)
however that update is coming in the future! In the meantime feel free to continue to pass more configuration options to the `per-subject-frequency` and `per-subject-recent`
methods and check out the configuration section below!

## Configuration

The `AnalyticsWidget.registerPickPredictor()` method accepts a javascript configuration object as its first argument. The structure of the configuration
object is as follows:

```json
{
	"namespace": "Pizza.createForm",
	"elements": ["Veggies", "Meats", "Crust"],
	"method": "per-subject-frequency"
}
```
The `namespace` property is **extremely** important as it determines how this data is queried and stored. Namespaces
should be in the format `AppName.formName.formField`. A proper namespace ensures that form data from an unwanted element or a different form
is not used an input which could lead to bad data and poor analytical predictions.

The `elements` property is used to determine which form elements will have data stored for analytical processing
Whenever the `registerPickPredictor()` method is called each element in the array is analyzed to do 1 of 2 options

- If it is a new form element it will Add it to the Form's namespace i.e it will create a slot for `Pizza.createForm.Veggies` to store information down the road
- If it is a previously recognized form element it will run the analytics defined by the `method` property on the given data set. An example config object looks like this

```json
{
    "namespace": "Pizza.toppingForm",
    "elements": ["Meats", "Veggies", "Cheese"],
    "method": "per-subject-frequency"
}
```

would query all the documents with the namespaces Pizza.toppingForm.Meats, Pizza.toppingForm.Veggies, and Pizza.toppingForm.Cheese and would
then run them against the per-subject-frequency classifier and return something like this

```
{
  "Ham",
  "Tomatoes",
  "Provolone"
}
```
Ultimately this can be interpreted as "The most frequent choices of Meats, Veggies, and Cheese are Ham, Tomatoes, and Provolone".

## Inserting into the Database

In order for Analytics to work correctly it must be fed actual customer values which have been selected. For instance we may predict on very little data
that a customer will choose provolone cheese however, the customer may have preferred American cheese and selected that instead. In this case its crucial for the
application to store the actual value so that next time the predictions will be more accurate.

In order to store actual values in the database the `insert()` method must be called. The `insert()` method takes a single configuration object which determines what information is stored take a look
below to learn how this object works to persist your data!

```json
{
	"namespace": ["Pizza.createForm"],
	"elements": ["Crust", "Veggies"],
	"values": ["Pan", "Tomato"],
	"user": "59f9cbac106d3e7fe33cd33f"
}
```

The above configuration object is very similar to the `registerPickPredictor()` object and has only one subtle difference!
The `namespace` property should be formatted like this `AppName.formName` as each element is appended to the namespace and stored in a different "table" so data is not confused when it is queried
The `elements` property is nearly the same as before and simply describes the elements from the form which are being inserted. (You can think of the elements like separate tables in a relational database)
Finally the `values` property does exactly as the name suggests it specifies the value for the Crust "table" as well as the value for the "Veggies" table. You can think of it as the following query:

`INSERT INTO Veggies (value) VALUES 'Tomato'`

Notice the special `user` property which can be applied if your form is currently collecting data from a logged in user. You can specify a `user` property in your
request query (in the next section) to filter all of the data made by a specific user. This allows you to ensure that in a member search form sally is not receiving
suggestions from Joe's searches!

## Querying

Querying is an integral part of any database and form analytics helps make it a breeze!

Simply hit the query endpoint (`/query`) with a POST request and a body in this form to query your data

```json
{
	"namespace": "Pizza.createForm",
	"table": "Meat",
	"query": {
		"where": ["Turkey"],
		"and": ["Tomato", "Thin"],
	}
}
```

The query api has been designed to be easily readable. The query above in SQL reads as follows **SELECT * FROM Pizza.createForm.Meat WHERE Meat = 'Turkey' AND references = 'Tomato' AND references = 'Thin' **
The query isn't exact SQL because of database inconsistencies however, it is relatively close. With this query API you can specify and AND, OR, USER, LIKE, LIMIT, or WHERE clause to find documents matching the criteria.

Lets run through a few simple queries to help get you accustomed to the API!

```json
{
	"namespace": "Membersearch.search",
	"table": "Name",
	"query": {
		"like": ["Fre"],
	}
}
```

will return all documents within the member search where the name is LIKE `Fre` in this case (Fred Flinstone would be returned).
You can also specify a user property to query only fields with a specific user ID. This is useful in user based applications where you do not want a user's queries
to be included in analytics for a separate user.

```json
{
	"namespace": "Membersearch.search",
	"table": "Name",
	"query": {
		"like": ["Fre"],
		"and": ["George Harrington"],
		"user": "59f9cbac106d3e7fe33cd33f"
	}
}
```
This query is a little more complex but will return all members where there name is like `Fre` and where another form value references "George Harrington" but only
includes searches made by the user with the ID "59f9cbac106d3e7fe33cd33f".

As you can see the Query API is quite powerful as it can services a variety of needs for a variety of forms and inputs all while being packed into a single simple HTTP Route!

You can also run the Query API through the client side library using expressive chained methods to filter the data!

```javascript
let data = new AnalyticsWidget()
    .query("Pizza.createForm")
    .table("Meat")
    .where("Turkey")
    .and("Tomato")
    .exec((data) => {
//JSON documents matching the search criteria is available as 'data'!
})
```

## Running the tests

Unit tests are an integral part of any project. To run unit tests for this repository run the command `npm run test`

## Deployment

This project can be deployed anywhere you like from AWS to Heroku, Azure, and more! Simply ensure that the environment
has NodeJS (6.11.1) and NPM (3.10.10) installed on it by running `node -v && npm -v` and follow the steps to clone and
start the server!


## Built With

* [React](https://facebook.github.io/react/) - The frontend web framework used
* [NodeJS](https://nodejs.org/en/) - Server framework
* [Express](https://expressjs.com/) - Dependency Management
* [Mongo DB](https://index.js.mongodb.com/) - Used to persist data

## Contributing

Please read [CONTRIBUTING.md](https://github.com/cbartram/hue-server) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags). 

## Authors

* **Christian Bartram** - *Developer* - [@cbartram](https://github.com/cbartram)
* **Michael Sankovich** - *Developer* 


## Acknowledgments

* Express and NodeJS!

### License
The MIT License (MIT)

Copyright (c) 2017 Christian Bartram

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.