var express = require('express');
var router = express.Router();
var Parse = require('parse/node');
var multer = require('multer');
var upload = multer({ dest: 'uploads/' });
var _ = require('lodash');
var fs = require('fs');
var path = require('path');

router.post('/', upload.array('files'), function (req, res, next) {
    var className = req.body.className;
    var objectId = req.body.objectId;
    var fieldName = req.body.fieldName;

    _.each(req.files, function (uploadedFile) {

        var filePath = path.join(req.app.get('root-path'), uploadedFile.path);
        fs.readFile(filePath, function (err, data) {
            if (err) {
                return res.status(500).json({ error: 'unknown error', code: err.code });
            }
            var file = new Parse.File(uploadedFile.originalname, Array.from(data));
            file.save().then(function (savedFile) {

                try {
                    fs.unlinkSync(filePath);
                }
                catch (e) { }
                var url = savedFile.url();

                if (!className) {
                    res.json({ url: url });
                }
                else {
                    if (objectId) {

                    }
                    else {
                        var obj = new Parse.Object(className);
                        obj.set(fieldName, url);
                        obj.save().then(function (r) {
                            res.json({
                                url: url,
                                object: r.toPointer()
                            });
                        });
                    }
                }
            }, function (error) {
                try {
                    fs.unlinkSync(filePath);
                }
                catch (e) { }
                res.status(500);
                res.json({ error: error.message, success: false });
            });
        });
    });
});

module.exports = router;
