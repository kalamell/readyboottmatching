const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users');

const Users = require('../models/users');
const Provinces = require('../models/provinces');
const path = require('path');
const fs = require('fs');

const { isAdmin } = require('../helpers/auth');


router.get('/login', (req, res) => {
    res.render('backend/login', {
        layout: 'backend',
    })
})

router.post('/login', (req, res) => { 
    let { username, password } = req.body;
    if (username == 'admin' && password == 'P@ssword11') {
        req.session.isadmin = true;
    }
    res.redirect('/mdata');
})
router.get('/', isAdmin, async (req, res) => {
    const users = await Users.find({}).sort({_id: 1});
    res.render('backend/dashboard', {
        layout: 'backend',
        users
    })
});



module.exports = router;
