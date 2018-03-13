const AlbumSchema = require('../Schemas/AlbumSchema');
const User = require('../Schemas/UserSchema');

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
    //Get/Read all albums
    .get((req, res) => {
      AlbumSchema.find((err, users) => {
        if (err) res.send(err);
        res.json(users);
      });
    })
}
