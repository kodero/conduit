'use strict'

var config =  {
    defaultRoutePath: '/',
    routes: {
        '/': {
            templateUrl: 'views/home.html',
            title: 'Home',
            dependencies: []
        },
        '/feed': {
            templateUrl: 'views/feed.html',
            title: 'Home',
            dependencies: []
        },
        '/signin': {
            templateUrl: 'views/signin.html',
            title : 'Sign In',
            dependencies: []
        },
        '/signup': {
            templateUrl: 'views/signup.html',
            title : 'Sign Up',
            dependencies: []
        },
        '/new-article': {
            templateUrl: 'views/new-article.html',
            title : 'New Article',
            dependencies: []
        },
        '/view-article/:slug': {
            templateUrl: 'views/article-view.html',
            title : 'Article View',
            dependencies: []
        },
        '/settings': {
            templateUrl: 'views/settings.html',
            title : 'Settings',
            dependencies: []
        },
        '/profile/:username': {
            templateUrl: 'views/profile.html',
            title : 'Profile',
            dependencies: []
        }
    }
}

function dependencyResolverFor(dependencies) {
    var definition = {
        resolver: ['$q', '$rootScope', '$ocLazyLoad', function ($q, $rootScope, $ocLazyLoad) {
            var deferred = $q.defer();
            if(dependencies.length == 0) return $q.resolve();
            return $ocLazyLoad.load([{
                name: 'myApp',
                files: dependencies
            }]);
        }]
    }
    return definition;
}

angular.module('app').config(function($routeProvider) {
    angular.forEach(config.routes, function(route, path){
        $routeProvider.when(path, {
            templateUrl:route.templateUrl,
            title : route.title,
            reloadOnSearch: false,
            resolve:dependencyResolverFor(route.dependencies)
        });
    });
});