var express = require('express');
var router = express.Router();

const translate = require('google-translate-api');
const Parse = require('parse/node');

router.post('/data', function (req, res) {


        console.log(req.body.text);

        translate(req.body.text, {
            from: req.body.from,
            to: req.body.to
        }).then(res1 => {


            res.json(res1);
        }).catch(err => {

            console.error(err);
            res.status = 500;
            res.json(error);
        });

    }

);


module.exports = router;
