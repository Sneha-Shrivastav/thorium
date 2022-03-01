const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema({
    authorId:{
        type:Number,
        required:true
    },
    authorName: {
        type: String,
        required: true
    },
    age: Number,
    address: String
})

module.exports = mongoose.model('Author', authorSchema)