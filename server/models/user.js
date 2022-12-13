const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  googleid: String,
  email: String, 
  locale: String,
  profilePic: String, 
  imageNames: [String],
});

// compile model from schema
module.exports = mongoose.model("user", UserSchema);