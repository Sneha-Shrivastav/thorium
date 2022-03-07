const mongoose = require('mongoose');

const userSchema = new mongoose.Schema( {
    name: String,
	balance:{
        type: Number,
        default:100
    }, 
	address:String,
	age: Number,
 	gender:{
        enum: ["male", "female", "LGBTQ"]
     }, 
	isFreeAppUser: {
        type: Boolean,
        default: false
    } 
}, { timestamps: true });

module.exports = mongoose.model('User2', userSchema) //users



// String, Number
// Boolean, Object/json, array