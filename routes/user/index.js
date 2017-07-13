'use strict';

const express = require('express');
const router = express.Router();
const passport = require('passport');

router.post('/authenticate', function (req, res, next) {
    passport.authenticate('parse', function (err, user, info) {
        if (err) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }

        if (!user) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }

        req.logIn(user, function (err) {
            if (err) {
                next(err);
                return;
            }
            res.json({
                user: req.user,
                redirectTo: '/'
            });
        });
    })(req, res);
});

module.exports = router;