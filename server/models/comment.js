const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  userId: String,
  userName: String, 
  parentStoryId: String, 
  comment: String, 
  timestamp: String, 
});

// compile model from schema
module.exports = mongoose.model("comment", CommentSchema);
