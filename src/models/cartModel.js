const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;




const cartSchema = new mongoose.Schema({

    userId: {
        type: ObjectId,
        required: true,
        ref: 'user',
        unique: true,
        trim: true
    },
    items: [{
        productId: {
            type: ObjectId,
            required: true,
            ref: 'product',
            trim: true
        },
        quantity:{
            type: Number,
            required: true,
            min: 1
        },// must be minimum 1
    }],
    totalPrice: {
        type: Number,
        required: true,
    },
    totalItems: {
        type: Number,
        required: true,
    },
}, { timestamps: true });



module.exports = mongoose.model('cart', cartSchema);
