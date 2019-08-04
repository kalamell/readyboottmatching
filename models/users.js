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