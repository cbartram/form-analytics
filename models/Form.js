/**
 * Created by christianbartram on 10/18/17.
 */
import mongoose from 'mongoose';


let Form = mongoose.Schema({
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