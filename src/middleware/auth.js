const jwt = require("jsonwebtoken");

let middle = function (req, res, next) {
  let token = req.headers["auth-token"];
  // if (!token) token = req.headers["auth-token"];
  if (!token) return res.send({ status: false, msg: "token must be present" });

  let decodedToken = jwt.verify(token, "functionup-thorium");

  if (!decodedToken)
    return res.send({ status: false, msg: "token is invalid" });

  next()
}

const authorise = function (req, res, next) {
  // comapre the logged in user's id and the id in request
  let token = req.headers["auth-token"];
  let decodedToken = jwt.verify(token, "functionup-thorium");
  let userLoggingIn = req.params.userId
  let userLoggedIn = decodedToken.userId

  if(userLoggedIn != userLoggingIn) return res.send({status:false, msg: "You are not allowed to modify requested user's data"})
  next()
}

module.exports.middle = middle
module.exports.authorise = authorise