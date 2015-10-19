$(window).load(
    function () {

        var injector = angular.element('#umbracoMainPageBody').injector();

        function addWrapperAndLogic() {
            if (location.hash.indexOf('/content') == 1 && location.hash.indexOf('edit') != -1) {
                if ($(".umb-panel-header").length) {
                    if ($("#look-whos-editing-too-container").length == 0) {
                        $(".umb-panel-header").find('.span5').append('<div id="look-whos-editing-too-container"></div>');
                        var html = $('<div id="look-whos-editing-too" ng-controller="LWET.ContentController"></div>');
                        injector.invoke(function ($compile) {
                            var obj = $('#look-whos-editing-too-container'); // get wrapper
                            var scope = obj.scope(); // get scope
                            // generate dynamic content
                            obj.html(html);
                            // compile!!!
                            $compile(obj.contents())(scope);
                        });
                    }
                } else {
                    setTimeout(addWrapperAndLogic, 1000);
                }
            }
        };

        angular.element('#umbracoMainPageBody').scope().$on('$viewContentLoaded', function () {
            addWrapperAndLogic();
        });

    }
);  