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
      console.log('create album');
      const { user_id } = req.decoded;
      User.findById(user_id, (err, user) => {
        if (err) res.send(err);
        const { name, capacity } = req.body.values;
        axios.post(`${ROOT_URL}/api/albums`, {
          name,
          capacity,
          user_id,
          fromServer: true
        }).then(axiosRes => {
          // console.log(axiosRes.data);
          //pushes new album into user schema
          const { data: {_id, user_id, name, created_at, capacity, pics, _v} } = axiosRes;
          // console.log(_id, user_id, name, created_at, capacity, pics, _v);
          User.update(
            {_id: user_id},
            { $push: {"albums": {_id, user_id, name, created_at, capacity, pics, _v} }},
            {safe: true, upsert: true}, ()=>res.send('Success adding album')
          )

        }).catch(err => {
          console.log('Error from user_routes:', err);
          res.sendStatus(500);
        });
      })
    })
    //Get album from user, body must have index of album
    .get((req, res) => {
      let albums;
      User.findById(req.decoded.user_id, (err, user) => {
        if (err) res.send(err);
        const { albIdx } = req.query;
        albums = user.albums;
        user.albums.forEach((alb)=>console.log(alb.name));
        res.json( albums )
      });
    })
    //delete album from user
    .delete((req, res) => {
      const { user_id } = req.decoded;
      User.findById(user_id, (err, user) => {
        if (err) res.send(err);
        const { albIdx } = req.query;
        const { _id, name } = user.albums[albIdx];
        AlbumSchema.remove({_id}, (err, pomc)=>{
          if (err) console.log(err);
          else {
            User.update(
              {_id: user_id},
              { $pull: {"albums": { _id } }},
              {safe: true, upsert: true}, ()=>console.log(`Deleted "${name}" Successfully`)
            )
          }
        }).then(()=>{
          user.albums.splice(albIdx, 1);
          res.send({success: true, albums: user.albums});
        }).catch(()=>res.send({success: false}));
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
