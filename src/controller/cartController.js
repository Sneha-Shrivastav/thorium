const cartModel = require("../models/cartModel")
const productModel = require("../models/productModel")
const validator = require("../validator/validator")




//********************************************************* Add to cart  ********************************************************************//

const addToCart = async function (req, res) {
    try {


        if (validator.isValidRequestBody(req.query)) return res.status(400).send({ status: false, msg: "can not pass request query. query is blocked" })


        const suggestionData = [{ "productId": "62556bc926c7f67d579eb459", "quantity": 2 }]
        if (!validator.isValidRequestBody(req.body)) return res.status(400).send({ status: false, msg: "please provide productId and quantity in request body", suggestionData: suggestionData })



        // have to pass items , can pass only one key , can pass items type only array format

        if (!validator.isValid(req.body.items)) return res.status(400).send({ status: false, message: ` Key Name : 'items' You can pass only a valid iteam. Make sure you can not pass only key name or a blank key` })
        if (Object.keys(req.body).length > 1) return res.status(400).send({ status: false, msg: "You can pass only one key in request body", suggestionData: suggestionData })
        if (!Array.isArray(req.body.items)) return res.status(400).send({ status: false, msg: "You can pass only array format in request body", suggestionData: suggestionData })



        // can add at a time only one product , can not pass blank array , in array can pass only object , can not pass a blank object

        if ((req.body.items.length > 1) || (req.body.items.length <= 0) || (typeof req.body.items[0] != 'object') || (typeof req.body.items[0] == 'object' && Array.isArray(req.body.items[0]))) return res.status(400).send({ status: false, msg: "You have to pass only one items as a object array", suggestionData: suggestionData })
        if (!validator.isValidRequestBody(req.body.items[0])) return res.status(400).send({ status: false, msg: "You can not pass a blank object array", suggestionData: suggestionData })



        // can pass only two keys in array object

        if (Object.keys(req.body.items[0]).length > 2) return res.status(400).send({ status: false, msg: "You can pass only two key in object array", suggestionData: suggestionData })


        const items = req.body.items[0]
        const { productId, quantity } = items


        if (!validator.isValid(productId)) return res.status(400).send({ status: false, message: ` Key Name : 'productId' You can pass only a valid ObjectId. Make sure you can not pass only key name or a blank key` })
        if (!validator.isObjectId(productId)) return res.status(400).send({ status: false, msg: "you can pass only object id in product id" })


        const isProductExist = await productModel.findOne({ _id: productId, isDeleted: false })
        if (!isProductExist) return res.status(404).send({ status: false, message: "Product Doesn't Exist" })


        if (!validator.isValid(quantity)) return res.status(400).send({ status: false, message: ` Key Name : 'quantity' You can pass only a valid quantity. Make sure you can not pass only key name or a blank key` })
        if (!validator.isValidInstallments(quantity)) return res.status(400).send({ status: false, message: 'quantity should be a numeric positive integer value and minimum 1' })
        if (quantity <= 0) return res.status(400).send({ status: false, message: 'quantity should be a numeric positive integer value and minimum 1' })


        let isCartExist = await cartModel.findOne({ userId: req.params.userId })



        // After all validation There is only two case or user cart exist or user cart not exist

        if (!isCartExist) {


            const saveCart = {}


            saveCart['userId'] = req.params.userId


            saveCart['items'] = [items]


            const totalPrice = quantity * isProductExist.price
            saveCart['totalPrice'] = totalPrice
            saveCart['totalItems'] = saveCart.items.length


            const saveCartData = await cartModel.create(saveCart)
            console.log(saveCartData)


            return res.status(201).send({ status: true, message: "New cart created", data: saveCartData })



        }




        // if user cart exist There is only two case or same product allready exist in cart or same product not exist in cart

        if (isCartExist) {




            // if same product allready exist

            for (let i = 0; i < isCartExist.items.length; i++) {

                if (isCartExist.items[i].productId == productId) {


                    isCartExist.items[i].quantity = isCartExist.items[i].quantity + quantity


                    const updateCart = {}
                    if (!('$set' in updateCart)) updateCart["$set"] = {}


                    updateCart['$set']['items'] = isCartExist.items
                    updateCart['$set']['totalPrice'] = isCartExist.totalPrice + quantity * isProductExist.price
                    updateCart['$set']['totalItems'] = isCartExist.items.length


                    const saveCartData = await cartModel.findOneAndUpdate({ userId: req.params.userId }, updateCart, { new: true })
                    console.log("saveCartData", updateCart)
                    return res.status(200).send({ status: true, message: "Cart already Exist : Adding item to Cart", data: saveCartData })


                }

            }




            // if same product not exist in cart

            const saveCart = {}
            if (!('$set' in saveCart)) saveCart["$set"] = {}


            const newItems = isCartExist.items
            newItems.push(items)
            saveCart['$set']['items'] = newItems


            const newTotalPrice = isCartExist.totalPrice + quantity * isProductExist.price
            saveCart['$set']['totalPrice'] = newTotalPrice
            saveCart['$set']['totalItems'] = newItems.length


            const saveCartData = await cartModel.findOneAndUpdate({ userId: req.params.userId }, saveCart, { new: true })
            console.log(saveCartData, "saveCartData")
            return res.status(200).send({ status: true, message: "Cart already Exist : Adding item to Cart", data: saveCartData })


        }

    }

    catch (err) {

        console.log(err)


        if (err.message.includes("validation failed")) {
            const key = Object.keys(err['errors'])
            for (let i = 0; i < key.length; i++) {
                if (err['errors'][key[i]]['kind'] === "required")
                    return res.status(400).send(` '${key[i]}' field is required `)
            }
        }



        if (err.message.includes("duplicate key error")) {
            const key = Object.keys(err)
            for (let i = 0; i < key.length; i++) {
                if (err['index'] === 0)
                    return res.status(400).send({ "key": err['keyValue'], "msg": `This key should be unique ` })
            }
        }


        if (err) return res.status(500).send({ status: false, msg: "error occure . For more information move to console ", error: err.message })


    }

}




//********************************************************* remove product from cart ********************************************************************//

const removeProductFromCart = async function (req, res) {
    try {


        if (validator.isValidRequestBody(req.query)) return res.status(400).send({ status: false, msg: "can not pass request query. query is blocked" })


        let isCartExist = await cartModel.findOne({ userId: req.params.userId })
        if (!isCartExist) return res.status(404).send({ status: false, msg: "No cart exist" })


        const suggestionData = { "productId": "62556bc926c7f67d579eb459", "removeProduct": 2 }
        if (!validator.isValidRequestBody(req.body)) return res.status(400).send({ status: false, msg: "please provide productId and removeProduct in request body", suggestionData: suggestionData })


        if (Object.keys(req.body).length > 2) return res.status(400).send({ status: false, msg: "You can pass only two key in request body", suggestionData: suggestionData })


        const items = req.body
        const { productId, removeProduct } = items

        console.log(productId)
        if (!validator.isValid(productId)) return res.status(400).send({ status: false, message: ` Key Name : 'productId' You can pass only a valid ObjectId. Make sure you can not pass only key name or a blank key` })
        if (!validator.isObjectId(productId)) return res.status(400).send({ status: false, msg: "you can pass only object id in product id" })


        // if product delete means product out of stock



        // here two cases if customer want to maintain his cart means he want to remove out of stock product also than we not check isDeleted we only check product exist or not
        // const isProductExist = await productModel.findOne({ _id: productId})
        // if (!isProductExist) return res.status(404).send({ status: false, message: "Product Doesn't Exist" })
        // we cover this case in next API



        // if customer want to reduce our total price only than we have to check isDeleted with check product exist or not
          
        const isProductExist = await productModel.findOne({ _id: productId, isDeleted: false })
        if (!isProductExist) return res.status(404).send({ status: false, message: "Product Doesn't Exist" })


        if (!validator.isValid(removeProduct)) return res.status(400).send({ status: false, message: ` Key Name : 'removeProduct' You can pass only a valid key. Make sure you can not pass only key name or a blank key` })
        if (!validator.isValidInstallments(removeProduct)) return res.status(400).send({ status: false, message: 'removeProduct should be a numeric positive integer value and minimum 1' })
        if (removeProduct <= 0) return res.status(400).send({ status: false, message: 'removeProduct should be a numeric positive integer value and minimum 1' })



        // after all validation there is only two case or product found in cart or product not found in cart

        for (let i = 0; i < isCartExist.items.length; i++) {


            // if product found there is three case or removeProduct more than quantity or removeProduct less than quantity or removeProduct equal to quantity

            if (isCartExist.items[i].productId == productId) {


                // if removeProduct more than quantity

                if (isCartExist.items[i].quantity < removeProduct)
                    return res.status(400).send({ status: false, msg: `Only ${isCartExist.items[i].quantity} product is present in your cart. Your removeProduct is higher. Please select suitable` })



                // if removeProduct is equal to quantity than it must your items not be empty it contains at least one product

                if (isCartExist.items[i].quantity == removeProduct) {


                    delete isCartExist.items[i]
                    const temp = []
                    isCartExist.items.filter((ele) => ele != undefined ? temp.push(ele) : ele)


                    // your cart must contain atleast 1 product
                    if (temp.length == 0) return res.status(400).send({ status: false, msg: "your cart should contain atleast 1 product. After removing this your cart is empty. please reduce you removeProduct atleast 1" })


                    const saveCart = {}
                    if (!('$set' in saveCart)) saveCart["$set"] = {}
                    saveCart['$set']['items'] = temp


                    const newTotalPrice = isCartExist.totalPrice - removeProduct * isProductExist.price
                    saveCart['$set']['totalPrice'] = newTotalPrice
                    saveCart['$set']['totalItems'] = temp.length


                    const saveCartData = await cartModel.findOneAndUpdate({ userId: req.params.userId }, saveCart, { new: true })
                    console.log(saveCartData, "saveCartData")
                    return res.status(200).send({ status: true, message: "Cart is updated", data: saveCartData })


                }


                // if remove product less than quantity


                const saveCart = {}
                if (!('$set' in saveCart)) saveCart["$set"] = {}


                isCartExist.items[i].quantity = isCartExist.items[i].quantity - removeProduct
                saveCart['$set']['items'] = isCartExist.items


                const newTotalPrice = isCartExist.totalPrice - removeProduct * isProductExist.price
                saveCart['$set']['totalPrice'] = newTotalPrice
                saveCart['$set']['totalItems'] = isCartExist.items.length


                const saveCartData = await cartModel.findOneAndUpdate({ userId: req.params.userId }, saveCart, { new: true })
                console.log(saveCartData, "saveCartData")
                return res.status(200).send({ status: true, message: "Cart is updated", data: saveCartData })


            }

        }



        // if product not found in cart
        return res.status(404).send({ status: false, msg: "No product found in your cart" })


    }

    catch (err) {

        return res.status(500).send({ status: false, msg: err.message })

    }

}





//********************************************************* get user cart ********************************************************************//

const userCart = async function (req, res) {
    try {


        const isCartExist = await cartModel.findOne({ userId: req.params.userId })
        console.log(isCartExist)


        if (!isCartExist) return res.status(404).send({ status: false, msg: "No cart found" })


        return res.status(200).send({ status: true, msg: "cart found successfull", data: isCartExist })


    }

    catch (err) {

        return res.status(500).send({ status: false, msg: err.message })

    }

}





//********************************************************* delete user cart ********************************************************************//

const deleteUserCart = async function (req, res) {
    try {


        const isCartExist = await cartModel.findOne({ userId: req.params.userId })
        if (!isCartExist) return res.status(404).send({ status: false, msg: "No cart found" })


        const saveCart = {}
        if (!('$set' in saveCart)) saveCart["$set"] = {}

        
        saveCart['$set']['items'] = []
        saveCart['$set']['totalPrice'] = 0
        saveCart['$set']['totalItems'] = 0


        const saveCartData = await cartModel.findOneAndUpdate({ userId: req.params.userId }, saveCart, { new: true })
        //console.log(saveCartData, "saveCartData")
        return res.status(204).send({ status: true, message: "Cart is deleted", data: saveCartData })


    }
    catch (err) {

        return res.status(500).send({ status: false, msg: err.message })

    }

}





module.exports = {
    addToCart,
    removeProductFromCart,
    userCart,
    deleteUserCart
}