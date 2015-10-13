$(window).load(
    function () {

        //var allEdits = [];

        //// Declare a proxy to reference the hub. 
        //var editing = $.connection.LWETHub;

        var injector = angular.element('#umbracoMainPageBody').injector();

        //var editingResource = injector.get('lookWhosEditingTooResource');
        //var notificationServiceWrapper = injector.get('lookWhosEditingTooNotificationServiceWrapper');

        //function updateTreeAndPage() {

        //    $("i[title*='content/content/edit']").closest("li").children("div").removeClass("look-whos-editing-too");

        //    var currentNodeId = -1;
        //    if (location.hash.indexOf('/content') == 1 && location.hash.indexOf('edit') != -1) {
        //        var locArray = location.hash.split('/');
        //        currentNodeId = locArray[locArray.length - 1];
        //    }

        //    $("#look-whos-editing-too").empty();

        //    for (var i = 0; i < allEdits.length; i++) {
        //        var edit = allEdits[i];
        //        $("i[title*='" + edit.nodeId + "']").closest("li").children("div").addClass("look-whos-editing-too");

        //        if ($("#look-whos-editing-too").length == 0) {
        //            $("ng-form[name='contentNameForm']").parent().parent().children(".span5").append("<div id='look-whos-editing-too'></div>");
        //        }

        //        if ($("#look-whos-editing-too-" + edit.userId).length == 0 && currentNodeId == edit.nodeId) {
        //            $("#look-whos-editing-too").append("<img id='look-whos-editing-too-" + edit.userId + "'src='//www.gravatar.com/avatar/" + edit.userGravatar + ".jpg?s=30&d=mm' title='" + edit.userName + "' >");
        //            notificationServiceWrapper.setCurrentEditNotification(edit);
        //        }
        //    }
        //}

        //function getAllEdits() {

        //    editingResource.getAllEdits().then(function (resp) {

        //        allEdits = resp.data;

        //        updateTreeAndPage();

        //    });
        //}

        angular.element('#umbracoMainPageBody').scope().$on('$viewContentLoaded', function () {

            //notificationServiceWrapper.removeAll();

            if (location.hash.indexOf('/content') == 1 && location.hash.indexOf('edit') != -1) {

                if ($("#look-whos-editing-too").length == 0) {
                    $("ng-form[name='contentNameForm']").parent().parent().children(".span5").append("<div id='look-whos-editing-too-container'></div>");
                    var html = "<div id='look-whos-editing-too' ng-controller='LWET.ContentController'></div>";
                    injector.invoke(function ($compile) {
                        var obj = $('#look-whos-editing-too-container'); // get wrapper
                        var scope = obj.scope(); // get scope
                        // generate dynamic content
                        obj.html(html);
                        // compile!!!
                        $compile(obj.contents())(scope);
                    });
                    
                }
                //var locArray = location.hash.split('/');
                //var contentNodeId = locArray[locArray.length - 1];

                //var authResource = injector.get('authResource');

                //authResource.getCurrentUser().then(function (user) {

                //    $.connection.hub.start().done(function () {
                //        editing.server.send(contentNodeId, user.id);
                //    });

                //    $.cookie('lookWhosEditingTooUser', user.id);

                //    editingResource.setEdit(contentNodeId, user.id);
                //});


                //setTimeout(getAllEdits, 1000);

            }
        //    else {

        //        $.connection.hub.start().done(function () {
        //            if ($.cookie('lookWhosEditingTooUser') !== undefined) {
        //                var userId = parseInt($.cookie('lookWhosEditingTooUser').toString());

        //                editing.server.stop(userId);
        //                editingResource.deleteByUserId(userId);
        //            }
        //        });

        //    }


        });


        //editing.client.broadcastStopEdit = function (userId) {

        //    if (_.where(allEdits, { userId: userId }).length > 0) {

        //        allEdits = _.reject(allEdits, function (el) { return el.userId === userId; });

        //        updateTreeAndPage();
        //    }
        //}


        //editing.client.broadcastEdit = function (nodeId, userId, userName, userGravatar) {

        //    console.log(userName + " is now on node " + nodeId);
        //    if (_.where(allEdits, { userId: userId }).length > 0) {

        //        var currentUserEdit = _.where(allEdits, { userId: userId })[0];
        //        currentUserEdit.nodeId = nodeId;
        //    }
        //    else {

        //        var newUserEdit = {};
        //        newUserEdit.nodeId = nodeId;
        //        newUserEdit.userId = userId;
        //        newUserEdit.userName = userName;
        //        newUserEdit.userGravatar = userGravatar;

        //        allEdits.push(newUserEdit);
        //    }

        //    updateTreeAndPage();

        //};

    }
);  