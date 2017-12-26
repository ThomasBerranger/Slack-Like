var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var isAuth = require('../tools/auth-tools').isAuth;


/* GET users listing. */
router.get('/account', isAuth,  function(req, res, next) {
  res.render('users/account', {user: req.user});
});



module.exports = router;
