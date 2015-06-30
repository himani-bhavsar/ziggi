'use strict';

appControllers.controller('HomeController', ['$scope', '$rootScope','$location', 'AuthenticationService',
    function HomeController($scope, $rootScope, $location, AuthenticationService) {
        //Admin User Controller (signIn, logOut)
        console.log(AuthenticationService.isAuthenticated)
        console.log("welcome to dashboard")
    }
]);
