const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users');
const multer = require('multer');

const Users = require('../models/users');
const Provinces = require('../models/provinces');
const path = require('path');
const fs = require('fs');

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

router.get('/edit', isAuth, async (req, res) => {

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
   
});


router.get('/update', isAuth, (req, res) => { 
    res.redirect('/user');
})

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/upload')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});
const upload = multer({ storage: storage });
router.post('/update', [isAuth, upload.single('file')], async (req, res) => {
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

   if (req.file != null) {
    await Users.findOneAndUpdate({facebookid: user.id}, {
       'profile_url': process.env.APP_URL + '/upload/' + req.file.filename
     });
   }
   res.redirect('/match');
   
})

router.get('/shared', isAuth, async (req, res) => {
    const user = req.session.passport.user;
    const data  =  await Users.findOne({facebookid: user.id});
    console.log(data);
    res.render('share', {
        data
    });
})

router.post('/doshare', isAuth, (req, res) => {
    const user = req.session.passport.user;
    Users.updateOne({facebookid: user.id}, { $inc: { sp: 1}}, function(err, resp) {
    });
})

module.exports = router;