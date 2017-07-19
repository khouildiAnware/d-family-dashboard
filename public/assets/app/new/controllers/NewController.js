angular.module('karizma.new')
    .controller('NewController', ['$scope', '$http','ValidationService', 'News', 'Language', 'pictureSizeFilter',
        function ($scope, $http,ValidationService, News, Language, pictureSizeFilter) {
            $scope.filters = {
                page: 1,
                pageSize: 12,
            };

            $scope.imagesQueue = [];
            var validationRules = {
               
                'title': {
                    arabicName: 'العنوان',
                    required: true,
                    multiLang: true
                },
                'content': {
                    arabicName: 'التفاصيل',
                    required: true,
                    multiLang: true
                },
                'images': {
                    arabicName: 'الصور',
                    required: true,
                    isImage: true,
                    queueKey: 'imagesQueue',
                    isArray: true
                }
            };

            var refresh = function () {
                var query = new News.Query();
                $scope.ui && $scope.ui.block();
                query.paged($scope.filters.page, $scope.filters.pageSize)
                    .include('title,content')
                    .descending('createdAt')
                    .search($scope.filters.search, ['title'], true)
                    .find()
                    .then(function (news) {
                        $scope.news = news;
                        $scope.ui.unblock();
                    });
            };

            $scope.selectItem = function (item) {
                if (!item) {
                    item = new News();
                    item.title = new Language();
                    item.content = new Language();
                }

                $scope.imagesQueue.length = 0;

                if (item.thumbnail) {
                    $scope.imagesQueue = [{
                            name: 'bg-',
                            url: item.thumbnail,
                            state: 'uploaded'
                        }];
                    

                    $scope.imageUploader.refreshQueue($scope.imagesQueue);
                }

                $scope.selectedItem = item;
            };

            $scope.fileUploaded = function (fileInfo, object) {
                $scope.selectedItem.thumbnail=fileInfo.url;
            };
             $scope.fileRemoved = function (fileInfo, index) {
                $scope.selectedItem.thumbnail = null;
            };

            

            $scope.cancel = function () {
                $scope.selectedItem.revert();
            };

           

            $scope.save = function () {
                 $scope.errors = [];
                if (!ValidationService.validate($scope, $scope.selectedItem, validationRules, $scope.errors)) {
                    return;
                }
                $scope.modalUI.block();
                $scope.imageUploader.upload().then(function () {
                    $scope.selectedItem.save(null, {
                        useMasterKey: true
                    }).then(function () {
                        $scope.modalUI.unblock();
                        $scope.newModal.hide();
                        refresh();
                    });
                });
            };

            $scope.$watch('filters', refresh, true);
        }
    ]);