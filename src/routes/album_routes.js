const AlbumSchema = require('../Schemas/AlbumSchema');
const User = require('../Schemas/UserSchema');

module.exports = function (router) {
  router.route('/albums/')
    .post((req, res) => {
        const { name, capacity, user_id } = req.body;
        // if (!user_id) res.send("No user was found.");
        const newAlbum = new AlbumSchema({ user_id, name, created_at: Date.now(), capacity });
        newAlbum.save(err => {
          if (err) res.send({ AlbumSuccess: false, err });
          res.send(newAlbum)
        });
    })
    //Get/Read all albums from such user
    .get((req, res) => {
      const { user_id } = req.decoded;
      console.log('firing this shit!!!!!!!!!!!');
      // AlbumSchema.findById(user_id, (err, albums) => {
      //   // if (err) res.send(err);
      //   console.log(err, albums);
      //   // res.json(albums);
      // });
    })
    //delete all albums for dev purpose
    .delete((req, res) => {
      AlbumSchema.find((err, albums) => {
        if (err) res.send(err);
        albums.forEach(album => {
        AlbumSchema.remove({ _id: album._id }, (err) => {
          if (err) res.send(err);
        })
      });
      setTimeout(() => res.send("All Done"), 3000);
    })
  })

}
