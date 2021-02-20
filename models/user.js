const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

// Define our model
const userSchema = new Schema({
  email: { type: String, unique: true, lowercase: true },
  password: String,
});
// on save hook, encrypt password
// before saving a model, run this function

userSchema.pre("save", async function (next) {
  // only if the password is modified
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = function (candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) {
      return callback(err);
    } else {
      callback(null, isMatch);
    }
  });
};

// Create the model class

const ModelClass = mongoose.model("user", userSchema);

// Export the model
module.exports = ModelClass;
