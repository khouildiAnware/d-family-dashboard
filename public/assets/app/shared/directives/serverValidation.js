angular.module('karizma.shared')
    .directive('form', ['$rootScope', function ($rootScope) {
        return {
            restrict: 'E',
            scope:{
                onSubmit:'&esSubmit'
            },
            link: function (scope, element, attr) {
                if ('esSubmit' in attr) {
                    
                    var switchForm = function(disabled) {
                        element.find(':input,button').prop('disabled', disabled);
                    };

                    element.on('submit', function() {
                        switchForm(true);
                        scope.onSubmit().then(function (res) {
                            switchForm(false);
                        }, function(res) {
                            switchForm(false);
                        });

                        return false;
                    });
                }

                $rootScope.$on('validation-errors', function (e, errors) {
                    element.find(':input').removeClass('error');
                    element.find('label.error').remove();
                    _.each(errors, function (error) {
                        if (error.fieldName === 'Generic') {
                            return;
                        }
                        var field = element.find('[name="' + error.fieldName + '"]');
                        if (!field.length) {
                            return;
                        }
                        field.addClass('error');
                        var label = field.next('[for="' + error.fieldName + '"]');
                        if (!label.length) {
                            label = $('<label class="error"></label>')
                                .attr('id', error.fieldName + '-error')
                                .attr('for', error.fieldName)
                                .insertAfter(field);
                        }

                        label.text(error.errorMessage).show();
                    });
                });
            }
    };
}]);