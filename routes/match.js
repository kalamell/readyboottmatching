const express = require('express');
const router = express.Router();
const path = require('path');


const { isAuth } = require('../helpers/auth');

router.get('/', isAuth, function(req,res){
    res.render('match');
    
});

module.exports = router;