(function (angular) {

    angular
            .module('arevea')
            .directive('calendarAvailabilityDays', calendarAvailabilityDaysDir);

    function calendarAvailabilityDaysDir() {
        var calDirective = {
            restrict: 'EA',
            replace: true,
            require: 'ngModel',
            templateUrl: 'templates/calendarBusinessTime/calendar.availability.directive.html',
            controller: calendarAvailbilityDirectiveController
        };

        return calDirective;

    }

    calendarAvailbilityDirectiveController.$inject = [
        '$scope'
    ];

    function calendarAvailbilityDirectiveController(
            $scope) {
    }
})(window.angular);


