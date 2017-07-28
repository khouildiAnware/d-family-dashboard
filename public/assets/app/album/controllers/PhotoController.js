angular.module('karizma.album')
    .controller('PhotoController', ['$scope', '$http', '$route', '$timeout', 'ValidationService', 'AlbumPhoto', 'Language', 'pictureSizeFilter',
        function ($scope, $http, $route, $timeout, ValidationService, AlbumPhoto, Language, pictureSizeFilter) {
            $scope.album = $route.current.locals.album;
            $scope.filters = {
                page: 1,
                pageSize: 12,
            };

            $scope.imagesQueue = [];
            $scope.widgets = [];
            var pic = $scope.album;
            //  console.log(pic);

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
                var query = new AlbumPhoto.Query();
                $scope.ui && $scope.ui.block();
                query.paged($scope.filters.page, $scope.filters.pageSize)
                    .include('name,album')
                    .equalTo('album', $scope.album)
                    .ascending('sortOrder')
                    .find()
                    .then(function (albumPhotos) {
                        $scope.albumPhotos = albumPhotos;
                        $scope.ui.unblock();
                    });
            };

            $scope.selectItem = function (item) {
                if (!item) {
                    item = new AlbumPhoto();
                    item.name = new Language();
                    //  console.log($scope.album);
                    item.album = $scope.album;
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

                pic.increment("nbPictures");
                console.log(pic.nbPictures);
                $scope.album.save();
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

                                $scope.albumPhotos = _.filter($scope.albumPhotos, function (o) {
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
