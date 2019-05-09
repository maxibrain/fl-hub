var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var bodyParser = require('body-parser');
var monk = require('monk');
var passport = require('passport');

var routes = require('./routes/index');
var account = require('./routes/account');
var jobs = require('./routes/jobs');
var jobsUpwork = require('./routes/jobs.upwork');
var jobEval = require('./routes/job-eval');
var auth = require('./routes/auth');
var criterias = require('./routes/criterias');

var app = express();
//localhost:27017/freelance-hub, 
var dbUrl = 'mongodb://maxibrain:Z2PibhDA@ds041563.mongolab.com:41563/freelance-hub';
var db = monk(dbUrl);

// daemons
var Provider = require('./models/provider');
var Daemon = require('./models/daemon');
var Daemons = require('./models/daemons');

app.daemons = new Daemons([
  //new Daemon(db, new Provider(), { count: 20 })
]);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    store: new MongoStore({ url: dbUrl }),
    secret: '59CBC0C6-40C3-4096-B4F0-54F27171CC32', 
    resave: true, 
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next) {
  req.fullUrl = req.protocol + '://' + req.get('host') + req.url;
  req.session = req.session || {};
  req.db = db;
  next();
});

passport.serializeUser(function (user, done) {
    done(null, user._id);
});

passport.deserializeUser(function (id, done) {
    db.get('users').findOne(id, (err, user) => done(err, user));
});
var authMiddleware = function (req, res, next) {
    if (req.user) {
        next();
    } else {
        res.redirect('/login?returnUrl=' + encodeURIComponent(req.originalUrl));
    }

//  if (req.session && req.session['upwork']) {
//    next();
//  } else {
//    res.redirect('/auth/upwork?returnUrl=' + encodeURIComponent(req.originalUrl));
//  }
}

app.use('/', routes);
app.use('/auth', auth);
app.use('/account', authMiddleware, account);
app.use('/jobs', authMiddleware, jobs);
app.use('/jobs/upwork', authMiddleware, jobsUpwork);
app.use('/job-eval', authMiddleware, jobEval);
app.use('/criterias', authMiddleware, criterias);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
      user: req.user
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
    user: req.user
  });
});


module.exports = app;
