function lwetSignalRService($rootScope) {
    var proxy = null;

    var initialize = function () {

        //Creating proxy
        if(proxy == null){
            proxy = $.connection.LWETHub;
        }

        proxy.client.broadcastEdit = function (nodeId, userId, userName, userGravatar) {
            var newUserEdit = {};
            newUserEdit.nodeId = nodeId;
            newUserEdit.userId = userId;
            newUserEdit.userName = userName;
            newUserEdit.userGravatar = userGravatar;
            $rootScope.$emit("broadcastEdit", newUserEdit);
        };

        proxy.client.broadcastStopEdit = function (userId) {
            $rootScope.$emit("broadcastStopEdit", userId);
        };

        //Publishing an event when server pushes a greeting message
        proxy.client.recieveMessage = function (message) {
            $rootScope.$emit('acceptGreet', message);
        };

        //Starting connection
<<<<<<< HEAD
        //$.connection.hub.logging = true;
        $.connection.hub.start().done(function () {
            proxy.server.listen();
        });
=======
        if(proxy.state === $.signalR.connectionState.disconnected){
            $.connection.hub.logging = true;
            $.connection.hub.start().done(function () {
                proxy.server.listen();
            });
        }
>>>>>>> origin/master
    };

    var sendRequest = function () {
        //Invoking greetAll method defined in hub
        proxy.server.greetAll();
    };

    var send = function (node, user) {
        proxy.server.send(node, user);
    };

    var stop = function (user) {
        proxy.server.send(user);
    };

    return {
        initialize: initialize,
        sendRequest: sendRequest,
        send: send,
        stop: stop
    };
};

angular.module('umbraco.resources').factory('lwetSignalRService', lwetSignalRService);
