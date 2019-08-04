const express = require('express');
const app = express();
const router = express.Router();
const db = require('./db');
const users = require('./routes/users');
const index = require('./routes/index');

const path = __dirname + '/views/';
const port = 3000;



app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path));
app.use('/', index);
app.use('/users', users);

app.listen(port, '127.0.0.1', function () {
  console.log('Example app listening on port 8080!');
  /*
  ocker exec -it db mongo readyboottmatchingdb -u readyboottmatchinguser
  */
})
