'use strict'

angular.module('app').controller('HeaderCtrl', function ($rootScope, $window, $scope, $location, $http, $timeout, $alert, $popover, $modal, UserService, Entity) {
    $scope.user = 'Guest';
    //$scope.preferenceService = PreferenceService;
     //logout
     $scope.logout = function () {
         console.log('Logging out..');
         Entity['Authentication'].logout({}, function(){
            UserService.isLoggedIn = false;
            $window.localStorage.GF_token = undefined;
            $alert({
                title: 'Success!',
                content: 'You have logged out of Ezen, you now be redirected to the login page in 3 seconds.',
                duration : 525,
                html : true,
                placement: 'top',
                type: 'info',
                show: true,
                animation: 'am-fade-and-slide-top'
             });
             $timeout(function(){
                $('#login').css("display", "inline-block");
                $('#wrapper').css("display", "none");
             }, 2000);
         })
     };

     //get currently logged in user
     $scope.getUserDetails = function(){
        Entity['User'].currentUser({}, function(data, status){
            UserService.isLoggedIn = true;
            UserService.user = data.user;
        })
     }();

     $scope.userService = UserService;

     $scope.$on('initialised', function(){
        //$scope.getUserDetails();
     })

     $scope.$on('userLoggedIn', function(){
        $('.animated-container').remove();
        $('#login').css("display", "none");
        $('#wrapper').css("display", "inline-block");
     })
 });