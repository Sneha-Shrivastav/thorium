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

        // sending token in authorization 
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


module.exports={registerUser,loginUser,getUser}