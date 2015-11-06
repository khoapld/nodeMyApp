var log = require('../libs/log')(module);
var sendJson = require('../libs/utils').sendJson;

module.exports = function (app) {

    // catch 404 and forward to error handler
    app.use(function (req, res) {
        res.status(404);
        log.info('Not found URL: %s', req.url);
        sendJson(res, {message: 'Not Found'}, 'error');
        return;
    });

    // development error handler
    if (app.get('env') === 'development') {
        app.use(function (err, req, res) {
            res.status(err.status || 500);
            log.error('Internal error(%d): %s', res.statusCode, err.message);
            sendJson(res, {message: err.message}, 'error');
            return;
        });
    }

    // production error handler
    app.use(function (err, req, res) {
        res.status(err.status || 500);
        log.error('Internal error(%d): %s', res.statusCode, err.message);
        sendJson(res, {message: err.message}, 'error');
        return;
    });

};
