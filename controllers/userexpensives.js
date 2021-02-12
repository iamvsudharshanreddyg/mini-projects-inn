const Expensive = require('../models/expensive');
const auth = require('../util/utill');
const User = require('../models/user');
const Moment = require('moment');
exports.getAddExpensive = (req, res, next) => {
  res.render('user/edit-expensive', {
    pageTitle: 'Add expensive',
    path: '/user/edit-expensive',
    isauth: auth.isauth,
    editing: false
  });
};

exports.getExpensives = (req, res, next) => {
  Expensive.find()
    // .select('title price -_id')
    // .populate('userId', 'name')
    .then(expensives => {
      // console.log(products);
      res.render('user/expensives', {
        prods: expensives,
        pageTitle: 'user expensives',
        isauth: auth.isauth,
        path: '/user/expensives'
      });
    })
    .catch(err => console.log(err));
};

exports.postAddExpensive = (req, res, next) => {
  const Purpose = req.body.title;

  const price = req.body.price;
  const description = req.body.description;
  const expensive = new Expensive({
    Purpose: Purpose,
    price: price,
    description: description,
    // imageUrl: imageUrl,
    userId: req.user
  });
  expensive
    .save()
    .then(result => {
      // console.log(result);
      // console.log('Created expensive');
      res.redirect('/user/expensives');
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getEditExpensive = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  // console.log('edit------------------------------------------------------');

  Expensive.findById(prodId)
    .then(expensive => {
      if (!expensive) {
        return res.redirect('/user/dashboard');
      }
      res.render('user/edit-expensive', {
        pageTitle: 'Edit expensive',
        path: '/user/edit-expensive',
        editing: editMode,
        isauth: auth.isauth,
        expensive: expensive
      });
    })
    .catch(err => console.log(err));
};

exports.postEditExpensive = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedPurpose = req.body.title;
  const updatedPrice = req.body.price;
  // const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;

  Expensive.findById(prodId)
    .then(product => {
      product.Purpose = updatedPurpose;
      product.price = updatedPrice;
      product.description = updatedDesc;
      // product.imageUrl = updatedImageUrl;
      return product.save();
    })
    .then(result => {
      console.log('UPDATED Expensive!');
      res.redirect('/user/dashboard');
    })
    .catch(err => console.log(err));
};

exports.postDeleteExpensive = (req, res, next) => {
  const prodId = req.body.productId;
  Expensive.findByIdAndRemove(prodId)
    .then(() => {
      console.log('DESTROYED Expensive');
      res.redirect('/user/expensives');
    })
    .catch(err => console.log(err));
};
//-------------------------------------------------------------------
exports.getIndex = (req, res, next) => {
  Expensive.find()
    .then(expensives => {
      res.render('user/dashboard', {
        prods: expensives,
        pageTitle: 'dashboard',
        isauth: auth.isauth,
        path: '/user/dashboard'
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  console.log(req.params.productId);
  console.log('edit----------------------------------------------------------------------------------');
  Expensive.findById(prodId)
    .then(expensive => {
      res.render('user/expensive-detail', {
        expensive: expensive,
        pageTitle: expensive.Purpose,
        isauth: auth.isauth,
        path: '/user/expensive-detail',
        moment: Moment,
      });
    })
    .catch(err => console.log(err));
};
exports.getUserProfile = (req, res, next) => {
  res.render('user/userdetails', {
    pageTitle: 'Profile',
    path: '/user/userdetails',
    isauth: auth.isauth,
    user: req.user,
    moment: Moment,
  });
}

exports.getAddProfile = (req, res, next) => {
  res.render('user/userprofile-edit', {
    pageTitle: 'Add expensive',
    path: '/user/userprofile-edit',
    isauth: auth.isauth,
  });
}
exports.postAddProfile = (req, res, next) => {
  console.log('now u can edit ');
  console.log(req.body);

  User.findOneAndUpdate({ "email": req.body.email },
    {
      $set: {
        gender: req.body.gender, firstname: req.body.firstname, lastname: req.body.lastname, dob: req.body.dob,
        tel: req.body.tel, profession: req.body.prof
      }
    },
    function (error, result) {
      if (error) {
        return res.json({
          status: false,
          message: 'error ',
          error: error
        });
      }
      else if (result) {
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
}
