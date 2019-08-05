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
        sex: interest,
        age: {
            $gte: range_min ,
            $lte: range_max,
        }
    }).exec(function(err, data_users) {
        let users = [];
        data_users.forEach(function(e, v) {
            if (e._id != user.id) {
                users.push({
                    'facebookid': e.facebookid,
                    'profile_url': e.profile_url,
                    'fullname': e.fullname,
                    'age': e.age,
                    'province': e.province,
                })
            }
        });
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
                        } else { 
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
                                    console.log('data >>> ', e.match);
                                    if (e.type == 'sp' && e.match._id == matchid) {
                                        res.status(200).json({
                                            type:e.type,
                                            id: e.match._id
                                        });
                                        return false;
                                    }
                                })
                                
                            } else { 
                                Users.findByIdAndUpdate(matchid,
                                    { "$push": { "othermatches":  {
                                        "match": user.id, 
                                        "type": type }} },
                                    { "new": true, "upsert": true },
                                    function (err, managerparent) {
                                        if (err) throw err;
                                        //console.log(managerparent);
                                    }
                                );
                                
                                res.status(500).json({
                                    'error': 'no data',
                                })
                            }
                        });
                    } else { 
                        res.status(200).json({
                            'error': 'erro',
                        })
                    }
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
                        /*
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
                        } else { 
                            Users.findByIdAndUpdate(user.id, 
                            {
                                $set: { 
                                    matches: [{ 
                                        match: matchid, 
                                        type: type 
                                    }] 
                                }
                            }, 
                            { new: true },
                            function(err, user) {
                            });
                        }
                        */
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

                    if (user.id != matchid) {
                        Users.findOne({_id: user.id, "othermatches.match" : matchid})
                        .populate('match')
                        .populate('othermatches.match', '_id fullname')
                        .exec(function(error, _data) {
                            if (_data != null) {
                                _data.othermatches.forEach(function(e) {
                                    console.log('data >>> ', e.match);
                                    if (e.type == 'y' && e.match._id == matchid) {
                                        res.status(200).json({
                                            type:e.type,
                                            id: e.match._id
                                        });
                                        return false;
                                    }
                                })
                                
                            } else { 
                                Users.findByIdAndUpdate(matchid,
                                    { "$push": { "othermatches":  {
                                        "match": user.id, 
                                        "type": type }} },
                                    { "new": true, "upsert": true },
                                    function (err, managerparent) {
                                        if (err) throw err;
                                        //console.log(managerparent);
                                    }
                                );
                                
                                res.status(500).json({
                                    'error': 'no data',
                                })
                            }
                        });
                    } else { 
                        res.status(200).json({
                            'error': 'erro',
                        })
                    }
                });
            }

        }
    } catch(err) {
        console.log(err);
    }
   
})

module.exports = router;