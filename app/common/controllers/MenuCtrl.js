'use strict'

angular.module('app').controller('MenuCtrl', function ($scope, UserService, $location) {
        $scope.currentMenu = 1;
        $scope.setCurrentMenu = function (val) {
            $scope.currentMenu = val;
        };

        $scope.userService = UserService;

        $scope.currentSubMenu = '';
        $scope.setCurrentSubMenu = function (val) {
            $scope.currentSubMenu = val;
        };

        //nav
        $scope.nav = 'mainNav';
        $scope.setNav = function(nav){
            $scope.nav = nav;
        }
    }
);