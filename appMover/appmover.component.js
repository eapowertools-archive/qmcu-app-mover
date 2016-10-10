(function () {
    "use strict";
    var module = angular.module("QMCUtilities", ["ngDialog"])

    function appMoverBodyController($scope, $http, ngDialog) {
        var model = this;

        model.openHelp = function() {
            ngDialog.open({
                template: "plugins/appMover/help-dialog.html",
                className: "help-dialog",
                controller: appMoverBodyController,
                scope: $scope
            });
        };
    }

    module.component("appMoverBody", {
        transclude: true,
        templateUrl: "plugins/appMover/app-mover-body.html",
        controllerAs: "model",
        controller: ["$scope", "$http", "ngDialog", appMoverBodyController]
    });

}());