const User = require('../Schemas/UserSchema');

module.exports = function(router) {
  router.route('/pics')
  .put((req, res) => {
    User.findById(req.decoded.user_id, (err, user) => {
      if (err) res.send(err);
      if (user.albums.length > 0) {
        user.albums.findOne({ name: req.body.albumName }, (err, album ) => {
          const path = album.methods.configureServerPath(req.body.albumData);
          album.push({ path, created_at: Date.now() })
        });
      }
      user.save((err) => {
        if (err) res.send(err);
        res.json({ message: 'User updated' })
      });
    })
  });
}
