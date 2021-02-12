const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    require: true
  },
  email: {
    type: String,
    require: true,
    unique: true
  },
  password: {
    type: String,
    require: true
  },
  token: {
    type: String,
    require: true
  },
  isActive: {
    type: Boolean,
    default: false
  },
  gender:{
    type:String,
    default: 'null'
  },
  firstname:{
    type:String,
    default:"first name"
  },
  lastname:{
    type:String,
    default:"last name"
  },
  dob:{
    type:Date,
    default:null
  },
  tel:{
    type:Number,
    default:null
  },
  profession:{
    type:String,
    default:"Techie"
  }
});

module.exports = mongoose.model('User', userSchema);
