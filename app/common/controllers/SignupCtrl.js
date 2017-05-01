angular.module('app').controller('SignupCtrl', function ($rootScope, $scope, $location, $http, $window, Entity, UserService) {
    $scope.user = {};
    $scope.signup = function (user) {
        Entity['User'].save({user : user}, function(res){
            $window.localStorage.Conduit_Token = res.user.token;
            UserService.user = res.user;
            $location.path('/');
        })
    };
});