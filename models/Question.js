const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },

  result: {
    type: Boolean,
  },
});
module.exports = mongoose.model('Question', QuestionSchema, 'questions_local_updated');
