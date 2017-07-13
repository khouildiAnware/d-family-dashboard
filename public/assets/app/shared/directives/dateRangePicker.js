angular.module('karizma.shared')
    .directive('dateRangePicker', ['$http', '$timeout', function ($http, $timeout) {
        return {
            restrict: 'A',
            scope: {
                onRangeChanged: '&?'
            },
            // template: '<div class="input-group">' +
            // '<input type="text" class="form-control" />' +
            // '<span class="input-group-addon">' +
            // '<span class="icon-calendar3"></span>' +
            // '</span>' +
            // '</div>',
            link: function (scope, element, attr) {
                element
                    .on('apply.daterangepicker', function (ev, picker) {
                        $timeout(function () {
                            scope.onRangeChanged({ startDate: picker.startDate, endDate: picker.endDate });
                        });
                    })
                    .daterangepicker();
            }
        };
    }]);