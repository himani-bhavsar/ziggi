'use strict';

appControllers.controller('LoginController', ['$scope', '$http', '$rootScope', '$timeout', '$location', '$window', '$cookieStore', 'UserService', 'AuthenticationService',
    function LoginController($scope, $http, $rootScope, $timeout, $location, $window, $cookieStore, UserService, AuthenticationService) {
        //Admin User Controller (signIn, logOut)
        //$scope.remember = false;
        $scope.email = '';
        $scope.emailId = '';
        $scope.password = '';
        $scope.isForgotPassword = false;
        $scope.newPassword = '';
        $scope.confirmNewPassword ='';
        $rootScope.blockLogin = false;
        $scope.countDown = 30;
        var count = 0;
        
        // var date = new Date();
        // var minutes = 0.5;
        // date.setTime(date.getTime() + (minutes * 60 * 1000));
        //$.cookie("example", "foo", { expires: date });
        // var exp = new Date(now.getFullYear()+1, now.getMonth(), now.getDate());
        // console.log(exp);    
        

        var clearLocking = function() {
              $('#emailID').removeAttr('disabled'); 
              $('#inputPassword').removeAttr('disabled');
              $rootScope.blockLogin = false;
              $cookieStore.put('count',0);
            
         }
         var CountDown = function() {
              setTimeout(function() {$rootScope.countDown--;
              return $scope.countDown;}, 1000);
            
         }
        $window.onload = function(){
          if($cookieStore.get('count') > 3 || $cookieStore.get('count') == 3){
            console.log("hello");
            var emailAttr = document.getElementById("emailID");
            var passwordAttr = document.getElementById("inputPassword");
            emailAttr.setAttribute("disabled", true);
            passwordAttr.setAttribute("disabled", true);
            $rootScope.blockLogin = true;
            //setTimeout(function() {$rootScope.countDown--; console.log($rootScope.countDown);}, 1000);  
            $timeout(clearLocking, 30000);
            $scope.counts = CountDown();  
          }
          else if($cookieStore.get('count') == 0){
            clearLocking();
          }
      }
        //// if(AuthenticationService.isAuthenticated){
        //   $location.path("/home"); 
        // }

        $scope.login = function (email, password) {
            if($cookieStore.get('count') == 2){
              $rootScope.blockLogin = true;
              var emailAttr = document.getElementById("emailID");
              var passwordAttr = document.getElementById("inputPassword");
              emailAttr.setAttribute("disabled", true);
              passwordAttr.setAttribute("disabled", true);
              $timeout(clearLocking, 30000);
              $scope.counts = CountDown();  
            }
          if(email !== null && password !== null) {
            UserService.signIn(email,password).success(function(data) {
              if(data[0].status == "success"){
                  AuthenticationService.isAuthenticated = true;
                  AuthenticationService.userName = $scope.email;
                  $window.sessionStorage.token = data[0].authentication_token;
                  $rootScope.authtoken = data[0].authentication_token;
                  $rootScope.$broadcast('user-logged');
                  $location.path("/home"); 
                  location.reload();
              }
              else if(data[0].status == "fail") {
                  $('#redMessage').fadeIn('slow');
                  $scope.failerMessage = data[0].msg;
                  setTimeout(function() {$scope.clearmessage();}, 1000);
                  count ++;
                  $cookieStore.put('count',count);                
              }
              else{
                  $location.path("/login");
              }
            }).error(function(status, data) {
                console.log(status);
                console.log(data);
            });
          } 
          else{
            $('#redMessage').fadeIn('slow');
            $scope.failerMessage = "Email and Password is required";
            setTimeout(function() {$scope.clearmessage();}, 1000);
          }
        }; 

        $scope.displayForgotTemplate = function(){
          $scope.isForgotPassword = true;
        }

        $scope.forgotPassword = function(email){
          $cookieStore.put('count',count); 
          if(email !== null) {  
            UserService.forgotPassword(email).success(function(data) {
                console.log(data);
                if(data.status == "success"){
                  $('#greenMessage').fadeIn('slow');
                  $scope.successMessage = data.msg;   
                  setTimeout(function() {$scope.clearmessage();}, 1000);
                }
                else if(data.status == "fail"){
                  $('#redMessage').fadeIn('slow');
                  $scope.failerMessage = data.msg;  
                  setTimeout(function() {$scope.clearmessage();}, 1000);
                }
              }).error(function(status, data) {
                  console.log(status);
                  console.log(data);
              });
          }
          else{
              $('#redMessage').fadeIn('slow');
              $scope.failerMessage = "email should not be empty";  
              setTimeout(function() {$scope.clearmessage();}, 1000);
          }
        }

        $scope.resetPassword = function(email, password, confirmPassword) {
          $cookieStore.put('count',count);
          if(email !== null && password !== null && confirmPassword !== null) {  
            UserService.resetPassword(email, $rootScope.reset_token[1], password, confirmPassword).success(function(data) {
          
                  if(data.status == "success") {
                    $location.path("/login");
                    $('#greenMessage').fadeIn('slow');
                    $scope.successMessage = "your password is successfully changed";
                    setTimeout(function() {$scope.clearmessage();}, 1000);

                  }
                  else if(data.status == "fail"){
                    $('#redMessage').fadeIn('slow');
                    $scope.failerMessage = data.msg;  
                    setTimeout(function() {$scope.clearmessage();}, 1000);
                  }
                  console.log(data);
              
            }).error(function(status, data) {
                    console.log(status);
                    console.log(data);
            });
          }
          else{
            $('#redMessage').fadeIn('slow');
            $scope.failerMessage = "All fields are required they should not be empty"; 
            setTimeout(function() {$scope.clearmessage();}, 1000);
          }
        }

        $scope.logOut = function () {
          $cookieStore.put('count',count);   
            if (AuthenticationService.isAuthenticated) {
                UserService.logOut($rootScope.authtoken).success(function(data) {
                    AuthenticationService.isAuthenticated = false;
                    $rootScope.authtoken = '';
                    delete $window.sessionStorage.token;
                    $rootScope.$broadcast('user-loggedoff');
                    $location.path("/login");
                    $('#greenMessage').fadeIn('slow');
                    $scope.successMessage = data.msg;
                    setTimeout(function() {$scope.clearmessage();}, 1000);

                }).error(function(status, data) {
                    console.log(status);
                    console.log(data);
                });
            }
            else {
                $location.path("/login");
            }
        }

        $scope.changePassword = function(new_password, old_password) {
            $cookieStore.put('count',count);
            if(AuthenticationService.isAuthenticated && new_password !== null && old_password !== null) {
                UserService.changePassword($rootScope.authtoken, new_password, old_password).success(function(data) {
              
                  if(data.status == "success") {
                    $location.path("/home");
                    $('#greenMessage').fadeIn('slow');
                    $rootScope.successMessage = "your password is successfully updated";
                    setTimeout(function() {$scope.clearmessage();}, 1000);
                  }
                  else if(data.status == "fail") {
                    $('#redMessage').fadeIn('slow');
                    $rootScope.failerMessage = data.msg;  
                    setTimeout(function() {$scope.clearmessage();}, 1000);
                  }
                }).error(function(status, data) {
                        console.log(status);
                        console.log(data);
                });
            }
            else if(new_password !== null || old_password !== null){
                $location.path("/login");
            }
        }

        $scope.clearmessage = function(){
          if(angular.element("#redMessage").html()!=undefined || angular.element("#greenMessage").html()!=undefined){
            setTimeout(function() {$('#redMessage').fadeOut('slow');
                                   $('#greenMessage').fadeOut('slow'); 
                                  }, 3000);
          }   
        }

console.log(AuthenticationService.isAuthenticated)
    
}]);