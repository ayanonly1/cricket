const mongoose = require('mongoose');

const BetSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  question_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
  },
  amount: {
    type: Number,
    required: true,
  },
  opinion: {
    type: Boolean,
    required: true,
  },
});
module.exports = mongoose.model('Bet', BetSchema);
