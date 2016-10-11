(function () {
    "use strict";
    var module = angular.module("QMCUtilities", ["ngDialog"])

    function fetchTableHeaders($http) {
        return $http.post('/sheetapprover/getAppList', sheetIds)
            .then(function (response) {
                return response;
            });
    }

    function appMoverBodyController($scope, $http, ngDialog) {
        var model = this;
        model.appListHostname = '';
        model.hostnameToAdd = '';
        model.appListTable = [];
        model.hostnameListTable = [];
        model.selectedApps = [];
        model.selectedNodes = [];

        model.getAppList = function () {
            return $http.post('/appmover/getAppList', {"hostname":model.appListHostname})
                .then(function (response) {
                    model.appListTable = response.data;
                    for (var index = 0; index < model.appListTable.length; index++) {
                        model.appListTable[index].unshift(false);
                    }
                });
        }

        model.addHostnameToList = function() {
            model.hostnameListTable.push([true, model.hostnameToAdd]);
            model.hostnameToAdd = '';
        }

        model.openHelp = function () {
            ngDialog.open({
                template: "plugins/appMover/help-dialog.html",
                className: "help-dialog",
                controller: appMoverBodyController,
                scope: $scope
            });
        };

        model.deployButtonValid = function () {
            if (model.selectedApps.length > 0 && model.selectedNodes.length > 0) {
                return true;
            }
            return false;
        }

        model.checkBox = function (isApp, isChecked, id) {
            if (isChecked) {
                if (isApp) {
                    model.selectedApps.push(id);
                } else {
                    model.selectedNodes.push(id);
                }
            } else {
                if (isApp) {
                    var index = model.selectedApps.indexOf(id);
                    model.selectedApps.splice(index, 1);
                } else {
                    var index = model.selectedNodes.indexOf(id);
                    model.selectedNodes.splice(index, 1);
                }
            }
            console.log(model.selectedApps);
            console.log(model.selectedNodes);
        };
    }

    module.component("appMoverBody", {
        transclude: true,
        templateUrl: "plugins/appMover/app-mover-body.html",
        controllerAs: "model",
        controller: ["$scope", "$http", "ngDialog", appMoverBodyController]
    });

}());