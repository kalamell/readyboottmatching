const helpers = {};

helpers.isAuth = async (req, res, next) => {
    const user = req.session.passport;
    console.log(user);
    if (user != null) {
        next();
    } else {
        res.redirect('/');
    }
}

helpers.isLogin = async (req, res, next) => {
    const user = req.session.passport;
    if (user != null) {
        res.redirect('/user');
        
    } else {
        next();
    }
}



helpers.isAdmin = async (req, res, next) => {
    const admin = req.session.isadmin;
    console.log(admin);
    if (admin == null) {
        res.redirect('/mdata/login');
        
    } else {
        next();
    }
}

module.exports = helpers;