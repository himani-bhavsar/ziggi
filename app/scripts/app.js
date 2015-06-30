'use strict';

var app = angular.module('signalsecure', ['ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'appServices',
    'appDirectives',
    'appControllers']);
var appServices = angular.module('appServices', []);
var appDirectives = angular.module('appDirectives', []);
var appControllers = angular.module('appControllers', []);

var options = {};
options.api = {};
options.api.base_url = "http://ziggi.bacancytechnology.com";

app.config(['$locationProvider', '$routeProvider', '$httpProvider',
  function ($locationProvider, $routeProvider, $httpProvider) {
  
      $routeProvider.
          when('/login', {
              templateUrl: 'views/login.html',
              controller: 'LoginController'
          }).
          when('/home', {
              templateUrl: 'views/home.html',
              controller: 'HomeController',
              access: { requiredAuthentication: true }
          }).
          when('/password/reset/:token', {
              templateUrl: 'views/reset-password.html',
              controller: 'LoginController'
          }).
          when('/change-password', {
              templateUrl: 'views/change-password.html',
              controller: 'LoginController'
          }).
            otherwise({
              redirectTo: '/login'
          });
   // $locationProvider.html5Mode(true);
    // $locationProvider.hashPrefix = '!';
    $httpProvider.interceptors.push('TokenInterceptor');
}]);

app.run(function($rootScope, $location, $window, $cookieStore, $timeout, AuthenticationService) {
    $rootScope.$on("$routeChangeStart", function(event, nextRoute, currentRoute) {
        //redirect only if both isAuthenticated is false and no token is set 
        if (nextRoute != null && nextRoute.access != null && nextRoute.access.requiredAuthentication 
            && !AuthenticationService.isAuthenticated && !$window.sessionStorage.token) {
              console.log($window.sessionStorage.token)
              $location.path("/login");
        }
    });
    
    $rootScope.auth = AuthenticationService.isAuthenticated;
    var href_loc = $window.location.href;
    $rootScope.reset_token = href_loc.split('reset/');
});

console.log('welcome to signal secure');
