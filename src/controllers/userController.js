const UserModel= require("../models/userModel")

// const createUser= async function (req, res) {
//     let data= req.body
//     let savedData= await UserModel.create(data)
//     res.send({msg: savedData})
// }

// const getUsersData= async function (req, res) {
//     let allUsers= await UserModel.find()
//     res.send({msg: allUsers})
// }

// module.exports.createUser= createUser
// module.exports.getUsersData= getUsersData

const createBook = async function(req,res){
    let data =req.body
    let savedData = await UserModel.create(data)
    res.send({book: savedData})
}

const bookList = async function(req,res){
    let list = await UserModel.find()
    res.send({list: list})
}
module.exports.createBook = createBook
module.exports.bookList = bookList