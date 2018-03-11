const mongoose   = require('mongoose');
const { Schema } = mongoose;
const bcrypt   = require('bcryptjs');
const AlbumSchema = require('./AlbumSchema');

const User = new Schema({
  name: String,
  email: String,
  username: { type:String, required: true, index: { unique: true }},
  password: { type:String, required: true },
  created_at: Date,
  albums:[{ type: mongoose.Schema.Types.ObjectId, ref: 'AlbumSchema' }]
});

User.pre('save', function(next) {
  if (!this.isModified('password')) return next();

  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);

    bcrypt.hash(this.password, salt, (err, hash) => {
      if (err) return next(err);

      this.password = hash;
      next();
    });
  });
});

User.methods.comparePassword = (pass, cb) => {
  bcrypt.compare(pass, this.password, (err, isMatch) => {
    if (err) return false;
    if (isMatch) return true;
  });
}
module.exports = mongoose.model('User', User);
