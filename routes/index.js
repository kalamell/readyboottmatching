const express = require('express');
const router = express.Router();
const path = require('path');


const { isAuth, isLogin } = require('../helpers/auth');



router.get('/', isLogin, function(req,res){
  res.render('index');
});

router.get('/blahblah', function(req, res) {
  req.session.passport = {
    user: {
      id: 9999
    }
  }
  res.redirect('/user');
})

module.exports = router;