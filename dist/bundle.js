/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded and loading wasm modules
/******/ 	var installedWasmModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// object with all compiled WebAssembly.Modules
/******/ 	__webpack_require__.w = {};
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./Schemas/AlbumSchema.js":
/*!********************************!*\
  !*** ./Schemas/AlbumSchema.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar mongoose = __webpack_require__(/*! mongoose */ \"mongoose\");\nvar Schema = mongoose.Schema;\nvar _serverConfig = '../serverConfig',\n    PICDIR_PATH = _serverConfig.PICDIR_PATH;\n\n\nvar album = new Schema({\n    name: String,\n    created_at: Date,\n    capacity: Number,\n    pics: [{\n        path: { type: String, required: true },\n        created_at: Date\n    }]\n});\n\nalbum.methods.configureServerPath = function (pictureData) {\n    var user_id = pictureData.user_id,\n        name = pictureData.name,\n        albumName = pictureData.albumName;\n\n    return PICDIR_PATH + '/' + user_id + '/' + albumName + '/' + name;\n};\n\nmodule.exports = mongoose.model('AlbumSchema', album);\n\n//# sourceURL=webpack:///./Schemas/AlbumSchema.js?");

/***/ }),

/***/ "./Schemas/UserSchema.js":
/*!*******************************!*\
  !*** ./Schemas/UserSchema.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar mongoose = __webpack_require__(/*! mongoose */ \"mongoose\");\nvar Schema = mongoose.Schema;\n\nvar bcrypt = __webpack_require__(/*! bcryptjs */ \"bcryptjs\");\nvar AlbumSchema = __webpack_require__(/*! ./AlbumSchema */ \"./Schemas/AlbumSchema.js\");\n\nvar User = new Schema({\n  name: String,\n  email: String,\n  username: { type: String, required: true, index: { unique: true } },\n  password: { type: String, required: true },\n  created_at: Date,\n  albums: [{ type: mongoose.Schema.Types.ObjectId, ref: 'AlbumSchema' }]\n});\n\nUser.pre('save', function (next) {\n  var _this = this;\n\n  if (!this.isModified('password')) return next();\n\n  bcrypt.genSalt(10, function (err, salt) {\n    if (err) return next(err);\n\n    bcrypt.hash(_this.password, salt, function (err, hash) {\n      if (err) return next(err);\n\n      _this.password = hash;\n      next();\n    });\n  });\n});\n\nUser.methods.comparePassword = function (pass, cb) {\n  bcrypt.compare(pass, undefined.password, function (err, isMatch) {\n    if (err) return false;\n    if (isMatch) return true;\n  });\n};\nmodule.exports = mongoose.model('User', User);\n\n//# sourceURL=webpack:///./Schemas/UserSchema.js?");

/***/ }),

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar mongoose = __webpack_require__(/*! mongoose */ \"mongoose\");\nvar express = __webpack_require__(/*! express */ \"express\");\nvar app = express();\n\nvar _require = __webpack_require__(/*! body-parser */ \"body-parser\"),\n    urlencoded = _require.urlencoded,\n    json = _require.json;\n\n__webpack_require__(/*! dotenv */ \"dotenv\").config();\nmongoose.connect('mongodb://' + process.env.MONGOUSER + ':' + process.env.MONGOPASS + '@ds263948.mlab.com:' + process.env.MONGOPORT + '/lostfam');\n\napp.use(urlencoded({ extended: true }));\napp.use(json());\n\nvar port = process.env.PORT || 8080;\n\nvar router = express.Router();\n\n/* Routes */\n__webpack_require__(/*! ./routes/album_routes */ \"./routes/album_routes.js\")(router);\n__webpack_require__(/*! ./routes/user_routes */ \"./routes/user_routes.js\")(router);\n__webpack_require__(/*! ./routes/pics_routes */ \"./routes/pics_routes.js\")(router);\n\napp.use('/api', router);\n\napp.listen(port);\nconsole.log('Magic happens on port ' + port);\n\n//# sourceURL=webpack:///./index.js?");

/***/ }),

/***/ "./routes/album_routes.js":
/*!********************************!*\
  !*** ./routes/album_routes.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar AlbumSchema = __webpack_require__(/*! ../Schemas/AlbumSchema */ \"./Schemas/AlbumSchema.js\");\nvar User = __webpack_require__(/*! ../Schemas/UserSchema */ \"./Schemas/UserSchema.js\");\n\nmodule.exports = function (router) {\n  router.route('/albums/').post(function (req, res) {\n    var _req$body = req.body,\n        name = _req$body.name,\n        capacity = _req$body.capacity,\n        user_id = _req$body.user_id;\n\n    if (!user_id) res.send(\"No user was found.\");\n    var newAlbum = new AlbumSchema({ name: name, created_at: Date.now(), capacity: capacity });\n    newAlbum.save(function (err) {\n      if (err) res.send({ AlbumSuccess: false, err: err });\n      res.send(newAlbum);\n    });\n  })\n  //Get/Read all albums\n  .get(function (req, res) {\n    AlbumSchema.find(function (err, users) {\n      if (err) res.send(err);\n      res.json(users);\n    });\n  });\n};\n\n//# sourceURL=webpack:///./routes/album_routes.js?");

/***/ }),

/***/ "./routes/pics_routes.js":
/*!*******************************!*\
  !*** ./routes/pics_routes.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar User = __webpack_require__(/*! ../Schemas/UserSchema */ \"./Schemas/UserSchema.js\");\n\nmodule.exports = function (router) {\n  router.route('/pics/:user_id').put(function (req, res) {\n    User.findById(req.params.user_id, function (err, user) {\n      if (err) res.send(err);\n      if (user.albums.length > 0) {\n        user.albums.findOne({ name: req.body.albumName }, function (err, album) {\n          var path = album.methods.configureServerPath(req.body.albumData);\n          album.push({ path: path, created_at: Date.now() });\n        });\n      }\n      user.save(function (err) {\n        if (err) res.send(err);\n        res.json({ message: 'User updated' });\n      });\n    });\n  });\n};\n\n//# sourceURL=webpack:///./routes/pics_routes.js?");

/***/ }),

/***/ "./routes/user_routes.js":
/*!*******************************!*\
  !*** ./routes/user_routes.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar User = __webpack_require__(/*! ../Schemas/UserSchema */ \"./Schemas/UserSchema.js\");\nvar axios = __webpack_require__(/*! axios */ \"axios\");\n\nvar _require = __webpack_require__(/*! ../serverConfig */ \"./serverConfig.js\"),\n    ROOT_URL = _require.ROOT_URL;\n\nmodule.exports = function (router) {\n  //Intiate Album handlers for User then pass off to Album routes\n  router.route('/users/albums/:user_id')\n  //Create an album\n  .post(function (req, res) {\n    var user_id = req.params.user_id;\n\n    console.log(req.body);\n    User.findById(user_id, function (err, user) {\n      if (err) res.send(err);\n      var _req$body = req.body,\n          name = _req$body.name,\n          capacity = _req$body.capacity;\n\n      axios.post(ROOT_URL + '/api/albums', {\n        name: name,\n        capacity: capacity,\n        user_id: user_id\n      }).then(function (axiosRes) {\n        //Gets the newly created AlbumSchema's id\n        user.albums.push(axiosRes.data);\n        user.save(function (err) {\n          if (err) res.send(err);\n          res.send('User updated');\n        });\n      }).catch(function (err) {\n        console.log(err);\n        res.send(500);\n      });\n    });\n    // res.send('ok')\n  })\n  //Get album from user, body must have index of album\n  .get(function (req, res) {\n    User.findById(req.params.user_id, function (err, user) {\n      if (err) res.send(err);\n      var albIdx = req.body.albIdx;\n\n      axios.get(ROOT_URL + '/albums/:album_id').then(function (axiosRes) {\n        //gets a single album's data\n        res.send(axiosRes.data);\n      }).catch(function (err) {\n        console.log(err);\n        res.send(500);\n      });\n    });\n  });\n\n  //Basic User Stuff\n  router.route('/users')\n  //Create a new User\n  .post(function (req, res) {\n    var _req$body2 = req.body,\n        name = _req$body2.name,\n        email = _req$body2.email,\n        username = _req$body2.username,\n        password = _req$body2.password;\n\n    var newUser = new User({ name: name, email: email, username: username, password: password, created_at: Date.now() });\n    newUser.save(function (err) {\n      if (err) {\n        console.log(err);\n        res.send({ success: false });\n      } else {\n        console.log('New user has been created.');\n        res.send({ success: true });\n      }\n    });\n  })\n  //Get all Users\n  .get(function (req, res) {\n    User.find(function (err, users) {\n      if (err) res.send(err);\n\n      res.json(users);\n    });\n  });\n\n  router.route('/users/:user_id')\n  //Get single User\n  .get(function (req, res) {\n    User.findById(req.params.user_id, function (err, user) {\n      if (err) res.send(err);\n      res.send(user);\n    });\n  })\n  //Update basic user info such as email, password, etc.\n  .put(function (req, res) {\n    User.findById(req.params.user_id, function (err, user) {\n      if (err) res.send(err);else {\n        /* Update generic user data here */\n\n        user.save(function (err) {\n          if (err) res.send(err);\n\n          res.json({ message: 'User updated' });\n        });\n      }\n    });\n  })\n  //Delete a single user\n  .delete(function (req, res) {\n    User.remove({ _id: req.params.user_id }, function (err, user) {\n      if (err) res.send(err);else res.json({ success: true });\n    });\n  });\n};\n\n//# sourceURL=webpack:///./routes/user_routes.js?");

/***/ }),

/***/ "./serverConfig.js":
/*!*************************!*\
  !*** ./serverConfig.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nvar path = __webpack_require__(/*! path */ \"path\");\n\nvar PICDIR_PATH = exports.PICDIR_PATH = path.resolve('./userimages');\nvar ROOT_URL = exports.ROOT_URL = 'http://localhost:8080';\n\n//# sourceURL=webpack:///./serverConfig.js?");

/***/ }),

/***/ "axios":
/*!************************!*\
  !*** external "axios" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"axios\");\n\n//# sourceURL=webpack:///external_%22axios%22?");

/***/ }),

/***/ "bcryptjs":
/*!***************************!*\
  !*** external "bcryptjs" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"bcryptjs\");\n\n//# sourceURL=webpack:///external_%22bcryptjs%22?");

/***/ }),

/***/ "body-parser":
/*!******************************!*\
  !*** external "body-parser" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"body-parser\");\n\n//# sourceURL=webpack:///external_%22body-parser%22?");

/***/ }),

/***/ "dotenv":
/*!*************************!*\
  !*** external "dotenv" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"dotenv\");\n\n//# sourceURL=webpack:///external_%22dotenv%22?");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"express\");\n\n//# sourceURL=webpack:///external_%22express%22?");

/***/ }),

/***/ "mongoose":
/*!***************************!*\
  !*** external "mongoose" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"mongoose\");\n\n//# sourceURL=webpack:///external_%22mongoose%22?");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"path\");\n\n//# sourceURL=webpack:///external_%22path%22?");

/***/ })

/******/ });