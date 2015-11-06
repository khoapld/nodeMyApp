var crypto = require('crypto');
var jwt = require('jwt-simple');

module.exports = {
    hashPW: function (pwd) {
        return crypto.createHash('sha256')
                .update(pwd)
                .digest('base64').toString();
    },
    genToken: function (user) {
        var expires = expiresIn(7); // 7 days
        var token = jwt.encode({
            exp: expires
        }, require('../config/secret')());

        return {
            token: token,
            expires: expires,
            user: user
        };
    },
    expiresIn: function (numDays) {
        var dateObj = new Date();
        return dateObj.setDate(dateObj.getDate() + numDays);
    }
};
