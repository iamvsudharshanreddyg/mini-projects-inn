const path = require('path');

const express = require('express');
const auth =require('../util/utill');
const User = require('../models/user');
const router = express.Router();


router.get("/", (req, res, next) => {
    res.render('auth/signup', {
      pageTitle: 'Signup',
      path: '/signup',
      isauth:auth.isauth,
    });
  });
  router.get("/signin", (req, res, next) => {
    res.render('auth/signin', {
      pageTitle: 'Signin',
      path: '/signin',
      isauth:auth.isauth,
    });
  });
  
  router.get("/signup", (req, res, next) => {
    res.render('auth/signup', {
      pageTitle: 'Signup',
      path: '/signup',
      isauth:auth.isauth,
    });
  });
  
  
  router.use("/auth", (req, res, next) => {
    res.render('auth/authentication', {
      pageTitle: 'Authentication',
      path: 'authentication',
      isauth:auth.isauth,
    });
  });

  router.use("/logout", (req, res, next) => {
    auth.isauth=false;
    res.redirect('/')
  });


  
router.post("/verify", (req, res, next) => {
  console.log("verifyyyyyyyyyyyyy-----------------------");
  console.log(req.body.token);
  const token = req.body.token;
  if (token == null) {
    return res.redirect("/auth");
  }
  User.findOneAndUpdate({ "token": req.body.token }, { $set: { isActive: true } }, function (error, result) {
    if (error) {
      return res.json({
        status: false,
        message: 'error ',
        error: error
      });
    }
    else if(result){
      console.log(result);
      return res.json({
        status: true,
        message: 'Success..',
        result: result
      });
    }
    return res.json({
      status: false,
      message: 'Data is not found',
      error: error
    });
  });
  // res.render("verified");
});
//---------------------ADMIN--------------------------------------

router.get("/admin", (req, res, next) => {
  // console.log('edit------------------------------------------------------');
  
  User.find()
    .then(users =>{
      // if (!users) {
      //   return res.redirect('/user/dashboard');
      // }
      res.render('admin', {
        users: users,
      });
    })
    .catch(err => console.log(err));
});


  module.exports = router;