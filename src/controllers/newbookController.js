const newbookModel= require("../models/newbookModel")
const newauthorModel= require("../models/newauthorModel")
const newpublisherModel= require("../models/newpublisherModel")

const createBook = async function(req,res){
   let data = req.body
   let authorId = data.author
   let publisherId = data.publisher

   if(!authorId){
       res.send("author is required")
   }
   let author = await newauthorModel.findById(authorId)
   if(!author){
       res.send("author is not present")
   }
   if(!publisherId){
       res.send("publisher is required")
   }

   let publisher = await newpublisherModel.findById(publisherId)
   if(!publisher){
       res.send("publisher is not present")
   }

   let savedData = await newbookModel.create(data)
   res.send({msg: savedData})
}

const getBooks = async function(req,res){
    let data = await newbookModel.find().populate('author')
    res.send({msg: data})
}

module.exports.createBook = createBook
module.exports.getBooks = getBooks