$(window).load(
    function () {

        var allEdits = [];

        // Declare a proxy to reference the hub. 
        var editing = $.connection.editingHub;

        var injector = angular.element('#umbracoMainPageBody').injector();

        var editingResource = injector.get('lookWhosEditingTooResource');

        function getAllEdits() {

            var currentNodeId = -1;
            if (location.hash.indexOf('/content') == 1 && location.hash.indexOf('edit') != -1) {
                var locArray = location.hash.split('/');
                var currentNodeId = locArray[locArray.length - 1];
            }

            console.log(Math.floor(Date.now() / 1000) + " start get all edits");
            editingResource.getAllEdits().then(function (resp) {
                console.log(Math.floor(Date.now() / 1000) + " done get all edits");
                console.log(resp.data);

                allEdits = resp.data;

                $("#look-whos-editing-too").empty();

                for (var i = 0; i < resp.data.length; i++) {
                    var edit = resp.data[i];
                    $("i[title*='" + edit.nodeId + "']").closest("li").children("div").addClass("look-whos-editing-too");

                    if ($("#look-whos-editing-too").length == 0) {
                        $("ng-form[name='contentNameForm']").parent().parent().children(".span5").prepend("<div id='look-whos-editing-too'></div>");
                    }

                    if ($("#look-whos-editing-too-" + edit.userId).length == 0 && currentNodeId == edit.nodeId)
                        $("#look-whos-editing-too").append("<img id='look-whos-editing-too-" + edit.userId + "'src='//www.gravatar.com/avatar/" + edit.userGravatar + ".jpg?s=30&d=mm' alt='" + edit.userName + "' >");

                }

            });
        }

        function updateTreeAndPage() {

            $("i[title*='content/content/edit']").closest("li").children("div").removeClass("look-whos-editing-too");

            var currentNodeId = -1;
            if (location.hash.indexOf('/content') == 1 && location.hash.indexOf('edit') != -1) {
                var locArray = location.hash.split('/');
                var currentNodeId = locArray[locArray.length - 1];
            }

            $("#look-whos-editing-too").empty();

            for (var i = 0; i < allEdits.length; i++) {
                var edit = allEdits[i];
                $("i[title*='" + edit.nodeId + "']").closest("li").children("div").addClass("look-whos-editing-too");

                if ($("#look-whos-editing-too").length == 0) {
                    $("ng-form[name='contentNameForm']").parent().parent().children(".span5").prepend("<div id='look-whos-editing-too'></div>");
                }

                if ($("#look-whos-editing-too-" + edit.userId).length == 0 && currentNodeId == edit.nodeId)
                    $("#look-whos-editing-too").append("<img id='look-whos-editing-too-" + edit.userId + "'src='//www.gravatar.com/avatar/" + edit.userGravatar + ".jpg?s=30&d=mm' alt='" + edit.userName + "' >");

            }
        }

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


                getAllEdits();

            }
            else {
                console.log($.cookie('lookWhosEditingTooUser') + ' not on content');

                $.connection.hub.start().done(function () {
                    console.log("send stop to server");
                    var userId = parseInt($.cookie('lookWhosEditingTooUser').toString());
                    console.log(userId);
                    editing.server.stop(userId);
                    editingResource.deleteByUserId(userId);
                    console.log("done send stop to server");
                });

                editingResource.deleteByUserId(0);
            }
        });


        editing.client.broadcastStopEdit = function (userId) {

            console.log("user " + userId + " is not on content anymore");

            if (_.where(allEdits, { userId: userId }).length > 0) {

                var currentUserEdit = _.where(allEdits, { userId: userId })[0];
                allEdits.splice(_.indexOf(allEdits, currentUserEdit), 1);
                console.log(_.indexOf(allEdits, currentUserEdit));
                allEdits = _.reject(allEdits, function (el) { return el.userId === userId; });
                console.log(allEdits);
                updateTreeAndPage();
            }

        }



        editing.client.broadcastEdit = function (nodeId, userId, userName, userGravatar) {


            console.log("user " + userId + " is now on node " + nodeId);

      

        
            if (_.where(allEdits, { userId: userId }).length > 0) {
                //modify nodeId
                var currentUserEdit = _.where(allEdits, { userId: userId })[0];
                currentUserEdit.nodeId = nodeId;
            }
            else {
                //add new edit
                var newUserEdit = {};
                newUserEdit.nodeId = nodeId;
                newUserEdit.userId = userId;
                newUserEdit.userName = userName;
                newUserEdit.userGravatar = userGravatar;

                allEdits.push(newUserEdit);
            }

            updateTreeAndPage();


        };



    }
);