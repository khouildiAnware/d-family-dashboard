var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    if (req.headers['X-Angular-Ajax-Request'] !== '1') {
        res.render('layout');
    } else {
        res.render('This should never happen!');
    }
});



module.exports = router;
