const mongoose = require('mongoose');

const { Schema } = mongoose;

var ProvinceSchema = new Schema({
    province_name: String
});

module.exports = mongoose.model("Provinces", ProvinceSchema);
