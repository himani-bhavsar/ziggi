'use strict';

appControllers.controller('HeaderController', ['$scope', '$http', '$rootScope','$location', '$window', 'UserService', 'AuthenticationService',
    function($scope, $http, $rootScope, $location, $window, UserService, AuthenticationService) {
        $rootScope.authtoken = $window.sessionStorage.token;
        $rootScope.auth = AuthenticationService.isAuthenticated;
        $scope.$on('user-logged', function (event, args) {
            try {
                AuthenticationService.isAuthenticated = true;
            } catch (e) {
            }
        });
        $scope.$on('user-loggedoff', function (event, args) {
            try {
                AuthenticationService.isAuthenticated = false;
            } catch (e) {
            }
        });
        $scope.changePassword = function(new_password, old_password) {
            $cookieStore.put('count',count);
            if(AuthenticationService.isAuthenticated) {
                UserService.changePassword($rootScope.authtoken, new_password, old_password).success(function(data) {
              
                      if(data.status == "success") {
                        $location.path("/home");
                        $rootScope.successMessage = "your password is successfully updated";
                        setTimeout(function() {$scope.clearmessage();}, 1000);

                      }
                      else if(data.status == "fail"){
                        $rootScope.failerMessage = data.msg;  
                        setTimeout(function() {$scope.clearmessage();}, 1000);
                      }
                      console.log(data);
                  
                }).error(function(status, data) {
                        console.log(status);
                        console.log(data);
                });
            }
            else{
                $location.path("/login");
            }
        }

        $scope.logOut = function () {
          console.log(AuthenticationService.isAuthenticated)
            if (AuthenticationService.isAuthenticated) {
                UserService.logOut($rootScope.authtoken).success(function(data) {
                    AuthenticationService.isAuthenticated = false;
                    delete $window.sessionStorage.token;
                    $rootScope.authtoken = '';
                    $rootScope.$broadcast('user-loggedoff');
                    $location.path("/login");
                }).error(function(status, data) {
                    console.log(status);
                    console.log(data);
                });
            }
            else {
                $location.path("/login");
            }
        }

}]);

