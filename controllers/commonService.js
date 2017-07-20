(function () {
    var app = angular.module('arevea');
    var commonService = function ($rootScope, $http) {
        var obj = {};
        obj.safeApply = function (scope, fn) {
            var phase = scope.$root.$$phase;
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
}());



