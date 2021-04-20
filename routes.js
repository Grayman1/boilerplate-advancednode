require('dotenv').config()
const express = require('express');
const myDB = require('./connection')
const passport = require('passport')
const ObjectID = require('mongodb').ObjectID
const mongo = require('mongodb').MongoClient
const BCrypt = require('bcrypt')
const pug = require('pug');

module.exports = function (app, myDataBase) {
  console.log('Routes files loaded')
  // Home Directory
  app.route("/").get((req, res) => {
      res.render('pug', {
      title: "Connected to Database",
      message: 'Please login',
      showLogin: true,
      showRegistration: true,
    // Add to implement social authorization
      showSocialAuth: true});
      
  });

  app.route('/login').post(passport.authenticate('local', {failureRedirect: '/' }),
      (req, res) => {
        res.redirect("/profile")
      }
    );

  app
    .route('/profile')
    .get(ensureAuthenticated, (req,res) => {
      res.render(process.cwd() + '/views/pug/profile', {username: req.user.username})  
  })

  function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/');
    };

    app.route('/register')
  .post((req, res, next) => {
    // Challenge #12 - Hashing password
    const hash = BCrypt.hashSync(req.body.password, 12);
    myDataBase.findOne({ username: req.body.username }, function(err, user) {
      if (err) {
        next(err);
      } else if (user) {
        res.redirect('/');
      } else {
        myDataBase.insertOne({
          username: req.body.username,
          // Challenge #12 change req.body password to use 'hash'
          password: hash
        },
          (err, doc) => {
            if (err) {
              res.redirect('/');
            } else {
              // The inserted document is held within
              // the ops property of the doc
              next(null, doc.ops[0]);
            }
          }
        )
      }
    })
  },
    passport.authenticate('local', { failureRedirect: '/' }),
    (req, res, next) => {
      res.redirect('/profile');
    }
  );
  // Add for challnge #14
  app.route('/auth/github')
    .get(passport.authenticate('github'));

  app.route('/auth/github/callback')
    .get(passport.authenticate('github', {failureRedirect:'/'}), (req, res) => {
      res.redirect('/profile');
    })

  app.route('/logout')
  .get((req, res) => {
    req.logout();
    res.redirect('/');
  });

  app.use((req, res, next) => {
  res.status(404)
    .type('text')
    .send('Not Found');
  });

  app.get('/profile', (req, res) => {
      res.render("/profile")
    })

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
