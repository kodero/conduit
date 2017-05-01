angular.module('app').controller('ProfileViewCtrl', function ($rootScope, $scope, $location, $http, $window, $route, Entity, UserService) {
    var username = $route.current.params['username'];
    $scope.profile = {};

    //load article
    $scope.profile = Entity['Profile'].get({username : username}, function(profile){
        $scope.profile = profile.profile;
    })

    $scope.articles = Entity['Article'].query({author : username}, function(articles){
        $scope.articles = articles.articles;
    })

    $scope.follow = function(article){
        Entity['Profile'].follow({username : profile.username}, function(res){
            //done
        })
    }
});

angular.module('app').controller('ProfileEditCtrl', function ($rootScope, $scope, $location, $http, $window, $route, Entity, UserService) {
    var username = $route.current.params['username'];
    $scope.user = {};

    //load article
    $scope.user = Entity['User'].currentUser({}, function(user){
        $scope.user = user.user;
    })

    $scope.updateUser = function(user){
        Entity['User'].update({user : user}, function(res){
            $location.path('/').replace();
        })
    }
});