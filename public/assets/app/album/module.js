angular.module('karizma.album', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/albums', {
                templateUrl: '/template/album/index',
                controller: 'AlbumController'
            })
            .when('/albums/:id', {
                templateUrl: '/template/album/photos',
                controller: 'PhotoController',
                resolve: {
                    album: function ($route, Album) {
                        return Album.get($route.current.params.id, null, true);
                    }
                }
            });
    }]);