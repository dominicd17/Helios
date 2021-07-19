const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SALT_WORK_FACTOR = 10;
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  arn: { type: String },
});

userSchema.pre('save', function (next) {
  const user = this;
  bcrypt.hash(user.password, SALT_WORK_FACTOR, function (err, hash) {
    if (err) console.log(err);
    user.password = hash;
    return next();
  });
});
userSchema.methods.comparePassword = function (potentialPass) {
  const user = this;
  return bcrypt.compare(potentialPass, user.password);
};

module.exports = mongoose.model('User', userSchema);
