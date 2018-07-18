import mongoose from 'mongoose';
import express  from 'express';
import morgan   from 'morgan';
import jwt      from 'jsonwebtoken';
import cors     from 'cors';
import { urlencoded, json } from 'body-parser';
const path = require('path');
const http = require('http');
const https = require('https');
const fs = require('fs');
const app = express();
require('dotenv').config();


const db = `mongodb://${process.env.MONGOUSER}:${process.env.MONGOPASS}@ds263948.mlab.com:${process.env.MONGOPORT}/lostfam`;
mongoose.connect(db, { useNewUrlParser: true })
.then(()=>console.log('Successful Connection'))
.catch(err => console.error('Database connection error: ', err))

app.set('secret', process.env.SUPERSECRET);

app.use(urlencoded({ extended: true }));
app.use(json());
app.use(morgan('dev'));
app.use(cors());
app.options('*', cors());

const port = process.env.PORT || 8080;

const router = express.Router();

//auth routes must come first because if we check for tokens we wont be able to get any
require('./routes/auth_routes')(app, router);

router.use((req, res, next) => {
  let token = req.body.token || req.query.token || req.headers['x-access-token'];
  // console.log(next);
  next();



// uncomment this for token verification on every api call
  if (token) {
    //verify with web token to get encrpyted data
    jwt.verify(token, app.get('secret'), (err, decoded) => {
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });
      } else {
        console.log(decoded);
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.status(403).send({
      success: false,
      message: 'No token provided.'
    });
  }
});

/* Routes */
require('./routes/album_routes')(router);
require('./routes/user_routes')(router);
require('./routes/pics_routes')(router);

app.get('/', (req, res) => {
  res.sendFile(path.resolve('./index.html'));
})
app.use('/api', router);

app.listen(port);
console.log('Run yarn `dev:server` and `yarn start` to update...Port ' + port);
