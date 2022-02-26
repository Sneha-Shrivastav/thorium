const mongoose = require('mongoose');
const { required } = require('nodemon/lib/config');

// const userSchema = new mongoose.Schema( {
//     firstName: String,
//     lastName: String,
//     mobile: {
//         type: String,
//         unique: true,
//         required: true
//     },
//     emailId: String,
//     gender: {
//         type: String,
//         enum: ["male", "female", "LGBTQ"] //"falana" will give an error
//     },
//     age: Number,
//     // isIndian: Boolean,
//     // parentsInfo: {
//     //     motherName: String,
//     //     fatherName: String,
//     //     siblingName: String
//     // },
//     // cars: [ String  ]
// }, { timestamps: true });

// module.exports = mongoose.model('User', userSchema) //users

const bookSchema = new mongoose.Schema ({
    bookName: {
        type: String,
        required: true
    },
    authorName:String,
    category: {
        type: String,
        enum: ["poetry", "history", "horror", "novel", "fairy-tale", "textbook"]
    },
    year: Number,  
}, {timestamps: true});

module.exports = mongoose.model('Book',bookSchema)



// String, Number
// Boolean, Object/json, array