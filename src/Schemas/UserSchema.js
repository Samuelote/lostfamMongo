const mongoose   = require('mongoose');
const { Schema } = mongoose;
const bcrypt   = require('bcryptjs');
const AlbumSchema = require('./AlbumSchema');

const User = new Schema({
  email: String,
  password: { type:String, required: true },
  created_at: Date,
  albums:[]
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

User.methods.comparePassword = function(pass, cb) {
  bcrypt.compare(pass, this.password, (err, isMatch) => cb(err, isMatch));
}
export default mongoose.model('User', User);
