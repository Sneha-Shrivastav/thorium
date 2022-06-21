const orderModel =require('../models/orderModel')
const cartModel =require('../models/cartModel')
const userModel = require('../models/userModel')
const validator =require('../validator/validator')



const createOrder= async function(req,res){



    try{
        const uId =req.params.userId
    if(!validator.isValid(uId)||!validator.isObjectId(uId)){return res.status(400).send({status:400,message:"please provide vailid object id  "})}

    let cartBody =req.body

    if(!cartBody){return res.status(400).send({status:false,message:"please provide cartBody"})}
    let {cancellable,status,isDeleted} =cartBody

    


    let findCart=await cartModel.findOne({userId:uId})
    if(!findCart){
        return  res.status(400).send({status:false,message:"no cart found from userID "})
    }
    // you can select particular elements form findCart if you Want 



    let {items,totalPrice,totalItems} =findCart

    let totalQuantity = 0
        let totalItem = items.length
        for (let i = 0; i < totalItem; i++) {
            totalQuantity = totalQuantity + Number(items[i].quantity)
        };

        
        

    if(isDeleted == "true"){
        var delDate = Date.now()
    }


    let orderBody ={userId:uId,items,totalPrice,totalItems,totalQuantity,cancellable,status,deletedAt:delDate}
    

    let orderCreated =await orderModel.create(orderBody)
    

    res.status(200).send({status:true,message:"Order  Created ",data:orderCreated})
    }


    catch(err){
        res.status(500).send({status:true,message:err.message})
    }


    
}


// const cancelOrder = async (req, res) => {
//     try {
//         let productId = req.body.orderId
//         const orderCancel = await orderModel.findOneAndUpdate({ _id: productId }, { isDeleted: true, deletedAt: Date(), status: "cancelled" }, { new: true })
//         return res.status(200).send({ status: true, message: 'Order has been cancelled Successfully', data: orderCancel });
//     }
//     catch (err) {
//         res.status(500).send(err.message)
//     }
// }


const updateOrder = async function(req,res){
    try{
        let userId = req.params.userId
        const{orderId, status} = req.body
        if(!(validator.isValidObjectId(userId))){
            return res.status(400).send({status: false, msg:"Provide a valid object Id/userId"})
        }
        // if(req.user.userId != userId){
        //     return res.status(401).send({status: false, msg: "userId does not match"})
        //}
        if(!validator.isValidObjectId(orderId)){
            return res.status(400).send({status: false, msg: "Provide a valid orderId"})
        }
        // validate status 
        let findUser = await userModel.findOne({_id: userId})
        if(!findUser){
           return res.status(400).send({status: false, msg: "User not found"})
        }

        // matching user id with orderId 
        let findOrder = await orderModel.findOne({_id: orderId, userId: userId})
        if(!findOrder){
            return res.status(400).send({status: false, msg: "orderId or userId does not match"})
        }
        let cancelCheck = findOrder.cancellable
        let statusCheck = findOrder.status
        if(statusCheck == "completed" || statusCheck == "cancelled"){
            return res.status(400).send({status: false, msg: "status cannot be changed"})
        }
        if(cancelCheck){
            let cancelOrder = await orderModel.findOneAndUpdate({_id: orderId}, 
                {status: status}, {new: true}) 
            return res.status(200).send({status: true, data: cancelOrder})
        }else{
            return res.status(400).send({status: false, msg:"Ther order is not cancellable"})
        }

    }catch(err){
        res.status(500).send({status: false, msg: err.message})
    }
}

module.exports={createOrder,updateOrder}