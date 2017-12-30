var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var isAuth = require('../tools/auth-tools').isAuth;
var Post = mongoose.model('Post');


// List posts
router.get('/', isAuth, function(req, res) {
    Post.find({}).then(items => {
        res.render('blog/list', { posts : items, user: req.user });
    }).catch(err => {
        console.log(err);
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
    Post.findById(req.params.id).then(item => {
        res.render('blog/view', { blog: item });
    }).catch(err => {
        console.log(err);
    });
});


router.get('/permalink/:permalink', function(req, res){
    Post.findOne({ permalink : req.params.permalink }).populate('user').exec(function(err, item){
        res.render('blog/view', {blog: item, user: req.user});
    });
});


// Remove a room
router.get("/delete/:id",isAuth, function(req, res) {
    Post.findByIdAndRemove(req.params.id, function(err, item){
        if(err)
            return res.send("Error ! ");
        res.redirect('/blog');
    });
});




// Create a comment
router.post("/post_comment/:id",isAuth, function(req, res){
    Post.findById(req.params.id).then(item => {
        req.body.author = req.user.username;
        req.body.date = new Date();
        req.body.like = 1
        req.body.unlike = 0
        item.comments.push(req.body);

        item.save().then(result => {
            res.redirect("/blog/permalink/" + result.permalink);
        }).catch(err => {
            console.log(err);
        });

    }).catch(err => {
        console.log(err);
        return res.send(err);
    });
});


// Remove a comment
router.delete("/delete/post_comment", isAuth, function(req, res) {
    Post.findOne({ _id : req.body.id_post }).then(post => {
        for (let i = 0; i < post.comments.length; i++) {
            if (post.comments[i]._id == req.body.id_comment) {
                post.comments.splice(i, 1);
            }
        }
        post.save().then(result => {
            console.log(result);
            res.redirect('back');
        }).catch(err => {
            console.log(err);
        });
    }).catch(err => {
        console.log(err);
    })
});


module.exports = router;
