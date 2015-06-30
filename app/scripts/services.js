appServices.factory('AuthenticationService', function() {
    var auth = {
        userName : '',
        isAuthenticated: false
    }

    return auth;
});

appServices.factory('TokenInterceptor', function ($q, $window, $location, AuthenticationService) {
  
    return {
        request: function (config) {
            config.headers = config.headers || {};
            if ($window.sessionStorage.token) {
                config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token
            }
            return config;
        },

        requestError: function(rejection) {
            return $q.reject(rejection);
        },

        /* Set Authentication.isAuthenticated to true if 200 received */
        response: function (response) {
            if (response != null && response.status == 200 && $window.sessionStorage.token && !AuthenticationService.isAuthenticated) {
                AuthenticationService.isAuthenticated = true;
            }
            return response || $q.when(response);
        },

        /* Revoke client authentication if 401 is received */
        responseError: function(rejection) {
            if (rejection != null && rejection.status === 401 && ($window.sessionStorage.token || $window.sessionStorage.namespace || AuthenticationService.isAuthenticated)) {
                delete $window.sessionStorage.token;
                AuthenticationService.isAuthenticated = false;
                $location.path('/login');
            }

            return $q.reject(rejection);
        }
    };
});

appServices.factory('UserService', function ($http) {
    console.log(options.api.base_url)
    return {
        signIn: function(email, password) {
            return $http.post(options.api.base_url +'/api/login', {email: email, password: password});
        },

        logOut: function(auth_token) {
            return $http.post(options.api.base_url + '/api/logout', {auth_token: auth_token});
        },

        forgotPassword: function(email) {
            return $http.post(options.api.base_url + '/api/forgot_password', {email: email});
        },

        resetPassword: function(email,token,password,password_confirmation) {
            return $http.post(options.api.base_url + '/api/reset_password', {email: email, token: token, password: password, password_confirmation: password_confirmation});
        },

        changePassword: function(token,n_password,c_password) {
            return $http.post(options.api.base_url + '/api/change_password', {auth_token: token, new_password: n_password, current_password: c_password});
        }
    }
});

// app.factory('middleware', function() {
//     return {
//         request: function(config) {
//             // need more controlling when there is more than 1 domain involved
//             config.url = "http://192.168.1.153/" + config.url
//             return config;
//         }
//     };
// });

// app.factory('apiUrlHttpInterceptor', function () {

//     // Can be an injected constant, value, or taken from some service
//     var apiUrl = '/'; 

//     var shouldPrependApiUrl = function (reqConfig) {
//       if (!apiUrl) return false;
//       return !(/[\s\S]*.html/.test(reqConfig.url) ||
//               (reqConfig.url && reqConfig.url.indexOf(apiUrl) === 0));
//     };

//     return {
//       request: function (reqConfig) {
//         // Filter out requests for .html templates, etc
//         if (apiUrl && shouldPrependApiUrl(reqConfig)) {
//           reqConfig.url = apiUrl + reqConfig.url;
//         }

//         return reqConfig;
//       }
//     };
//   });

  
    
 