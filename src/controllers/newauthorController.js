const newauthorModel= require("../models/newauthorModel")

const createAuthor = async function(req,res){
    let data = req.body
    let savedData = await newauthorModel.create(data)
    res.send({msg: savedData})
}

module.exports.createAuthor= createAuthor