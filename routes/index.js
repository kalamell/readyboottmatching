const express = require('express');
const router = express.Router();
const path = require('path');


const { isAuth, isLogin } = require('../helpers/auth');



router.get('/', function(req,res){
  res.render('index');
});

module.exports = router;