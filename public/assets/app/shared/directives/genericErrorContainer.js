angular.module('karizma.shared')
    .directive('genericErrorContainer', ['$rootScope', function ($rootScope) {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                element.hide();

                $rootScope.$on('validation-errors', function (e, errors) {

                    var genericErrors = _(errors).filter({ fieldName: 'Generic' }).map('errorMessage').value();
                    if (!genericErrors.length) {
                        return;
                    }
                    
                    var list = $('<ul></ul>');
                    _.each(genericErrors, function(err) {
                        var item = $('<li></li>');
                        item.text(err);
                        list.append(item);
                    });

                    if ('popup' in attr) {
                        swal({
                            title: 'خطأ!',
                            text: genericErrors.join('</br>'),
                            type: 'error',
                            confirmButtonClass: 'blue alert-btn btn-circle',
                            confirmButtonText: 'أغلق'
                        });
                    } else {
                        element.html('').append(list).show();
                    }
                });
            }
        };
    }]);