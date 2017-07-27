angular.module('karizma.participation')
    .controller('ParticipController', ['$scope', '$http', '$q', 'ValidationService', 'Participation', 'User', 'Work', 'Language', 'pictureSizeFilter',
        function ($scope, $http, $q, ValidationService, Participation, User, Work, Language, pictureSizeFilter) {

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
                var query = new Participation.Query();

                $scope.ui && $scope.ui.block();
                if ($scope.filters.search) {
                    var title = new Participation.Query();

                    title.matches('title', '.*' + decodeURIComponent($scope.filters.search) + '.*', 'i');
                    query = Parse
                        .Query
                        .or
                        .apply(null, [title]);
                }
                query.paged($scope.filters.page, $scope.filters.pageSize)

                    .descending('createdAt')
                    .include('user')
                    .find()
                    .then(function (participations) {
                        $scope.participations = participations;
                        $scope.ui.unblock();
                    });
            };






            $scope.$watch('filters', refresh, true);




            }


    ]);
