function lwetDashboardController($scope, lookWhosEditingTooResource, contentResource) {
    lookWhosEditingTooResource
        .getAllEdits()
        .then(function (resp) {
            $scope.allEdits = resp.data;
            angular.forEach($scope.allEdits, function (value) {
                contentResource.getById(value.nodeId)
                   .then(function (content) {
                       value.nodeName = content.name;
                   });
            });
        });
};

angular.module("umbraco").controller("LWET.DashboardController", lwetDashboardController);