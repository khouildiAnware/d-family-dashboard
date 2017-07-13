angular.module('karizma.category')
    .controller('CategoryController', ['$scope', '$http', 'ValidationService', 'Category', 'Language', 'pictureSizeFilter',
        function ($scope, $http, ValidationService, Category, Language, pictureSizeFilter) {
            $scope.filters = {
                page: 1,
                pageSize: 100,
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
                var query = new Category.Query();
                $scope.ui && $scope.ui.block();
                query.paged($scope.filters.page, $scope.filters.pageSize)
                    .include('name,backgroundImage')
                    .ascending('sortOrder')
                    .find()
                    .then(function (categories) {
                        $scope.categories = categories;
                        $scope.ui.unblock();
                    });
            };

            $scope.selectCategory = function (category) {
                if (!category) {
                    category = new Category();
                    category.name = new Language();
                }

                $scope.imagesQueue.length = 0;

                if (category.backgroundImage) {
                    $scope.imagesQueue.push({
                        name: 'bg',
                        url: pictureSizeFilter(category.backgroundImage, 's'),
                        state: 'uploaded'
                    });
                    $scope.backgroundUploader.refreshQueue($scope.imagesQueue);
                }
                $scope.selectedCategory = category;
            };

            $scope.fileUploaded = function (fileInfo, object) {
                $scope.selectedCategory.backgroundImage = object;
            };

            $scope.fileRemoved = function (fileInfo, index) {
                $scope.selectedCategory.backgroundImage = null;
            };

            $scope.cancel = function () {
                $scope.selectedCategory.revert();
            };

            $scope.toggle = function (category, isHidden) {
                category.isHidden = isHidden;
                category.save(null, {
                    useMasterKey: true
                }).then(function () {}, function () {
                    category.revert();
                });
            };

            $scope.save = function () {
                $scope.errors = [];
                if (!ValidationService.validate($scope, $scope.selectedCategory, validationRules, $scope.errors)) {
                    return;
                }

                $scope.modalUI.block();
                $scope.backgroundUploader.upload().then(function () {
                    $scope.selectedCategory.save(null, {
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

            $scope.sortStop = function () {
                _.each($scope.categories, function (category, index) {
                    category.sortOrder = index + 1;
                });

                $scope.ui.block();
                Parse.Object.saveAll($scope.categories, {
                    useMasterKey: true
                }).then(function () {
                    $scope.ui.unblock();
                }, function (error) {
                    $scope.ui.unblock();
                });
            };

            $scope.$watch('filters', refresh, true);
        }
    ]);