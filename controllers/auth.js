const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');
const bodyparser = require("body-parser");
const User = require('../models/user');
const { check, validationResult } = require('express-validator');
const Utill = require('../util/utill');
const mailgun = require("mailgun-js");
const randomstring = require('randomstring');
const mg = mailgun({ apiKey: Utill.MAILGUN_API_KEY, domain: Utill.DOMAIN });
router.use(bodyparser.json());
router.use(bodyparser.urlencoded({ extended: true }));


router.post(
  '/signup',
  [
    check('username').not().isEmpty().trim().escape(),
    check('password').not().isEmpty().trim().escape(),
    check('email').isEmail().normalizeEmail()
  ],
  function (req, res) {
    console.log(req.body);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        status: false,
        message: 'Form validation error.',
        errors: errors.array()
      });
    }


    const secretToken = randomstring.generate();
    console.log('secretToken', secretToken);
    const msg = {
      to: req.body.email,
      from: 'sudharshanchinnu1997@gmail.com',
      subject: 'signup Verification',
      html: `<h1>Thankyou for  using</h1>
                 <h5>enter thekey:<strong> ${secretToken}  </strong</h5><br/>
                 <a href="http://localhost:3000/auth">Click here to verify</a>`

    };
    mg.messages()
      .send(msg, function (error, body) {
        if (error) {
          return res.json({
            message: error.message
          });
        }
        // console.log(body);
        console.log('Email sent');

        const hashedPassword = bcrypt.hashSync(req.body.password, 10);
        var temp = new User({
          username: req.body.username,
          email: req.body.email,
          password: hashedPassword,
          token: secretToken
        });
        temp.save(function (error, result) {
          if (error) {
            return res.json({
              status: false,
              message: 'DB connection fail',
              error: error
            });
          } else {
            return res.status(400).json({ message: 'email has been sent to u r account kindly activate it' });
          }
        });
        //return res.status(400).json({ message: 'email has been sent to u r account kindly activate it' });
      });
  }
);




router.post("/loginuser", async (req, res, next) => {
  // const email = req.body.email;
  // const pwd = req.body.your_pass;
  //try{  
  // console.log(req.body.email);
  // console.log(req.body.your_pass);
  if (req.body.email == 'admin' && req.body.your_pass == 'admin') {
    Utill.isauth = true;
    // console.log("addddddddddddd---------------------")
    return res.redirect('/admin');
  }
  var person = await User.findOne({ email: req.body.email });
  console.log("password-----------------------------")
  // console.log(person.password);
  // console.log(person.isActive);
  Utill.userid=person._id;
  if (!person) {
    return res.status(422).json({
      message: "no user found"
    });
  }
  if (!person.isActive) {
    return res.status(422).json({
      status: false,
      message: 'user inactive please activate it by email.'
    });
  }
  if (!bcrypt.compareSync(req.body.your_pass, person.password)) {
    return res.status(400).send({ message: "The password is invalid" });
  }
  // console.log(person._id);
  User.findById(person._id)
    .then(user => {
      // console.log(user);
      req.user = user;
      // Utill.userid=user._id;
      // console.log(userid);
      Utill.isauth = true;
      res.redirect("/user/dashboard");
    })
    .catch(err => console.log(err));


  //   }
  // catch (error) {
  //       res.status(500).send({ message: error.message});
  //   }
});

router.post("/delete-user", (req, res, next) => {
  const userId = req.body.userId;
  User.findByIdAndRemove(userId)
    .then(() => {
      console.log('user deleted');
      res.redirect('/admin');
    })
    .catch(err => console.log(err));
});


module.exports = router;
