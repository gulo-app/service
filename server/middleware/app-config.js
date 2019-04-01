const express       =   require('express');
const bodyParser    =   require('body-parser');
const uuid          =   require('uuid/v4');
const session       =   require('express-session')
const SessionStore  =   require('session-file-store')(session);
const path          =   require('path');
const passport      =   require('passport');
const initPassport  =   require('./passport');

initPassport();

module.exports = (app) => {
  app.use(express.static("."));
  app.use(bodyParser.json());         // to support JSON-encoded bodies
  app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
  }));
  app.use(bodyParser.raw());

  app.use(function(req, res, next) { //allow CORS origins
    var allowedOrigins = ['http://localhost', 'http://localhost:*', 'http://localhost:3000', 'https://gulo-client.herokuapp.com/login', 'http://gulo-client.herokuapp.com/login'];
    var origin = req.headers.origin;
    if(allowedOrigins.indexOf(origin) > -1){
         res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Credentials', true);
    next();
  });

  app.use(session({ //create session
    genid: (req) => {
      return uuid() // use UUIDs for session IDs
    },
    store: new SessionStore({path: path.join(__dirname, './sessions'), logFn: function(){} }),
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: false
  }))
  app.use(passport.initialize());
  app.use(passport.session());
};
