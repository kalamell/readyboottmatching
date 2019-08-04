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

module.exports = helpers;