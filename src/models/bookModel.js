const mongoose = require('mongoose');

// const bookSchema = new mongoose.Schema( {
//     bookName: String, 
//     authorName: String, 
//     tags: [String],
    
//     isPublished: Boolean,
//     prices: {
//         indianPrice: String,
//         europePrice: String,
//     },
//     sales: {type: Number, default: 10},
    
//     // " best boook on earth"   [ "Nodejs in detail" , "mongodb in detail", "fronend in detail"] 
    // {
        // "ch1 ": "awesome intro to JS",
        // "ch2" : "intro to nodejs",
        // "ch3" : "intro to db"
//     //  }
//     summary :  mongoose.Schema.Types.Mixed,
//     isDeleted: Boolean //true on book deletion i.e you flag the document/data as isDeleted: true..(mark "dirty")

// }, { timestamps: true });

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

const booksSchema = new mongoose.Schema({
    name: String,
    authorId:{
        type:Number,
        required:true
    },
    price:Number,
    rating:Number

})


module.exports = mongoose.model('Book', booksSchema) //users
module.exports = mongoose.model('Author', authorSchema)
