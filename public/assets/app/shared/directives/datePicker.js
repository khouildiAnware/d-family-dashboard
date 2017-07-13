angular.module('karizma.shared')
    .directive('datePicker', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            scope: {
                date: '=datePicker'
            },
            link: function (scope, element, attr) {
                var disablePast = 'disablePast' in attr;

                element.addClass('date-input').datepicker({
                    rtl: false,
                    orientation: 'right',
                    autoclose: true,
                    language: 'ar',
                    container: 'body',
                    beforeShowDay: function (d) {
                        if (!disablePast) {
                            return {
                                enabled: true
                            };
                        }

                        return {
                            enabled: d >= new Date()
                        };
                    }
                });

                element.on('changeDate', function (e) {
                    scope.date = e.date;
                    element.val(moment(e.date).format('dddd D MMMM YYYY'));
                });

                scope.$watch('date', function (newDate) {
                    if (!newDate) {
                        element.val('');
                        return;
                    }

                    element.val(moment(newDate).format('dddd D MMMM YYYY'));                    
                });
            }
        };
    }]);