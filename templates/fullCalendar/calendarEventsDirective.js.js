(function (angular) {

    angular.module('arevea')
            .directive('calendarEvent', calendarEventDir);

    /*
     * Calendar Directive
     */
    function calendarEventDir() {
        return {
            restrickt: 'EA',
//            replace: true,
            require: 'ngModel',
            scope: {ngModel: '='},
            templateUrl: 'templates/fullCalendar/calendarEventDirective.html',
            controller: calendarEventCtrl
        }
    }
    calendarEventCtrl.$inject = ['$scope'];
    function calendarEventCtrl($scope) {
        $scope.ngModel.name = "test";
        console.log("This is ", $(this), this);
        $("#fullCalendar").fullCalendar({
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'month,agendaWeek,agendaDay'
            },
            defaultDate: new Date(),
            navLinks: false, // can click day/week names to navigate views
            selectable: false,
            selectHelper: false,
            select: function (start, end) {
                // Display the modal.
                // You could fill in the start and end fields based on the parameters

                $('#fullCalendarModal').modal('show');

            },
            eventClick: function (event, element) {
                // Display the modal and set the values to the event values.
                $('#fullCalendarModal').modal('show');
                $('#fullCalendarModal').find('#title').val(event.title);
                $('#fullCalendarModal').find('#starts-at').val(event.start);
                $('#fullCalendarModal').find('#ends-at').val(event.end);

            },
            editable: true,
            eventLimit: true, // allow "more" link when too many events
            renderEvent: $scope.ngModel
        });

    }


})(window.angular);


