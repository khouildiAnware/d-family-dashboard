angular.module('karizma.shared')
    .filter('moment', function () {
        return function (input, method, parameters) {
            if (!input)
                return '';
            var date = input;
            if (typeof input === 'string') {
                date = new Date(input);
            }
            if (method === 'to') {
                return moment().to(input);
            }
            if (method === 'format') {
                if (parameters === 'FullTime') {
                    parameters = 'dddd D MMMM YYYY [على الساعة] H:mm A';
                }
            }
            return moment(date)[method](parameters);
        };
    });