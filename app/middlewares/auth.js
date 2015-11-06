var jwt = require('jwt-simple');
var Utils = require('../libs/utils.js');
var User = require('../models/users.js');

var auth = {
    login: function (req, res) {
        // Validation
        req.assert('username')
                .len(5, 255).withMessage('Username should be between 5 and 255 characters')
                .notEmpty().withMessage('Username is required');
        req.assert('password', '6 to 20 characters required').len(6, 20);
        var errValidation = req.validationErrors(true);
        if (errValidation) {
            Utils.sendJson(res, errValidation, 'error');
        } else {
            auth.validate(req.body.username, req.body.password, function (dbUserObj) {
                if (!dbUserObj) {
                    Utils.sendJson(res, {
                        login: {
                            param: 'login',
                            msg: 'Username or Password is not correct'
                        }
                    }, 'error');
                } else {
                    Utils.sendJson(res, Utils.genToken(dbUserObj));
                }
            });
        }
    },
    logout: function () {
        Utils.sendJson(res, {
            login: {
                param: 'logout',
                msg: 'Logout success'
            }
        });
    },
    validate: function (username, password, callback) {
        User.findOne({username: username}, function (err, user) {
            if (!user) {
                callback(false);
            } else if (user.password !== Utils.hashPW(password.toString())) {
                callback(false);
            } else {
                var dbUserObj = {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    is_actived: user.is_actived
                };
                callback(dbUserObj);
            }
        });
    },
    validateUser: function (username, callback) {
        User.findOne({username: username}, function (err, user) {
            if (!user) {
                callback(false);
            } else {
                var dbUserObj = {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    is_actived: user.is_actived
                };
                callback(dbUserObj);
            }
        });
    }
};

module.exports = auth;
