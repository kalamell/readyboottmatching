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
        /*
        sex: interest,
        age: {
            $gte: range_min ,
            $lte: range_max,
        }*/
    }).exec(function(err, users) {
        res.render('match', {
            users
        });
    })

});

router.get('/result/:id/:type', isAuth, async (req, res) => {
    let { id, type }=req.params;
    const user = req.session.passport.user;

    const me  = await Users.findOne({facebookid: user.id});
    const match = await Users.findOne({facebookid: id});
    if (type == 'y') {
        res.render('match/y', {
            me, 
            match
        })
    } 

    if (type == 'sp') {

    }
})

router.post('/matching', async (req, res) => { 
    const user = req.session.passport.user;
    let { id, type } = req.body;
    let matchid = id.replace("#", "");

    if (type == 'sp') {

    } else { 
        if (type =='y') {
            Users.findOne({_id: user.id, "matches.match" : matchid})
            .populate('match')
            .populate('matches.match', 'name')
            .exec(function(error, data) {
                if (error) {
                    res.send('error');
                } else {
                    if (data == null) {
                        Users.findByIdAndUpdate(user.id,
                            { "$push": { "matches":  {
                                "match": matchid, 
                                "type": type }} },
                            { "new": true, "upsert": true },
                            function (err, managerparent) {
                                if (err) throw err;
                                //console.log(managerparent);
                            }
                        );

                    } 
                }

                if (user.id != matchid) {
                    Users.findOne({_id: user.id, "othermatches.match" : matchid})
                    .populate('match')
                    .populate('othermatches.match', '_id fullname')
                    .exec(function(error, _data) {
                        if (_data != null) {
                            _data.othermatches.forEach(function(e) {
                                if (e.type == 'y') {
                                    res.json({
                                        type: e.type, 
                                        id: matchid,
                                    });
                                }
                            })
                        } else { 
                            res.json({
                                'error': 'no data',
                            })
                        }
                        /*if (error) {
                            res.status(500);
                            res.json('error', { error: error });
                        }
                        _data.othermatches.forEach(function(e) {
                            if (e.type == 'y') {
                                res.json({
                                    type: e.type, 
                                    id: matchid,
                                });
                            }
                        })*/ 

                        res.json(_data);
                    
                    });
                }
            });
        }

    }
   
})

module.exports = router;