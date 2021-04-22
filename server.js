'use strict';
require('dotenv').config()
const express = require('express');
const myDB = require('./connection')
const fccTesting = require('./freeCodeCamp/fcctesting.js');
const session = require('express-session')
const passport = require('passport')
const routes = require('./routes.js');
const auth = require('./auth.js');

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
// Add for Challenge #20
passportSocketIo = require('passport.socketio');
MongoStore = require('connect-mongo')(session);
cookieParser = require('cookie-parser');
const  URI = process.env.MONGO_URI;
const store = new MongoStore({url: URI});

//const app = express();
const pug = require('pug');

app.set('view engine', 'pug')

const PORT = process.env.PORT || 3000;

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use(passport.initialize())
app.use(passport.session())

io.use(
  passportSocketIo.authorize({
    cookieParser: cookieParser,
    key: 'express.sid',
    secret: process.env.SESSION_SECRET,
    store: store,
    success: onAuthorizeSuccess,
    fail: onAuthorizeFail
  })
);

myDB(async client => {
  const myDataBase = await client.db('MyFourthFCCdb_4_0').collection('users');
  console.log("Sucessful DB Connection");
  routes(app, myDataBase);
  auth(app, myDataBase);

  let currentUsers = 0;
  io.on('connection', socket => {
    currentUsers += 1;
    io.emit('user count', currentUsers);
    console.log('A user has connected');

// Challenge #19 -- Add code to disconnect user
    socket.on('disconnect', () => {
    currentUsers -= 1;
    io.emit('user count', currentUsers);
    console.log('A user has disconnected');
  });
  
});

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

function onAuthorizeSuccess(data, accept) {
  console.log('successful connection to socket.io');

  accept(null, true);
}

function onAuthorizeFail(data, message, error, accept) {
  if (error) throw new Error(message);
  console.log('failed connection to socket.io:', message);
  accept(null, false);
}

// app.listen out here..
http.listen(PORT, () => {
      console.log('Listening on port ' + PORT);
});
