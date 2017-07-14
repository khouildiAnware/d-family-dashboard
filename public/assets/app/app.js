(function () {
    var PARSE_SERVER_URL = 'https://dfamily.parse-server.karizma1.com/parse';
    var PARSE_APP_ID = 'F54949DC-1EF8-4453-A71A-8A481SLKJ5LD';
    var PARSE_MASTER_KEY = '5022C83B-4F72-46A0-AE7E-ABGH4HSVXN56';

    Parse.initialize(PARSE_APP_ID, '');
    Parse.serverURL = PARSE_SERVER_URL;
    Parse.masterKey = PARSE_MASTER_KEY;

    $('body').show();
    if (!Parse.User.current()) {
        $('body').addClass('login');
    } else {
        $('body').removeClass('login');
    }

    angular.module('karizma', ['ngResource', 'ngRoute', 'ui.sortable', 'summernote', 'karizma.account', 'karizma.shared', 'karizma.home', 'karizma.category', 'karizma.user', 'karizma.new'])
        .config(['$locationProvider', '$routeProvider', '$httpProvider',
            function ($locationProvider, $routeProvider, $httpProvider) {
                $routeProvider
                    .when('error', {
                        templateUrl: '/template/error/index'
                    })
                    .otherwise({
                        redirect: '/error'
                    });

                $locationProvider.html5Mode(true);

                $httpProvider.interceptors.push(function ($q, $rootScope) {
                    return {
                        'responseError': function (response) {
                            if (response.status);

                            if (response.data && response.data && response.data.errors) {
                                $rootScope.$emit('validation-errors', response.data.errors);
                            }

                            return $q.reject(response);
                        }
                    };
                });
            }
        ])
        .run(['$rootScope', '$http', '$location', '$timeout',
            function ($rootScope, $http, $location, $timeout) {

                // $http.post(parseServerUrl + '/schemas', {
                //     "_method": "GET",
                //     "_ApplicationId": parseAppId,
                //     "_MasterKey": parseMasterKey
                // }).then(function(res){
                //     $rootScope.Schema = res.data.results;
                //     ParseUtils.registerClasses(res.data.results);
                // });


                $http.defaults.headers.common['X-Angular-Ajax-Request'] = '1';

                moment.locale('ar');

                $rootScope.$on('$routeChangeStart',
                    function () {
                        if (!Parse.User.current()) {
                            if ($location.path() !== '/account/login') {
                                $location.path('/account/login');
                            }
                        } else {
                            $rootScope.currentUser = Parse.User.current();
                            $rootScope.isAuthenticated = true;
                            $rootScope.pageLoading = true;
                        }
                        if (!Parse.User.current()) {
                            $('body').addClass('login');
                        } else {
                            $('body').removeClass('login');
                        }
                    });

                $rootScope.$on('$routeChangeSuccess',
                    function () {
                        $rootScope.pageLoading = false;
                    });

                $rootScope.$on('$routeChangeError',
                    function () {
                        $rootScope.pageLoading = false;
                    });
            }
        ]);


})();