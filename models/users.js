const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Users = new Schema ({
    _id: { type: String, required: true},
    facebookid: { type: String, required: true},
    fullname: { type: String, required: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    sex: { type: String, default: 'male' },
    token: { type: String },
    email: { type: String },
    age: { type: Number },
    province: { type: String, default: 'กรุงเทพมหานคร' },
    profile_url: { type: String },
    interest: { type: String, default: 'female' },
    range_min: { type: Number, default: 18},
    range_max: { type: Number, default: 40},
    sp: { type: Number, default: 1},
    shared: { type: Number, default: 0},
    matches: [{
        match: {
            type: String,
            ref: 'Users'
        },
        type: { type: String }
      }],
    othermatches: [{
        match: {
            type: String,
            ref: 'Users'
        },
        type: { type: String }
    }],
});

module.exports = mongoose.model('Users', Users);