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
    let ready = '';

    if (user.id != '9999') {
        ready = await Users.findOne({facebookid: '9999'});
    }

    Users.find({
        sex: interest,
        age: {
            $gte: range_min ,
            $lte: range_max,
        }
    }).sort({_id: 1}).exec(function(err, data_users) {
        if (data_users.length == 0) {
            //res.redirect('/user');
            //return false;
        }
        let users = [];
        let no = 1;
        data_users.forEach(function(e, v) {
            if (e._id != user.id) {
                users.push({
                    'facebookid': e.facebookid,
                    'profile_url': e.profile_url,
                    'fullname': e.fullname,
                    'age': e.age,
                    'province': e.province,
                });
                if (no == 10 && ready !='') {
                    users.push({
                        'facebookid': ready.facebookid,
                        'profile_url': ready.profile_url,
                        'fullname': ready.fullname,
                        'age': ready.age,
                        'province': ready.province,
                    });
                }
                no++;
            }
        });
        ready = '';
        res.render('match', {
            users,
            ready
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
        res.render('match/sp', {
            me, 
            match
        })
    }
})

router.post('/matching', async (req, res) => { 
    const user = req.session.passport.user;
    let { id, type } = req.body;
    let matchid = id.replace("#", "");
    try {
        if (type == 'sp') {
            const me  = await Users.findOne({facebookid: user.id});
            if (me.sp == 0) {
                res.status(200).json({
                    type: 'sp',
                    coin: 0,
                });
            } else { 
                Users.updateOne({facebookid: user.id}, { $inc: { sp: -1}}, function(err, resp) {
                });

                await Users.findOne({_id: user.id, "matches.match" : matchid})
                .populate('match')
                .populate('matches.match', 'name')
                .exec(function(error, data) {
                    if (error) {
                        res.status(200).json(error);
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

                            Users.findByIdAndUpdate(matchid,
                                { "$push": { "othermatches":  {
                                    "match": user.id, 
                                    "type": type }} },
                                { "new": true, "upsert": true },
                                function (err, managerparent) {
                                    if (err) throw err;
                                    console.log(managerparent);
                                }
                            );
                        }
                    }

                    
                    //Users.findOne({_id: matchid, "matches.match" : user.id})
                    Users.findOne({_id: matchid})
                    .populate('match')
                    .populate('matches.match', '_id type fullname')
                    .exec(function(error, _data) {
                        if (_data != null) {
                            var _find = '';
                            _data.othermatches.forEach(function(e) {
                                console.log('data >>> ', e.type, e.match, e.match._id, user.id);
                                if (e.type == 'sp' && e.match == user.id) {
                                    console.log('fine ok');
                                    _find = 'ok'; 
                                }
                            })
                            if (_find == 'ok') {
                                res.status(200).json({
                                    type: 'sp',
                                    id: matchid,
                                });
                            } else { 
                                res.status(200).json({
                                    'error': 'match no data ' + matchid + ' : ' + user.id,
                                })
                            }
                        } else { 
                            res.status(200).json({
                                'error': 'error no data ' + matchid + ' : ' + user.id,
                            })
                        }
                    });
                });
            }
        } else { 
            if (type =='y') {
                await Users.findOne({_id: user.id, "matches.match" : matchid})
                .populate('match')
                .populate('matches.match', 'name')
                .exec(function(error, data) {
                    if (error) {
                        res.status(200).json(error);
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
                            Users.findByIdAndUpdate(matchid,
                                { "$push": { "othermatches":  {
                                    "match": user.id, 
                                    "type": type }} },
                                { "new": true, "upsert": true },
                                function (err, managerparent) {
                                    if (err) throw err;
                                    console.log(managerparent);
                                }
                            );
                        }
                    }

                    Users.findOne({_id: matchid, "matches.match" : user.id})
                    .populate('match')
                    .populate('matches.match', '_id type fullname')
                    .exec(function(error, _data) {
                        if (_data != null) {
                            var _find = '';
                            _data.matches.forEach(function(e) {
                                if (e.type == 'y' && e.match._id == user.id) {
                                    console.log('fine ok');
                                    _find = 'ok';
                                    
                                }
                            })
                            if (_find == 'ok') {
                                res.status(200).json({
                                    type: 'y',
                                    id: matchid,
                                });
                            } else { 
                                res.status(200).json({
                                    'error': 'no data ' + matchid + ' : ' + user.id,
                                })
                            }
                            
                            
                        } else { 
                            
                            res.status(200).json({
                                'error': 'no data ' + matchid + ' : ' + user.id,
                            })
                        }
                    });
                    
                });
            }

        }
    } catch(err) {
        console.log(err);
    }
   
})

module.exports = router;