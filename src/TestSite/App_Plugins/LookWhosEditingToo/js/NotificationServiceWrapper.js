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
                    sticky: false
                });
        },
        setPublishedNotification: function (email, time) {
            notificationsService
                .add(
                {
                    headline: 'This node was just published at ' + time + ' by ',
                    message: email,
                    type: 'warning',
                    sticky: false
                });
        },
        removeAll: function () {
            notificationsService.removeAll();
        }
    };
};

angular.module('umbraco.resources').factory('lookWhosEditingTooNotificationServiceWrapper', lookWhosEditingTooNotificationServiceWrapper);