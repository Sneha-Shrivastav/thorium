const jwt = require("jsonwebtoken");
const authorModel = require("../models/authorModel")


const createAuthor = async function (req, res) {
    try {
        const data = req.body

        if (!Object.keys(data).length > 0) return res.status(400).send({ error: "Please enter data" })
        const createdauthor = await authorModel.create(data)
        res.status(201).send({ data: createdauthor })
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ msg: err.message })
    }
}

const authorLogin = async function (req, res) {
    try {
    let emailId = req.body.email;
    let password = req.body.password;

    let author = await authorModel.findOne({ email: emailId, password: password });
    if (!author)
        return res.status(400).send({
            status: false,
            msg: "authorname or the password is not corerct",
        })

    let token = jwt.sign(
        {
            authorId: author._id
        },
        "Project-1"
    );
    res.status(200).send({ data: token })
}
catch (err) {
    console.log(err)
    res.status(500).send({ msg: err.message })
}
}


module.exports.createAuthor = createAuthor
module.exports.authorLogin = authorLogin