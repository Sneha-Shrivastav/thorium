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




// tax api 


// for protection 
// router.post('/users/taxCalculator',authenticate.authentication,authorize.authorization,taxController.userTaxCreation)
router.post('/users/taxCalculator',taxController.userTaxCreation)
router.get('/users/:userId/getTaxDetails', taxController.getTaxDetailsByUserId)
router.post('/users/:userId/markTaxPaid',taxController.markTaxPaid)

router.post('/users/:userId/createAndEditTaxDue',taxController.createAndEditTaxDue)
router.post('users/:userId/editTaxDue',taxController.editTaxDue)


module.exports = router;