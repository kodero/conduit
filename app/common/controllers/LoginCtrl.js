angular.module('app').controller('LoginCtrl', function ($rootScope, $scope, $location, $http, $window, Entity, UserService) {
        $scope.user = {};
        //$scope.loginFailureMsg = '';
        $scope.login = function (user) {
            $scope.loginFailureMsg = '';
            Entity['User'].login({}, {user : user}, function(data, status){
                console.log('Success..');
                $window.localStorage.Conduit_token = data.user.token;
                UserService.isLoggedIn = true;
                $rootScope.$broadcast('userLoggedIn');
                $scope.user = data.user;  
                $location.path('/').replace();
            }, function(){
                $scope.loginFailureMsg = 'Sorry, the login details provided are not correct!';
            })
        };
});