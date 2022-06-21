const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const productController = require('../controller/productController');
const cartController = require('../controller/cartController');
const orderController = require('../controller/orderController');
const authenticate = require('../middleware/authentication');
const authorize = require('../middleware/authorization');

const taxController = require('../controller/taxController')


// User Api
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/user/:userId/profile',authenticate.authentication ,userController.getUser);
router.put('/user/:userId/profile',authenticate.authentication,authorize.authorization , userController.updateProfile);
// product api
router.post('/products', productController.createProduct);
router.get('/products', productController.getProductByFilter);
router.get('/products/:productId', productController.getProductById);
router.put('/products/:productId', productController.updateProduct);
router.delete('/products/:productId', productController.deleteProduct);
// cart api
router.post('/users/:userId/cart',authenticate.authentication,authorize.authorization, cartController.addToCart);
router.put('/users/:userId/cart',authenticate.authentication,authorize.authorization ,cartController.removeProductFromCart);
router.get('/users/:userId/cart',authenticate.authentication,authorize.authorization, cartController.userCart);
router.delete('/users/:userId/cart',authenticate.authentication,authorize.authorization, cartController.deleteUserCart);
// order api
router.post('/users/:userId/orders', orderController.createOrder);
router.put('/users/:userId/orders', orderController.updateOrder);



// tax api 

router.post('/users/taxCalculator',taxController.userTaxCreation)

module.exports = router;