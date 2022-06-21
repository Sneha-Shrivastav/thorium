const mongoose = require('mongoose');

const isValid = (value) => {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    if (typeof value === 'number' && value.toString().trim().length === 0) return false
    return true;
}
const isValidRequestBody = (requestBody) => {
    if (Object.keys(requestBody).length) return true
    return false;
}
const isValidObjectId = (ObjectId) => {
    return mongoose.Types.ObjectId.isValid(ObjectId)
}


const isObjectId = function (ObjectId) {
    return  mongoose.isValidObjectId(ObjectId)
    }
    

    const isValidPhone = function (phone) {
        phone = phone.trim()
        let regexForphone = /^(?:(?:\+|0{0,2})91(\s*|[\-])?|[0]?)?([6789]\d{2}([ -]?)\d{3}([ -]?)\d{4})$/
        return regexForphone.test(phone)
    };  



    const isValidPassword = function (password) {
        password = password.trim()
        if (password.length > 7 && password.length < 16) return true
        return false
    }

    const isValidEmail = function (email) {
        email = email.trim()
        let regexForEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
        return regexForEmail.test(email)
    };

    
    
    

module.exports = { 
    isValid, 
    isValidRequestBody, 
    isValidObjectId,
    
    isObjectId,
    isValidEmail,
    isValidPhone,
    isValidPassword
    
 }