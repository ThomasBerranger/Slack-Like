var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var isAuth = require('../tools/auth-tools').isAuth;
var User = mongoose.model('User');

// display a user
router.get('/account', isAuth,  function(req, res, next) {
  res.render('users/account', {user: req.user});
});


// update a user
router.post('/account', isAuth,  function(req, res, next) {
    User.findById(req.user, function(err, item){
        if(err)
            return res.send("Error ! ");

        item.username = req.body.username
        item.email = req.body.email

        item.save(function() {})
    });
    res.redirect('/users/account');
  });


// delete a user
router.get("/delete/:id",isAuth, function(req, res) {
  User.findByIdAndRemove(req.params.id, function(err, item){
      if(err)
          return res.send("Error ! ");
      res.redirect('/blog');
  });
});


// change a user role
router.get("/edit_role/:id",isAuth, function(req, res) {
  User.findById(req.params.id, function(err, item){
      if(err)
          return res.send("Error ! ");
      item.role = !item.role
      item.save(function() {})
      res.redirect('/users/account');
  });
});


// list of users
router.get('/list', isAuth,  function(req, res, next) {
    User.find({}).then(items => {
        res.render('users/list', { users : items });
    }).catch(err => {
        console.log(err);
    });
  });

  


module.exports = router;
