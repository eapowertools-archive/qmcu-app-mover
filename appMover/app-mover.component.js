(function () {
    "use strict";
    var module = angular.module("QMCUtilities", ["ngDialog"])

    function appMoverBodyController($scope, $http, ngDialog) {
        var model = this;

    }

    module.component("appMoverBody", {
        transclude: true,
        templateUrl: "plugins/appMover/app-mover-body.html",
        controllerAs: "model",
        controller: ["$scope", "$http", "ngDialog", appMoverBodyController]
    });

}());