var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = mongoose.model('User');

var PostSchema = new Schema({
    title : String,
    content : String,
    permalink : String,
    author : String,
    date : Date,
    comments: [{
        author : String,
        permalink : String,
        message : String,
        date : String,
        like : Number,
        unlike : Number
    }],

    user : { type: mongoose.Schema.Types.ObjectId, ref: "User"}
});

var Post = mongoose.model('Post', PostSchema);