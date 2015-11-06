var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressSession = require('express-session');
var mongoStore = require('connect-mongo')(expressSession);

var config = require('./app/libs/config');

// connect to databse
var mongoose = require('mongoose');
mongoose.connect(config.get('mongoose:uri'));

// connect database error
mongoose.connection.on('error', function (err) {
    console.log(config.get('mongoose:error'), err);
});

// connect database success
mongoose.connection.once('open', function () {
    console.log(config.get('mongoose:success'));

    // define app using express
    var app = express();

    // set port
    app.set('port', process.env.PORT || config.get('port'));

    // view engine setup
    app.engine('.html', require('ejs').__express);
    app.set('views', __dirname + '/app/views');
    app.set('view engine', 'html');

    // uncomment after placing your favicon in /public
    app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
    app.use(logger('dev'));

    // configure app to use bodyParser(). This will let us get the data from a POST
    // parse application/json
    app.use(bodyParser.json());
    // parse application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({extended: false}));

    // configure app to use cookieParser()
    app.use(cookieParser());

    // set the static files
    app.use(express.static(path.join(__dirname, 'public')));

    app.use(expressSession({
        secret: 'SECRET',
        cookie: {maxAge: 60 * 60 * 1000},
        resave: false,
        saveUninitialized: true,
        store: new mongoStore({
            db: mongoose.connection.db,
            collection: 'sessions'
        })
    }));

    // pass application into routes
    require('./app/config/routes')(app);

    // error handler
    require('./app/middlewares/errorHandler')(app);

    // start app
    app.listen(app.get('port'), function () {
        console.log('Express server listening on port ' + app.get('port'));
    });

    module.exports = app;
});
