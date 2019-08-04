const express = require('express');
const router = express.Router();
const path = require('path');

var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;

router.get('/', (req, res) => {
    res.render('login');
})

router.get('/login', (req, res) => {
    if (req.user) {
        req.session.id = req.user.id
    }
    res.redirect('/user');
})

module.exports = router;