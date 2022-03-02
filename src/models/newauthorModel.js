const mongoose = require('mongoose')

const newauthorSchema = new mongoose.Schema({
    authorName: String,
    age: Number,
    address: String
}, { timestamps: true });

module.exports = mongoose.model('newauthor', newauthorSchema)