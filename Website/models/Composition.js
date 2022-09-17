// Not gonna lie, approximatley 83.275% of my code was copied and pasted

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CompositionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectID,
    ref: 'users'
  },
  date: {
    type: Date,
    default: Date.now
  },
  composer: {
    type: String
  },
  title: {
    type: String,
    default: "(Untitled)"
  },
  runtime: {
    type: Number
  },
  file_id: {
    type: String
  },
  filelength: {
    type: Number
  },
  filename: {
    type: String,
  },
  filetype: {
    type: String
  },
  private: {
    type: Boolean,
    default: false
  },
  description: {
    type: String,
    default: "(No description has been added)"
  },
  performers: {
	type: [String],
	default: []
  },
  tags: {
	type: [String],
	default: []
  }
});

module.exports = Composition = mongoose.model('compositions', CompositionSchema);
