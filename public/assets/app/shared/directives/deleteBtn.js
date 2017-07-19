angular.module('karizma.shared')
    .directive('deleteBtn', ['$http', '$injector', function ($http, $injector) {
        return {
            restrict: 'A',
            scope: {
                object: '=deleteBtn',
            },
            link: function (scope, element, attr, ngModel) {
                element.on('click', function () {
                    swal({
                            title: "هل أنت متأكد؟",
                            text: "لا يمكن استرجاع البيانات بعد الحذف",
                            type: "warning",
                            showCancelButton: true,
                            confirmButtonClass: "red",
                            confirmButtonText: "نعم، احذف",
                            cancelButtonText: "إلغاء",
                            closeOnConfirm: false
                        },
                        function () {
                            scope.object.destroy({
                                useMasterKey: true
                            }).then(function (res) {
                                var container = attr.containerId || element.parent();
                                $(container).remove();
                                
                                swal({
                                    title: "تم الحذف!",
                                    text: "تم حذف البيانات نهائيا",
                                    type: "success",
                                    confirmButtonClass: "btn-primary",
                                    confirmButtonText: "أغلق"
                                });

                               

                            }, function (res) {
                                swal({
                                    title: "حدث خطأ!",
                                    text: "حدث خطأ أثناء حذف البيانات",
                                    type: "error",
                                    confirmButtonClass: "red",
                                    confirmButtonText: "أغلق"
                                });
                            });
                        });
                });
            }
        };
    }]);