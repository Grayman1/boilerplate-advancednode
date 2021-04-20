

const passport = require('passport')
const ObjectID = require('mongodb').ObjectID
const mongo = require('mongodb').MongoClient
const LocalStrategy = require('passport-local')
const bodyParser = require('body-parser')
const BCrypt = require('bcrypt')

module.exports = function (app, myDataBase) {
  console.log('Authentication files loaded')
// Serialization and deserialization here...
  // Save User ID to a cookie
passport.serializeUser((user, done) => {
  done(null, user._id);
});

// Retrieve User details from cookie
passport.deserializeUser((id, done) => {
  // myDataBase.collection("users")
  myDataBase.findOne({ _id: new ObjectID(id) }, (err, doc) => {
    done(null, doc);
  });
})

// Move to route.js
passport.use(new LocalStrategy(
  (username, password, done) => {
    myDataBase.findOne({ username: username },   function (err, user) {
      console.log('User '+ username +' attempted to log in.');
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      // Challenge #12 hash PW authentication
//        if (password !== user.password)
        if (!BCrypt.compareSync(password, user.password)) { return done(null, false); }
      return done(null, user);
    });
  }
));




}
/*
require('dotenv').config()
const express = require('express');
const myDB = require('./connection')

const fccTesting = require('./freeCodeCamp/fcctesting.js');

const session = require('express-session')
const passport = require('passport')
const ObjectID = require('mongodb').ObjectID
const mongo = require('mongodb').MongoClient
// For Challenge #6
const LocalStrategy = require('passport-local')
const bodyParser = require('body-parser')
// Install bcrypt for password hashing
const BCrypt = require('bcrypt')

const app = express();
const pug = require('pug');

*/
