var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    username: String,
    password: String,
    email: String,
    facebook : {
        id : String,
        token : String,
    },
    twitter : {
        id : String,
        token : String,
    },
    google : {
        id : String,
        token : String,
    },
    role: Boolean,
    mute: Boolean
});

var User = mongoose.model('User', UserSchema);

module.exports = User;