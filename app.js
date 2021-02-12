const path = require('path');
const Utill = require('./util/utill');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const errorController = require('./controllers/error');
const User = require('./models/user');
const auth = require('./controllers/auth');
const app = express();
const session = require('express-session');
app.set('view engine', 'ejs');
app.set('views', 'views');

const userRoutes = require('./routes/user');
const Auth = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(Auth);
app.use((req, res, next) => {
  console.log(Utill.userid);
  User.findById("6010191aff41e30d547f02d5")
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});
app.use(auth);
app.use('/user', userRoutes);

app.use(errorController.get404);

mongoose
  .connect(
    "mongodb://127.0.0.1:27017/expences",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    },
  )
  .then(result => {
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });
