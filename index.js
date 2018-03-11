const mongoose = require('mongoose');
const express  = require('express');
const app      = express();
const { urlencoded, json } = require('body-parser');

require('dotenv').config();
mongoose.connect(`mongodb://${process.env.MONGOUSER}:${process.env.MONGOPASS}@ds263948.mlab.com:${process.env.MONGOPORT}/lostfam`);

app.use(urlencoded({ extended: true }));
app.use(json());

const port = process.env.PORT || 8080;

const router = express.Router();

/* Routes */
require('./routes/albums')(router);
require('./routes/genUser')(router);
require('./routes/pics')(router);


app.use('/api', router);

app.listen(port);
console.log('Magic happens on port ' + port);
