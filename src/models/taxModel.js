const mongoose = require('mongoose');
const { isObjectId } = require('../validator/validator');

const taxSchema = new mongoose.Schema({


    userId:{
        type:Object,
        required:true,
        ref:'User'


    },

    totalSales:{
        type:Number,
        required:true,


    },

    City:{
        type:String,
        required:true

    },

    date:{
        type:Date

    },

    SGST:{
        type:Number,
        required:true
    },

    CGST:{
        type:Number,
        required:true
    },

    taxSlab :{
        type:Number,
        enum:['5','12','18','28']

    },
    taxStatus :{
        type:String,
        enum:['New','Paid','Delayed',]

    },
    // only to be done by taxAccountant
    taxDue:{
        type:String,
        // can be done only by taxAccountant 
        enum:["delayed","new"],
        

    },




      // we can also select as test type 
    // taxType:{

    // }
    




})





module.exports = new mongoose.model('taxModel',taxSchema)