const mongoose = require("mongoose");

const StorySchema = new mongoose.Schema({
  userId: String,
  userName: String, 
  countryName: String, 
  photoId: String, 
  description: String, 
  timestamp: String, 
  numLikes: String, 
});

// compile model from schema
module.exports = mongoose.model("story", StorySchema);
