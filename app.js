const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const Parse = require('parse/node');
const expressValidator = require('express-validator');
const _ = require('lodash');
const ParseStrategy = require('passport-parse');
const cookieSession = require('cookie-session');
const passport = require('passport');
const Schema = require('./helpers/schema');

const appId = 'F54949DC-1EF8-4453-A71A-8A481SLKJ5LD';
const masterKey = '5022C83B-4F72-46A0-AE7E-ABGH4HSVXN56';
const parseUrl = 'https://dfamily.parse-server.karizma1.com/parse';

Parse.initialize(appId, '', masterKey);
Parse.serverURL = parseUrl;
Parse.Cloud.useMasterKey();

var app = express();
// app.use(Schema.init(parseUrl, appId, masterKey));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('root-path', __dirname);
app.use(express.static(path.join(__dirname, 'public')));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(cookieParser('aaf1f4dd-9066-472a-8f15-d621552f6560', {
    httpOnly: true
}));

app.use(cookieSession({
    keys: ['248cbf14-57a2-4bb7-bd01-593bb6ca518f'],
    name: 'session',
    maxAge: 60 * 60 * 1000 * 24 // 24 hour
}));

var parseStrategy = new ParseStrategy({ parseClient: Parse });
passport.use(parseStrategy);

passport.serializeUser(function (user, done) {
    user.get('company').fetch(function (c) {
        done(null, user);
    });
});

passport.deserializeUser(function (obj, done) {
    done(null, obj);
});

app.use(passport.initialize());
app.use(passport.session());

app.use(expressValidator({
    customSanitizers: {
        toArray: function (value) {
            if (!value) {
                return null;
            }

            return value.split(',');
        },
        toObject: function (value) {
            if (!value) {
                return {};
            }

            var parts = value.split(',');

            var fn = function (key, value, obj) {
                if (key.indexOf('.') < 0) {
                    obj[key] = decodeURIComponent(value);
                    return obj;
                }

                var parts = key.split('.');
                if (parts.length === 2) {
                    obj[parts[0]] = decodeURIComponent(value);
                    return obj;
                }

                obj[parts[0]] = fn(_.tail(parts).join('.'), value);
                return obj;
            };

            var result = {};
            _.each(parts, function (p) {
                var parts2 = p.split(':');
                return fn(parts2[0], parts2[1], result);
            });

            return result;
        },
    }
}));

// app.use(function (req, res, next) {
//     if (!req.user && req.url !== '/api/user/authenticate' && req.url !== '/account/login') {
//         if (req.headers['X-Angular-Ajax-Request']) {
//             res.status(401).json({ error: 'Unauthorized' });
//         }
//         else {
//             res.redirect('/account/login');
//         }
//     }
//     else {
//         next();
//     }
// });

var account = require('./routes/account');
var upload = require('./routes/upload');
var index = require('./routes/index');
var templates = require('./routes/template');

app.use('/account', account);
app.use('/upload', upload);
app.use('/template/*', templates);
var routes = require('./config/routes');
routes(app);

app.use('*', index);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;