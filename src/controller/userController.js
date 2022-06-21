const userModel = require("../models/userModel")
const aws= require("aws-sdk")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
const validator = require("../validator/validator")
const awsConnection = require("../configs/awsConnection.js")
const setEncription = require("../configs/encription.js")
const generateToken=require("../middleware/genrateToken")
saltRounds=10;

// register user


const registerUser = async function (req, res) {
    try {
        const userData = req.body


        //const files = req.files (if we are going to use multer)
        if (Object.keys(userData).length = 0) { return res.status(400).send({ status: "false", message: "Please ptovide required input fields" }) }
        let { fname, lname, email, phone, password, role } = userData
        if (!validator.isValid(fname)) { return res.status(400).send({ status: "false", message: "Please enter first name" }) }
        if (!validator.isValid(lname)) { return res.status(400).send({ status: "false", message: "Please enter last name" }) }
        if (!validator.isValid(email)) { return res.status(400).send({ status: "false", message: "Please enter email" }) }

        if (!validator.isValidEmail(email)) return res.status(400).send({ status: false, message: ` Email should be valid email` })
        let duplicateEmail = await userModel.findOne({ email: email })
        if (duplicateEmail) {
            return res.status(400).send({ status: false, message: `Email Already Present` });
        }

        if (!validator.isValidPhone(phone)) {
            return res.status(400).send({ status: false, message: "please provide a valid phone number" });
        }
    
        let duplicatePhone = await userModel.findOne({ phone: phone })
        if (duplicatePhone) {
            return res.status(400).send({ status: false, message: `Phone Number Already Present` });
        }
        if (!validator.isValid(password.trim())) { return res.status(400).send({ status: "false", message: "Please enter a  password" }) }
        if (!(password.length >= 8 && password.length <= 15)) {
            return res.status(400).send({ status: false, message: "Password should be Valid min 8 and max 15 " });
        }

        // role validation 
        // agr ye tino nhi hai to return 
        if(['taxPayer','taxAccountant','admin'].indexOf(role) ==-1){
            return res.status(400).send({status:false,msg:"please select in bw ['taxPayer','taxAccountant','admin']"})
        }
        // we can also add validation for admin and tax accountant
        // criteria 
          

        
        
        const hash = await bcrypt.hash(password, saltRounds)
        const updatedData = {
            "fname": fname,
            "lname": lname,
            "email": email,
            "phone": phone,
            "password": hash,
            "role":role,
            
        }
        let user = await userModel.create(updatedData)
        return res.status(201).send({ status: true, message: "user registered succesfully", data: user })
    }
    catch (err) {
        return res.status(500).send({ status: "false", message: err.message })
    }
}

// login user

const loginUser = async function (req, res) {
    try {


        const requestBody = req.body
       // if (validator.isValidRequestBody(req.query)) return res.status(400).send({ status: false, msg: "can not pass request query. query is blocked" })
       // if (!validator.isValidRequestBody(requestBody)) return res.status(400).send({ status: false, msg: "please provide login user details in request body" })


        if (Object.keys(requestBody).length > 2) return res.status(400).send({ status: false, msg: "you can pass only two keys in request body" })
        const { email, password } = requestBody


        if (!validator.isValid(email)) return res.status(400).send({ status: false, message: ` Key Name : 'email' You can pass only a valid email. Make sure you can not pass only key name or a blank key` })
        if (!validator.isValidEmail(email)) return res.status(400).send({ status: false, message: ` Key Name : 'email' You can pass only a valid email. Make sure you can not pass only key name or a blank key` })
        const user = await userModel.findOne({ email })
        if (!user) return res.status(404).send({ status: false, message: ` Key Name : 'email' Your email is not found ` })
        //console.log("user" , user)


        if (!validator.isValid(password)) return res.status(400).send({ status: false, message: ` Key Name : 'password' You can pass only a valid password more than 8 character and less than 15 character. Make sure you can not pass only key name or a blank key` })
        if (!validator.isValidPassword(password)) return res.status(400).send({ status: false, message: ` Key Name : 'password' You can pass only a valid password more than 8 character and less than 15 character. Make sure you can not pass only key name or a blank key` })


        const matchPassword = await setEncription.matchEncription(password, user.password)
        if (!matchPassword) return res.status(404).send({ status: false, message: ` Key Name : 'password' Your password not match try again` })


        const tokenSet = await generateToken.generateToken(user)
        if (!tokenSet) return res.status(404).send({ status: false, message: "There is an error occure to generate token. more details move on console" })

        // in this area we can send token with different roles 
        res.setHeader('authorization', tokenSet.token)
        //console.log("Security details", tokenWithId)


        return res.status(200).send({ status: true, msg: `User login successfully`, data: tokenSet })


    }
    catch (err) {
        console.log(err)
        return res.status(500).send({ status: false, error: err.message, msg: "more details move on console", })
    }

}




// get user

const getUser = async function (req, res) {
    try {


        if (validator.isValidRequestBody(req.query)) return res.status(400).send({ status: false, msg: "can not pass request query. query is blocked" })
        if (validator.isValidRequestBody(req.body)) return res.status(400).send({ status: false, msg: "can not pass request body. body is blocked" })
        const userId = req.params.userId


        if (!validator.isObjectId(userId)) return res.status(400).send({ status: false, msg: "you can pass only object id in path params" })


        const userData = await userModel.findById(userId)
        if (!userData) return res.status(404).send({ status: false, msg: "no data found" })


        return res.status(200).send({ status: true, msg: "data found successfully", data: userData })


    }
    catch (err) {
        console.log(err)
        return res.status(500).send({ status: false, error: err.message, msg: "more details move on console", })
    }

}


//update user

const updateProfile = async function (req, res) {
    try {


        if (validator.isValidRequestBody(req.query)) return res.status(400).send({ status: false, msg: "can not pass request query. query is blocked" })


        const requestBody = req.body
        if (!validator.isValid(requestBody)) return res.status(400).send({ status: false, msg: "please provide user updation details in form data of request body" })
        let { fname, lname, email, phone, password, address } = requestBody


        const user = await userModel.findById(req.params.userId)
        let updateUserData = {}


        if ('fname' in req.body) {

            if (!validator.isValid(fname)) return res.status(400).send({ status: false, message: ` Key Name : 'fname' You can pass only a to z OR A to Z. Make sure you can not pass only key name or a blank key` })
            if (!validator.isStrictString(fname)) return res.status(400).send({ status: false, message: ` Key Name : 'fname' You can pass only a to z OR A to Z. Make sure you can not pass only key name or a blank key` })


            if (!('$set' in updateUserData)) updateUserData["$set"] = {};
            updateUserData['$set']['fname'] = fname

        }


        if ('lname' in req.body) {


            if (!validator.isValid(lname)) return res.status(400).send({ status: false, message: ` Key Name : 'lname' You can pass only a to z OR A to Z. Make sure you can not pass only key name or a blank key` })
            if (!validator.isStrictString(lname)) return res.status(400).send({ status: false, message: ` Key Name : 'lname' You can pass only a to z OR A to Z. Make sure you can not pass only key name or a blank key` })


            if (!('$set' in updateUserData)) updateUserData["$set"] = {};
            updateUserData['$set']['lname'] = lname

        }


        if ('email' in req.body) {


            if (!validator.isValid(email)) return res.status(400).send({ status: false, message: ` Key Name : 'email' You can pass only a valid email. Make sure you can not pass only key name or a blank key` })
            if (!validator.isValidEmail(email)) return res.status(400).send({ status: false, message: ` Key Name : 'email' You can pass only a valid email. Make sure you can not pass only key name or a blank key` })


            let duplicateEmail = await userModel.findOne({ email: email })
            if (duplicateEmail) return res.status(400).send({ status: false, message: `Email Already Present. Take another email` });


            if (!('$set' in updateUserData)) updateUserData["$set"] = {};
            updateUserData['$set']['email'] = email

        }


        if (req.files && req.files.length > 0) {


            const profileImage = await awsConnection.uploadProfileImage(req.files)
            if (!profileImage) return res.status(400).send({ status: false, message: "there is an error to upload profile image. for more details move on console" })


            if (!('$set' in updateUserData)) updateUserData["$set"] = {};
            updateUserData['$set']['profileImage'] = profileImage

        }


        if ('phone' in req.body) {


            if (!validator.isValid(phone)) return res.status(400).send({ status: false, message: ` Key Name : 'phone' You can pass only a valid Indian Mobile No. Make sure you can not pass only key name or a blank key` })
            if (!validator.isValidPhone(phone)) return res.status(400).send({ status: false, message: ` Key Name : 'phone' You can pass only a valid Indian Mobile No. Make sure you can not pass only key name or a blank key` })


            let duplicatePhone = await userModel.findOne({ phone: phone })
            if (duplicatePhone) return res.status(400).send({ status: false, message: `Phone Already Present. Take another Phone Number` });


            if (!('$set' in updateUserData)) updateUserData["$set"] = {};
            updateUserData['$set']['phone'] = phone

        }


        if ('password' in req.body) {


            if (!validator.isValid(password)) return res.status(400).send({ status: false, message: ` Key Name : 'password' You can pass only a valid password more than 8 character and less than 15 character. Make sure you can not pass only key name or a blank key` })
            if (!validator.isValidPassword(password)) return res.status(400).send({ status: false, message: ` Key Name : 'password' You can pass only a valid password more than 8 character and less than 15 character. Make sure you can not pass only key name or a blank key` })
            const encryptedPassword = await setEncription.setEncription(password)


            if (!('$set' in updateUserData)) updateUserData["$set"] = {};
            updateUserData['$set']['password'] = encryptedPassword

        }



        if ('address' in req.body) {


            const addressSuggestData = { "shipping": { "street": "abc road", "city": "indb", "pincode": 777777 }, "billing": { "street": "def road", "city": "indb", "pincode": 999979 } }


            const addressData = await validator.isValidAddress(address)
            if (!addressData) return res.status(400).send({ status: false, msg: "please provide address in object form. Make sure you can not pass only key name or a blank key", addressSuggestData: addressSuggestData })


            address = JSON.stringify(user.address)
            const schemaAddress = await validator.isValidAddress(address)


            if (!('$set' in updateUserData)) updateUserData["$set"] = {};
            updateUserData['address'] = schemaAddress


            const { shipping, billing } = addressData;


            if ('shipping' in addressData) {


                const { street, city, pincode } = shipping


                if ('street' in shipping) {
                    if (!validator.isValid(street)) return res.status(400).send({ status: false, msg: "please provide 'street' key in billing address. Make sure you can not pass only key name or a blank key" })


                    if (!('$set' in updateUserData)) updateUserData["$set"] = {};
                    updateUserData['address']['shipping']['street'] = street

                }

                
                if ('city' in shipping) {


                    if (!validator.isValid(city)) return res.status(400).send({ status: false, msg: "please provide 'city' key in shipping address. Make sure you can not pass only key name or a blank key" })
                    if (!validator.isStrictString(city)) return res.status(400).send({ status: false, message: ` Key Name : 'city' You can pass only a to z OR A to Z. Make sure you can not pass only key name or a blank key` })


                        if (!('$set' in updateUserData)) updateUserData["$set"] = {};
                    updateUserData['address']['shipping']['city'] = city
                    
                }



                if ('pincode' in shipping) {
                     if (!validator.isValid(pincode)) return res.status(400).send({ status: false, message: ` Key Name : 'pincode' You can pass only 0 to 9 digit. Make sure you can not pass only key name or a blank key or starting from 0` })
                     if (!validator.isValidPincode(pincode)) return res.status(400).send({ status: false, message: ` Key Name : 'pincode' You can pass only 0 to 9 digit. Make sure you can not pass only key name or a blank key or starting from 0` })


                    if (!('$set' in updateUserData)) updateUserData["$set"] = {};
                    updateUserData['address']['shipping']['pincode'] = pincode

                }

            }



            if ('billing' in addressData) {


                const { street, city, pincode } = billing


                if ('street' in shipping) {


                    if (!validator.isValid(street)) return res.status(400).send({ status: false, msg: "please provide 'street' key in billing address. Make sure you can not pass only key name or a blank key" })


                    if (!('$set' in updateUserData)) updateUserData["$set"] = {};
                    updateUserData['address']['billing']['street'] = street

                }



                if ('city' in shipping) {


                    if (!validator.isValid(city)) return res.status(400).send({ status: false, msg: "please provide 'city' key in billing address. Make sure you can not pass only key name or a blank key" })
                    if (!validator.isStrictString(city)) return res.status(400).send({ status: false, message: ` Key Name : 'city' You can pass only a to z OR A to Z. Make sure you can not pass only key name or a blank key` })

                    if (!('$set' in updateUserData)) updateUserData["$set"] = {};
                    updateUserData['address']['billing']['city'] = city

                }



                if ('pincode' in shipping) {


                     if (!validator.isValid(pincode)) return res.status(400).send({ status: false, message: ` Key Name : 'pincode' You can pass only 0 to 9 digit. Make sure you can not pass only key name or a blank key or starting from 0` })
                    if (!validator.isValidPincode(pincode)) return res.status(400).send({ status: false, message: ` Key Name : 'pincode' You can pass only 0 to 9 digit. Make sure you can not pass only key name or a blank key or starting from 0` })


                    if (!('$set' in updateUserData)) updateUserData["$set"] = {};
                    updateUserData['address']['billing']['pincode'] = pincode

                }

            }

        }


        console.log("updateUserData" , updateUserData)


        const updatedData = await userModel.findOneAndUpdate({ _id: req.params.userId }, updateUserData, { new: true })
        return res.status(200).send({ status: true, message: "User profile updated", data: updatedData })


    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }

}

module.exports={registerUser,loginUser,getUser,updateProfile}