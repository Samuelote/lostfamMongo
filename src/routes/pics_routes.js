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
    let cap;
    User.findById(user_id, (err, user)=>{
      if (err) res.send('Error finding user.')
      const { albums } = user;
      let index;
      for (let i in albums){
        if (albums[i].name === name){
          activeAlb = albums[i]._id;
          index = i;
        }
      }
      if (activeAlb) {
        if (user.albums[index].pics.length < user.albums[index].capacity){
          User.update(
            {_id : user_id},
            { $push: {[`albums.${index}.pics`]: { exif }}},
            (err)=>{
              if (err) res.send('Error occurred when adding photo to roll.');
              else res.send(`photo taken: ${user.albums[index].pics.length+1} / ${user.albums[index].capacity}`);
            }
          );
        } else {
          console.log('Roll has hit its max');
          res.send("You're roll has run out of film")
        }
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
