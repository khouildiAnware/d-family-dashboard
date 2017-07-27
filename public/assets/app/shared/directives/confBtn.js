angular.module('karizma.shared')
    .directive('confBtn', ['$http', '$injector', 'Work', 'Language', 'User', function ($http, $injector, Work, Language, User) {
        return {
            restrict: 'A',
            scope: {
                object: '=confBtn',
            },
            link: function (scope, element, attr, ngModel) {
               
                var containerJson;

                function save(text, langue) {
                    console.log(text);

                    var long = new Parse.Object("Language");

                    long.set(langue ? "englishLabel" : "arabicLabel", containerJson.title);
                    long.set(langue ? "arabicLabel" : "englishLabel", text);
                    long.save(null, {
                        success: function (gameScore) {

                            console.log('New object created with objectId: ' + gameScore.id);
                            var user = new Parse.Object("_User");
                            user.set("objectId", containerJson.user.id);

                            var work = new Parse.Object("Work");

                            work.set("thumbnail", containerJson.thumbnail);
                            work.set("title", long);

                            work.set("video", containerJson.video);
                            work.set("user", user);
                            work.save(null, {
                                success: function (gameScore) {

                                    console.log('New object created with objectId: ' + gameScore.id);

                                    containerJson.destroy({
                                        success: function (myObject) {
                                            var container = attr.containerId || element.parent();
                                            $(container).remove();

                                            swal({
                                                title: "",
                                                text: "تمت العملية بنجاح ",
                                                type: "success",
                                                confirmButtonClass: "btn-primary",
                                                confirmButtonText: "أغلق"
                                            });


                                        },
                                        error: function (myObject, error) {

                                            swal({
                                                title: "حدث خطأ!",
                                                text: "حدث خطأ أثناء إدخال  البيانات",
                                                type: "error",
                                                confirmButtonClass: "red",
                                                confirmButtonText: "أغلق"
                                            });
                                        }
                                    });


                                },
                                error: function (gameScore, error) {

                                    console.log('Failed to create new object, with error code: ' + error.message);
                                    swal({
                                        title: "حدث خطأ!",
                                        text: "حدث خطأ أثناء إدخال  البيانات",
                                        type: "error",
                                        confirmButtonClass: "red",
                                        confirmButtonText: "أغلق"
                                    });
                                }
                            });
                        },
                        error: function (gameScore, error) {

                            console.log('Failed to create new object, with error code: ' + error.message);
                            swal({
                                title: "",
                                text: "لقد تم إلغاء العملية ",
                                type: "warning",
                                confirmButtonClass: "green",
                                cancelButtonText: "إلغاء"
                            });
                        }
                    });


                }



                element.on('click', function () {
                    swal({
                            title: "هل أنت متأكد؟",
                            text: " ",
                            type: "warning",
                            showCancelButton: true,
                            confirmButtonClass: "green",
                            confirmButtonText: "نعم ",
                            cancelButtonText: "إلغاء",
                            closeOnConfirm: false
                        },
                        function () {

                            containerJson = scope.object;

                            var langue;
                            var valeur;

                            if (/^[a-z A-Z0-9(*/)+-=[\]\,;:"'?!.{}$~°<>]+$/.test(containerJson.title)) {

                                var data = {
                                    from: 'en',
                                    to: 'ar',
                                    text: containerJson.title
                                };
                                langue = true;


                            } else {

                                var data = {
                                    from: 'ar',
                                    to: 'en',
                                    text: containerJson.title
                                };
                                langue = false;


                            }


                            console.log(langue);


                            $.blockUI();
                            $http({
                                method: 'POST',
                                url: 'translate/data',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                data: data
                            }).then(function (response) {

                                $.unblockUI();

                                swal({
                                        title: "تأكيد الترجمة ",

                                        text: langue ? "تأكيد الترجمة بالعربية" : "تأكيد الترجمة بالانجليزية",

                                        type: "input",
                                        showCancelButton: true,
                                        closeOnConfirm: true,
                                        animation: "slide-from-top",
                                        inputValue: response.data.text
                                    },
                                    function (inputValue) {

                                        valeur = inputValue;

                                        save(valeur, langue);


                                    });

                            });
                        },
                        function (error) {
                            swal({
                                title: "حدث خطأ!",
                                text: "حدث خطأ أثناء إدخال  البيانات",
                                type: "error",
                                confirmButtonClass: "red",
                            });
                        });
                });

            }
        };
    }]);
