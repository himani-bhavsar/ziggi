'use strict';

appControllers.controller('LoginController', ['$scope', '$http', '$rootScope','$location', '$window', '$cookies', '$cookieStore', 'UserService', 'AuthenticationService',
    function LoginController($scope, $http, $rootScope, $location, $window, $cookies, $cookieStore, UserService, AuthenticationService) {
        //Admin User Controller (signIn, logOut)
        //$scope.remember = false;
        var count = 0;
        var how = $.cookie('count');
        console.log(how)
        if($.cookie('count') == "3") {
          console.log("hello")
          $scope.blockLogin = true;
          $('#emailID').attr('disabled', 'disabled');
              $('#inputPassword').attr('disabled', 'disabled');
              $scope.email = '';
              $scope.password = '';
              setTimeout(function() { $('#emailID').removeAttr('disabled'); }, 40000);
              setTimeout(function() { $('#inputPassword').removeAttr('disabled'); }, 40000);
        }
        $scope.email = '';
        $scope.emailId = '';
        $scope.password = '';
        $scope.isForgotPassword = false;
        $scope.newPassword = '';
        $scope.confirmNewPassword ='';
        $scope.blockLogin = false;
        if($rootScope.authtoken){
          $location.path("/home"); 
        }

        $scope.login = function (email, password) {
            if($.cookie('count') >= 2) {
              console.log("hello")
              $scope.blockLogin = true;
              $('#emailID').attr('disabled', 'disabled');
              $('#inputPassword').attr('disabled', 'disabled');
              $scope.email = '';
              $scope.password = '';
              setTimeout(function() { $('#emailID').removeAttr('disabled'); }, 40000);
              setTimeout(function() { $('#inputPassword').removeAttr('disabled'); }, 40000);
            }

            UserService.signIn(email,password).success(function(data) {
              if(data[0].status == "success"){
                  AuthenticationService.isAuthenticated = true;
                  AuthenticationService.userName = $scope.email;
                  $window.sessionStorage.token = data[0].authentication_token;
                  $rootScope.authtoken = data[0].authentication_token;
                  $rootScope.$broadcast('user-logged');
                  $location.path("/home"); 
              }
              else if(data[0].status == "fail" && email !== null || password !== null) {
                  var a = new Date();
                  a.setSeconds(a.getSeconds() + 10000);
                  $('#message').fadeIn('slow');
                  $scope.message = data[0].msg;
                  setTimeout(function() {$scope.clearmessage();}, 1000);
                  count ++;
                  $.cookie('count', count, { expires: a, path: '/' });              
              }
              else{
                  $location.path("/login");
              }
            }).error(function(status, data) {
                console.log(status);
                console.log(data);
            });
            console.log("hello");
        }; 

        
        $scope.clearmessage = function(){
          if(angular.element("#message").html()!=undefined){
            setTimeout(function() {$('#message').fadeOut('slow');}, 2000);
          }   
        }

        $scope.forgotPassword = function(){
          $scope.isForgotPassword = true;
        }

        $scope.sendEmail = function(email){  
          UserService.forgotPassword(email).success(function(data) {
                    console.log(data);
                    if(data.status == "fail"){
                    $scope.message = data.msg;  
                    setTimeout(function() {$scope.clearmessage();}, 1000);
                  }
                }).error(function(status, data) {
                    console.log(status);
                    console.log(data);
                });
            }
        $scope.changePassword = function(email, password, confirmPassword) { 
            UserService.changePassword(email, $rootScope.reset_token[1], password, confirmPassword).success(function(data) {
          
                  if(data.status == "success") {
                    $location.path("/login");
                  }
                  else if(data.status == "fail"){
                    $scope.message = data.msg;  
                    setTimeout(function() {$scope.clearmessage();}, 1000);
                  }
                  console.log(data);
              
            }).error(function(status, data) {
                    console.log(status);
                    console.log(data);
            });

        }



        $scope.logOut = function () {
            if (AuthenticationService.isAuthenticated) {
                UserService.logOut($rootScope.authtoken).success(function(data) {
                    AuthenticationService.isAuthenticated = false;
                    $rootScope.authtoken = '';
                    delete $window.sessionStorage.token;
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

    console.log(AuthenticationService.isAuthenticated)
}]);