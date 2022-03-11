const jwt = require("jsonwebtoken");

let middle = function (req, res, next) {
  try {
  let token = req.headers["auth-token"];
  if (!token) return res.status(401).send({ status: false, msg: "token must be present" });

  let decodedToken = jwt.verify(token, "functionup-thorium");

  if (!decodedToken)
    return res.status(403).send({ status: false, msg: "token is invalid" })
  }
  catch(error){
    res.status(500).send({ msg: "Error", error: error.message })
  }

  next()
}

const authorise = function (req, res, next) {
  try {
  let token = req.headers["auth-token"];
  let decodedToken = jwt.verify(token, "functionup-thorium");
  let userLoggingIn = req.params.userId
  let userLoggedIn = decodedToken.userId

  if(userLoggedIn != userLoggingIn) return res.status(403).send({status:false, msg: "You are not allowed to modify requested user's data"})
  }
  catch(error){
    res.status(500).send({ msg: "Error", error: error.message })
  }
  next()
}

module.exports.middle = middle
module.exports.authorise = authorise