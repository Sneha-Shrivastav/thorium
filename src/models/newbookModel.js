const mongoose = require('mongoose');
const { required } = require('nodemon/lib/config');
const ObjectId = mongoose.Schema.Types.ObjectId

const newbookSchema = new mongoose.Schema({
    name: String,
    authorName: String,
    author:{
        type: ObjectId,
        ref: 'newauthor',
        required: true
    },
    price: Number,
    rating: Number,
    publisherName: String,
    publisher: {
        type: ObjectId,
        ref: 'newpublisher',
        required: true
    },
    isHardCover:{
        type:Boolean,
        default:false
    }
}, { timestamps: true });

module.exports = mongoose.model('newbook', newbookSchema)