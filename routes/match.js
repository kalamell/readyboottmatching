const express = require('express');
const router = express.Router();
const path = require('path');

const Users = require('../models/users');
const Provinces = require('../models/provinces');


const { isAuth } = require('../helpers/auth');

router.get('/', isAuth, async function(req,res){
    const user = req.session.passport.user;
    const data  = await Users.findOne({facebookid: user.id});

    let interest  = data.interest;
    let range_min = data.range_min;
    let range_max = data.range_max;

    Users.find({
        interest: interest,
        age: {
            $gte: range_min ,
            $lte: range_max,
        }
    }).exec(function(err, users) {
        res.render('match', {
            users
        });
    })

});

module.exports = router;