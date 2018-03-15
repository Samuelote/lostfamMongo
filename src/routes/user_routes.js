import User from '../Schemas/UserSchema';
import AlbumSchema from '../Schemas/AlbumSchema';
import axios from 'axios';
const { ROOT_URL } = require('../serverConfig');

/*
  The req.decoded.user_id is the decrypted user_id that we unecrypt in index.js
  if is original encoded after a user authenticates themselves with their username
  and password -> this encryption happens in auth.routes

  short version  -> was using req.params.user_id, now uses req.decoded.user_id
*/

module.exports = function (router) {
//Intiate Album handlers for User then pass off to Album routes
  router.route('/users/albums/')
    //Create an album
    .post((req,res) => {
      const { user_id } = req.decoded;
      User.findById(user_id, (err, user) => {
        if (err) res.send(err);
        const { name, capacity } = req.body;
        axios.post(`${ROOT_URL}/api/albums`, {
          name,
          capacity,
          user_id
        }).then(axiosRes => {
        //Gets the newly created AlbumSchema's id
          user.albums.push(axiosRes.data);
          user.save((err) => {
            if (err) res.send(err);
            res.send('User updated')
          })
        }).catch(err => {
          console.log(err);
          res.send(500);
        });
      })
      // res.send('ok')
    })
    //Get album from user, body must have index of album
    .get((req, res) => {
      User.findById(req.decoded.user_id, (err, user) => {
        if (err) res.send(err);
        const { albIdx } = req.body;
        axios.get(`${ROOT_URL}/albums/${user.album[albIdx]}`).then(axiosRes => {
          //gets a single album's data
          res.send(axiosRes.data);
        }).catch(err => {
          console.log(err);
          res.send(500);
        });
      });
    })
    //delete album from user
    .delete((req, res) => {
      User.findById(req.decoded.user_id, (err, user) => {
        if (err) res.send(err);
        const { albIdx } = req.body;
        AlbumSchema.remove({ _id: user.album[albIdx] }, (err, user) => {
          if (err) res.send(err);
          else {
            user.albums.splice(albIdx, 1);
            user.save(err => {
              if (err) res.send(err);
              else {
                res.json({ success: true });
              }
            })
          };
        });
      });
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

  router.route('/user/')
    //Get single User
    .get((req, res) => {
      User.findById(req.decoded.user_id, (err, user) => {
        if (err) res.send(err);
        res.send(user);
      })
    })
    //Update basic user info such as email, password, etc.
    .put((req, res) => {
      User.findById(req.decoded.user_id, (err, user) => {
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
      User.remove({ _id: req.decoded.user_id }, (err, user) => {
        if (err) res.send(err);
        else res.json({ success: true });
      });
    })
}
