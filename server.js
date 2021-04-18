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
  console.log("Sucessful Connection")
  
  // Be sure to change the title
  app.route("/").get((req, res) => {
      res.render('pug', {title: "Connected to Database", message: 'Please login'})
    });

/*
  // Serialization and deserialization here...
  // Save User ID to a cookie
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  // Retrieve User details from cookie
  passport.deserializeUser((id, done) => {
    myDB.collection("users")
    .findOne({ _id: new ObjectID(id) }, (err, doc) => {
      done(null, doc);
    });
  
  })
  */
}).catch(e => {
  console.log("Unsuccessful Connection")
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


  
