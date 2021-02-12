const path = require('path');
const auth =require('../util/utill');
const express = require('express');

const userController = require('../controllers/userexpensives');


const router = express.Router();

router.get('/dashboard', userController.getIndex);

router.get('/expensive/:productId', userController.getProduct);

// /user/add-expensive => GET
router.get('/add-expensive', userController.getAddExpensive);

// /user/expensives => GET
router.get('/expensives', userController.getExpensives);

// /user/add-expensive => POST
router.post('/add-expensive', userController.postAddExpensive);

router.get('/edit-expensive/:productId', userController.getEditExpensive);

router.post('/edit-expensive', userController.postEditExpensive);

router.post('/delete-expensive', userController.postDeleteExpensive);

router.get('/userdetails',userController.getUserProfile)

router.get('/userprofile-edit',userController.getAddProfile);

router.post('/userprofile-edit',userController.postAddProfile);

module.exports = router;
