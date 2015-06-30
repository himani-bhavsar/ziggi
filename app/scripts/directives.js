appDirectives.directive('authenticatedUser', ['AuthenticationService', function (AuthenticationService) {
    return {
        restrict: 'A',
        scope: {},
        link: function (scope, element, attrs) {

            function toggleVisibilityBasedOnAuthentication() {
                if (AuthenticationService.isAuthenticated) {
                    element.removeClass('display-hide');
                } else {
                    element.addClass('display-hide');
                }
            }

            toggleVisibilityBasedOnAuthentication();

            scope.$on('user-logged', toggleVisibilityBasedOnAuthentication);

            scope.$on('user-loggedoff', toggleVisibilityBasedOnAuthentication);
        }
    };
}]);

appDirectives.directive("headerLayout", function () {

    // Return the directive configuration.
    return ({
        controller: "HeaderController",
        link: link,
        restrict: "E",
        templateUrl: "views/header.html"
    });

    // I bind the JavaScript events to the scope.
    function link(scope, element, attributes) {
        console.log("directive linking.");
    }
});


// changes started
appDirectives.directive("footerLayout", function () {

    // Return the directive configuration.
    return ({
        controller: "FooterController",
        link: link,
        restrict: "E",
        templateUrl: "views/footer.html"
    });

    // I bind the JavaScript events to the scope.
    function link(scope, element, attributes) {
        console.log("directive linking.");
    }
});
