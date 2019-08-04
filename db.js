const mongoose = require('mongoose');
require('dotenv').config();
const {
    MONGO_USERNAME,
    MONGO_PASSWORD,
    MONGO_HOSTNAME,
    MONGO_PORT,
    MONGO_DB
} = process.env;
  
mongoose.connect(`mongodb://${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}`, {
    auth:{
        authdb: MONGO_DB,
        user: MONGO_USERNAME,
        password: MONGO_PASSWORD,
    
    },
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false
})
  .then(db => console.log('DB Connectd....****'))
  .catch(err => console.error(err));
