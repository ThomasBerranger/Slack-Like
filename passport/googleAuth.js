var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var User = require('../models/user');
var config = require('../config/auth');


module.exports =  function(passport) {
    passport.use(new GoogleStrategy({
        clientID : config.googleAuth.clientID,
        clientSecret: config.googleAuth.clientSecret,
        callbackURL: config.googleAuth.callbackURL,
        profileFields: ['id', 'emails', 'name']
      },
      function(token, refreshToken, profile, done) {
          loginOrSignUp = function() {
              User.findOne({ 'google.id' : profile.id }, function(err, user){
                  if(err)
                      return done(err);
                  
                      if(user) {
                          return done(null, user);
                      } else {
                          var nUser = new User();
  
                          nUser.google.id = profile.id;
                          nUser.google.token =token;
                          nUser.email = profile.emails[0].value;
                          nUser.username = profile.emails[0].value;
                          nUser.mute = false;
                          nUser.role = true;
  
                          nUser.save(function(err) {
                              if(err)
                                  throw err;
  
                              return done(null, nUser);
                          })
                      }
              })
          }
          process.nextTick(loginOrSignUp);
      }))
}