const AlbumSchema = require('../Schemas/AlbumSchema');
const User = require('../Schemas/user');

module.exports = function (router) {
  router.route('/albums/')
    .post((req, res) => {
        const { name, capacity, user_id } = req.body;
        if (!user_id) res.send("No user was found.");
        const newAlbum = new AlbumSchema({ name, created_at: Date.now(), capacity });
        newAlbum.save(err => {
          if (err) res.send({ AlbumSuccess: false, err });
          res.send(newAlbum)
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
