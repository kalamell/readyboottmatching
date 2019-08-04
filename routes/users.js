const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users');

const Users = require('../models/users');
const Provinces = require('../models/provinces');


const { isAuth } = require('../helpers/auth');


router.get('/', isAuth, async (req, res) => {

    const user = req.session.passport.user;
    const data  = await Users.findOne({facebookid: user.id});
    const provinces = await Provinces.find({});
    let data_provinces = [];
    provinces.forEach(function(e, v) {
        if (e.province_name == data.province) {
            select = 'selected';
        } else { 
            select = '';
        }

        data_provinces.push({
            province_name: e.province_name,
            select
        });
    })



    res.render('profile', {
        data,
        data_provinces
    });

    console.log(data);
   
});


router.get('/update', isAuth, (req, res) => { 
    res.redirect('/user');
})

router.post('/update', isAuth, async (req, res) => {
    let { sex, interest, province, age, range_min, range_max } = req.body;
    const user = req.session.passport.user;
    await Users.findOneAndUpdate({facebookid: user.id}, {
       sex, 
       interest, 
       province, 
       age,
       range_min,
       range_max
    });
    
    res.redirect('/match');
   
})

module.exports = router;