const { count } = require("console")
const BookModel= require("../models/bookModel")
const AuthorModel= require("../models/authorModel")
const authorModel = require("../models/authorModel")
const bookModel = require("../models/bookModel")

// const createBook= async function (req, res) {
//     let data= req.body

//     let savedData= await BookModel.create(data)
//     res.send({msg: savedData})
// }

// const getBooksData= async function (req, res) {
//     let allBooks= await BookModel.find( {authorName : "HO" } )
//     console.log(allBooks)
//     if (allBooks.length > 0 )  res.send({msg: allBooks, condition: true})
//     else res.send({msg: "No books found" , condition: false})
// }


// const updateBooks= async function (req, res) {
//     let data = req.body // {sales: "1200"}
//     // let allBooks= await BookModel.updateMany( 
//     //     { author: "SK"} , //condition
//     //     { $set: data } //update in data
//     //  )
//     let allBooks= await BookModel.findOneAndUpdate( 
//         { authorName: "ABC"} , //condition
//         { $set: data }, //update in data
//         { new: true , upsert: true} ,// new: true - will give you back the updated document // Upsert: it finds and updates the document but if the doc is not found(i.e it does not exist) then it creates a new document i.e UPdate Or inSERT  
//      )
     
//      res.send( { msg: allBooks})
// }

// const deleteBooks= async function (req, res) {
//     // let data = req.body 
//     let allBooks= await BookModel.updateMany( 
//         { authorName: "FI"} , //condition
//         { $set: {isDeleted: true} }, //update in data
//         { new: true } ,
//      )
     
//      res.send( { msg: allBooks})
// }




// // CRUD OPERATIONS:
// // CREATE
// READ
// UPDATE
// DELETE

const createBook = async function(req,res){
    let data = req.body
    let savedData = await BookModel.create(data)
    res.send({ msg: savedData})
}

const createAuthor = async function(req,res){
    let data = req.body
    let savedData = await AuthorModel.create(data)
    res.send({ msg: savedData})
}

const bookList = async function(req,res){
    let books = await authorModel.find({authorName:"Chetan Bhagat"})
    let id = books[0].authorId
    let display = await bookModel.find({authorId:id}).select()
    res.send({msg:display})
}

const changePrice = async function(req,res){
    let book = await bookModel.find({name: "Two states"})
    let id = book[0].authorId
    let author = await authorModel.find({authorId:id}) .select({authorName:1})

    let bookN = book[0].name
    let updatedPrice = await bookModel.findOneAndUpdate({name:bookN},{price:100},{new:true})
    res.send({msg:updatedPrice})
}

const authorNames = async function(req,res){
    let books = await bookModel.find({price:{$gte:50, $lte:100}}).select({authorId:1})
    let id = books.map(ele => ele.authorId)

    let arr =[]
    for(i=0; i<id.length; i++){
        let x = id[i]
        let authorN = await authorModel.find({authorId:x}).select({authorName:1})
        arr.push(authorN)
    }

    res.send({msg: arr})
}

module.exports.createBook= createBook
module.exports.createAuthor= createAuthor
module.exports.bookList= bookList
module.exports.changePrice= changePrice
module.exports.authorNames= authorNames


// module.exports.createBook= createBook
// module.exports.getBooksData= getBooksData
// module.exports.updateBooks= updateBooks
// module.exports.deleteBooks= deleteBooks
