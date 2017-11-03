/**
 * Created by christianbartram on 10/18/17.
 */
const mongoose = require('mongoose');

let Element = mongoose.Schema({
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