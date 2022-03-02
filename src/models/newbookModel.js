const mongoose = require('mongoose');
const { required } = require('nodemon/lib/config');
const ObjectId = mongoose.Schema.Types.ObjectId

const newbookSchema = new mongoose.Schema({
    name: String,
    author:{
        type: ObjectId,
        ref: 'newauthor',
        required: true
    },
    price: String,
    rating: Number,
    publisher: {
        type: ObjectId,
        ref: 'newpublisher',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('newbook', newbookSchema)