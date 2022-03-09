const express = require('express');
const router = express.Router();
const userController= require("../controllers/userController")
const Middleware = require("../middleware/auth")

router.get("/test-me", function (req, res) {
    res.send("My first ever api!")
})

router.post("/users", userController.createUser)

router.post("/login", userController.loginUser)

//The userId is sent by front end
router.get("/users/:userId",Middleware.middle, userController.getUserData)

router.put("/users/:userId",Middleware.middle,Middleware.authorise, userController.updateUser)

router.delete('/users/:userId',Middleware.middle,Middleware.authorise, userController.deleteUser)

router.post("/users/:userId/posts",Middleware.middle,Middleware.authorise, userController.postMessage)

module.exports = router;