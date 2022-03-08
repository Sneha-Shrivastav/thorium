const express = require('express');
const router = express.Router();
const userController= require("../controllers/userController")
const Middleware = require("../middleware/auth");

router.get("/test-me", function (req, res) {
    res.send("My first ever api!")
})

router.post("/users", userController.createUser  )

router.post("/login", userController.loginUser)

router.get("/users/:userId",Middleware.middle, userController.getUserData)

router.put("/users/:userId",Middleware.middle, userController.updateUser)


router.delete("/users/:userId",Middleware.middle, userController.deleteUser)

module.exports = router;