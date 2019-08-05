require('dotenv').config();
const express = require('express');
const app = express();
const router = express.Router();
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const exphbs = require('express-handlebars');
const Handlebars = require('handlebars');

const db = require('./db');
const usersRouter = require('./routes/users');
const indexRouter = require('./routes/index');
const matchRouter = require('./routes/match');
const authRouter = require('./routes/auth');

const helment = require('helmet');
var session = require('express-session')
const port = 3000;
const Users = require('./models/users');


app.use(function(req, res, next) {
  res.locals.app_id = process.env.APP_ID;
  next()
})


var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
passport.serializeUser(function(user, done) {
  done(null, user);
})
passport.deserializeUser(function(obj, done) {
  done(null, obj)
})
passport.use(new FacebookStrategy({
    clientID: process.env.APP_ID,
    clientSecret: process.env.APP_SECRET,
    callbackURL: process.env.APP_CALLBACK,
    profileFields: ['id', 'email', 'displayName', 'first_name', 'last_name', 'picture.type(large)']
  },

  function(accessToken, refreshToken, profile, done) {
    let user = profile._json;
    console.log(user);
    Users.findOne({facebookid:user.id}).then(function(currentUser){
      if(!currentUser){
        console.log(profile);
          const newUser = new Users({
              _id: user.id,
              facebookid: user.id,
              fullname: user.name,
              first_name: user.first_name,
              last_name: user.last_name,
              email: user.email,
              profile_url: user.picture.data.url,
          });
          newUser.save(function(err,user){
              if(err) throw err;
              console.log(user);
          });
      } else { 

      }
    })
    done(null, user);
  }
));

//setting
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'layouts/partials'),
    extname: '.hbs',
    //helpers: handlebarsHelpers
}));
app.set('view engine', '.hbs');
app.set('view options', { layout: 'backend' });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(helment());
app.use(express.urlencoded({extended: false}));

app.use(cookieParser())
app.use(session({ secret: process.env.KEY, resave: true, saveUninitialized: true }))
app.use(passport.initialize())
app.use(passport.session())

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/match', matchRouter);


app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'public_profile'] }));
app.get('/auth/callback', passport.authenticate('facebook', { successRedirect: '/auth/login',
                                      failureRedirect: '/auth' }))

app.use('/auth', authRouter);



Handlebars.registerHelper("isMale", function(value) {
  return value == 'male' ? 'checked' : '';
})

Handlebars.registerHelper("isFeMale", function(value) {
  return value == 'female' ? 'checked' : '';
})


Handlebars.registerHelper("isGLBT", function(value) {
  return value == 'lgbt' ? 'checked' : '';
})


app.listen(port, '127.0.0.1', function () {
  console.log('Example app listening on port 8080!');
  /*
  ocker exec -it db mongo readyboottmatchingdb -u readyboottmatchinguser
  */
})
