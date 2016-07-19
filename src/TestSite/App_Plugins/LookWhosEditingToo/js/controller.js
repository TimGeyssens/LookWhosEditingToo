function lwetDashboardController($scope, $rootScope, lookWhosEditingTooResource, contentResource, lwetSignalRService, lookWhosEditingTooNotificationServiceWrapper) {

    $scope.text = "";
    $scope.allEdits = [];
    $scope.globalMessage = "";
    lookWhosEditingTooResource.getAllEdits(true).then(function (response) {
        $scope.allEdits = _.groupBy(response.data, "nodeId");
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

        if ($scope.globalMessage.length > 0) {
            var injector = angular.element('#umbracoMainPageBody').injector();
            var authResource = injector.get('authResource');
            authResource.getCurrentUser().then(function(user) {
                lwetSignalRService.sendRequest(user.name, $scope.globalMessage);
                $scope.redBorder = "";
                $scope.globalMessage = "";
            });
        } else {
            $scope.redBorder = "redBorder";
        }
    }

    updateGreetingMessage = function (userName, message) {
        lookWhosEditingTooNotificationServiceWrapper.setGlobalNotification(userName, message);
    }

    lwetSignalRService.initialize();

    //Updating greeting message after receiving a message through the event
    $rootScope.$on("acceptGreet", function (e, data) {
        $scope.$apply(function () {
            updateGreetingMessage(data.userName, data.message);
        });
    });
};

angular.module("umbraco").controller("LWET.DashboardController", lwetDashboardController);

function lwetContentController($scope, $rootScope, lookWhosEditingTooResource, lookWhosEditingTooNotificationServiceWrapper, lwetSignalRService, $routeParams) {
    var injector = angular.element('#umbracoMainPageBody').injector();
    var authResource = injector.get('authResource');
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
                $("ng-form[name='headerNameForm']").parent().parent().children(".btn-group.pull-right").append("<div id='look-whos-editing-too'></div>");
            }

            if ($("#look-whos-editing-too-" + edit.userId).length == 0 && currentNodeId == edit.nodeId) {
                $("#look-whos-editing-too").append("<img id='look-whos-editing-too-" + edit.userId + "'src='//www.gravatar.com/avatar/" + edit.userGravatar + ".jpg?s=30&d=mm' title='" + edit.userName + "' >");
                lookWhosEditingTooNotificationServiceWrapper.setCurrentEditNotification(edit);
            }
        }
    }

    function getAllEdits() {
        lookWhosEditingTooResource.getAllEdits(false).then(function (resp) {
            allEdits = resp.data;
            updateTreeAndPage();
        });
    }


    $rootScope.$on("broadcastPublished", function (data, res) {
        if ($routeParams.id == res.nodeId) {
            authResource.getCurrentUser().then(function (user) {
                if (user.email != res.email) {
                    lookWhosEditingTooNotificationServiceWrapper.setPublishedNotification(res.email, res.time);
                }
            });
        }
    });

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
 
    //var authResource = injector.get('authResource');
    if (location.hash.indexOf('/content') == 1 && location.hash.indexOf('edit') !== -1) {
        authResource.getCurrentUser().then(function (user) {
            $.cookie('lookWhosEditingTooUser', user.id);
            lookWhosEditingTooResource.setEdit($routeParams.id, user.id).then(function (resp) {
            });
        });
    } else {
        lookWhosEditingTooResource.deleteByUserId(user.id).then(function (resp) {
        });
    }

};

angular.module("umbraco").controller("LWET.ContentController", lwetContentController);