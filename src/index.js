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

const port = process.env.PORT || 80;

const router = express.Router();

//auth routes must come first because if we check for tokens we wont be able to get any
require('./routes/auth_routes')(app, router);

router.use((req, res, next) => {
  const user_id = req.body.values ? req.body.values.user_id : undefined;
  //determines if call was made from server or from client
  if (req.body.fromServer){
    return next();
  }
  let token = user_id || req.body.user_id || req.query.user_id || req.headers['x-access-token'];

  if (token) {
    //verify with web token to get encrpyted data
    jwt.verify(token, app.get('secret'), (err, decoded) => {
      // console.log(err);
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });
      } else {
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
require('./routes/user_routes')(router);
require('./routes/album_routes')(router);
require('./routes/pics_routes')(router);

app.get('/', (req, res) => {
  res.sendFile(path.resolve('./index.html'));
})
app.use('/api', router);

app.listen(port);
console.log('Run yarn `dev:server` and `yarn start` to update...Port ' + port);
