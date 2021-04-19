'use strict';
// require('dotenv').config();
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

const app = express();
const pug = require('pug');


app.set('view engine', 'pug')
//app.set('views', './views/pug')

const PORT = process.env.PORT || 3000;

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use(passport.initialize())
app.use(passport.session())

// Challenge #4 Serialization of a User Object
//const ObjectID = require('mongodb').ObjectID;



// Challenge #5  Implement the Serialization of a Passport User

myDB(async client => {
  const myDataBase = await client.db('database').collection('users');
  console.log("Sucessful DB Connection")
  
  // Be sure to change the title
  app.route("/").get((req, res) => {
      res.render('pug', {
      title: "Connected to Database",
      message: 'Please login',
      showLogin: true});
      
  });


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
  // CHALLENGES #7 CODE MDIFICATIONS -- HOW TO USE PASSPORT STRATEGES
  app.route('/login').post(passport.authenticate('local', {failureRedirect: '/' }),
      (req, res) => {
        res.redirect("/profile")
      }
    );
/*
  app
    .route('/profile')
    .get(ensureAuthenticated, (req,res) => {
        res.render(process.cwd() + '/views/pug/profile');
    }); 
*/
  function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/');
    };

    // CHALLENGE SOLUTION CODE

  passport.use(new LocalStrategy(
    (username, password, done) => {
      myDataBase.findOne({ username: username },   function (err, user) {
        console.log('User '+ username +' attempted to log in.');
        if (err) { return done(err); }
        if (!user) { return done(null, false); }
        if (password !== user.password) { return done(null, false); }
        return done(null, user);
      });
    }
  ));


  app
    .route('/profile')
    .get(ensureAuthenticated, (req,res) => {
      res.render(process.cwd() + '/views/pug/profile')    
    .get('/profile', (req, res) => {
      res.render("/profile")
    })
    })

}).catch(e => {
  console.log("Unsucessful DB connection");
  app.route('/').get((req, res) => {
    res.render('pug', { title: e, message: 'Unable to login' });
  });
});

fccTesting(app); //For FCC testing purposes 
app.use('/public', express.static(process.cwd() + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.listen out here..
app.listen(PORT, () => {
      console.log('Listening on port ' + PORT);
    });


  // CHALLENGE #6 -- AUTHENTICATION STRATEGIES

  // EXAMPLE CODE
/*
  let findUseDocument = new LocalStrategy((username, password, done) => {
    db.collection('users').findOne(
      {username: username},
      {err, user} => {
        if (err) { return done(err); }
        else if (!user) { return done(null, false); }
        else if (password !== user.password)   { return done(null, false); }
        return done(null, user);
      }
    )
  })
*/

/*
  // CHALLENGE SOLUTION CODE
let findUseDocument = new LocalStrategy((username, password, done) => {
    db.collection('users').findOne(
      {username: username},
      {err, user} => {
        console.log("User " + username + ' attempted to log in.');

    if (err) { return done(err); }
    if (!user) { return done(null, false); }
    if (password !== user.password)   { return done(null, false); }
    return done(null, user);
      }
    )
  })
  passport.use(findUserDocument)
*/