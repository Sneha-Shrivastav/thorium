const jwt = require("jsonwebtoken")



const generateToken = async function (user) {
    try {

        let role = user.role
        // in authorization we will check  token user Id with param user id 
        var token = await jwt.sign({ userId: user._id ,role:role}, "Chandan Gupta", {
            
            expiresIn: "20d"
           
        });

        token={
            userId:user._id, 

            token:token,
            // authorization for diff roles 
            role: user.role
        }
        return token

    }
    catch (err) {
        console.log(err)
    }
}




module.exports.generateToken=generateToken