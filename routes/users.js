const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users');
const multer = require('multer');

const Users = require('../models/users');
const Provinces = require('../models/provinces');
const path = require('path');
const fs = require('fs');

const { isAuth } = require('../helpers/auth');


let MobileDetect = require('mobile-detect');

router.get('/', isAuth, async (req, res) => {

    const user = req.session.passport.user;
    const data  = await Users.findOne({facebookid: user.id});
    const provinces = await Provinces.find({});
    let data_provinces = [];

    var min = 100 * ((data.range_min - 23) / (40 - 23)) + 1;
    var max = 100 * ((data.range_max - 23) / (40 - 23)) - 1;

    min = min.toFixed(0);
    max = max.toFixed(0);

    if (min <= 5) {
        min = 0;
    }

    if (max >= 99) {
        max = 100;
    }


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
        data_provinces,
        min, 
        max
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

    let md = new MobileDetect(req.headers['user-agent']);

    const user = req.session.passport.user;
    const data  =  await Users.findOne({facebookid: user.id});
    const ios = md.os() == 'iOS' ? true : false;
    const android = md.os() == 'AndroidOS' ? true : false;
    console.log(md.os());
    res.render('share', {
        data,
        ios,
        android
    });
})

router.post('/doshare', isAuth, (req, res) => {
    const user = req.session.passport.user;
    Users.updateOne({facebookid: user.id}, { $inc: { sp: 1}}, function(err, resp) {
    });
})


router.get('/matches', isAuth, async (req, res) => {
    const user = req.session.passport.user;
    const me  =  await Users.findOne({facebookid: req.params.id});
    let data_user = [];
    await Users.findOne({_id: req.params.id})
        .exec(function(error, data) {
            data.matches.forEach(function(d) {
                Users.findOne({_id: d.match}).exec(function(e, _d) {
                    _d.matches.forEach(function(__d) {
                        if (__d.match == req.params.id) {
                            data_user.push({
                                'name': _d.fullname,
                                'type': __d.type,
                                'age': _d.age,
                                'sex': _d.sex,
                                'profile_url': _d.profile_url,
                            });
                        }
                    })

                })
            })

            res.render('list-match', {
                me,
                data_user
            });
        });
   
   
                
})
module.exports = router;

