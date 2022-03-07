const express = require('express');
const router = express.Router();
const UserController= require("../controllers/userController")
const ProductController= require("../controllers/productController")
const Middleware= require("../middlewares/middleware")



router.post("/createProduct", ProductController.createProduct)



router.post("/createUser", Middleware.mid, UserController.createUser )





module.exports = router;