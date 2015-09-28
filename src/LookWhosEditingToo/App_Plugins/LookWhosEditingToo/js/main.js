$(window).load(
    function () {

        // Declare a proxy to reference the hub. 
        var editing = $.connection.editingHub;

        var injector = angular.element('#umbracoMainPageBody').injector();

        var editingResource = injector.get('lookWhosEditingTooResource');

        angular.element('#umbracoMainPageBody').scope().$on('$viewContentLoaded', function () {

            if (location.hash.indexOf('/content') == 1 && location.hash.indexOf('edit') != -1) {
                var locArray = location.hash.split('/');
                var contentNodeId = locArray[locArray.length - 1];

                var authResource = injector.get('authResource');

                authResource.getCurrentUser().then(function (user) {

                    $.connection.hub.start().done(function () {
                        editing.server.send(contentNodeId, user.id);
                    });

                    $.cookie('lookWhosEditingTooUser', user.id);

                    editingResource.setEdit(contentNodeId, user.id);
                });

            }
            else {
                console.log($.cookie('lookWhosEditingTooUser') + ' not on content');

                $.connection.hub.start().done(function () {
                    editing.server.send(-1, $.cookie('lookWhosEditingNowUser'));
                });

                editingResource.deleteByUserId($.cookie('lookWhosEditingNowUser'));
            }
        });



        // Create a function that the hub can call to broadcast messages.
        editing.client.broadcastEdit = function (nodeId, userId) {

            console.log("user " + userId + " is now on node " + nodeId);

            $("i[title*='content/content/edit']").closest("li").children("div").removeClass("editing");

            //get all edits
            editingResource.getAllEdits().then(function (resp) {
                console.log(resp.data);
                for (var i = 0; i < resp.data.length; i++) {
                    var edit = resp.data[i];
                    $("i[title*='" + edit.nodeId + "']").closest("li").children("div").addClass("editing");
                }

            });

            //$("i[title*='" + nodeId + "']").closest("li").children("div")
            //    .addClass("editing")
            //    .attr("rel", userId);

        };


    }
);