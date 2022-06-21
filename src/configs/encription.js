const bcrypt = require("bcrypt")



const setEncription = async function (password) {
    try {

        password = password.trim()
        const saltRounds = 10

        const passwordHash = await bcrypt.hash(password, saltRounds)
        console.log("encriptedPassword : ", passwordHash)
        return passwordHash

    }
    catch (err) {
        console.log(err)
    }
}






const matchEncription = async function (password , passwordHash) {
    try {

        password = password.trim()
        

        const matchPassword = await bcrypt.compare(password, passwordHash)
        return matchPassword
        

    }
    catch (err) {
        console.log(err)
    }
}







module.exports.setEncription = setEncription
module.exports.matchEncription=matchEncription