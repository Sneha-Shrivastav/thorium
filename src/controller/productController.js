const productModel = require("../models/productModel")
const aws= require("aws-sdk")
const currencySymbol = require("currency-symbol-map")
const validator = require("../validator/validator.js")
const awsConnection = require("../configs/awsConnection.js")
const bcrypt=require("bcrypt")
saltRounds=10;



const createProduct = async function (req, res) {
    try {
        const requestBody = req.body;

        if (!validator.isValidRequestBody(requestBody)) {
            return res.status(400).send({ status: false, message: 'please provide valid inputs in request body' })
        }

        let { title, description, price, currencyId, isFreeShipping, style, availableSizes, installments } = requestBody;

        if (!validator.isValid(title)) {
            return res.status(400).send({ status: false, message: 'Title is required' })
        }

        const duplicatetitle = await productModel.findOne({ title });

        if (duplicatetitle) {
            return res.status(400).send({ status: false, message: 'Title is already used.' })
        }

        if (!validator.isValid(description)) {
            return res.status(400).send({ status: false, message: 'Description is required' })
        }

        if (!validator.isValid(price)) {
            return res.status(400).send({ status: false, message: 'Price is required' })
        }
        if (isNaN(price)) {
            return res.status(400).send({ status: false, message: 'Price should be a numeric value' })
        }

        if (price <= 0) {
            return res.status(400).send({ status: false, message: `Price should be a valid number` })
        }

        if (!validator.isValid(currencyId)) {
            return res.status(400).send({ status: false, message: 'CurrencyId is required' })
        }

        if (!(currencyId == "INR")) {
            return res.status(400).send({ status: false, message: 'currencyId should be INR' })
        }

        if (validator.isValid(isFreeShipping)) {

            if (!((isFreeShipping === "true") || (isFreeShipping === "false"))) {
                return res.status(400).send({ status: false, message: 'isFreeShipping must be a boolean value' })
            }
        }
        if (installments) {
            if (!validator.isValid(installments)) {
                return res.status(400).send({ status: false, message: "please enter installments" })
            }
            if (isNaN(installments)) {
                return res.status(400).send({ status: false, message: 'Installment should be a numeric value' })
            }
        }
        //let productImage = req.files;
        const productImage = await awsConnection.uploadProfileImage(req.files)
        if (!productImage) return res.status(400).send({ status: false, message: "there is an error to upload profile image. for more details move on console" })
        const newProductData = {
            title,
            description,
            price,
            currencyId,
            currencyFormat: currencySymbol(currencyId),
            isFreeShipping,
            style,
            installments,
            productImage
        }

        if (!validator.isValid(availableSizes)) {
            return res.status(400).send({ status: false, message: 'available Sizes is required' })
        }
        availableSizes = availableSizes.toUpperCase()
        if (availableSizes) {
            let sizeArray = availableSizes.split(",").map(x => x.trim())

            for (let i = 0; i < sizeArray.length; i++) {
                if (!(["S", "XS", "M", "X", "L", "XXL", "XL"].includes(sizeArray[i]))) {
                    return res.status(400).send({ status: false, message: `Available Sizes must be among ${["S", "XS", "M", "X", "L", "XXL", "XL"]}` })
                }
            }

            if (Array.isArray(sizeArray)) {
                newProductData['availableSizes'] = sizeArray
            }
        }
        const saveProductDetails = await productModel.create(newProductData)
        res.status(201).send({ status: true, message: "Success", data: saveProductDetails })

    } catch (error) {
        console.log(error)
        res.status(500).send({ status: false, data: error });
    }
}



//********************************************************* Get Product By Filter ********************************************************************//


const getProductByFilter = async (req, res) => {
    try {


        if (validator.isValidRequestBody(req.body)) return res.status(400).send({ status: false, msg: "can not pass request body. body is blocked" })



        const filters = req.query
        const finalFilters = { isDeleted: false }



        if (!validator.isValidRequestBody(req.query)) {


            console.log("finalFilters", finalFilters)
            const allProducts = await productModel.find(finalFilters).select({
                title: 1, description: 1, price: 1, currencyFormat: 1, currencyId: 1, isFreeShipping: 1, productImage: 1, style: 1, availableSizes: 1, installments: 1, _id: 0
            })


            if (allProducts.length == 0) return res.status(404).send({ status: false, message: "Product not Found" })
            return res.status(200).send({ status: true, message: "Product List", TotalProduct: allProducts.length, TotalApplyFilter:0, data: allProducts })

        }




        const { name, size, priceGreaterThan, priceLessThan, priceSort, installments, currencyId, style, isFreeShipping } = filters


        const TotalApplyFilter = Object.keys(req.query).length


        if ('name' in req.query) {


            if (!validator.isValid(name)) return res.status(400).send({ status: false, message: ` Key Name : 'name' You can pass only a valid name. Make sure you can not pass only key name or a blank key` })
            if (!validator.isStrictString(name)) return res.status(400).send({ status: false, message: ` Key Name : 'name' You can pass only a to z OR A to Z. Make sure you can not pass only key name or a blank key` })


            finalFilters['title'] = { $regex: name }

        }




        if ('size' in req.query) {


            if (!validator.isValid(size)) return res.status(400).send({ status: false, message: ` Key Name : 'size' You can pass only a valid size. Make sure you can not pass only key name or a blank key` })
            const temp = "['S', 'XS', 'M', 'X', 'L', 'XXL', 'XL']"


            const flag = await validator.isValidAvailableSizes(size)
            if (!flag) return res.status(400).send({ status: false, message: `Sizes must be among ${temp}` })


            finalFilters['availableSizes'] = { $in: [...size]}

        }





        if (('priceGreaterThan' in req.query) || ('priceLessThan' in req.query) || ('priceGreaterThan' in req.query && 'priceLessThan' in req.query)) {



            if (('priceGreaterThan' in req.query) && ('priceLessThan' in req.query)) {


                if (!validator.isValid(priceGreaterThan)) return res.status(400).send({ status: false, message: ` Key Name : 'priceGreaterThan' You can pass only a valid price. Make sure you can not pass only key name or a blank key` })
                if (!validator.isValidPrice(priceGreaterThan)) return res.status(400).send({ status: false, message: ` Key Name : 'priceGreaterThan' You can pass only 0 to 9 digit or decimal number. Make sure you can not pass only key name or a blank key or 00` })


                if (!validator.isValid(priceLessThan)) return res.status(400).send({ status: false, message: ` Key Name : 'priceLessThan' You can pass only a valid price. Make sure you can not pass only key name or a blank key` })
                if (!validator.isValidPrice(priceLessThan)) return res.status(400).send({ status: false, message: ` Key Name : 'priceLessThan' You can pass only 0 to 9 digit or decimal number. Make sure you can not pass only key name or a blank key or 00` })


                let x = parseInt(priceGreaterThan)
                let y = parseInt(priceLessThan)
                finalFilters['price'] = { $gte: x, $lte: y }


            }
            else if ('priceGreaterThan' in req.query) {


                if (!validator.isValid(priceGreaterThan)) return res.status(400).send({ status: false, message: ` Key Name : 'priceGreaterThan' You can pass only a valid price. Make sure you can not pass only key name or a blank key` })
                if (!validator.isValidPrice(priceGreaterThan)) return res.status(400).send({ status: false, message: ` Key Name : 'priceGreaterThan' You can pass only 0 to 9 digit or decimal number. Make sure you can not pass only key name or a blank key or 00` })


                let x = parseInt(priceGreaterThan)
                finalFilters['price'] = { $gte: x }


            }
            else if ('priceLessThan' in req.query) {


                if (!validator.isValid(priceLessThan)) return res.status(400).send({ status: false, message: ` Key Name : 'priceLessThan' You can pass only a valid price. Make sure you can not pass only key name or a blank key` })
                if (!validator.isValidPrice(priceLessThan)) return res.status(400).send({ status: false, message: ` Key Name : 'priceLessThan' You can pass only 0 to 9 digit or decimal number. Make sure you can not pass only key name or a blank key or 00` })


                let x = parseInt(priceLessThan)
                finalFilters['price'] = { $lte: x }


            }


        }

        if ('priceSort' in req.query) {


            if (!validator.isValid(priceSort)) return res.status(400).send({ status: false, message: ` Key Name : 'priceShort' You can pass only a valid priceShort. Make sure you can not pass only key name or a blank key` })
            if (!validator.isValidPriceSort(priceSort)) return res.status(400).send({ status: false, msg: "Please enter valid input for sorting in price ....... 1 : for ascending order or -1 : for descending order " })



            if (priceSort == 1) {


                console.log("finalFilters with sort", finalFilters)
                const allProducts = await productModel.find(finalFilters).select({
                    title: 1, description: 1, price: 1, currencyFormat: 1, currencyId: 1, isFreeShipping: 1, productImage: 1, style: 1, availableSizes: 1, installments: 1, _id: 0
                }).sort({ price: 1 })


                if (allProducts.length == 0) return res.status(404).send({ status: false, message: "Product not Found" })
                return res.status(200).send({ status: true, message: "Product List", TotalProduct: allProducts.length, TotalApplyFilter:TotalApplyFilter , data: allProducts })


            }



            if (priceSort == -1) {


                console.log("finalFilters with sort", finalFilters)
                const allProducts = await productModel.find(finalFilters).select({
                    title: 1, description: 1, price: 1, currencyFormat: 1, currencyId: 1, isFreeShipping: 1, productImage: 1, style: 1, availableSizes: 1, installments: 1, _id: 0
                }).sort({ price: -1 })


                if (allProducts.length == 0) return res.status(404).send({ status: false, message: "Product not Found" })
                return res.status(200).send({ status: true, message: "Product List", TotalProduct: allProducts.length, TotalApplyFilter:TotalApplyFilter , data: allProducts })


            }

        }



        console.log("finalFilters witout sort", finalFilters)
        const allProducts = await productModel.find(finalFilters).select({
            title: 1, description: 1, price: 1, currencyFormat: 1, currencyId: 1, isFreeShipping: 1, productImage: 1, style: 1, availableSizes: 1, installments: 1, _id: 0
        })


        if (allProducts.length == 0) return res.status(404).send({ status: false, message: "Product not Found" })
        return res.status(200).send({ status: true, message: "Product List", TotalProduct: allProducts.length, TotalApplyFilter:TotalApplyFilter , data: allProducts })


    }
    catch (err) {

        res.status(500).send({ status: false, message: err.message })

    }

}


//********************************************************* Get Product BY Id ********************************************************************//


const getProductById = async function (req, res) {

    try {


        if (validator.isValidRequestBody(req.query)) return res.status(400).send({ status: false, msg: "can not pass request query. query is blocked" })
        if (validator.isValidRequestBody(req.body)) return res.status(400).send({ status: false, msg: "can not pass request body. body is blocked" })


        const productId = req.params.productId
        if (!validator.isObjectId(productId)) return res.status(400).send({ status: false, msg: "you can pass only object id in path params" })


        const isProductPresent = await productModel.findById(productId)
        if (!isProductPresent) return res.status(404).send({ status: false, msg: "product not found" })


        if (isProductPresent.isDeleted === true) return res.status(404).send({ status: false, msg: "product is deleted" })
        return res.status(200).send({ status: true, msg: "product found successfully", data: isProductPresent })


    }


    catch (err) {

        return res.status(500).send({ status: false, msg: err.message })

    }

}






//********************************************************* Update Product ********************************************************************//


const updateProduct = async function (req, res) {
    try {


        if (validator.isValidRequestBody(req.query)) return res.status(400).send({ status: false, msg: "can not pass request query. query is blocked" })
        const productId = req.params.productId
        if (!validator.isObjectId(productId)) return res.status(400).send({ status: false, msg: "you can pass only object id in path params" })


        const isProductPresent = await productModel.findById(productId)
        if (!isProductPresent) return res.status(404).send({ status: false, msg: "product not found" })
        if (isProductPresent.isDeleted === true) return res.status(404).send({ status: false, msg: "product is deleted" })



        const requestBody = req.body
       
        let { title, description, price, currencyId, isFreeShipping, productImage, style, availableSizes, installments, isDeleted } = requestBody
        const updateProductData = {}



        if ('title' in req.body) {


            if (!validator.isValid(title)) return res.status(400).send({ status: false, message: ` Key Name : 'title' You can pass only a valid title. Make sure you can not pass only key name or a blank key` })
            if (!validator.isStrictString(title)) return res.status(400).send({ status: false, message: ` Key Name : 'title' You can pass only a to z OR A to Z. Make sure you can not pass only key name or a blank key` })


            let duplicateTitle = await productModel.findOne({ title: title })
            if (duplicateTitle) return res.status(400).send({ status: false, message: `title Already Present. Take another title` });


            if (!('$set' in updateProductData)) updateProductData["$set"] = {};
            updateProductData['$set']['title'] = title

        }



        if ('description' in req.body) {


            if (!validator.isValid(description)) return res.status(400).send({ status: false, message: ` Key Name : 'description' You can pass only a valid description. Make sure you can not pass only key name or a blank key` })
            if (!validator.isNormalString(description)) return res.status(400).send({ status: false, message: ` Key Name : 'description' You can pass only a valid description in string form. Make sure you can not pass only key name or a blank key or only number`, suggestion: "sonu @ Verma 123" })


            if (!('$set' in updateProductData)) updateProductData["$set"] = {};
            updateProductData['$set']['description'] = description

        }



        if ('price' in req.body) {


            if (!validator.isValid(price)) return res.status(400).send({ status: false, message: ` Key Name : 'price' You can pass only a valid price. Make sure you can not pass only key name or a blank key` })
            if (!validator.isValidPrice(price)) return res.status(400).send({ status: false, message: ` Key Name : 'price' You can pass only 0 to 9 digit or decimal number. Make sure you can not pass only key name or a blank key or 00` })


            if (!('$set' in updateProductData)) updateProductData["$set"] = {};
            updateProductData['$set']['price'] = price

        }



        if ('currencyId' in req.body) {


            const suggestionCurrency = {
                usDollar: 'USD',
                Bitcoin: 'BTC',
                indianRupee: 'INR',
                Euro: 'EUR'
            }


            if (!validator.isValid(currencyId)) return res.status(400).send({ status: false, message: ` Key Name : 'currencyId' You can pass only a valid currency. Make sure you can not pass only key name or a blank key`, suggestionCurrency: suggestionCurrency })
            const result = await validator.isValidCurrency(currencyId)
            if (!result) return res.status(400).send({ status: false, message: ` Key Name : 'currencyId' You can pass only a valid currency. Make sure you can not pass only key name or a blank key`, suggestionCurrency: suggestionCurrency })


            if (!('$set' in updateProductData)) updateProductData["$set"] = {};
            updateProductData['$set']['currencyId'] = currencyId


            if (!('$set' in updateProductData)) updateProductData["$set"] = {};
            updateProductData['$set']['currencyFormat'] = currencySymbol(currencyId)

        }




        if ('isFreeShipping' in req.body) {


            if (!validator.isValid(isFreeShipping)) return res.status(400).send({ status: false, message: ` Key Name : 'isFreeShipping' You can pass only a valid isFreeShipping. Make sure you can not pass only key name or a blank key` })


            if (!((isFreeShipping === "true") || (isFreeShipping === "false")))
                return res.status(400).send({ status: false, message: 'isFreeShipping must be a boolean value' })


            if (!('$set' in updateProductData)) updateProductData["$set"] = {};
            updateProductData['$set']['isFreeShipping'] = isFreeShipping

        }




        if (req.files && req.files.length > 0) {


            const ProductImage = await awsConnection.uploadProfileImage(req.files)
            if (!ProductImage) return res.status(400).send({ status: false, message: ` Key Name : 'productImage' You can pass only files. Make sure you can not pass only key name or a blank key` })


            if (!('$set' in updateProductData)) updateProductData["$set"] = {};
            updateProductData['$set']['productImage'] = ProductImage

        }




        if ('style' in req.body) {


            if (!validator.isValid(style)) return res.status(400).send({ status: false, message: ` Key Name : 'style' You can pass only a valid style. Make sure you can not pass only key name or a blank key` })
            if (!validator.isNormalString(style)) return res.status(400).send({ status: false, message: ` Key Name : 'style' You can pass only a valid style in string form. Make sure you can not pass only key name or a blank key or only number`, suggestion: "sonu @ Verma 123" })


            if (!('$set' in updateProductData)) updateProductData["$set"] = {};
            updateProductData['$set']['style'] = style

        }




        if ('availableSizes' in req.body) {


            if (!validator.isValid(availableSizes)) return res.status(400).send({ status: false, message: ` Key Name : 'availableSizes' You can pass only a valid availableSizes. Make sure you can not pass only key name or a blank key` })
            const temp = "['S', 'XS', 'M', 'X', 'L', 'XXL', 'XL']"
            const flag = await validator.isValidAvailableSizesForUpdate(availableSizes, isProductPresent.availableSizes)
            if (!flag) return res.status(400).send({ status: false, message: `Available Sizes must be among ${temp}` })


            if (!('$set' in updateProductData)) updateProductData["$set"] = {};
            updateProductData['$set']['availableSizes'] = flag

        }




        if ('installments' in req.body) {


            if (!validator.isValid(installments)) return res.status(400).send({ status: false, message: ` Key Name : 'installments' You can pass only a valid installments. Make sure you can not pass only key name or a blank key` })
            if (!validator.isValidInstallments(installments)) return res.status(400).send({ status: false, message: 'Installment should be a numeric positive integer value or 0' })


            if (!('$set' in updateProductData)) updateProductData["$set"] = {};
            updateProductData['$set']['installments'] = installments

        }




        if ('isDeleted' in req.body) {


            if (!validator.isValid(isDeleted)) return res.status(400).send({ status: false, message: ` Key Name : 'isDeleted' You can pass only a valid isDeleted. Make sure you can not pass only key name or a blank key` })


            if (!((isDeleted === "true") || (isDeleted === "false")))
                return res.status(400).send({ status: false, message: 'isDeleted must be a boolean value' })


            if (isDeleted === "true")
                return res.status(400).send({ status: false, message: 'You can not Delete product in this API' })


            if (!('$set' in updateProductData)) updateProductData["$set"] = {};
            updateProductData['$set']['isDeleted'] = isDeleted

        }


        console.log("updateProductData", updateProductData)


        const updatedData = await productModel.findOneAndUpdate({ _id: productId }, updateProductData, { new: true })
        return res.status(200).send({ status: true, message: "product updated successfully", data: updatedData })


    } catch (error) {

        return res.status(500).send({ status: false, message: error.message });

    }

}






//********************************************************* Delete Product ********************************************************************//


const deleteProduct = async function (req, res) {

    try {


        if (validator.isValidRequestBody(req.query)) return res.status(400).send({ status: false, msg: "can not pass request query. query is blocked" })
        if (validator.isValidRequestBody(req.body)) return res.status(400).send({ status: false, msg: "can not pass request body. body is blocked" })


        const productId = req.params.productId
        if (!validator.isObjectId(productId)) return res.status(400).send({ status: false, msg: "you can pass only object id in path params" })


        const isProductPresent = await productModel.findById(productId)
        if (!isProductPresent) return res.status(404).send({ status: false, msg: "product not found" })


        if (isProductPresent.isDeleted === true) return res.status(404).send({ status: false, msg: "product is already deleted" })
        const productDelete = await productModel.findByIdAndUpdate(productId,
            {
                $set: {
                    isDeleted: true,
                    deletedAt: Date.now()
                }
            }, { new: true })


        return res.status(200).send({ status: true, msg: "product deleted successfully", data: productDelete })


    }

    catch (err) {

        return res.status(500).send({ status: false, msg: err.message })

    }

}



module.exports={createProduct,getProductByFilter,getProductById,deleteProduct,updateProduct}