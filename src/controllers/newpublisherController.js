const newpublisherModel= require("../models/newpublisherModel")

const creatPublisher = async function(req,res){
    let data = req.body
    let savedData = await newpublisherModel.create(data)
    res.send({msg: savedData})
}

module.exports.creatPublisher= creatPublisher