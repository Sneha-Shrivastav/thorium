const jwt = require("jsonwebtoken");

let authentication = function (req, res, next) {
  try {
    let token = req.headers["x-api-key"];

    if (!token) return res.send({ status: false, msg: "token must be present" });

    let decodedToken = jwt.verify(token, "Project-1");

    if (!decodedToken)
      return res.send({ status: false, msg: "token is invalid" });
  }
  catch (err) {
    console.log(err)
    res.status(500).send({ msg: err.message })
  }
  next()
}

const authorise = function (req, res, next) {
  try {
    let token = req.headers["x-api-key"];
    let decodedToken = jwt.verify(token, "Project-1");
    let userLoggingIn = req.query.authorId
    let userLoggedIn = decodedToken.authorId

    if (userLoggedIn != userLoggingIn) return res.send({ status: false, msg: "You are not allowed to modify requested user's data" })
  }
  catch (err) {
    console.log(err)
    res.status(500).send({ msg: err.message })
  }
  next()

}

module.exports.authentication = authentication
module.exports.authorise = authorise