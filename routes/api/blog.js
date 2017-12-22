var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var Post = mongoose.model('Post');

// List blog posts
router.get('/', function(req, res) {
    Post.find({}, function(err, items){
        res.json(items);
    });
});

router.post('/create', function(req, res) {
    var post = req.body;
    post.date = new Date();

    var pl = req.body.title
        .toLowerCase()
        .replace(/[^a-zA-Z ]/g, "")
        .replace(/\s+/g, '-');

    post.permalink = pl;

    Post.create(post, function(err, item) {
        res.json(
            {
                created : true,
                itemCreated : item
            });
    });
});

// View Post
router.get('/id/:id', function(req, res) {
    Post.findById(req.params.id, function(err, item){
        res.json(item);
    })
});

router.get('/permalink/:permalink', function(req, res){
    Post.findOne({ permalink : req.params.permalink },function(err, item){
        res.json(item);
    });
});


// Remove Post
router.get("/delete/:id", function(req, res) {
    Post.findByIdAndRemove(req.params.id, function(err, item){
        if(err)
            return res.json({ removed : false, error : err});
        res.json({ removed : true });
    });
});

module.exports = router;
