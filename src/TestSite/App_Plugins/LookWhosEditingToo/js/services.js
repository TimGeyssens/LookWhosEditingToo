﻿function lwetSignalRService($rootScope) {
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
        proxy.client.broadcastPublished = function(nodeId, username, time) {
            var data = {};
            data.nodeId = nodeId;
            data.userName = username;
            data.time = time;
            $rootScope.$emit('broadcastPublished', data);
        };
        //Publishing an event when server pushes a greeting message
        proxy.client.recieveMessage = function (userName, msg) {
            var data = {};
            data.userName = userName;
            data.message = msg
            $rootScope.$emit('acceptGreet', data);
        };

        //Starting connection
            $.connection.hub.logging = true;
            $.connection.hub.start().done(function () {
                proxy.server.listen();
            });
    };

    var sendRequest = function (userName, msg) {
        //Invoking greetAll method defined in hub
        proxy.server.greetAll(userName, msg);
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
