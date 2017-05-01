// Intercept http calls.
angular.module('app').factory('LemrHttpInterceptor', function ($q, $window, $rootScope) {

    return {
        // On request success
        request: function (config) {
            //console.log('Config : ' + config); // Contains the data about the request before it is sent.
            $('#loading').css("left", ($(window).width()/2) - 100);
            $('#loading').show();

            //add authentication headers
            config.headers = config.headers || {};
            if ($window.localStorage.GF_token) {
                if($window.localStorage.Conduit_Token) config.headers.Authorization = 'Token ' + $window.localStorage.Conduit_Token;
            }else{
                console.info('Token not found!');
            }

            // Return the config or wrap it in a promise if blank.
            return config || $q.when(config);
        },

        // On request failure
        requestError: function (rejection) {
            // Return the promise rejection.
            return $q.reject(rejection); 
        },

        // On response success
        response: function (response) {
            //console.log(response); // Contains the data from the response.
            $('#loading').hide();
            // Return the response or promise.
            return response || $q.when(response);
        },

        // On response failure
        responseError: function (rejection) {
            $('#loading').hide();
            $rootScope.$broadcast("responseError", rejection);
            return $q.reject(rejection);
        }
    };
});

// Add the interceptor to the $httpProvider.
angular.module('app').config(function($httpProvider) {  
    $httpProvider.interceptors.push('LemrHttpInterceptor');
});