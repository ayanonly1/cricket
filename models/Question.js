const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model('Question', QuestionSchema);
