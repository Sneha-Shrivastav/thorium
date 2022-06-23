const validator = require("../validator/Validator")
const userModel = require("../models/userModel")


 // most of the authorization we will be doing in controllers 

const authorization = async function (req, res, next) {

    try {

        // we need to put something here to allow access to taxAccountant and admin 


        
        const decodedToken = req.decodedToken;
        let userId = req.params.userId


        if (!validator.isObjectId(userId)) return res.status(400).send({ status: false, msg: "you can pass only object id in path params" })
        let isPresentUser = await userModel.findById(userId)


        if (!isPresentUser) return res.status(404).send({ status: false, msg: "User not found" })
        

        // here if the user  role is taxAcc and admin he can bypass the authorization in most of cases 
        if(isPresentUser.role == 'taxAccountant'|| isPresentUser.role == ' admin'){
            next()
        }
        else{
            if (userId != decodedToken.userId) return res.status(401).send({ status: false, msg: "unauthorize access " })
        // otherWise user can access only its details 
   
        }
        
        
       


        next()

    } catch (err) {
        console.log(err)
        return res.status(500).send({ status: false, msg: "error occure for more information move on console", error: err.message })
    }
}


// we can create taxDue creation here and give it path to route file 



module.exports.authorization = authorization