import User from '../Schemas/UserSchema';
import AlbumSchema from '../Schemas/AlbumSchema';
import jwt from 'jsonwebtoken';
import axios from 'axios';
const mongoose = require('mongoose');
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
        const { name, capacity } = req.body.values;
        console.log(name,capacity, user_id);
        axios.post(`${ROOT_URL}/api/albums`, {
          name,
          capacity,
          user_id,
          fromServer: true
        }).then(axiosRes => {
        //Gets the newly created AlbumSchema's id
            user.save((err) => {
            user.albums.push(axiosRes.data);
            if (err) res.send(err);
            res.send('User updated')
          })
        }).catch(err => {
          // console.log('Erorr:', err);
          // res.sendStatus(500);
        });
      })
      // res.send('ok')
    })
    //Get album from user, body must have index of album
    .get((req, res) => {
      User.findById(req.body.user_id, (err, user) => {
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
