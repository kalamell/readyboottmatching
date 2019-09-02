const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users');

const Users = require('../models/users');
const Provinces = require('../models/provinces');
const path = require('path');
const fs = require('fs');
const xl = require('excel4node');

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

router.get('/export', isAdmin, async (req, res) => {
    
    const wb = new xl.Workbook();
    const ws = wb.addWorksheet('Sheet 1'); 

    ws.cell(1,1).string('ลำดับ'); 
    ws.cell(1,2).string('ชื่อ -  นามสกุล'); 
    ws.cell(1,3).string('Email'); 
    ws.cell(1,4).string('อายุ'); 
    ws.cell(1,5).string('เพศ'); 
    ws.cell(1,6).string('สนใจเพศ'); 
    ws.cell(1,7).string('ช่วงอายุ'); 
    ws.cell(1,8).string('จำนวนแชร์'); 
    ws.cell(1,9).string('Match'); 

    const users = await Users.find({}).sort({_id: 1});
    let i = 2;
    let no = 1;
    
    console.log(users);
    
    users.forEach(function(key, v) {
        ws.cell(i, 1).number(no);
        ws.cell(i, 2).string(key.fullname);
        ws.cell(i, 3).string(key.email);

        let age = key.age + ' ปี';
        ws.cell(i, 4).string(age);

        let sex = '';
        if (key.sex == 'male') { 
            sex = 'ชาย';
        }
        if (key.sex == 'female') { 
            sex = 'หญิง';
        }
        if (key.sex == 'glbt') { 
            sex = 'ไม่ระบุ';
        }


        let interest = '';
        if (key.interest == 'male') { 
            interest = 'ชาย';
        }
        if (key.interest == 'female') { 
            interest = 'หญิง';
        }
        if (key.interest == 'glbt') { 
            interest = 'ไม่ระบุ';
        }


        ws.cell(i, 5).string(sex);
        ws.cell(i, 6).string(interest);
        let range = key.range_min + ' - ' + key.range_max;
        ws.cell(i, 7).string(range);
        ws.cell(i, 8).number(key.shared);

        let match = 0;

        key.matches.forEach(function(_k, _v) {
            key.othermatches.forEach(function(__k, __v) {
                if (_k.match == __k.match) {
                    match++;
                }
            })
        });

        ws.cell(i, 9).number(match);

       
        i++;
        no++;
    })


    

    wb.write('export-ready.xlsx'); 

})

router.get('/user/match/:id', async (req, res) => {
    let data_user = [];
    const me  =  await Users.findOne({facebookid: req.params.id});

    try {
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
                                'sex': _d.sex,
                                'age': _d.age,
                                'email': _d.email,
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
    } catch (err) {
        res.redirect('/');
    }
})



module.exports = router;

