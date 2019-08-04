const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users');


router.get('/', function(req, res){
    usersController.index(req,res);
});

router.post('/addshark', function(req, res) {
    usersController.create(req,res);
});

module.exports = router;