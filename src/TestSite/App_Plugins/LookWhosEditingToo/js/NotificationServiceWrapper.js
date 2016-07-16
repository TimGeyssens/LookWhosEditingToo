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
        setGlobalNotification: function (message) {
            notificationsService
                .add(
                {
                    headline: 'Message From User ',
                    message: message,
                    type: 'info',
                    sticky: true
                });
        },
        removeAll: function () {
            notificationsService.removeAll();
        }
    };
};

angular.module('umbraco.resources').factory('lookWhosEditingTooNotificationServiceWrapper', lookWhosEditingTooNotificationServiceWrapper);