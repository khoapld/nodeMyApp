/* View template */
/* index page */
exports.index = function (req, res) {
    res.render('index', {title: 'My App'});
};

/* Signup Page */
exports.signup = function (req, res) {
    if (req.session.user) {
        res.redirect('/');
        return;
    }
    res.render('signup', {title: 'Signup Page', msg: req.session.msg});
};

/* Login Page */
exports.login = function (req, res) {
    if (req.session.user) {
        res.redirect('/');
        return;
    }
    res.render('login', {title: 'Login Page', msg: req.session.msg});
};

/* Login Page */
exports.logout = function (req, res) {
    req.session.destroy(function () {
        res.redirect('/login');
    });
};
