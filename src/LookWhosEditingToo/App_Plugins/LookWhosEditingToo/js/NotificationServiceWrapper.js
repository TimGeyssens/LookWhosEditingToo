function lookWhosEditingTooNotificationServiceWrapper(notificationsService) {
    return {
        setCurrentEditNotification: function (edit) {
            notificationsService
                .add(
                {
                    headline: 'Attention',
                    message: edit.userName + ' is currently editing this content.',
                    type: 'warning',
                    sticky: false
                });
        },
        setGlobalNotification: function (userName, message) {
            notificationsService
                .add(
                {
                    headline: 'Message From ' + userName,
                    message: message,
                    type: 'info',
                    sticky: true
                });
        },
        setPublishedNotification: function (username, time) {
            notificationsService
                .add(
                {
                    headline: 'This node was just published at ' + time + ' by ',
                    message: username,
                    type: 'warning',
                    sticky: true
                });
        },
        removeAll: function () {
            notificationsService.removeAll();
        }
    };
};

angular.module('umbraco.resources').factory('lookWhosEditingTooNotificationServiceWrapper', lookWhosEditingTooNotificationServiceWrapper);