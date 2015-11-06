var BaseController = require('./baseController.js');
var User = require('../models/users.js');

/* View template */

/* API */
/* singup user */
exports.signupUser = function (req, res) {
    var data = {};

    // Validation
    req.assert('username')
            .len(5, 255).withMessage('Username should be between 5 and 255 characters')
            .notEmpty().withMessage('Username is required');
    req.assert('password', '6 to 20 characters required').len(6, 20);
    req.assert('email')
            .isEmail().withMessage('Email invalid')
            .notEmpty().withMessage('Email is required');
    var errValidation = req.validationErrors(true);
    if (errValidation) {
        data.errors = errValidation;
        res.json(data);
    } else {
        var user = new User({username: req.body.username});
        user.set('password', req.body.password);
        user.set('email', req.body.email);
        user.save(function (err) {
            if (err) {
                var errors = {};
                if (err.name === 'MongoError') {
                    console.log(err.message);
                }
                if (err.name === 'ValidationError') {
                    for (field in err.errors) {
                        errors[err.errors[field].path] = {
                            param: err.errors[field].path,
                            msg: err.errors[field].message
                        };
                    }
                }
                res.json({errors: errors});
            } else {
                req.session.user = user.id;
                req.session.username = user.username;
                req.session.msg = 'Authenticated as ' + user.username;

                data.success = {
                    data: {
                        id: user.id,
                        username: user.username,
                        email: user.email,
                        is_actived: user.is_actived
                    }
                };
                res.json(data);
            }
        });
    }
};

/* get users info */
exports.getUsers = function (req, res, next) {
    User.find(function (err, users) {
        if (err)
            return next(err);
        res.json(users);
    });
};

/* Post create new user */
exports.createUser = function (req, res) {
    User.create(req.body, function (err, post) {
        if (err) {
            var errors = {};
            if (err.name === 'MongoError') {
                console.log(err.message);
            }
            if (err.name === 'ValidationError') {
                for (field in err.errors) {
                    errors[err.errors[field].path] = err.errors[field].message;
                }
            }
            res.json({errors: errors});
        }
        res.json(post);
    });
};

/* get user info by id */
exports.getUser = function (req, res, next) {
    User.findById(req.params.id, function (err, post) {
        if (err)
            return next(err);
        res.json(post);
    });
};

/* update user by id */
exports.updateUser = function (req, res, next) {
    User.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
        if (err) {
            var errors = {};
            if (err.name === 'MongoError') {
                console.log(err.message);
            }
            if (err.name === 'ValidationError') {
                for (field in err.errors) {
                    errors[err.errors[field].path] = err.errors[field].message;
                }
            }
            res.json({errors: errors});
        }
        res.json(post);
    });
};

/* delete user by id */
exports.deleteUser = function (req, res, next) {
    User.findByIdAndRemove(req.params.id, req.body, function (err, post) {
        if (err)
            return next(err);
        res.json(post);
    });
};
