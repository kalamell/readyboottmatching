const path = require('path');
const Users = require('../models/users');

exports.index = function (req, res) {
    res.sendFile(path.resolve('views/user.html'));
};

exports.create = function (req, res) {
    var newUser = new Users(req.body);
    newUser.save(function (err) {
            if(err) {
            res.status(400).send('Unable to save shark to database');
        } else {
            res.redirect('/users');
        }
  });
};


