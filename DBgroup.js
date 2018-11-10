const mongoose = require('mongoose');

let dbSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  groupId: Number,
  title: String,
  type:String,
  count: Number
});

let DBgroup = mongoose.model('DBgroup', dbSchema);

module.exports = DBgroup;
