var crypto = require('crypto');
var jwt = require('jwt-simple');
var secret = require('../config/secret')();

module.exports = {
    sendJson: function (res, result, type) {
        res.json({
            type: type ? type : 'success',
            result: result
        });
    },
    hashPW: function (pwd) {
        return crypto.createHash('sha256')
                .update(pwd)
                .digest('base64').toString();
    },
    genToken: function (user) {
        var expires = this.expiresIn(7); // 7 days
        var token = jwt.encode({
            exp: expires
        }, secret);

        return {
            access_token: token,
            x_key: user.id,
            user: user
        };
    },
    expiresIn: function (numDays) {
        var dateObj = new Date();
        return dateObj.setDate(dateObj.getDate() + numDays);
    }
};
