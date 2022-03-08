let middle = function(req,res,next){
let token = req.headers["Auth-token"];
  if (!token) token = req.headers["auth-token"];
  if (!token) return res.send({ status: false, msg: "token must be present" });

  console.log(token);
  next()
}
module.exports.middle = middle