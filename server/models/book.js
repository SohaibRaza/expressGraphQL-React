const mongoose = require('mongoose');

// eslint-disable-next-line prefer-destructuring
const Schema = mongoose.Schema;

const booksSchema = new Schema({
    name: String,
    genere: String,
    authorId: String
});

module.exports = mongoose.model('Books', booksSchema);
