var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var isAuth = require('../tools/auth-tools').isAuth;
var Post = mongoose.model('Post');


// List blog posts
router.get('/', function(req, res) {
    Post.find({}, function(err, items){
        res.render('blog/list', { posts : items });
    });
});


// Create Post
router.get('/create', isAuth, function(req, res){
    res.render('blog/create');
})

router.post('/create', isAuth, function(req, res) {
    var post = req.body;
    post.date = new Date();

    var pl = req.body.title
        .toLowerCase()
        .replace(/[^a-zA-Z ]/g, "")
        .replace(/\s+/g, '-');

    post.permalink = pl;

    post.user = req.user;

    Post.create(post, function(err, item) {
        res.redirect("/blog");
    });
});


// View Post
router.get('/id/:id', function(req, res) {
    Post.findById(req.params.id, function(err, item){
        console.log(item);
        res.render('blog/view', { blog: item });
    })
});


router.get('/permalink/:permalink', function(req, res){
    Post.findOne({ permalink : req.params.permalink }).populate('user').exec(function(err, item){
        res.render('blog/view', {blog: item, user: req.user});
    });
});


// Remove Post
router.get("/delete/:id",isAuth, function(req, res) {
    Post.findByIdAndRemove(req.params.id, function(err, item){
        if(err)
            return res.send("Error ! ");
        res.redirect('/blog');
    });
});


router.post("/post_comment/:id",isAuth, function(req, res){
    Post.findById(req.params.id, function(err, item){
        if(err)
            return res.send(err);
            
            req.body.author = req.user.username;
            req.body.date = new Date();
            req.body.like = 1
            item.comments.push(req.body);

            item.save(function(err, item){
                res.redirect("/blog/permalink/" + item.permalink);
            })
    })
});


module.exports = router;
