const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users');

const Users = require('../models/users');


const { isAuth } = require('../helpers/auth');


router.get('/', isAuth, async (req, res) => {

    const user = req.session.passport.user;
    const data  = await Users.findOne({facebookid: user.id});
    res.render('profile', {
        data
    });

    console.log(data);
   
});


router.get('/update', isAuth, (req, res) => { 
    res.redirect('/user');
})

router.post('/update', isAuth, async (req, res) => {
    let { sex, interest, province } = req.body;
    const user = req.session.passport.user;
    await Users.findOneAndUpdate({facebookid: user.id}, {
       sex, 
       interest, 
       province 
    });
    
    res.redirect('/match');
   
})

module.exports = router;