angular.module('karizma.album')
    .controller('AlbumController', ['$scope', '$http','$timeout', 'ValidationService', 'Album', 'Language', 'pictureSizeFilter',
        function ($scope, $http,$timeout, ValidationService, Album, Language, pictureSizeFilter) {
            $scope.filters = {
                page: 1,
                pageSize: 12,
            };

            $scope.imagesQueue = [];
            $scope.widgets = [];

            var validationRules = {
                'name': {
                    arabicName: 'الاسم',
                    required: true,
                    multiLang: true
                },
                'backgroundImage': {
                    arabicName: 'الصورة',
                    required: true,
                    isImage: true,
                    queueKey: 'imagesQueue'
                }
            };

            var refresh = function () {
                var query = new Album.Query();
                $scope.ui && $scope.ui.block();
                query.paged($scope.filters.page, $scope.filters.pageSize)
                    .include('name')
                    .ascending('sortOrder')
                    .find()
                    .then(function (albums) {
                        $scope.albums = albums;
                        $scope.ui.unblock();
                    });
            };

            $scope.selectItem = function (item) {
                if (!item) {
                    item = new Album();
                    item.name = new Language();
                }

                $scope.imagesQueue.length = 0;

               if (item.thumbnail) {
                    $scope.imagesQueue = [{
                            name: 'bg-',
                            url: item.thumbnail,
                            state: 'uploaded'
                        }];
                    $scope.backgroundUploader.refreshQueue($scope.imagesQueue);
                }
                
                $scope.selectedItem = item;
            };

            $scope.fileUploaded = function (fileInfo, object) {
                $scope.selectedItem.thumbnail = fileInfo.url;
            };

            $scope.fileRemoved = function (fileInfo, index) {
                $scope.selectedItem.thumbnail = null;
            };

            $scope.cancel = function () {
                $scope.selectedItem.revert();
            };

            $scope.toggle = function (item, isHidden) {
                item.isHidden = isHidden;
                item.save(null, {
                    useMasterKey: true
                }).then(function () {}, function () {
                    item.revert();
                });
            };

            $scope.save = function () {
                $scope.errors = [];
                if (!ValidationService.validate($scope, $scope.selectedItem, validationRules, $scope.errors)) {
                    return;
                }

                $scope.modalUI.block();
                $scope.backgroundUploader.upload().then(function () {
                    $scope.selectedItem.save(null, {
                        useMasterKey: true
                    }).then(function () {
                        $scope.modalUI.unblock();
                        $scope.categoryModal.hide();
                        refresh();
                    });
                });
            };

            $scope.sortableOptions = {
                placeholder: 'col-md-4 col-xs-2 sortable-placeholder',
                'ui-floating': true
            };

            $scope.delete = function (item) {
               
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
                            item.destroy({
                                useMasterKey: true
                            }).then(function (res) {
                                

                                 $timeout(function () {

                                $scope.albums = _.filter($scope.albums, function (o) {
                                    return o.id != item.id;
                                });
                               
                            });
                                
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
            };

            $scope.$watch('filters', refresh, true);
        }
    ]);