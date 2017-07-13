angular.module('karizma.shared')
    .filter('formatDate', function () {
        return function (input, format) {
            if (!input)
                return '';
            return moment(input).format(format || 'D MMMM YYYY');
        };
    });