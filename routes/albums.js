const AlbumSchema = require('../Schemas/AlbumSchema');
const User = require('../Schemas/user');

module.exports = function (router) {
  router.route('/albums/:user_id')
    .put((req, res) => {
      User.findById(req.params.user_id, (err, user) => {
        if (err) res.send(err);
          const { name, created_at, capacity } = req.body;
          const newAlbum = new AlbumSchema({ name, created_at: Date.now(), capacity });

          newAlbum.save(err => {
            if (err) {
              console.log(err);
              res.send({ AlbumSuccess: false });
            } else {
              console.log('new Album created!')
            }
          })

            user.albums.push(newAlbum);

            user.save((err) => {
              if (err) res.send(err);
              res.json({ message: 'User updated wiuth new Album' })
            });
        });
      })
    .get((req, res) => {
        User.findById(req.params.user_id, (err, user) => {
          if (err) res.send(err);
          console.log(user.albums[0])
          AlbumSchema.findById(user.albums[0], (err, album) => {
            if (err) res.send(err);
            res.send(album);
          });
        });
    })
}
