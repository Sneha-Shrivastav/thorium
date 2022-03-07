const mid = function (req, res, next){
    let data = req.headers
  
   if(data.hasOwnProperty("isfreeappuser") === false){
       res.send( "the request is missing a mandatory header" )
   }else {
       next()
   }

}
module.exports.mid= mid