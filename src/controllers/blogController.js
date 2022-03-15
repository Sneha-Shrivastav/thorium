const blogModel = require("../models/blogModel")
const authorModel = require("../models/authorModel")
const moment = require("moment")
const { months } = require("moment")

const create = async function (req, res) {
    try {
        const input = req.body

        const id = req.body.authorId

        if (!Object.keys(input).length > 0) return res.send("Please enter blogData")

        const findAuthor = await authorModel.find({ _id: id })

        if (!findAuthor.length > 0) return res.status(400).send("authorId is not present")

        const createdBlog = await blogModel.create(input)

        res.status(201).send({ createdBlog })
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ msg: err.message })
    }
}


const getBlogs = async function (req, res) {
    try {
        const data = req.query
        if (!data) return res.status(400).send({ error: "Enter some for the filter data" })

        const blogs = await blogModel.find(data, { isDeleted: false }, { isPublished: true }).populate("authorId")

        if (!blogs) return res.status(404).send({ error: "No such data found" })

        res.status(200).send({ data: blogs })
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ msg: err.message })
    }
}


const updateBlog = async function (req, res) {
    try {
        let data = req.body
        const id = req.params.blogId

        if (!id) {
            res.status(400).send(" Please enter id ")
            return
        }


        if (!data) {
            res.status(400).send("Enter data to update")
        }

        const time = moment()

        const a = { ...data, isPublished: true, publishedAt: time }



        const update = await blogModel.findOneAndUpdate({ _id: id }, { $set: a }, { new: true })

        if (!update) return res.status(404).send({ error: "No such data found " })
        res.status(200).send({ msg: update })
    }
    catch (error) {
        res.status(500).send(error.message)
    }
}



const deleteBlog = async function (req, res) {
    try {
        let Id = req.params.blogId;

        if (!Id) return res.status(400).send({ error: "blogId should be present in params" });

        const data = await blogModel.find({ _id: Id })


        if (!data) return res.status(400).send({ error: "Invalid blogId" })


        const timeDate = moment()

        const dataforUpdation = { ...data, isDeleted: true, deletedAt: timeDate }

        let deletedBlog = await blogModel.findByIdAndUpdate({ _id: Id }, dataforUpdation, { new: true });
        res.send({ status: "Deleted", data: deletedBlog });

    }
    catch (err) {
        console.log(err)
        res.status(500).send({ msg: err.message })
    }
}



const deleteByQuery = async function (req, res) {
    try {
        const data = req.query
        console.log(data)

        if (!data) return res.status(400).send({ error: "Please enter some data to campare" })

        const timeDate = moment()

        const dataforUpdation = { ...data, isDeleted: true, deletedAt: timeDate }

        const result = await blogModel.updateMany(data, dataforUpdation, { new: true })

        if (!result) res.status(404).send({ error: " No data found" })

        res.status(200).send({ data: result })
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ msg: err.message })
    }
}

module.exports.create = create
module.exports.deleteByQuery = deleteByQuery
module.exports.deleteBlog = deleteBlog
module.exports.updateBlog = updateBlog
module.exports.getBlogs = getBlogs