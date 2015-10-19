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

function lwetContentController($scope, $rootScope, lookWhosEditingTooResource, lookWhosEditingTooNotificationServiceWrapper, lwetSignalRService) {

    function updateTreeAndPage() {

        $("i[title*='content/content/edit']").closest("li").children("div").removeClass("look-whos-editing-too");

        var currentNodeId = -1;
        if (location.hash.indexOf('/content') == 1 && location.hash.indexOf('edit') != -1) {
            var locArray = location.hash.split('/');
            currentNodeId = locArray[locArray.length - 1];
        }

        $("#look-whos-editing-too").empty();

        for (var i = 0; i < allEdits.length; i++) {
            var edit = allEdits[i];
            $("i[title*='" + edit.nodeId + "']").closest("li").children("div").addClass("look-whos-editing-too");

            if ($("#look-whos-editing-too").length == 0) {
                $("ng-form[name='contentNameForm']").parent().parent().children(".span5").append("<div id='look-whos-editing-too'></div>");
            }

            if ($("#look-whos-editing-too-" + edit.userId).length == 0 && currentNodeId == edit.nodeId) {
                $("#look-whos-editing-too").append("<img id='look-whos-editing-too-" + edit.userId + "'src='//www.gravatar.com/avatar/" + edit.userGravatar + ".jpg?s=30&d=mm' title='" + edit.userName + "' >");
                lookWhosEditingTooNotificationServiceWrapper.setCurrentEditNotification(edit);
            }
        }
    }

    function getAllEdits() {

        lookWhosEditingTooResource.getAllEdits().then(function (resp) {

            allEdits = resp.data;

            updateTreeAndPage();

        });
    }

    $rootScope.$on("broadcastStopEdit", function (userId) {
        if (_.where(allEdits, { userId: userId }).length > 0) {
            allEdits = _.reject(allEdits, function (el) { return el.userId === userId; });
            updateTreeAndPage();
       }
    });

    $rootScope.$on('broadcastEdit', function (nodeId, userId, userName, userGravatar) {
        if (_.where(allEdits, { userId: userId }).length > 0)
        {
            var currentUserEdit = _.where(allEdits, { userId: userId })[0];
            currentUserEdit.nodeId = nodeId;
        }
        else
        {
            var newUserEdit = {};
            newUserEdit.nodeId = nodeId;
            newUserEdit.userId = userId;
            newUserEdit.userName = userName;
            newUserEdit.userGravatar = userGravatar;

            allEdits.push(newUserEdit);
        }

        updateTreeAndPage();
    });

    getAllEdits();

    lwetSignalRService.initialize();

    if (location.hash.indexOf('/content') == 1 && location.hash.indexOf('edit') != -1) {
        //Set current edit in database and cookie
    } else {
        //Delete current edit in database and remove cookie
    }

};

angular.module("umbraco").controller("LWET.ContentController", lwetContentController);