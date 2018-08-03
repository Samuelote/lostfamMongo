import User from '../Schemas/UserSchema';
import AlbumSchema from '../Schemas/AlbumSchema';

module.exports = function(router) {
  router.route('/pics/')
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
    });
  })
  .post((req,res) => {
    const { user_id } = req.decoded;
    const { name, exif } = req.body.values;
    // console.log(exif);
    let activeAlb;
    User.findById(user_id, (err, user)=>{
      const { albums } = user;
      for (let i in albums){
        if (albums[i].name === name){
          activeAlb = albums[i]._id;
        }
      }
      if (activeAlb) {
        AlbumSchema.findById(activeAlb, (err, alb)=>{
          AlbumSchema.update(
            {_id: activeAlb},
            { $push: {"pics": {exif}}},
            {safe: true, upsert: true}, (err)=>{
              if (err) res.send('Error occurred when adding photo to roll.');
              else res.send('Photo Saved to Roll!')
            }
          )
        })
      } else {
        res.send('Error finding album for pic')
      }
    })


    // const newAlbum = new AlbumSchema({ user_id, name, created_at: Date.now(), capacity });
    // newAlbum.save(err => {
    //   if (err) res.send({ AlbumSuccess: false, err });
    //   res.send(newAlbum)
    // });
  })
}
