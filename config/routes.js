var resources = [
    'user'
];

module.exports = function (app) {
    resources.forEach(function (r) {
        app.use('/api/' + r, require('../routes/' + r));
    });
};
