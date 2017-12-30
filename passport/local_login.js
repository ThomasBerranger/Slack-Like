// var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bCrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');
var User = mongoose.model('User');

var isValidPassword = function(user, password) {
    return bCrypt.compareSync(password, user.password);
}

var createHash = function(password){
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}

module.exports = function(passport) {

    passport.use('login', new LocalStrategy({
        passReqToCallback: true
    }, function(req, username, password, done){
        loginUser = function() {
            /*
             *  @NOTE
             *  Version 4 de Mongoose on utilise plus de callback
             *  la fonction est une promesse, du coup on récupere
             *  le résultat avec un .then()
             */
            User.findOne({ 'username' : username }).then(user => {
                if(!user) {
                    console.log("User not found with username" + username);
                    return done(null, false);
                } else if(!isValidPassword(user, password)) {
                    console.log("Invalid password");
                    return done(null, false);
                } else {
                    return done(null, user);
                }
            }).catch(err => {
                return done(err);
            });
        }
        process.nextTick(loginUser);
    }));

}