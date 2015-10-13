function lwetDashboardController($scope, $rootScope, lookWhosEditingTooResource, contentResource, lwetSignalRService) {

    $scope.text = "";
    $scope.allEdits = [];

    lookWhosEditingTooResource.getAllEdits().then(function (response) {
        $scope.allEdits = _.groupBy(response.data, "nodeId");
        console.log($scope.allEdits);
    });

    $scope.getIcon = function (id) {
        contentResource.getById(id).then(function (data) {
            return data.icon;
        });
    };

    $scope.getContentName = function(id){
        contentResource.getById(id).then(function (data) {
            return data.name;
        });
    };

    $scope.greetAll = function () {
        lwetSignalRService.sendRequest();
    }

    updateGreetingMessage = function (text) {
        $scope.text = text;
    }

    lwetSignalRService.initialize();

    //Updating greeting message after receiving a message through the event
    $rootScope.$on("acceptGreet", function (e, message) {
        $scope.$apply(function () {
            updateGreetingMessage(message)
        });
    });
};

angular.module("umbraco").controller("LWET.DashboardController", lwetDashboardController);

function lwetContentController($scope, $rootScope, lookWhosEditingTooResource) {
    console.log("Content controller loaded!");
};

angular.module("umbraco").controller("LWET.ContentController", lwetContentController);