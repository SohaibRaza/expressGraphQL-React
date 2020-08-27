const mongoose = require('mongoose');

// eslint-disable-next-line prefer-destructuring
const Schema = mongoose.Schema;

const authorsSchema = new Schema({
    name: String,
    age: Number
});

module.exports = mongoose.model('Authors', authorsSchema);
// book: [{
//     _id: mongoose.mongo.ObjectId,
//     name: String,
//     genere: String
// }]