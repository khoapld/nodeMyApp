var expressValidator = require('express-validator');

module.exports = function (app) {

    app.use(expressValidator({
        errorFormatter: function (param, msg, value) {
            var namespace = param.split('.'),
                    root = namespace.shift(),
                    formParam = root;

            while (namespace.length) {
                formParam += '[' + namespace.shift() + ']';
            }
            return {
                param: formParam,
                msg: msg
                        //value: value
            };
        },
        customValidators: {
            isArray: function (value) {
                return Array.isArray(value);
            },
            gte: function (param, num) {
                return param >= num;
            }
        }
    }));

    app.all('/api/*', function (req, res, next) {
        // CORS headers
        res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
        // Set custom headers for CORS
        res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');
        if (req.method === 'OPTIONS') {
            res.status(200).end();
        } else {
            next();
        }
    });

    // Auth Middleware - This will check if the token is valid
    // Only the requests that start with /api/v1/* will be checked for the token.
    // Any URL's that do not follow the below pattern should be avoided unless you 
    // are sure that authentication is not needed
    app.all('/api/**/*', [require('../middlewares/validateRequest')]);

    // handle request
    app.use('/', require('../routes/index'));
    app.use('/users', require('../routes/users'));
    app.use('/api', require('../routes/api'));

};
