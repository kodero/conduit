'use strict'

angular.module('app').factory('UserService', function($rootScope, $http, $q) {
    var _rawPermissionCollection = [];
    var _normalizedPermissionCollection = [];
    var ret = {
        isLoggedIn : false,

        normalizePermissionCollection : function (rawPerms) {
            _rawPermissionCollection = rawPerms;
            angular.forEach(_rawPermissionCollection, function(value, key) {
                this.push(value.attributes.permission.attributes.permissionName);
            }, _normalizedPermissionCollection);
            //$rootScope.$emit('permissionsChanged');
            $rootScope.$broadcast('permissionsChanged');
        },
        hasPermission : function(permission){
            //var updateDays = this.user.attributes.userProfile.attributes.updateDays || -1;
            return ($.inArray(permission, _normalizedPermissionCollection)) == -1? false : true;
        },
        getNormalizedPermissionCollection : function(){
            return _normalizedPermissionCollection;
        },
        isAdminAccount : function(){
            //possible states HEAD_OFFICE, RETAIL_SHOP
            //console.log('Checking account type...' + this.user.attributes.userProfile.attributes.profileType.key);
            if(!this.isLoggedIn) return false;
            //this.user.attributes.userProfile.attributes.profileType.key === 'HEAD_OFFICE' &&
            return (this.user.attributes.retailStore.attributes.orgType.key === 'HQ');
        },
        isRetailShopAccount : function(){
            //possible states HEAD_OFFICE, RETAIL_SHOP
            //console.log('Checking account type...');
            if(!this.isLoggedIn) return false;
            //this.user.attributes.userProfile.attributes.profileType.key === 'RETAIL_SHOP'
            return (this.user.attributes.retailStore.attributes.orgType.key === 'RETAIL');
        },

        loadUser : function(){
           if(ret.isLoggedIn) return $q.resolve({data : ret.user});
           $promise = $http.get("./resources/authentication/loggedinUser", {})
           $promise.then(function (data, status, headers, config) {
               /*ret.isLoggedIn = true;
               ret.user = data;
               console.log('Data : ' + JSON.stringify(data));*/
           })
           return $promise;
       }
    };

    return ret;
});