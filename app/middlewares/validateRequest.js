var jwt = require('jwt-simple');
var Utils = require('../libs/utils.js');
var validateUser = require('../middlewares/auth').validateUser;
var secert = require('../config/secret.js')();

module.exports = function (req, res, next) {
    // When performing a cross domain request, you will recieve
    // a preflighted request first. This is to check if our the app
    // is safe. 

    // We skip the token outh for [OPTIONS] requests.
    //if(req.method == 'OPTIONS') next();

    var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
    var key = (req.body && req.body.x_key) || (req.query && req.query.x_key) || req.headers['x-key'];

    if (token && key) {
        try {
            var decoded = jwt.decode(token, secert);
            if (decoded.exp <= Date.now()) {
                Utils.sendJson(res, {
                    authorized: {
                        param: 'access_token',
                        message: 'Token Expired'
                    }
                }, 'error');
                return;
            }

            // Authorize the user to see if s/he can access our resources
            // The key would be the logged in user's username
            validateUser(key, function (dbUser) {
                if (dbUser) {
                    //if ((req.url.indexOf('admin') >= 0 && dbUser.role == 'admin') || (req.url.indexOf('admin') < 0 && req.url.indexOf('/api/') >= 0)) {
                    if (req.url.indexOf('/api/') >= 0) {
                        next(); // To move to next middleware
                    } else {
                        Utils.sendJson(res, {
                            authorized: {
                                param: 'x_key',
                                message: 'Not Authorized'
                            }
                        }, 'error');
                        return;
                    }
                } else {
                    Utils.sendJson(res, {
                        authorized: {
                            param: 'x_key',
                            message: 'Invalid User'
                        }
                    }, 'error');
                    return;
                }
            });
        } catch (err) {
            res.status(500);
            Utils.sendJson(res, {
                authorized: {
                    param: 'authorized',
                    message: 'Oops something went wrong'
                }
            }, 'error');
        }
    } else {
        Utils.sendJson(res, {
            authorized: {
                param: 'authorized',
                message: 'Invalid Token or Key'
            }
        }, 'error');
        return;
    }
};
