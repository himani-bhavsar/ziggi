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

appServices.factory('NotificationService', ['$http', function ($http) {
    var service = {};

    service.showError = function (message, title) {
        toastr.error(message, title);
    };

    service.showSuccess = function (message, title) {
        toastr.success(message, title);
    };

    service.showWarning = function (message, title) {
        toastr.warning(message, title);
    };

    service.hideMessages = function () {
        toastr.clear();
    };

    return service;
}]);