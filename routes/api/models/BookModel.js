const mongoose = require('mongoose');

const BookSchema = mongoose.Schema({
  title: { type: String, trim: true },
  comments: [{ type: String, trim: true }]
});

module.exports = mongoose.model('Book', BookSchema);