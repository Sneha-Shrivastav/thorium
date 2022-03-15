const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId

const blogSchema = new mongoose.Schema( {
    title : {
        type : String ,
        required : true 
    },
    body : {
        type : String ,
        required : true 
    },
    authorId : {
        type : ObjectId ,
        ref : "author" ,
        required : true
    } ,
    tages :  [ String ] ,
    category : {
        type : String ,
        required : true 
    }, 
    subcategory : [ String ] ,
    isDeleted : {
        type : Boolean ,
        default : false
    } ,
    deletedAt : Date ,
    isPublished : { 
        type : Boolean ,
        default : false
    } ,
    deletedAt : Date
 } , { timestamps: true });

module.exports = mongoose.model('blog', blogSchema) 
