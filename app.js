var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var methodOverride = require('method-override');
var expressSession = require('express-session');

var User = require('./models/user');
var Post = require('./models/post');

var index = require('./routes/index');
var users = require('./routes/users');
var auth = require('./routes/auth/auth');
var blog = require('./routes/blog');

var app = express();

var server = require('http').createServer(app);  
var io = require('socket.io')(server);


mongoose.Promise = global.Promise;

let database = mongoose.connect('mongodb://localhost/slack-like', {
    useMongoClient: true,
    socketTimeoutMS: 0,
    keepAlive: true,
    reconnectTries: 30
});

database.then(function (db) {
    console.log('DataBase : Ready to work !');
});

//- Method override
app.use(methodOverride('_method'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(expressSession({ secret : 'MyS3cr3tW0rd!:o' }));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done){
  done(null, user._id);
});
passport.deserializeUser(function(id, done){
  User.findById(id, function(err, user){
    done(err, user);
  });
});


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', index);
app.use('/users', users);
app.use('/auth', auth);
app.use('/blog', blog);


app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});


io.on('connection', function(client) {  
  console.log('Client connected...');
  /* Bloqué :'( */
});


module.exports = app;
