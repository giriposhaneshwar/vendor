(function () {
    var app = angular.module('arevea');
    var commonService = function ($rootScope, $http) {
        var obj = {};
        obj.safeApply = function (scope, fn) {
            var phase = (scope.$root != null) ? null : scope.$root.$$phase;
//            console.log("Phase result", phase);
            if (phase == '$apply' || phase == '$digest') {
                if (fn && (typeof (fn) === 'function')) {
                    fn();
                }
            } else {
                scope.$apply(fn);
            }
        };
        return obj;
    };
    app.factory('commonService', ['$rootScope', '$http', commonService]);
    app.directive('resize', ['$window', function ($window) {
            return {
                link: link,
                restrict: 'A'
            };
            function link(scope, element, attrs) {
                scope.screenWidth = $window.innerWidth;
                function onResize() {
                    // uncomment for only fire when $window.innerWidth change   
                    // if (scope.width !== $window.innerWidth)
                    {
                        scope.screenWidth = $window.innerWidth;
                        scope.$digest();
                    }
                }
                function cleanUp() {
                    angular.element($window).off('resize', onResize);
                }
                angular.element($window).on('resize', onResize);
                scope.$on('$destroy', cleanUp);
            }
        }
    ]);
}());



