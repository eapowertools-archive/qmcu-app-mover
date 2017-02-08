(function () {
    "use strict";
    var module = angular.module("QMCUtilities", ["ngDialog", "btford.socket-io"])
    .factory('mySocket', function (socketFactory) {
            return socketFactory();
        });

    function fetchTableHeaders($http) {
        return $http.post('/sheetapprover/getAppList', sheetIds)
            .then(function (response) {
                return response;
            });
    }

    function appMoverBodyController($scope, $http, ngDialog, mySocket) {
        var model = this;
        model.appListHostname = '';
        model.hostnameToAdd = '';
        model.appListTable = [];
        model.hostnameListTable = [];
        model.selectedApps = [];
        model.selectedNodes = [];
        model.statusOutput = '';

        mySocket.on("appMover", function (msg) {
            model.statusOutput += msg + "\n";
        });

        model.getAppList = function () {
            return $http.post('/appmover/getAppList', {
                    "hostname": model.appListHostname
                })
                .then(function (response) {
                    model.appListTable = response.data;
                    for (var index = 0; index < model.appListTable.length; index++) {
                        model.appListTable[index].unshift(false);
                    }
                });
        }

        model.addHostnameToList = function () {
            model.hostnameListTable.push([false, model.hostnameToAdd]);
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

        model.checkBoxApps = function (isChecked, appID, appName) {
            if (isChecked) {
                model.selectedApps.push({"id":appID,"name":appName});
            } else {
                var index = model.selectedApps.indexOf({"id":appID,"name":appName});
                model.selectedApps.splice(index, 1);
            }
            console.log(model.selectedApps);
        };

        model.checkBoxHostnames = function (isChecked, id) {
            if (isChecked) {
                model.selectedNodes.push(id);
            } else {
                var index = model.selectedNodes.indexOf(id);
                model.selectedNodes.splice(index, 1);
            }
            console.log(model.selectedNodes);
        };

        model.deployApps = function () {
            return $http.post('/appmover/deployApps', {
                    "hostname": model.appListHostname,
                    "apps": model.selectedApps,
                    "nodes": model.selectedNodes
                })
                .then(function (response) {
                    // model.appListTable = response.data;
                    // for (var index = 0; index < model.appListTable.length; index++) {
                    //     model.appListTable[index].unshift(false);
                    // }
                });
        }
    }

    module.component("appMoverBody", {
        transclude: true,
        templateUrl: "plugins/appMover/app-mover-body.html",
        controllerAs: "model",
        controller: ["$scope", "$http", "ngDialog", "mySocket", appMoverBodyController]
    });

}());