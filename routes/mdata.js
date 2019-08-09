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

router.get('/user/match/:id', async (req, res) => {
    let data_user = [];
    const me  =  await Users.findOne({facebookid: req.params.id});

    await Users.findOne({_id: req.params.id})
    .exec(function(error, data) {
        data.matches.forEach(function(d) {
            Users.findOne({_id: d.match}).exec(function(e, _d) {
                _d.matches.forEach(function(__d) {
                    console.log('match :', __d.match);
                    if (__d.match == req.params.id) {
                        data_user.push({
                            'name': _d.fullname,
                            'type': __d.type,
                            'profile_url': _d.profile_url,
                            'profile_url_me': data.profile_url
                        });
                    }
                })

            })
        });
        
        res.render('backend/usermatch', {
            layout: 'backend',
            data_user,
            me
        });
    });
})



module.exports = router;

