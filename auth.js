
require('dotenv').config()
const passport = require('passport')
const ObjectID = require('mongodb').ObjectID
const mongo = require('mongodb').MongoClient
const LocalStrategy = require('passport-local')
const bodyParser = require('body-parser')
const BCrypt = require('bcrypt');
// Add for Challenge #15
const GitHubStrategy = require('passport-github').Strategy;

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
  // Add for Challenge #15
  passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: 
  'https://boilerplate-advancednode.grayman1.repl.co/auth/github/callback' /*INSERT CALLBACK URL ENTERED INTO GITHUB HERE*/
  //process.cwd() + '/auth/github/callback'
},
  function(accessToken, refreshToken, profile, cb) {
    console.log(profile);
    //Database logic here with callback containing our user object
    // Challenge #16 code modifications
    myDataBase.findOneAndUpdate(
  { id: profile.id },
  {
      $setOnInsert: {
        id: profile.id,
        name: profile.displayName || 'John Doe',
        photo: profile.photos[0].value || '',
        email: Array.isArray(profile.emails)
          ? profile.emails[0].value
          : 'No public email',
        created_on: new Date(),
        provider: profile.provider || ''
      },
      $set: {
        last_login: new Date()
      },
      $inc: {
        login_count: 1
      }
    },
    { upsert: true, new: true },
    (err, doc) => {
      return cb(null, doc.value);
    }
  );
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
