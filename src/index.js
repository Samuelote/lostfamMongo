import mongoose from 'mongoose';
import express  from 'express';
import morgan   from 'morgan';
import jwt      from 'jsonwebtoken';
import cors     from 'cors';
import { urlencoded, json } from 'body-parser';
const app = express();

require('dotenv').config();
mongoose.connect(`mongodb://${process.env.MONGOUSER}:${process.env.MONGOPASS}@ds263948.mlab.com:${process.env.MONGOPORT}/lostfam`);
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


app.use('/api', router);

app.listen(port);
console.log('Magic happens on port ' + port);
