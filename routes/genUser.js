const User  = require('../Schemas/user');
const axios = require('axios');

module.exports = function (router) {
//Intiate Album handlers for User then pass off to Album routes
  router.route('/users/albums/:user_id')
    //Create an album
    .post((req,res) => {
      const { user_id } = req.params;
      console.log(req.body)
      User.findById(user_id, (err, user) => {
        if (err) res.send(err);
        const { name, capacity } = req.body;
        axios.post(`http://localhost:8080/api/albums`, {
          name,
          capacity,
          user_id
        }).then(axiosRes => {
        //Gets the newly created AlbumSchema's id
          const newAlbum = axiosRes.data;
          user.albums.push(newAlbum);
          user.save((err) => {
            if (err) res.send(err);
            res.send('User updated')
          })
        }).catch(err => console.log(err));
      })
      // res.send('ok')
    })

//Basic User Stuff
  router.route('/users')
    //Create a new User
    .post((req, res) => {
      const { name, email, username, password } = req.body;
      const newUser = new User({ name, email, username, password, created_at: Date.now() });
      newUser.save(err => {
        if (err) {
          console.log(err);
          res.send({ success: false });
        } else {
          console.log('New user has been created.')
          res.send({ success: true });
        }
      })
    })
    //Get all Users
    .get((req, res) => {
      User.find((err, users) => {
        if (err) res.send(err);

        res.json(users);
      })
    });

  router.route('/users/:user_id')
    //Get single User
    .get((req, res) => {
      User.findById(req.params.user_id, (err, user) => {
        if (err) res.send(err);
        res.send(user);
      })
    })
    //Update basic user info such as email, password, etc.
    .put((req, res) => {
      User.findById(req.params.user_id, (err, user) => {
        if (err) res.send(err);
        else {
          /* Update generic user data here */


          user.save((err) => {
            if (err) res.send(err);

            res.json({ message: 'User updated' })
          })
        }
      })
    })
    //Delete a single user
    .delete((req, res) => {
      User.remove({ _id: req.params.user_id }, (err, user) => {
        if (err) res.send(err);
        else res.json({ success: true });
      });
    })
}
