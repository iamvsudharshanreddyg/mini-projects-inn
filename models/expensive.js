const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const expensiveSchema = new Schema({
  Purpose: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  createdOn: {
    type: Date,
    default: Date.now()
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = mongoose.model('expensive', expensiveSchema);
