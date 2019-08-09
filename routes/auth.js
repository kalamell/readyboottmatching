const express = require('express');
const router = express.Router();
const path = require('path');

const Provinces = require('../models/provinces');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;



const { isAuth, isLogin } = require('../helpers/auth');


router.get('/', isLogin, (req, res) => {
    res.render('login');
})

router.get('/login', (req, res) => {
    res.redirect('/user');
})

router.get('/install', (req, res) => {
   res.redirect('/user');
    let povinces  =[
        {'province_name': 'กระบี่'},
        {'province_name': 'กรุงเทพมหานคร'},
        {'province_name': 'กาญจนบุรี'},
        {'province_name': 'กาฬสินธุ์'},
        {'province_name': 'กำแพงเพชร'},
        {'province_name': 'ขอนแก่น'},
        {'province_name': 'จันทบุรี'},
        {'province_name': 'ฉะเชิงเทรา'},
        {'province_name': 'ชลบุรี'},
        {'province_name': 'ชัยนาท'},
        {'province_name': 'ชัยภูมิ'},
        {'province_name': 'ชุมพร'},
        {'province_name': 'เชียงราย'},
        {'province_name': 'เชียงใหม่'},
        {'province_name': 'ตรัง'},
        {'province_name': 'ตราด'},
        {'province_name': 'ตาก'},
        {'province_name': 'นครนายก'},
        {'province_name': 'นครปฐม'},
        {'province_name': 'นครพนม'},
        {'province_name': 'นครราชสีมา'},
        {'province_name': 'นครศรีธรรมราช'},
        {'province_name': 'นครสวรรค์'},
        {'province_name': 'นนทบุรี'},
        {'province_name': 'นราธิวาส'},
        {'province_name': 'น่าน'},
        {'province_name': 'บึงกาฬ'},
        {'province_name': 'บุรีรัมย์'},
        {'province_name': 'ปทุมธานี'},
        {'province_name': 'ประจวบคีรีขันธ์'},
        {'province_name': 'ปราจีนบุรี'},
        {'province_name': 'ปัตตานี'},
        {'province_name': 'พระนครศรีอยุธยา'},
        {'province_name': 'พะเยา'},
        {'province_name': 'พังงา'},
        {'province_name': 'พัทลุง'},
        {'province_name': 'พิจิตร'},
        {'province_name': 'พิษณุโลก'},
        {'province_name': 'เพชรบุรี'},
        {'province_name': 'เพชรบูรณ์'},
        {'province_name': 'แพร่'},
        {'province_name': 'ภูเก็ต'},
        {'province_name': 'มหาสารคาม'},
        {'province_name': 'มุกดาหาร'},
        {'province_name': 'แม่ฮ่องสอน'},
        {'province_name': 'ยโสธร'},
        {'province_name': 'ยะลา'},
        {'province_name': 'ร้อยเอ็ด'},
        {'province_name': 'ระนอง'},
        {'province_name': 'ระยอง'},
        {'province_name': 'ราชบุรี'},
        {'province_name': 'ลพบุรี'},
        {'province_name': 'ลำปาง'},
        {'province_name': 'ลำพูน'},
        {'province_name': 'เลย'},
        {'province_name': 'ศรีสะเกษ'},
        {'province_name': 'สกลนคร'},
        {'province_name': 'สงขลา'},
        {'province_name': 'สตูล'},
        {'province_name': 'สมุทรปราการ'},
        {'province_name': 'สมุทรสงคราม'},
        {'province_name': 'สมุทรสาคร'},
        {'province_name': 'สระแก้ว'},
        {'province_name': 'สระบุรี'},
        {'province_name': 'สิงห์บุรี'},
        {'province_name': 'สุโขทัย'},
        {'province_name': 'สุพรรณบุรี'},
        {'province_name': 'สุราษฎร์ธานี'},
        {'province_name': 'สุรินทร์'},
        {'province_name': 'หนองคาย'},
        {'province_name': 'หนองบัวลำภู'},
        {'province_name': 'อ่างทอง'},
        {'province_name': 'อำนาจเจริญ'},
        {'province_name': 'อุดรธานี'},
        {'province_name': 'อุตรดิตถ์'},
        {'province_name': 'อุทัยธานี'},
        {'province_name': 'อุบลราชธานี'}]; 
        Provinces.insertMany(povinces);
    res.redirect('/');
})

module.exports = router;