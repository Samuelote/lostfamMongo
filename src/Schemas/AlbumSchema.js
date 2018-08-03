const mongoose   = require('mongoose');
const { Schema } = mongoose;
const { PICDIR_PATH }   = '../serverConfig';

const album = new Schema({
  user_id: String,
  name: String,
  created_at: Date,
  capacity: Number,
  pics:[]
})

album.methods.configureServerPath = (pictureData) => {
  const { user_id, name, albumName } = pictureData;
  return `${PICDIR_PATH}/${user_id}/${albumName}/${name}`;
}

module.exports = mongoose.model('AlbumSchema', album);
