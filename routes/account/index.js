var express = require('express');
var router = express.Router();

router.get('/logout', function(req, res, next) {
    req.logout();
    res.redirect('/account/login');
});


module.exports = router;