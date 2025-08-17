const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({
  searchTerm: {
    type: String,
    required: true
  },
  count: {
    type: Number,
    default: 1
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  imageUrl: {
    type: String
  },
  imdbID: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  year: {
    type: String,
    required: true
  },
  type: {
    type: String
  }
});

module.exports = mongoose.model('Movie', MovieSchema);
