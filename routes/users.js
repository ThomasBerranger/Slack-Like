var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var isAuth = require('../tools/auth-tools').isAuth;
var User = mongoose.model('User');

// display a user
router.get('/account', isAuth,  function(req, res, next) {
  res.render('users/account', {user: req.user});
});


// delete a user
router.get("/delete/:id",isAuth, function(req, res) {
  User.findByIdAndRemove(req.params.id, function(err, item){
      if(err)
          return res.send("Error ! ");
      res.redirect('/blog');
  });
});


// edit a user
router.get("/edit/:id",isAuth, function(req, res) {
  User.findById(req.params.id, function(err, item){
      if(err)
          return res.send("Error ! ");
      item.role = "Super Admin"
      item.save(function() {
        
      })
      res.redirect('/users/account');
  });
});


module.exports = router;
