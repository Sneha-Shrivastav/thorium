const jwt = require('jsonwebtoken')




const authentication = async function (req, res, next) {
    try {
     
           
        let token = req.headers["authorization"]

        if (!token) return res.status(400).send({ status: false, msg: "please provide token in request hadder in form of Bearear token " })
        if (!token.startsWith("Bearer")) return res.status(400).send({ status: false, msg: "please provide token in request hadder in form of Bearear token " })


        token = token.split("Bearer")
        token = token[1].trim()


        let validateToken = jwt.verify(token, "Chandan Gupta")
        


        req.decodedToken = validateToken


        next()

    } catch (err) {


      


        
        return res.status(500).send({ status: false, msg:err.message })
    


    }

}

















module.exports.authentication = authentication



