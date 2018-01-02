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

    passport.use('signup', new LocalStrategy({
        passReqToCallback: true
    }, function(req,username, password, done) {
        findOrCreateUser = function() {
            /*
             *  @NOTE
             *  Version 4 de Mongoose on utilise plus de callback
             *  la fonction est une promesse, du coup on récupere
             *  le résultat avec un .then()
             */
            User.findOne({ 'username' : username }).then(user => {
                if (user) {
                    console.log("User already exists");
                    return done(null, false);
                } else {
                    let nUser = new User();

                    nUser.username = username;
                    nUser.password = createHash(password);
                    nUser.email = req.body.email;
                    nUser.mute = false;
                    nUser.role = true;

                    nUser.save().then(result => {
                        console.log('User created ! Yay !');
                        return done(null, result);
                    }).catch(err => {
                        console.log("Oups, something went wrong");
                        throw err;
                    });
                }
            }).catch(err => {
                console.log('Error in sign up ' + err);
                return done(err)
            });
        }
        process.nextTick(findOrCreateUser);
    }));

};