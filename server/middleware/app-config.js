const express       =   require('express');
const bodyParser    =   require('body-parser');
const uuid          =   require('uuid/v4');
const session       =   require('express-session')
const SessionStore  =   require('session-file-store')(session);
const path          =   require('path');
const passport      =   require('passport');
const initPassport  =   require('./passport');
const cors          =   require('cors')

initPassport();

module.exports = (app) => {
  // app.use((req,res,next) => {
  //   console.log(`request from: ${req.get('origin')}`);
  //   next();
  // })

  app.use(express.static("."));
  app.use(bodyParser.json());         // to support JSON-encoded bodies
  app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
  }));
  app.use(bodyParser.raw());
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

  const allowedOrigins = [
                          'http://localhost',
                          'http://localhost:3000', 'http://localhost:9400', 'http://localhost:*',
                          'http://localhost://8605', 'https://localhost://8605', 'localhost://8605',
                          'https://gulo-client.herokuapp.com', 'http://gulo-client.herokuapp.com',
                          'https://montv10.net:9500',
                        '*'];
  var corsOptions = {
    origin: function (origin, callback) {
      callback(null,true);
    },
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
    optionsSuccessStatus: 200
  }
  app.use(cors(corsOptions));


  // app.use(function(req, res, next) { //allow CORS origins
  //   console.log("incoming request");
  //   console.log('origin: '  + req.get('origin'));
  //   console.log('host: '    + req.get('host'));
  //   console.log('\n ___________________________\n\n');
  //   var allowedOrigins = [
  //                         'http://localhost',
  //                         'http://localhost:3000',
  //                         'http://localhost://8605', 'https://localhost://8605', 'localhost://8605',
  //                         'https://gulo-client.herokuapp.com', 'http://gulo-client.herokuapp.com',
  //                         'https://montv10.net:9500',
  //                         '*'];
  //   var origin = req.headers.origin;
  //   if(allowedOrigins.indexOf(origin) > -1){
  //        res.setHeader('Access-Control-Allow-Origin', origin);
  //   }
  //   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  //   res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, PATCH, OPTIONS');
  //   res.header('Access-Control-Allow-Credentials', true);
  //   next();
  // });
};
