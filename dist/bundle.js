/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
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
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
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
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nvar mongoose = __webpack_require__(/*! mongoose */ \"mongoose\");\nvar Schema = mongoose.Schema;\n\nvar bcrypt = __webpack_require__(/*! bcryptjs */ \"bcryptjs\");\nvar AlbumSchema = __webpack_require__(/*! ./AlbumSchema */ \"./Schemas/AlbumSchema.js\");\n\nvar User = new Schema({\n  email: String,\n  password: { type: String, required: true },\n  created_at: Date,\n  albums: [{ type: mongoose.Schema.Types.ObjectId, ref: 'AlbumSchema' }]\n});\n\nUser.pre('save', function (next) {\n  var _this = this;\n\n  if (!this.isModified('password')) return next();\n\n  bcrypt.genSalt(10, function (err, salt) {\n    if (err) return next(err);\n\n    bcrypt.hash(_this.password, salt, function (err, hash) {\n      if (err) return next(err);\n\n      _this.password = hash;\n      next();\n    });\n  });\n});\n\nUser.methods.comparePassword = function (pass, cb) {\n  bcrypt.compare(pass, this.password, function (err, isMatch) {\n    return cb(err, isMatch);\n  });\n};\nexports.default = mongoose.model('User', User);\n\n//# sourceURL=webpack:///./Schemas/UserSchema.js?");

/***/ }),

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar _mongoose = __webpack_require__(/*! mongoose */ \"mongoose\");\n\nvar _mongoose2 = _interopRequireDefault(_mongoose);\n\nvar _express = __webpack_require__(/*! express */ \"express\");\n\nvar _express2 = _interopRequireDefault(_express);\n\nvar _morgan = __webpack_require__(/*! morgan */ \"morgan\");\n\nvar _morgan2 = _interopRequireDefault(_morgan);\n\nvar _jsonwebtoken = __webpack_require__(/*! jsonwebtoken */ \"jsonwebtoken\");\n\nvar _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);\n\nvar _cors = __webpack_require__(/*! cors */ \"cors\");\n\nvar _cors2 = _interopRequireDefault(_cors);\n\nvar _bodyParser = __webpack_require__(/*! body-parser */ \"body-parser\");\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nvar path = __webpack_require__(/*! path */ \"path\");\nvar http = __webpack_require__(/*! http */ \"http\");\nvar https = __webpack_require__(/*! https */ \"https\");\nvar fs = __webpack_require__(/*! fs */ \"fs\");\nvar app = (0, _express2.default)();\n__webpack_require__(/*! dotenv */ \"dotenv\").config();\n\nvar db = 'mongodb://' + process.env.MONGOUSER + ':' + process.env.MONGOPASS + '@ds263948.mlab.com:' + process.env.MONGOPORT + '/lostfam';\n_mongoose2.default.connect(db, { useNewUrlParser: true }).then(function () {\n  return console.log('Successful Connection');\n}).catch(function (err) {\n  return console.error('Database connection error: ', err);\n});\n\napp.set('secret', process.env.SUPERSECRET);\n\napp.use((0, _bodyParser.urlencoded)({ extended: true }));\napp.use((0, _bodyParser.json)());\napp.use((0, _morgan2.default)('dev'));\napp.use((0, _cors2.default)());\napp.options('*', (0, _cors2.default)());\n\nvar port = process.env.PORT || 8080;\n\nvar router = _express2.default.Router();\n\n//auth routes must come first because if we check for tokens we wont be able to get any\n__webpack_require__(/*! ./routes/auth_routes */ \"./routes/auth_routes.js\")(app, router);\n\nrouter.use(function (req, res, next) {\n  var token = req.body.token || req.query.token || req.headers['x-access-token'];\n  // console.log(next);\n  next();\n\n  // uncomment this for token verification on every api call\n  if (token) {\n    //verify with web token to get encrpyted data\n    _jsonwebtoken2.default.verify(token, app.get('secret'), function (err, decoded) {\n      if (err) {\n        return res.json({ success: false, message: 'Failed to authenticate token.' });\n      } else {\n        console.log(decoded);\n        req.decoded = decoded;\n        next();\n      }\n    });\n  } else {\n    return res.status(403).send({\n      success: false,\n      message: 'No token provided.'\n    });\n  }\n});\n\n/* Routes */\n__webpack_require__(/*! ./routes/album_routes */ \"./routes/album_routes.js\")(router);\n__webpack_require__(/*! ./routes/user_routes */ \"./routes/user_routes.js\")(router);\n__webpack_require__(/*! ./routes/pics_routes */ \"./routes/pics_routes.js\")(router);\n\napp.get('/', function (req, res) {\n  res.sendFile(path.resolve('./index.html'));\n});\napp.use('/api', router);\n\napp.listen(port);\nconsole.log('Run yarn `dev:server` and `yarn start` to update...Port ' + port);\n\n//# sourceURL=webpack:///./index.js?");

/***/ }),

/***/ "./routes/album_routes.js":
/*!********************************!*\
  !*** ./routes/album_routes.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar AlbumSchema = __webpack_require__(/*! ../Schemas/AlbumSchema */ \"./Schemas/AlbumSchema.js\");\nvar User = __webpack_require__(/*! ../Schemas/UserSchema */ \"./Schemas/UserSchema.js\");\n\nmodule.exports = function (router) {\n  router.route('/albums/').post(function (req, res) {\n    console.log(\"mongo fired add album\");\n    var _req$body = req.body,\n        name = _req$body.name,\n        capacity = _req$body.capacity,\n        user_id = _req$body.user_id;\n\n    if (!user_id) res.send(\"No user was found.\");\n    var newAlbum = new AlbumSchema({ name: name, created_at: Date.now(), capacity: capacity });\n    newAlbum.save(function (err) {\n      if (err) res.send({ AlbumSuccess: false, err: err });\n      res.send(newAlbum);\n    });\n  })\n  //Get/Read all albums\n  .get(function (req, res) {\n    AlbumSchema.find(function (err, albums) {\n      if (err) res.send(err);\n      res.json(albums);\n    });\n  })\n  //delete all albums for dev purpose\n  .delete(function (req, res) {\n    AlbumSchema.find(function (err, albums) {\n      if (err) res.send(err);\n      albums.forEach(function (album) {\n        AlbumSchema.remove({ _id: album._id }, function (err) {\n          if (err) res.send(err);\n        });\n      });\n      setTimeout(function () {\n        return res.send(\"All Done\");\n      }, 3000);\n    });\n  });\n};\n\n//# sourceURL=webpack:///./routes/album_routes.js?");

/***/ }),

/***/ "./routes/auth_routes.js":
/*!*******************************!*\
  !*** ./routes/auth_routes.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar _UserSchema = __webpack_require__(/*! ../Schemas/UserSchema */ \"./Schemas/UserSchema.js\");\n\nvar _UserSchema2 = _interopRequireDefault(_UserSchema);\n\nvar _jsonwebtoken = __webpack_require__(/*! jsonwebtoken */ \"jsonwebtoken\");\n\nvar _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nmodule.exports = function (app, router) {\n\n  router.post('/authenticate', function (req, res) {\n    var _req$body = req.body,\n        email = _req$body.email,\n        password = _req$body.password;\n\n    _UserSchema2.default.findOne({ email: email.toLowerCase() }, function (err, user) {\n      if (err) throw err;\n      if (!user) res.json({ success: false, message: \"Authentication Failed. Invalid email.\" });else {\n        //if everything went good, check password with bcrypt method defined in UserSchema\n        user.comparePassword(password, function (err, isMatch) {\n          if (err) throw err;\n          if (!isMatch) res.json({ success: false, message: \"Authentication Failed. Incorrect email or password.\" });else {\n            var payload = { user_id: user._id };\n            var token = _jsonwebtoken2.default.sign(payload, app.get('secret'), {\n              expiresIn: 60 * 1440 * 30 * 3 //expires in 90 days\n            });\n\n            res.json({\n              success: true,\n              message: 'Token Granted.',\n              token: token\n            });\n          }\n        });\n      }\n    });\n  });\n\n  router.route('/register')\n\n  //Create a new User\n  .post(function (req, res) {\n    console.log(req.body.values);\n    var _req$body$values = req.body.values,\n        email = _req$body$values.email,\n        password = _req$body$values.password;\n\n    var duplicate = false;\n    _UserSchema2.default.findOne({ email: email.toLowerCase() }, function () {\n      duplicate = true;\n    });\n    if (!duplicate) {\n      var newUser = new _UserSchema2.default({ email: email, password: password, created_at: Date.now() });\n      newUser.save(function (err) {\n        console.log('pomcer');\n        if (err) {\n          console.log(err);\n          name: String, res.send({ success: false, message: 'Try again. Error Occurred.' });\n        } else {\n          console.log('New user has been created.');\n          res.send({ success: true });\n        }\n      });\n    }\n  });\n};\n\n//# sourceURL=webpack:///./routes/auth_routes.js?");

/***/ }),

/***/ "./routes/pics_routes.js":
/*!*******************************!*\
  !*** ./routes/pics_routes.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar User = __webpack_require__(/*! ../Schemas/UserSchema */ \"./Schemas/UserSchema.js\");\n\nmodule.exports = function (router) {\n  router.route('/pics').put(function (req, res) {\n    User.findById(req.decoded.user_id, function (err, user) {\n      if (err) res.send(err);\n      if (user.albums.length > 0) {\n        user.albums.findOne({ name: req.body.albumName }, function (err, album) {\n          var path = album.methods.configureServerPath(req.body.albumData);\n          album.push({ path: path, created_at: Date.now() });\n        });\n      }\n      user.save(function (err) {\n        if (err) res.send(err);\n        res.json({ message: 'User updated' });\n      });\n    });\n  });\n};\n\n//# sourceURL=webpack:///./routes/pics_routes.js?");

/***/ }),

/***/ "./routes/user_routes.js":
/*!*******************************!*\
  !*** ./routes/user_routes.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar _UserSchema = __webpack_require__(/*! ../Schemas/UserSchema */ \"./Schemas/UserSchema.js\");\n\nvar _UserSchema2 = _interopRequireDefault(_UserSchema);\n\nvar _AlbumSchema = __webpack_require__(/*! ../Schemas/AlbumSchema */ \"./Schemas/AlbumSchema.js\");\n\nvar _AlbumSchema2 = _interopRequireDefault(_AlbumSchema);\n\nvar _axios = __webpack_require__(/*! axios */ \"axios\");\n\nvar _axios2 = _interopRequireDefault(_axios);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nvar _require = __webpack_require__(/*! ../serverConfig */ \"./serverConfig.js\"),\n    ROOT_URL = _require.ROOT_URL;\n\n/*\n  The req.decoded.user_id is the decrypted user_id that we unecrypt in index.js\n  if is original encoded after a user authenticates themselves with their username\n  and password -> this encryption happens in auth.routes\n\n  short version  -> was using req.params.user_id, now uses req.decoded.user_id\n*/\n\nmodule.exports = function (router) {\n  //Intiate Album handlers for User then pass off to Album routes\n  router.route('/users/albums/')\n  //Create an album\n  .post(function (req, res) {\n    var user_id = req.decoded.user_id;\n\n    _UserSchema2.default.findById(user_id, function (err, user) {\n      if (err) res.send(err);\n      var _req$body = req.body,\n          name = _req$body.name,\n          capacity = _req$body.capacity;\n\n      _axios2.default.post(ROOT_URL + '/api/albums', {\n        name: name,\n        capacity: capacity,\n        user_id: user_id\n      }).then(function (axiosRes) {\n        //Gets the newly created AlbumSchema's id\n        user.albums.push(axiosRes.data);\n        user.save(function (err) {\n          if (err) res.send(err);\n          res.send('User updated');\n        });\n      }).catch(function (err) {\n        console.log(err);\n        res.send(500);\n      });\n    });\n    // res.send('ok')\n  })\n  //Get album from user, body must have index of album\n  .get(function (req, res) {\n    _UserSchema2.default.findById(req.decoded.user_id, function (err, user) {\n      if (err) res.send(err);\n      var albIdx = req.body.albIdx;\n\n      _axios2.default.get(ROOT_URL + '/albums/' + user.album[albIdx]).then(function (axiosRes) {\n        //gets a single album's data\n        res.send(axiosRes.data);\n      }).catch(function (err) {\n        console.log(err);\n        res.send(500);\n      });\n    });\n  })\n  //delete album from user\n  .delete(function (req, res) {\n    _UserSchema2.default.findById(req.decoded.user_id, function (err, user) {\n      if (err) res.send(err);\n      var albIdx = req.body.albIdx;\n\n      _AlbumSchema2.default.remove({ _id: user.album[albIdx] }, function (err, user) {\n        if (err) res.send(err);else {\n          user.albums.splice(albIdx, 1);\n          user.save(function (err) {\n            if (err) res.send(err);else {\n              res.json({ success: true });\n            }\n          });\n        };\n      });\n    });\n  });\n\n  //Basic User Stuff\n  router.route('/users')\n  //Get all Users\n  .get(function (req, res) {\n    _UserSchema2.default.find(function (err, users) {\n      if (err) res.send(err);\n      res.json(users);\n    });\n  });\n\n  router.route('/user/')\n  //Get single User\n  .get(function (req, res) {\n    _UserSchema2.default.findById(req.decoded.user_id, function (err, user) {\n      if (err) res.send(err);\n      res.send(user);\n    });\n  })\n  //Update basic user info such as email, password, etc.\n  .put(function (req, res) {\n    _UserSchema2.default.findById(req.decoded.user_id, function (err, user) {\n      if (err) res.send(err);else {\n        /* Update generic user data here */\n\n        user.save(function (err) {\n          if (err) res.send(err);\n          res.json({ message: 'User updated' });\n        });\n      }\n    });\n  })\n  //Delete a single user\n  .delete(function (req, res) {\n    _UserSchema2.default.remove({ _id: req.decoded.user_id }, function (err, user) {\n      if (err) res.send(err);else res.json({ success: true });\n    });\n  });\n};\n\n//# sourceURL=webpack:///./routes/user_routes.js?");

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

/***/ "cors":
/*!***********************!*\
  !*** external "cors" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"cors\");\n\n//# sourceURL=webpack:///external_%22cors%22?");

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

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"fs\");\n\n//# sourceURL=webpack:///external_%22fs%22?");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"http\");\n\n//# sourceURL=webpack:///external_%22http%22?");

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"https\");\n\n//# sourceURL=webpack:///external_%22https%22?");

/***/ }),

/***/ "jsonwebtoken":
/*!*******************************!*\
  !*** external "jsonwebtoken" ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"jsonwebtoken\");\n\n//# sourceURL=webpack:///external_%22jsonwebtoken%22?");

/***/ }),

/***/ "mongoose":
/*!***************************!*\
  !*** external "mongoose" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"mongoose\");\n\n//# sourceURL=webpack:///external_%22mongoose%22?");

/***/ }),

/***/ "morgan":
/*!*************************!*\
  !*** external "morgan" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"morgan\");\n\n//# sourceURL=webpack:///external_%22morgan%22?");

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