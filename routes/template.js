
var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    var templatePath = req.baseUrl.substring(10);
    res.render(templatePath);
});

module.exports = router;
