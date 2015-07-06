'use strict';

appControllers.controller('LoginController', ['$scope', '$http', '$rootScope', '$timeout', '$location', '$window', '$cookieStore', 'UserService', 'AuthenticationService',
    function LoginController($scope, $http, $rootScope, $timeout, $location, $window, $cookieStore, UserService, AuthenticationService) {
        //Admin User Controller (signIn, logOut)
        //$scope.remember = false;
        var date = new Date();
        $scope.email = '';
        $scope.emailId = '';
        $scope.password = '';
        $scope.isForgotPassword = false;
        $scope.newPassword = '';
        $scope.confirmNewPassword ='';
        $rootScope.blockLogin = false;
        $rootScope.countDown = 30;
        var count = 0;
        var mytimeout = null;
        //console.log(date.setSeconds( $scope.time1 - $scope.time2));
        //console.log($scope.time2.getSeconds());
       // var date = new Date();
        // var minutes = 0.5;
        // date.setTime(date.getTime() + (minutes * 60 * 1000));
        //$.cookie("example", "foo", { expires: date });
        // var exp = new Date(now.getFullYear()+1, now.getMonth(), now.getDate());
        // console.log(exp);    
        //var diff = new Date();
//date.setSeconds( time2 -time1);

        var clearLocking = function() {
              $('#emailID').removeAttr('disabled'); 
              $('#inputPassword').removeAttr('disabled');
              $rootScope.blockLogin = false;
              $cookieStore.put('count',0);
              $rootScope.countDown = 30;
              $timeout.cancel(mytimeout);
         }
        $scope.onTimeout = function() {
          if($rootScope.countDown ===  0) {
              $timeout.cancel(mytimeout);
              $cookieStore.put('count',0);
              return;
          }
          $rootScope.countDown--;
          mytimeout = $timeout($scope.onTimeout, 1000);
        };
        $window.onload = function(){
          if($cookieStore.get('count') > 3 || $cookieStore.get('count') == 3){
            $scope.time2 = date.getSeconds();
            toastr.warning('Please wait till 30 seconds !'); 
            // $rootScope.countDown = $scope.time2;
            console.log($scope.time2)
            console.log("hello");
            $rootScope.blockLogin = true;
            var emailAttr = document.getElementById("emailID");
            var passwordAttr = document.getElementById("inputPassword");
            emailAttr.setAttribute("disabled", true);
            passwordAttr.setAttribute("disabled", true);
            $rootScope.blockLogin = true;
            // $('#blockAccess').addClass('display-show');
            mytimeout = $timeout($scope.onTimeout, 1000);
            $timeout(clearLocking, 30000);
          }
          else if($cookieStore.get('count') == 0){
            clearLocking();
          }
          else if($cookieStore.get('count') < 3){
            var cookiecount = $cookieStore.get('count');
            $cookieStore.put('count',cookiecount);
          }
        }
        
        $scope.login = function (email, password) {
            if($cookieStore.get('count') == 3){
              toastr.warning('Please wait till 30 seconds !'); 
              $scope.time1 = date.getSeconds();
              console.log($scope.time1)
              $rootScope.blockLogin = true;
              var emailAttr = document.getElementById("emailID");
              var passwordAttr = document.getElementById("inputPassword");
              emailAttr.setAttribute("disabled", true);
              passwordAttr.setAttribute("disabled", true);
              mytimeout = $timeout($scope.onTimeout, 1000);
              $timeout(clearLocking, 30000);
              
            }
          else if(email !== null && password !== null) {
            UserService.signIn(email,password).success(function(data) {
              if(data[0].status == "success"){
                  $rootScope.auth = true;
                  AuthenticationService.isAuthenticated = true;
                  AuthenticationService.userName = email
                  $window.sessionStorage.token = data[0].authentication_token;
                  $rootScope.authtoken = data[0].authentication_token;
                  $rootScope.$broadcast('user-logged');
                  if(data[0].password_expired == true){
                    $location.path("/change-password");
                  }
                  else{
                    $location.path("/home");
                  }
                  toastr.success('Login Successfully !'); 
              }
              else if(data[0].status == "fail") {
                  $('#redMessage').fadeIn('slow');
                  $scope.failerMessage = "User credentials is invalid";
                  setTimeout(function() {$scope.clearmessage();}, 1000);
                  count ++;
                  $cookieStore.put('count',count);                
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
          //$cookieStore.put('count',count); 
          if(email !== null) {  
            UserService.forgotPassword(email).success(function(data) {
                console.log(data);
                if(data.status == "success"){
                  toastr.success('Reset instruction mail successfully sent !');
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
              $scope.failerMessage = "Email should not be empty";  
              setTimeout(function() {$scope.clearmessage();}, 1000);
          }
        }

        $scope.resetPassword = function(email, password, confirmPassword) {
          //$cookieStore.put('count',count);
          var passwordLen = $('#pswd').val().length;
          if(email !== null && password !== null && confirmPassword !== null) {  
            UserService.resetPassword(email, $rootScope.reset_token[1], password, confirmPassword).success(function(data) {
          
                  if(data.status == "success") {
                    $location.path("/login");
                    toastr.success('Your password has been reset successfully!')
                  }
                  else if(data.status == "fail" && email == null){
                    $('#redMessage').fadeIn('slow');
                    $scope.failerMessage = "Email is required";   
                    setTimeout(function() {$scope.clearmessage();}, 1000);
                  }
                  else if(data.status == "fail" && passwordLen < 7){
                    $('#redMessage').fadeIn('slow');
                    $scope.failerMessage = "Password must be atleast 6 characters long.";   
                    setTimeout(function() {$scope.clearmessage();}, 1000);
                  }
                  else if(password !== confirmPassword){
                    $('#redMessage').fadeIn('slow');
                    $scope.failerMessage = "Password and password confirmation doesn't match.";   
                    setTimeout(function() {$scope.clearmessage();}, 1000);
                  }
                  console.log(data);
              
            }).error(function(status, data) {
                    console.log(status);
                    console.log(data);
            });
          }
          else {
            $('#redMessage').fadeIn('slow');
            $scope.failerMessage = "All fields are required"; 
            setTimeout(function() {$scope.clearmessage();}, 1000);
          }
        }

        $scope.logOut = function () {
          $cookieStore.put('count',0);   
            if (AuthenticationService.isAuthenticated) {
                UserService.logOut($rootScope.authtoken).success(function(data) {
                    toastr.success('Logout Successfully !'); 
                    $rootScope.auth = false;
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

        $scope.changePassword = function(new_password, old_password) {
            $cookieStore.put('count',0);
            if(AuthenticationService.isAuthenticated && new_password !== null && old_password !== null) {
                UserService.changePassword($rootScope.authtoken, new_password, old_password).success(function(data) {
              
                  if(data.status == "success") {
                    $location.path("/home");
                    toastr.success('Your password has been changed successfully!')
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
            else if(new_password == null || old_password == null){
                $('#redMessage').fadeIn('slow');
                    $rootScope.failerMessage = "All Fields are required";  
                    setTimeout(function() {$scope.clearmessage();}, 1000);
            }
            else{
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
}]);