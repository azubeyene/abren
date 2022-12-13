const mongoose = require("mongoose");

const LikeSchema = new mongoose.Schema({
  userId: String,
  parentStoryId: String, 
});

// compile model from schema
module.exports = mongoose.model("like", LikeSchema);
